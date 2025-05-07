import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private openai: OpenAIApi;

  constructor(private config: ConfigService) {
    const configuration = new Configuration({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });

    this.openai = new OpenAIApi(configuration);
  }

  async generateGuidance(numberOfDay: number): Promise<string> {
    const prompt = `Tu es un guide spirituel bienveillant et inspirant.

    Donne une guidance douce et lumineuse à un utilisateur influencé aujourd’hui par le nombre ${numberOfDay}.

    Ta réponse doit être :
    - claire et compréhensible
    - légèrement poétique ou symbolique (sans excès)
    - en 1 à 3 phrases maximum
    - utile : elle doit suggérer un état d’esprit ou une intention pour la journée`;

    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Tu es un guide spirituel bienveillant, intuitif et poétique.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    return response.data.choices[0].message?.content ?? 'Pas de réponse.';
  }

  async generateGuidanceFromPrompt(prompt: string): Promise<string> {
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Tu es un guide spirituel bienveillant, intuitif et poétique.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 350,
    });
  
    return response.data.choices[0].message?.content ?? 'Réponse manquante.';
  }

  async generateFromMessages(messages: any[]) {
    const cleanedMessages = messages.filter(
      (m) => m && typeof m.content === 'string' && m.content.trim() !== ''
    );

    
    const response = await this.openai.createChatCompletion({
      model: 'gpt-4',
      messages: cleanedMessages,
      temperature: 0.7,
    });
    
  
    return response.data.choices[0].message?.content?.trim() ?? '';
  }
  
  
}
