import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

function loadRootEnvFile(): void {
  if (process.env.DATABASE_URL) {
    return;
  }

  const envFilePath = join(process.cwd(), '..', '..', '.env');

  if (!existsSync(envFilePath)) {
    return;
  }

  const envFileContents = readFileSync(envFilePath, 'utf8');

  for (const rawLine of envFileContents.split('\n')) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

function getRequiredEnv(name: string): string {
  loadRootEnvFile();

  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getTypeOrmOptions(
  databaseUrl = getRequiredEnv('DATABASE_URL'),
): DataSourceOptions {
  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [
      join(process.cwd(), 'src', '**', '*.entity.ts'),
      join(process.cwd(), 'dist', '**', '*.entity.js'),
    ],
    migrations: [
      join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
      join(process.cwd(), 'dist', 'database', 'migrations', '*.js'),
    ],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
  };
}

const appDataSource = new DataSource(getTypeOrmOptions());

export default appDataSource;
