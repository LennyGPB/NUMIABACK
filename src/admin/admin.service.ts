// admin.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, premiumUsers, todayGuidance, totalChats, weeklyGuidance] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isPremium: true } }),
      this.prisma.guidance.count({
        where: {
          date: {
            gte: dayjs().startOf('day').toDate(),
          },
        },
      }),
      this.prisma.chatMessage.count(),
      this.prisma.guidance.count({
        where: {
          date: {
            gte: dayjs().subtract(7, 'day').startOf('day').toDate(),
          },
        },
      }),
    ]);

    return {
      totalUsers,
      premiumUsers,
      todayGuidance,
      weeklyGuidance,
      totalChats,
    };
  }
}
