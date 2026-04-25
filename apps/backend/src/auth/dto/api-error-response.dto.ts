import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Bad Request' })
  error!: string;

  @ApiProperty({
    example: ['page must not be less than 1', 'limit must not be greater than 50'],
    oneOf: [
      { type: 'string', example: 'Resource not found' },
      {
        type: 'array',
        items: { type: 'string' },
      },
    ],
  })
  message!: string | string[];

  @ApiProperty({ example: '/api/issues?page=1&limit=10' })
  path!: string;

  @ApiProperty({ example: '2026-04-25T10:00:00.000Z' })
  timestamp!: string;
}