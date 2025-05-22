import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { prhaseReseauDto } from 'src/auth/dto/phrase-reseau.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReseauService {
    constructor(private prisma: PrismaService, private aiService: AiService) {}

    async sendPhraseToReseau(phrase: string, userId: string, dto: prhaseReseauDto) {
        const user = await this.prisma.user.findUnique({
              where: { id: userId },
        });
          
        if (!user) throw new NotFoundException('Utilisateur introuvable.');

         const startOfDay = new Date();
         startOfDay.setHours(0, 0, 0, 0)

        const drawsToday = await this.prisma.reseauEnergetique.count({
            where: {
                userId,
                date: {
                gte: startOfDay,
                },
            },
        });

        if (drawsToday >= 1) {
          throw new BadRequestException({
            code: 'DRAW_LIMIT_REACHED',
            message: "Tu as déjà écris ta pensée aujourd’hui. Reviens demain 🌙",
          });
        }

        await this.prisma.reseauEnergetique.create({
        data: {
            userId,
            date: new Date(),
            content: phrase,
        },
        });
    
        return {
        startOfDay,
        phrase,
        }; 
    }

    async getReseauByVibration(number: number, limit = 10) {
        const reseau = await this.prisma.reseauEnergetique.findMany({
            where: {
                nombre: number,
            },
            select: {
                content: true,
                date: true,
                nombre: true,
            },
            orderBy: {
                date: 'desc',
            },
            take: limit,
        });

        if (!reseau || reseau.length === 0) {
          throw new NotFoundException('Aucun réseau trouvé.');
        }     

        return reseau;
    }

    async getReseau(limit = 10) {
        const reseau = await this.prisma.reseauEnergetique.findMany({
            select: {
                content: true,
                date: true,
                nombre: true,
            },
            orderBy: {
                date: 'desc',
            },
            take: limit,
        });

        if (!reseau || reseau.length === 0) {
          throw new NotFoundException('Aucun réseau trouvé.');
        }     

        return reseau;
    }

    async getReseauById(id: string) {
        const reseau = await this.prisma.reseauEnergetique.findUnique({
            where: {
                id,
            },
            select: {
                content: true,
                date: true,
                nombre: true,
            },
        });

        if (!reseau) {
          throw new NotFoundException('Aucun réseau trouvé.');
        }     

        return reseau;
    }
}
