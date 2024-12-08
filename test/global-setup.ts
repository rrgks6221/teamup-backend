import { PostgreSqlContainer } from '@testcontainers/postgresql';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

module.exports = async function () {
  const postgresContainer = await new PostgreSqlContainer(
    'postgres:16.1',
  ).start();

  process.env.DATABASE_URL = postgresContainer.getConnectionUri();

  console.log(process.env.DATABASE_URL);

  const postgresClient = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await postgresClient.connect();

  // migrations 디렉토리 경로
  const migrationsDir = path.join(__dirname, '../prisma/migrations');
  const migrationFolders = fs.readdirSync(migrationsDir);

  for (const folder of migrationFolders) {
    const migrationPath = path.join(migrationsDir, folder, 'migration.sql');

    if (fs.existsSync(migrationPath)) {
      let migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      // FOREIGN KEY 제약 조건 제거
      migrationSQL = migrationSQL.replace(
        /ALTER TABLE.*?ADD CONSTRAINT.*?FOREIGN KEY.*?;/gs,
        '',
      );

      await postgresClient.query(migrationSQL);
    }
  }

  await postgresClient.end();

  globalThis.__POSTGRES_CONTAINER__ = postgresContainer;
};
