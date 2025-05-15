import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JournalPrivate } from '@prisma/client';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async createEntry(userId: string, content: string): Promise<JournalPrivate> {
    return this.prisma.journalPrivate.create({
      data: {
        userId,
        content,
        date: new Date(),
      },
    });
  }

  async getEntries(userId: string, limit = 35): Promise<JournalPrivate[]> {
    return this.prisma.journalPrivate.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }
}
