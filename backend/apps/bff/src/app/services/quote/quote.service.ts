import { Injectable } from '@nestjs/common';
import { QuoteRequestDto, QuoteResponseDto } from '@target/interfaces';

@Injectable()
export class QuoteService {
  async getQuote({ beitrag, geburtsdatum }: QuoteRequestDto): Promise<QuoteResponseDto> {
    await this.sleep(Math.random() * 4000); // Simulate a real quote service delay 😅

    // Calculate age from birthdate
    const birthDate = new Date(geburtsdatum);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() - 
      (today.getMonth() < birthDate.getMonth() || 
       (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
    const retirementAge = 67;
    const yearsToRetirement = retirementAge - age;
    const ageMultiplier = age < 30 ? 1.2 : age < 40 ? 1.1 : age < 50 ? 1.0 : 0.9;
    
    return {
      basisdaten: {
        geburtsdatum,
        versicherungsbeginn: new Date().toISOString().split('T')[0],
        garantieniveau: '90%',
        alterBeiRentenbeginn: retirementAge,
        aufschubdauer: Math.max(yearsToRetirement, 0),
        beitragszahlungsdauer: Math.max(yearsToRetirement, 1),
      },
      leistungsmerkmale: {
        garantierteMindestrente: Math.round(beitrag * 50 * ageMultiplier),
        einmaligesGarantiekapital: Math.round(beitrag / 2 * ageMultiplier),
        todesfallleistungAbAltersrentenbezug: retirementAge,
      },
      beitrag: {
        einmalbeitrag: beitrag,
        beitragsdynamik: age < 40 ? '2%' : '1,5%',
      },
    };
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
