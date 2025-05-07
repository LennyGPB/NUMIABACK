import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckCompatibilityDto } from 'src/auth/dto/check-compatibility.dto';
import { calculateLifePathNumber } from '../utils/numerology.utils'; 
import { AiService } from '../ai/ai.service';

@Injectable()
export class CompatibilityService {
  constructor(private aiService: AiService) {}

  async checkCompatibility(dto: CheckCompatibilityDto) {
    const date1 = new Date(dto.birthDate1);
    const date2 = new Date(dto.birthDate2);
    
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      throw new BadRequestException('Date(s) de naissance invalide(s)');
    }

    const lifePath1 = calculateLifePathNumber(date1);
    const lifePath2 = calculateLifePathNumber(date2);

    const prompt = `
    Tu es un expert en numérologie et guide spirituel.

    On te donne deux chemins de vie :
    - Chemin de vie 1 : ${lifePath1} (date de naissance : ${date1})
    - Chemin de vie 2 : ${lifePath2} (date de naissance : ${date2})

    Ta mission est de transmettre une lecture claire, inspirante et accessible de leur compatibilité.

    Formate ta réponse ainsi :
    Résumé : une phrase courte, poétique et synthétique sur la vibration de leur lien (max. 2 lignes, et mentionne la date de naissance relié au chemin de vie).
    Détails : une explication inspirée de la symbolique de ces deux nombres, en 4 à 6 lignes maximum. Reste simple, fluide, sans jargon. Ne répète pas le résumé.

    Rappelle-toi : sois spirituel mais ancré, profond mais accessible. 

    `;

    const response = await this.aiService.generateGuidanceFromPrompt(prompt);

    // Séparation du contenu via le format imposé
    const [summaryLine, ...detailsLines] = response.split('\n').filter(Boolean);
    const summary = summaryLine.replace(/^Résumé\s*:\s*/i, '');
    const details = detailsLines.join('\n').replace(/^Détails\s*:\s*/i, '');

    return {
      lifePath1,
      lifePath2,
      summary,
      details,
    };
  }
}
