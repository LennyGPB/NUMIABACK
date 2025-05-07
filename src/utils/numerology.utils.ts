export function calculateLifePathNumber(birthDate: Date): number {
    if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
      throw new Error('Date de naissance invalide');
    }

    // On récupère les composants de la date (jour, mois, année)
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1; // +1 car Janvier = 0
    const year = birthDate.getFullYear();
  
    // On convertit chaque partie en une chaîne, puis on découpe en chiffres individuels
    const digits = `${day}${month}${year}`.split('').map(Number);
  
    // On additionne tous les chiffres
    let total = digits.reduce((acc, val) => acc + val, 0);
  
    // On réduit jusqu'à obtenir un chiffre entre 1 et 9 (ou 11/22 plus tard si tu veux)
    while (total > 9 && total !== 11 && total !== 22) {
      total = total.toString().split('').map(Number).reduce((a, b) => a + b);
    }
  
    return total;
  }
  
  export function calculatePersonalYearNumber(birthDate: Date, now: Date): number {
    // On récupère le jour et le mois de naissance
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
  
    // Et on prend l’année actuelle
    const year = now.getFullYear();
  
    // On forme une "date virtuelle" : jour + mois + année actuelle
    const digits = `${day}${month}${year}`.split('').map(Number);
  
    let total = digits.reduce((acc, val) => acc + val, 0);
  
    while (total > 9 && total !== 11 && total !== 22) {
      total = total.toString().split('').map(Number).reduce((a, b) => a + b);
    }
  
    return total;
  }

  export function calculateDayNumber(today: Date, lifePathNumber: number): number {
    // Étape 1 : extraire les chiffres de la date actuelle
    const dayDigits = today
      .toISOString()
      .slice(0, 10) // yyyy-mm-dd
      .replace(/-/g, '') // "20250417"
      .split('')
      .map(Number); // [2, 0, 2, 5, 0, 4, 1, 7]
  
    const dateSum = dayDigits.reduce((acc, val) => acc + val, 0); // 2+0+2+5+0+4+1+7 = 21
  
    // Étape 2 : additionner avec le chemin de vie
    let total = dateSum + lifePathNumber; // 21 + 6 = 27
  
    // Étape 3 : réduction théosophique
    while (total > 9 && total !== 11 && total !== 22) {
      total = total
        .toString()
        .split('')
        .map(Number)
        .reduce((a, b) => a + b);
    }
  
    return total; // ex : 2 + 7 = 9
  }

  const numerologyMap: Record<string, number> = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9,
  };
  
  const vowels = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);

  function reduceToOneDigit(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num
        .toString()
        .split('')
        .map(Number)
        .reduce((a, b) => a + b, 0);
    }
    return num;
  }
  
  
  export function calculateExpressionNumber(fullName: string): number {
    const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  
    const total = letters
      .split('')
      .map(letter => numerologyMap[letter] || 0)
      .reduce((sum, val) => sum + val, 0);
  
    return reduceToOneDigit(total);
  }

  export function calculateSoulNumber(fullName: string): number {
    const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  
    const vowelValues = letters
      .split('') // On découpe le nom en lettres
      .filter(letter => vowels.has(letter))
      .map(letter => numerologyMap[letter] || 0);
  
    const total = vowelValues.reduce((sum, val) => sum + val, 0);
  
    return reduceToOneDigit(total);
  }
  
  
  