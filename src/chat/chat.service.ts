import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async sendMessage(userId: string, message: string) {
    // 1. Vérification de l’utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    if (user.iaTokens <= 0) {
      throw new ForbiddenException("Tu as atteint ta limite de messages pour aujourd’hui.");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { iaTokens: { decrement: 1 } },
    });
  
    const guide = user.guideChoice || 'Le Sage';
  
    // 2. Récupération de l’historique du chat (ex. les 10 derniers échanges)
    const history = await this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });
  
    // 3. Construction du message système
    const systemMessage = {
      role: 'system',
      content: `Tu es ${guide}, un guide spirituel bienveillant, choisi par l’utilisateur.
  
    Ta mission est de répondre de manière claire, humaine, intuitive, avec un ton bienveillant et enraciné. 
    Ne sois jamais mystique ou abstrait, sois lumineux et accessible.`,
    };
  
    // 4. Format de l’historique pour OpenAI (en filtrant nulls)
    const chatMessages = history.flatMap((entry) => {
      const userMsg = entry.message?.trim();
      const aiMsg = entry.aiResponse?.trim();
      const msgs: { role: string; content: string }[] = [];
  
      if (userMsg) msgs.push({ role: 'user', content: userMsg });
      if (aiMsg) msgs.push({ role: 'assistant', content: aiMsg });
  
      return msgs;
    });
  
    // 5. Ajout du message actuel
    chatMessages.push({ role: 'user', content: message });
  
    // 6. Tableau final envoyé à OpenAI
    const messages = [systemMessage, ...chatMessages];
  
    // 7. Appel à OpenAI
    const aiResponse = await this.aiService.generateFromMessages(messages);
  
    // 8. Enregistrement du message et de la réponse
    await this.prisma.chatMessage.create({
      data: {
        userId,
        message,
        aiResponse,
      },
    });
  
    // 9. Retour
    return {
      guide,
      userMessage: message,
      aiResponse,
    };
  }
  
  async getHistory(userId: string, limit = 20) {
    return this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        message: true,
        aiResponse: true,
        createdAt: true,
      },
    });
  }

  async clearHistory(userId: string) {
    await this.prisma.chatMessage.deleteMany({
      where: { userId },
    });
  
    return {
      message: 'Historique de chat supprimé avec succès.',
    };
  }
  
  
  
}
