import { and, desc, eq } from 'drizzle-orm';
import { db } from './client';
import { favorites, Item, items } from './schema';

// 1. ADICIONAR ITEM
// Usamos 'Item' pois o ID é gerado automaticamente
export const addItem = async (data: Item) => {
  return await db.insert(items).values(data).returning();
};

// 2. ATUALIZAR ITEM
export const updateItem = async (id: number, data: Partial<Item>) => {
  return await db.update(items).set(data).where(eq(items.id, id));
};

// 3. DELETAR ITEM
export const deleteItem = async (id: number) => {
  // O 'cascade' no schema deve cuidar dos favoritos, mas por segurança deletamos manual
  await db.delete(favorites).where(eq(favorites.itemId, id));
  return await db.delete(items).where(eq(items.id, id));
};

// 4. FEED (TODOS OS ITENS + STATUS DE FAVORITO)
// Precisamos saber se o usuário atual curtiu cada item para pintar o coração
export const getItems = async (currentUserId?: string | null) => {
  // Pega todos os itens (do mais novo para o mais antigo)
  const allItems = await db.select().from(items).orderBy(desc(items.id));

  // Se não tem usuário logado, ninguém é favorito
  if (!currentUserId) {
    return allItems.map(item => ({ ...item, isFavorite: false }));
  }

  // Busca APENAS os favoritos do usuário logado
  const userFavorites = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, currentUserId));

  // Cria um conjunto (Set) de IDs para checagem rápida (O(1))
  const favoriteIds = new Set(userFavorites.map(f => f.itemId));

  // Retorna os itens adicionando a propriedade boolean isFavorite
  return allItems.map(item => ({
    ...item,
    isFavorite: favoriteIds.has(item.id)
  }));
};

// 5. OBTER ITEM ÚNICO (DETALHES)
export const getItemById = async (id: number, currentUserId?: string | null) => {
  const itemResult = await db.select().from(items).where(eq(items.id, id));
  const item = itemResult[0];

  if (!item) return null;

  let isFavorite = false;

  // Verifica se o usuário atual curtiu este item específico
  if (currentUserId) {
    const favCheck = await db
      .select()
      .from(favorites)
      .where(and(
        eq(favorites.itemId, id), 
        eq(favorites.userId, currentUserId)
      ));
    
    isFavorite = favCheck.length > 0;
  }

  return { ...item, isFavorite };
};

// 6. ALTERNAR FAVORITO (TOGGLE)
// A lógica correta: Verifica se existe -> Se sim, Deleta. Se não, Cria.
export const toggleFavorite = async (itemId: number, userId: string) => {
  const existing = await db
    .select()
    .from(favorites)
    .where(and(
      eq(favorites.itemId, itemId),
      eq(favorites.userId, userId)
    ));
    console.log("Toggle favorite check:", existing);
  if (existing.length > 0) {
    // Já era favorito, então remove (Descurtir)
    console.log("Removing favorite for itemId");
    await db.delete(favorites).where(
      and(eq(favorites.itemId, itemId), eq(favorites.userId, userId))
    );
    return false; // Retorna status atual: Não Favorito
  } else {
    // Não era favorito, então cria (Curtir)
    console.log("Adding favorite for itemId");
    await db.insert(favorites).values({
      itemId,
      userId,
    });
    return true; // Retorna status atual: Favorito
  }
};

// 7. MEUS ITENS (ANÚNCIOS QUE EU CRIEI)
export const getMyItems = async (userId: string) => {
  return await db
    .select()
    .from(items)
    .where(eq(items.ownerId, userId))
    .orderBy(desc(items.id));
};

// 8. MEUS FAVORITOS (ITENS QUE EU CURTI)
// Faz um JOIN para trazer os dados completos do item
export const getFavorites = async (userId: string) => {
  const result = await db
    .select({
      // Selecionamos explicitamente os campos da tabela items para limpar o retorno
      id: items.id,
      title: items.title,
      price: items.price,
      description: items.description,
      image: items.image,
      whatsapp: items.whatsapp,
      ownerId: items.ownerId,
    })
    .from(favorites)
    // Junta a tabela de favoritos com a tabela de itens
    .innerJoin(items, eq(favorites.itemId, items.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));

  // Como estamos na tela de favoritos, todos são isFavorite = true
  return result.map(item => ({ ...item, isFavorite: true }));
};