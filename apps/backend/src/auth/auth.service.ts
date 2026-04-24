import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { AuthResponse } from './interfaces/aith-response.interface';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/core/types';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthTokens } from './interfaces/auth-tokens.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.userService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.createFromAuth({
      email: registerDto.email,
      displayName: registerDto.displayName,
      passwordHash,
      role: registerDto.role ?? UserRole.MEMBER,
    });

    return this.buildAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    return this.buildAuthResponse(user);
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.userService.findOne(payload.sub);

    if (user.hashedRefreshToken) {
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Refresh token is invalid');
      }
    }

    await this.userService.clearRefreshTokenHash(user.id);

    return {
      message: 'Logged out successfully',
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.userService.findOne(payload.sub);

    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('Refresh token is not active');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    return this.buildAuthResponse(user);
  }

  private async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  private async buildAuthResponse(user: UserEntity): Promise<AuthResponse> {
    const tokens = await this.generateTokens(user);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.userService.updateRefreshTokenHash(user.id, hashedRefreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      tokens,
    };
  }

  private async generateTokens(user: UserEntity): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }
}