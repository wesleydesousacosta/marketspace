import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';
import migrations from '../../drizzle/migrations';

// Nome do arquivo do banco de dados local
const DATABASE_NAME = 'furnimarket_v2.db'; // <--- Mudamos o nome aqui
// Abre o banco de dados de forma síncrona (novo padrão Expo SQLite)
const expoDb = openDatabaseSync(DATABASE_NAME);

// Inicializa o Drizzle
export const db = drizzle(expoDb);

/**
 * ATENÇÃO: Para um MVP rápido sem configurar o drizzle-kit migrations agora,
 * você pode usar esta função temporária para criar a tabela na inicialização.
 * Em produção, use 'drizzle-kit push' ou migrações reais.
 */

export const useDbMigrations = () => {
  return useMigrations(db, migrations);
};
