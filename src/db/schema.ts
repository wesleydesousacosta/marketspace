import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  price: integer('price').notNull(), // Armazenaremos centavos para evitar flutuação
  description: text('description').notNull(),
  image: text('image').notNull(), // URL da imagem
  isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
  whatsapp: text('whatsapp').notNull(), // Número de WhatsApp do vendedor
  ownerId: text('owner_id').notNull(), // ID do usuário do Clerk
});

// Tipos inferidos para uso no App
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;