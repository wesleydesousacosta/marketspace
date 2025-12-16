import { HfInference } from '@huggingface/inference';

const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;

if (!HF_ACCESS_TOKEN) {
  throw new Error('HF_ACCESS_TOKEN is not set in environment variables.');
}

const hf = new HfInference(HF_ACCESS_TOKEN);

export async function getImageDescription(imageUrl: string): Promise<string> {
  const response = await hf.imageToText({
    data: await (await fetch(imageUrl)).arrayBuffer(),
    model: 'Salesforce/blip-image-captioning-large', // You can choose other models as well
  });
  return response.generated_text;
}