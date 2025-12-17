import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';
import migrations from '../../drizzle/migrations';

// Nome do arquivo do banco de dados local
const DATABASE_NAME = 'furnimarket_v4.db'; // <--- Mudamos o nome aqui
// Abre o banco de dados de forma síncrona (novo padrão Expo SQLite)
const expoDb = openDatabaseSync(DATABASE_NAME);

// Inicializa o Drizzle
export const db = drizzle(expoDb);

export const useDbMigrations = () => {
  return useMigrations(db, migrations);
};
