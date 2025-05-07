import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { GenerateWordsDto } from 'src/auth/dto/generate-words.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class VibrationService {
  constructor(private prisma: PrismaService, private readonly openai: OpenAIApi) {}

  async generateWords(dto: GenerateWordsDto): Promise<string> {
    const { number, type } = dto;
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // pour ne comparer que la date
  
    // 1. Vérifie le cache
    const existing = await this.prisma.vibrationCache.findFirst({
      where: {
        number,
        type,
        date: today,
      },
    });
  
    if (existing) {
      return existing.words; // 🔁 On renvoie le cache
    }
  
    // 2. Sinon, appel OpenAI
    const prompt = `Donne-moi 3 mots inspirants, séparés par des tirets (-) et un espace entre les tirets, pour illustrer la vibration ${number} en numérologie ${
      type === 'collective' ? 'collective' : 'personnelle'
    }. Utilise un ton symbolique et évocateur. Ne donne rien d’autre que les trois mots.`;
  
    const response = await this.openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });
  
    const text = response.data.choices[0].message?.content?.trim() ?? '';
  
    // 3. Stocke dans le cache
    await this.prisma.vibrationCache.create({
      data: {
        number,
        type,
        date: today,
        words: text,
      },
    });
  
    return text;
  }
  
}
