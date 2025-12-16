const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
export const iaImageDescription = async (base64: string) => {
    console.log("Iniciando descrição de imagem via IA...");
  if (!OPENAI_KEY) throw new Error("OPENAI_KEY não definida");

  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
              Você é um especialista em copywriting para e-commerce e marketing digital. Sua tarefa é criar um anúncio de venda atraente e completo para o item na imagem, como se fosse para um marketplace de alto padrão.

              O anúncio deve ter a seguinte estrutura:

              1.  **Título:** Crie um título curto, chamativo e otimizado para buscas (SEO), incluindo o nome do item e uma característica principal (ex: "Cadeira de Escritório Ergonômica de Couro Genuíno").
              2.  **Descrição Detalhada:** Elabore um parágrafo envolvente que descreva o item. Destaque os principais benefícios, o design, os materiais de alta qualidade e como ele pode melhorar o dia a dia ou o ambiente do comprador. Use uma linguagem persuasiva e um tom vendedor, mas honesto.
              3.  **Características Principais (em formato de lista/tópicos):**
                  *   Material: (Descreva o material principal que você consegue identificar).
                  *   Cor: (Identifique a cor principal e secundárias).
                  *   Condição: Assuma que o item é 'Novo'.
              
              Seja criativo e foque em criar um desejo pelo produto, realçando seu valor e qualidades únicas. A resposta final deve ser apenas o texto do anúncio, começando pelo título.
              `
            },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${cleanBase64}`
            }
          ]
        }
      ]
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

    const data = await response.json();
    const message = data.output?.[0];
    const content = message?.content?.[0];
    const text = content?.text;
    console.log("Descrição gerada:", message, text, content);
  return text;
};