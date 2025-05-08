import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { calculateLifePathNumber, calculatePersonalYearNumber, calculateSoulNumber, calculateExpressionNumber  } from '../utils/numerology.utils';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { OAuth2Client } from 'google-auth-library';
import { SetupProfileDto } from './dto/setup-profile.dto';
import { jwtVerify, createRemoteJWKSet } from 'jose';



@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  
  async register(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
  
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }
  
    const birthDate = new Date(dto.birthDate);
    const lifePath = calculateLifePathNumber(birthDate);
    const personalYear = calculatePersonalYearNumber(birthDate, new Date());
    const soul = calculateSoulNumber(dto.name);
    const expression = calculateExpressionNumber(dto.name);
  
    const hashedPassword = await bcrypt.hash(dto.password, 10); // 10 = nombre de "salt rounds"

    if (isNaN(birthDate.getTime())) {
      throw new BadRequestException('La date de naissance est invalide.');
    }
  
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        birthDate,
        password: hashedPassword,
        lifePathNumber: lifePath,
        expressionNumber: expression,
        soulNumber: soul,
        personalYearNumber: personalYear,
      },
    });
  
    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);
  
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lifePathNumber: user.lifePathNumber,
        personalYearNumber: user.personalYearNumber,
      },
    };
  }

  async login(dto: LoginUserDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user || !user.password) {
    throw new UnauthorizedException('Identifiants invalides.');
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Identifiants invalides.');
  }

  const payload = { sub: user.id };
  const token = this.jwtService.sign(payload);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      lifePathNumber: user.lifePathNumber,
      personalYearNumber: user.personalYearNumber,
    },
  };
  }

  async verifyGoogleIdToken(idToken: string) {
    const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
  
    const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: this.config.get('GOOGLE_CLIENT_ID'), // ✅ Ton Client ID exact ici (à injecter dans ton ConfigService)
    });
  
    return payload;
  }

  async oauthLogin(dto: OAuthLoginDto) {
    const { provider, idToken } = dto;

    if (provider === 'google') {
      const payload = await this.verifyGoogleIdToken(idToken);
    
      const email = payload.email;
      const googleId = payload.sub;
    
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { providerId: googleId },
            { email: email as string },
          ],
        },
      });
    
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: (email as string),
            name: 'Utilisateur Google',
            provider: 'google',
            providerId: googleId,
            birthDate: new Date(), // temporaire
            lifePathNumber: 1,
            personalYearNumber: 1,
          },
        });
      }
    
      const token = this.jwtService.sign({ sub: user.id });
    
      return {
        token,
        user,
      };
    }
    

    if (provider === 'apple') {
      const payload = await this.verifyAppleIdToken(idToken);
    
      const email = payload.email; // Peut être masqué
      const appleId = payload.sub; // ID unique Apple
    
      // Chercher un utilisateur avec l'appleId OU avec email
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { providerId: appleId }, // Apple unique ID
            { email: email as string }, // Si disponible
          ],
        },
      });
    
      if (!user) {
        // Créer le user
        user = await this.prisma.user.create({
          data: {
            email: (email as string) ?? `${appleId}@privaterelay.appleid.com`,
            name: 'Utilisateur Apple',
            provider: 'apple',
            providerId: appleId,
            birthDate: new Date(), // temporaire
            lifePathNumber: 1,
            personalYearNumber: 1,
          },
        });
      }
    
      console.log('Token JWT généré avec ID :', user.id);
      const token = this.jwtService.sign({ sub: user.id });
    
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          guideChoice: user.guideChoice,
          isPremium: user.isPremium,
        },
      };
    }
    

    throw new Error('Provider non pris en charge');
  }

  async setupProfile(userId: string, dto: SetupProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) throw new Error('Utilisateur introuvable');
  
    // Empêche de modifier un profil déjà complété
    if (user.birthDate && user.name) {
      throw new Error('Le profil est déjà complété.');
    }
  
    const birthDate = new Date(dto.birthDate);
    const lifePath = calculateLifePathNumber(birthDate);
    const personalYear = calculatePersonalYearNumber(birthDate, new Date());
    const soul = calculateSoulNumber(dto.name);
    const expression = calculateExpressionNumber(dto.name);

    if (isNaN(birthDate.getTime())) {
      throw new BadRequestException('La date de naissance est invalide.');
    }
  
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        birthDate,
        lifePathNumber: lifePath,
        personalYearNumber: personalYear,
        soulNumber: soul,
        expressionNumber: expression,
      },
      select: {
        id: true,
        name: true,
        birthDate: true,
        lifePathNumber: true,
        personalYearNumber: true,
      },
    });
  
    return {
      message: 'Profil complété avec succès',
      user: updated,
    };
  }
  
  async verifyAppleIdToken(idToken: string) {
    const JWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));
  
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: 'https://appleid.apple.com',
      audience: this.config.get('APPLE_BUNDLE_ID'), // 👉 com.numia.app
    });
  
    return payload;
  }

}
