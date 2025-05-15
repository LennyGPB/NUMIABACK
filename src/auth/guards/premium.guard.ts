import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class PremiumGuard implements CanActivate { 
    canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.isPremium) {
      throw new ForbiddenException('Accès réservé aux utilisateurs Premium.');
    }

    return true;
  }
}
