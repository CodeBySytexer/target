import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InputStore } from '@target/input-lib';

@Component({
  selector: 'lib-quote-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.scss']
})
export class QuoteSummaryComponent {
  private readonly inputStore = inject(InputStore);
  private readonly router = inject(Router);


  quote = computed(() => this.inputStore.quote());
  isLoading = computed(() => this.inputStore.isLoading());
  error = computed(() => this.inputStore.error());


  private readonly uiState = computed(() => this.inputStore.uiState());


  formatCurrency(value: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }

 
  formatDate(dateString: string): string {
    if (!dateString) return 'Nicht angegeben';
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('de-DE').format(date);
  }


  calculateCurrentAge(): number {
    const quote = this.quote();

    if (!quote?.basisdaten?.geburtsdatum) return 0;
    
    const birthDate = new Date(quote.basisdaten.geburtsdatum);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }


  getTimeDifferenceFromToday(dateString: string): string {
    if (!dateString) return 'Nicht berechnet';
    
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    
    if (diffTime < 0) {
      return 'bereits begonnen';
    }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `in ${diffDays} Tagen`;
    } else if (diffDays < 365) {
      const months = Math.round(diffDays / 30);

      return `in ${months} Monat${months > 1 ? 'en' : ''}`;
    } else {
      const years = Math.round(diffDays / 365);

      return `in ${years} Jahr${years > 1 ? 'en' : ''}`;
    }
  }


  getInputValue(key: string): any {
    const uiState = this.uiState();

    if (!uiState) return 'Nicht verfügbar';
    
    const field = (uiState as any)[key];

    return field?.value || 'Nicht verfügbar';
  }

 
  calculateTotalGuaranteedPension(): number {
    const quote = this.quote();

    if (!quote?.leistungsmerkmale?.garantierteMindestrente) return 0;
    
    // Assuming 20 years of pension payments (conservative estimate)
    const yearsToPay = 20;
    const monthlyRent = quote.leistungsmerkmale.garantierteMindestrente;
    
    return monthlyRent * 12 * yearsToPay;
  }


  calculateReturn(): string {
    const quote = this.quote();

    if (!quote) return '0.0';
    
    const totalPaid = quote.beitrag.einmalbeitrag;
    const totalReceived = this.calculateTotalGuaranteedPension() + quote.leistungsmerkmale.einmaligesGarantiekapital;
    
    if (totalPaid === 0) return '0.0';
    
    const profit = totalReceived - totalPaid;
    const returnPercent = (profit / totalPaid) * 100;
    
    return returnPercent.toFixed(1);
  }


  goBack(): void {
    this.router.navigate(['/inputs']);
  }


  startNewQuote(): void {
    this.inputStore.clearQuote();
    this.router.navigate(['/inputs']);
  }


  acceptQuote(): void {
    // TODO: Implement quote acceptance logic
    alert('Angebot angenommen! Diese Funktion wird in einer zukünftigen Version implementiert.');
  }

  downloadQuote(): void {
    // TODO: Implement PDF download functionality
    alert('PDF-Download wird in einer zukünftigen Version verfügbar sein.');
  }
}
