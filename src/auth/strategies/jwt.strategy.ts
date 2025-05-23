import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    const secret = config.get<string>('JWT_SECRET') || process.env.JWT_SECRET;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string }) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Token invalide.');
    }
    
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role, 
      isPremium: user.isPremium,
    };
  }
}
