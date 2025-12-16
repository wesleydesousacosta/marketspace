import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'expo', // Specifies Expo SQLite driver
  dialect: 'sqlite'
} satisfies Config;