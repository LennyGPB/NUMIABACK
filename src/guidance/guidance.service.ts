import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateDayNumber } from '../utils/numerology.utils';
import { AiService } from 'src/ai/ai.service';
import { DrawGuidanceDto } from 'src/auth/dto/draw-guidance.dto';
import { CheckInDto } from 'src/auth/dto/check-in.dto';

@Injectable()
export class GuidanceService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async getToday(userId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    // Vérifier si une guidance existe déjà aujourd’hui
    const existing = await this.prisma.guidance.findFirst({
      where: {
        userId,
        date: startOfDay,
      },
    });

    if (existing) {
      return existing;
    }

    // 2. Récupérer l’utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    // 3. Calcul du nombre du jour
    const numberOfDay = calculateDayNumber(new Date(), user.lifePathNumber);
    const aiResponse = await this.aiService.generateGuidance(numberOfDay, user.lifePathMessage ?? '');

    // 5. Enregistrement en base
    const guidance = await this.prisma.guidance.create({
      data: {
        userId,
        date: startOfDay,
        numberOfDay,
        message: 'Votre guidance quotidienne',
        aiResponse,
      },
    });

    return guidance;
  }

  async getHistory(userId: string, limit = 7) {
    return this.prisma.guidance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
      select: {
        id: true,
        date: true,
        numberOfDay: true,
        aiResponse: true,
      },
    });
  }
  

  async askQuestion(userId: string, question: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
  
    const numberOfDay = calculateDayNumber(new Date(), user.lifePathNumber);
  
    const prompt = `
  Tu es un guide spirituel bienveillant.
  Un utilisateur vit sa journée sous l’influence du nombre ${numberOfDay}.
  Voici son intention ou sa question du jour : "${question}"
  Réponds-lui avec sagesse, douceur et inspiration, en lien avec la vibration du ${numberOfDay}.
  `;
  
    const aiResponse = await this.aiService.generateGuidanceFromPrompt(prompt);
  
    return {
      numberOfDay,
      question,
      aiResponse,
    };
  }
  
  async drawGuidance(userId: string, dto: DrawGuidanceDto) {
    const { theme, nbNumbers = 1 } = dto;
  
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
  
    // 🔒 1. Vérifier combien de tirages ont déjà été faits aujourd’hui
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
  
    const drawsToday = await this.prisma.draw.count({
      where: {
        userId,
        date: {
          gte: startOfDay,
        },
      },
    });
  
    // if (drawsToday >= 2) {
    //   throw new BadRequestException({
    //     code: 'DRAW_LIMIT_REACHED',
    //     message: "Tu as déjà effectué 2 tirages aujourd’hui. Reviens demain 🌙",
    //   });
    // }
  
    // 🎲 2. Génération aléatoire des nombres (entre 1 et 9, sans doublon)
    const numbers: number[] = [];
    while (numbers.length < nbNumbers) {
      const n = Math.floor(Math.random() * 9) + 1;
      if (!numbers.includes(n)) numbers.push(n);
    }
  
    // 📜 3. Création du prompt
    const prompt = `
    Tu es un guide spirituel et numérologue bienveillant.
    
    L’utilisateur cherche une guidance sur le thème : "${theme}".  
    Voici les nombres tirés : ${numbers.join(', ')}.  
    Son profil numérologique :  
    - Chemin de vie : ${user.lifePathNumber}  
    - Année personnelle : ${user.personalYearNumber}
    
    Ta mission :
    - Donne une introduction courte, poétique et apaisante (1 à 2 phrases max)
    - Puis interprète les nombres avec douceur, en lien avec le thème
    - Reste clair, fluide, sans excès de mysticisme
    - Le tout en **5 phrases maximum**
    
    Ta guidance doit inspirer, recentrer et éclairer.
    Commence maintenant :`;
  
    // 🧠 4. Appel OpenAI
    const aiResponse = await this.aiService.generateGuidanceFromPrompt(prompt);
  
    // 💾 5. Enregistrement du tirage
    await this.prisma.draw.create({
      data: {
        userId,
        date: new Date(),
        theme,
        numbers: numbers.join(','),
        response: aiResponse,
      },
    });
  
    // ✅ 6. Retour de la réponse
    return {
      theme,
      numbers,
      aiResponse,
    };
  }
  
  async generateLifePathMessage(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user || !user.lifePathNumber) {
      throw new Error("Chemin de vie introuvable pour cet utilisateur.");
    }

    if (user.lifePathMessage) {
      return {
        lifePathNumber: user.lifePathNumber,
        message: user.lifePathMessage,
      };
    }

    const prompt = `
    Tu es un guide spirituel bienveillant.

    L’utilisateur a un chemin de vie numéro ${user.lifePathNumber}.

    Ta mission est de lui transmettre un message clair, inspirant et honnête sur sa personnalité profonde liée à ce chemin de vie.

    Consignes :
    - Ta réponse doit faire 1 à 2 phrases maximum
    - Sois doux, humain, encourageant
    - Décris sa personnalité avec justesse : ses élans naturels, ses forces, mais aussi ses tendances ou besoins (comme la prudence, le besoin d’équilibre, la peur du vide…)
    - Utilise un langage simple, sans jargon ni mysticisme
    - Sois ancré, sans exagération ni idéalisme

    → Exemple pour le chemin de vie 3 :  
    "Tu es une personne expressive et créative, souvent portée par le besoin de dire, de partager, de faire sourire. Tu peux avoir tendance à douter de ta légitimité, mais quand tu oses t’exprimer librement, tu rayonnes naturellement."

    Commence maintenant :`;
  
    const aiResponse = await this.aiService.generateGuidanceFromPrompt(prompt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { lifePathMessage: aiResponse },
    });
  
    return {
      lifePathNumber: user.lifePathNumber,
      message: aiResponse,
    };
  }
  
  async tirageCycleInterieur(userId: string) {
    const nbNumbers = 3;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const drawsToday = await this.prisma.draw.count({
      where: {
        userId,
        date: {
          gte: startOfDay,
        },
      },
    });
  
    //  if (drawsToday >= 2) {
    //   throw new BadRequestException({
    //     code: 'DRAW_LIMIT_REACHED',
    //     message: "Tu as déjà effectué 2 tirages aujourd’hui. Reviens demain 🌙",
    //   });
    // }

    const numbers: number[] = [];
    while (numbers.length < nbNumbers) {
      const n = Math.floor(Math.random() * 9) + 1;
      if (!numbers.includes(n)) numbers.push(n);
    }

    const prompt = `
    Tu es un guide spirituel et numérologue bienveillant.

    L’utilisateur a tiré trois nombres représentant son cycle intérieur :

    - Le premier représente le **passé récent** (ce qu’il quitte)
    - Le second représente le **présent** (ce qu’il traverse)
    - Le troisième représente la **leçon à intégrer** (ce vers quoi il tend)

    Voici les nombres tirés : ${numbers.join(', ')}

    Ta réponse doit :
    - Être claire, douce et inspirante
    - Rester simple à comprendre
    - Comporter une courte introduction (1 phrase)
    - Puis une lecture en 3 parties : Passé, Présent, Leçon
    - Ne pas dépasser 6 à 8 phrases au total
    - Éviter les métaphores floues ou le jargon mystique

    Commence maintenant :`;

    const aiResponse = await this.aiService.generateGuidanceFromPrompt(prompt);

    await this.prisma.draw.create({
      data: {
        userId,
        date: new Date(),
        theme: 'cycle intérieur',
        numbers: numbers.join(','),
        response: aiResponse,
      },
    });

     return {
      numbers,
      aiResponse,
    };
  
  }

  async checkIn(userId: string, dto: CheckInDto) {
    const { mood } = dto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
  
    const checkInToday = await this.prisma.checkIn.count({
      where: {
        userId,
        date: {
          gte: startOfDay,
        },
      },
    });

    if (checkInToday >= 1) {
      throw new BadRequestException({
        code: 'DRAW_LIMIT_REACHED',
        message: "Tu as déjà partagé ta pensée aujourd’hui. Reviens demain 🌙",
      });
    }

    const prompt = `
    Tu es un coach bienveillant et inspirant spécialisé en développement personnel, numérologie et psychologie positive.
    Un utilisateur t'indique comment il se sent parmi une liste d'émotions simples : "Bien", "Calme", "Stressé", "Fatigué", "Confus", "Heureux" ou "Triste".

    Ta mission est de lui proposer **un seul exercice immédiat**, simple, concret et réalisable en 1 à 3 minutes maximum, pour l’aider à **amplifier ou rééquilibrer** son état du moment.

    L’exercice peut être basé sur :
    - la respiration,
    - la pleine conscience,
    - l’écriture introspective,
    - la visualisation guidée,
    - ou une micro-action émotionnelle.

    **Sois très clair, doux, et précis.** N’écris qu’un seul exercice. Utilise un ton empathique, moderne et accessible à tous. Ne donne pas de contexte ou d’explication longue. L'exercice doit être directement actionnable.

    Voici l’émotion indiquée par l’utilisateur : **${mood}**

    Propose l’exercice maintenant :`;

    const aiResponse = await this.aiService.generateGuidanceFromPrompt(prompt);

    await this.prisma.checkIn.create({
      data: {
        userId,
        date: new Date(),
        mood,
        response: aiResponse,
      },
    });
  
    return {
      mood,
      aiResponse,
    };
  }
  
}
