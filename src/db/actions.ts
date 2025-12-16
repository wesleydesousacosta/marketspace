import { eq, desc } from 'drizzle-orm';
import { db } from './client';
import { items, NewItem } from './schema';

// Obter todos os itens (para o Feed)
export const getItems = async () => {
  return await db.select().from(items).orderBy(desc(items.id));
};

// Adicionar novo item
export const addItem = async (data: NewItem) => {
  return await db.insert(items).values(data).returning();
};

// Alternar favorito (Toggle)
export const toggleFavorite = async (id: number, currentStatus: boolean) => {
  return await db
    .update(items)
    .set({ isFavorite: !currentStatus })
    .where(eq(items.id, id));
};

// Obter itens do usuário logado
export const getMyItems = async (userId: string) => {
  return await db.select().from(items).where(eq(items.ownerId, userId));
};

// Obter apenas favoritos
export const getFavorites = async () => {
  return await db.select().from(items).where(eq(items.isFavorite, true));
};

// Deletar item
export const deleteItem = async (id: number) => {
  return await db.delete(items).where(eq(items.id, id));
};

export const updateItem = async (id: number, data: Partial<NewItem>) => {
  return await db.update(items).set(data).where(eq(items.id, id));
};

// Obter item único por ID
export const getItemById = async (id: number) => {
  const result = await db.select().from(items).where(eq(items.id, id));
  return result[0];
};