
const patterns = {
    "Numéros de Carte de Crédit": /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
    "Adresses Email": /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    "Numéros de Téléphone": /\b(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}\b/g,
    "Numéros de Sécurité Sociale": /\b[12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2}\b/g,
  };
  
  export const scanForSensitiveData = (text: string): Record<string, string[]> => {
    const results: Record<string, string[]> = {};
  
    Object.entries(patterns).forEach(([type, pattern]) => {
      const matches = text.match(pattern) || [];
      if (matches.length > 0) {
        results[type] = matches;
      }
    });
  
    return results;
  };
  