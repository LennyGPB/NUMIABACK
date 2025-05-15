import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';
import { calculateLifePathNumber, calculatePersonalYearNumber, calculateSoulNumber, calculateExpressionNumber } from 'src/utils/numerology.utils';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        birthDate: true,
        lifePathNumber: true,
        personalYearNumber: true,
        guideChoice: true,
        isPremium: true,
        soulNumber: true,
        expressionNumber: true,
        iaTokens: true,
        lastTokenReset: true,
        // pushTokens: {
        //   select: {
        //     id: true,
        //     token: true,
        //   },
        // },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }

    return user;
  }

  async chooseGuide(userId: string, guide: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { guideChoice: guide },
      select: {
        id: true,
        name: true,
        guideChoice: true,
      },
    });
  
    return {
      message: `Guide IA mis à jour avec succès`,
      user,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
  
    const birthDate = new Date(dto.birthDate);
    
    // Calculs numérologiques
    const lifePath = calculateLifePathNumber(birthDate);
    const personalYear = calculatePersonalYearNumber(birthDate, new Date());
    const soul = calculateSoulNumber(dto.name);
    const expression = calculateExpressionNumber(dto.name);
  
    // Mise à jour utilisateur
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        birthDate,
        lifePathNumber: lifePath,
        expressionNumber: expression,
        soulNumber: soul,
        personalYearNumber: personalYear,
      },
    });
  
    return {
      message: 'Profil mis à jour avec succès.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        birthDate: updatedUser.birthDate,
        lifePathNumber: updatedUser.lifePathNumber,
        personalYearNumber: updatedUser.personalYearNumber,
      },
    };
  }
  
}
