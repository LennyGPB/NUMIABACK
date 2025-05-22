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

  async generateGuidance(numberOfDay: number, cheminDeVie: string, ): Promise<string> {
    const prompt = `Tu es un guide spirituel moderne, bienveillant et inspiré.  
    Tu accompagnes chaque jour l’utilisateur avec douceur et clarté.

    Aujourd’hui, l’utilisateur est sous l’influence du **nombre personnel du jour : ${numberOfDay}**  
    et son **chemin de vie est ${cheminDeVie}**, ce qui t’éclaire sur sa mission profonde.

    Ta mission est double :

    ---

    1. ✨ **Commence par une guidance courte**, composée de 1 à 3 phrases.  
    Elle doit proposer une intention ou un état d’esprit utile pour la journée.  
    Utilise un ton **doux, clair, fluide et légèrement poétique**. Tu peux faire appel à des images simples (lumière, souffle, eau, marche, silence...).  
    N’utilise pas de termes techniques ou spirituels complexes.

    2. 🎯 **Ensuite, propose un seul défi concret à réaliser aujourd’hui.**  
    Ce défi doit être **simple, faisable en quelques minutes**, et aligné avec la vibration du jour.  
    Il peut s’agir d’un geste, d’un exercice, d’une réflexion ou d’une mini-action bienveillante.  
    Évite les formulations vagues ou génériques.

    ---

    **Exemples de structure attendue :**

    🧭 *Guidance :*  
    > « Aujourd’hui, prends le temps de t’écouter sans te juger. Le silence intérieur éclaire parfois plus que les réponses. »

    🎯 *Défi :*  
    > Note dans un carnet trois choses que tu ressens en ce moment, sans chercher à les expliquer.

    ---

    Maintenant, propose la guidance et le défi du jour :`;

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
