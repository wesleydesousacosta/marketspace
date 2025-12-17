import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// --- TABELA DE ITENS (Sem o isFavorite) ---
export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  price: integer('price').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  whatsapp: text('whatsapp').notNull(),
  ownerId: text('owner_id').notNull(), // Dono do item
});

// --- NOVA TABELA DE FAVORITOS ---
export const favorites = sqliteTable('favorites', {
  userId: text('user_id').notNull(),
  itemId: integer('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  // Adicionando 'name' resolve a ambiguidade de tipos que causa o aviso de depreciação
  pk: primaryKey({ columns: [table.userId, table.itemId], name: 'favorites_pk' }),
}));
// Tipos
export type Item = typeof items.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;