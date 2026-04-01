import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { QuoteResponseDto } from '@target/interfaces';
import { InputDtoSchema } from '@target/validations';
import { of, throwError } from 'rxjs';

import { InputStore } from '../input.store';
import { QuoteService } from '../services/quote.service';

jest.mock('@target/validations', () => ({
  InputDtoSchema: {
    safeParseAsync: jest.fn(),
  },
}));

describe('InputStore', () => {
  let store: any;
  let quoteService: jest.Mocked<QuoteService>;

  const mockQuoteResponse: QuoteResponseDto = {
    basisdaten: {
      geburtsdatum: '1990-01-01',
      versicherungsbeginn: '2024-01-01',
      garantieniveau: '90%',
      alterBeiRentenbeginn: 67,
      aufschubdauer: 30,
      beitragszahlungsdauer: 10,
    },
    leistungsmerkmale: {
      garantierteMindestrente: 50000,
      einmaligesGarantiekapital: 25000,
      todesfallleistungAbAltersrentenbezug: 40000,
    },
    beitrag: {
      einmalbeitrag: 0,
      beitragsdynamik: '1,5%',
    },
  };

  beforeEach(() => {
    quoteService = {
      calculateQuote: jest.fn(),
    } as unknown as jest.Mocked<QuoteService>;

    TestBed.configureTestingModule({
      providers: [{ provide: QuoteService, useValue: quoteService }],
    });

    store = TestBed.inject(InputStore);
  });

  describe('updateInputs', () => {
    it('should update state when validation succeeds', async () => {
      const input = { key: 'beitrag', value: 2000 };

      (InputDtoSchema.safeParseAsync as jest.Mock).mockResolvedValue({
        success: true,
      });

      await (store as any).updateInputs(input);

      expect(store.uiState().beitrag.value).toBe(2000);
      expect(store.uiState().beitrag.valid).toBe(true);
      expect(store.uiState().beitrag.error).toBeNull();
    });

    it('should update state with validation errors when validation fails', async () => {
      const input = { key: 'beitrag', value: -1 };

      (InputDtoSchema.safeParseAsync as jest.Mock).mockResolvedValue({
        success: false,
        error: {
          issues: [{ path: ['beitrag'], message: 'Beitrag must be positive' }],
        },
      });

      await (store as any).updateInputs(input);

      expect(store.uiState().beitrag.value).toBe(-1);
      expect(store.uiState().beitrag.valid).toBe(false);
      expect(store.uiState().beitrag.error).toBe('Beitrag must be positive');
    });

    it('should clear global error when updating inputs', async () => {
      const input = { key: 'beitrag', value: 2000 };

      (InputDtoSchema.safeParseAsync as jest.Mock).mockResolvedValue({
        success: true,
      });

      // Set an error state first
      store.uiState.set({
        ...store.uiState(),
        error: 'Previous error'
      });

      await (store as any).updateInputs(input);

      expect(store.uiState().error).toBeNull();
    });
  });

  describe('calculate', () => {
    it('should update quote when calculation succeeds', async () => {
      (InputDtoSchema.safeParseAsync as jest.Mock).mockResolvedValue({
        success: true,
      });
      quoteService.calculateQuote.mockReturnValue(of(mockQuoteResponse));

      await (store as any).calculate();

      expect(store.uiState().quote).toEqual(mockQuoteResponse);
      expect(store.uiState().isCalculatingQuote).toBe(false);
      expect(store.uiState().error).toBeNull();
      expect(quoteService.calculateQuote).toHaveBeenCalled();
    });

    it('should handle validation failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (InputDtoSchema.safeParseAsync as jest.Mock).mockResolvedValue({
        success: false,
      });

      await (store as any).calculate();

      expect(store.uiState().isCalculatingQuote).toBe(false);
      expect(store.uiState().error).toBe('Ungültige Eingabedaten. Bitte überprüfen Sie alle Pflichtfelder und versuchen Sie es erneut.');
      expect(quoteService.calculateQuote).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle API errors with generic Error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (InputDtoSchema.safeParseAsync as jest.Mock).mockResolvedValue({
        success: true,
      });
      const error = new Error('API Error');

      quoteService.calculateQuote.mockReturnValue(throwError(() => error));

      await (store as any).calculate();

      expect(store.uiState().isCalculatingQuote).toBe(false);
      expect(store.uiState().error).toBe('Ein Fehler ist aufgetreten: API Error');
      expect(quoteService.calculateQuote).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle HTTP 500 error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (InputDtoSchema.safeParseAsync as jest.Mock).mockResolvedValue({
        success: true,
      });
      const httpError = new HttpErrorResponse({ status: 500 });

      quoteService.calculateQuote.mockReturnValue(throwError(() => httpError));

      await (store as any).calculate();

      expect(store.uiState().isCalculatingQuote).toBe(false);
      expect(store.uiState().error).toBe('Serverfehler. Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.');

      consoleSpy.mockRestore();
    });

    it('should handle HTTP 400 error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (InputDtoSchema.safeParseAsync as jest.Mock).mockResolvedValue({
        success: true,
      });
      const httpError = new HttpErrorResponse({ status: 400 });

      quoteService.calculateQuote.mockReturnValue(throwError(() => httpError));

      await (store as any).calculate();

      expect(store.uiState().isCalculatingQuote).toBe(false);
      expect(store.uiState().error).toBe('Ungültige Eingabedaten. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.');

      consoleSpy.mockRestore();
    });

    it('should handle network error (status 0)', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (InputDtoSchema.safeParseAsync as jest.Mock).mockResolvedValue({
        success: true,
      });
      const httpError = new HttpErrorResponse({ status: 0 });

      quoteService.calculateQuote.mockReturnValue(throwError(() => httpError));

      await (store as any).calculate();

      expect(store.uiState().isCalculatingQuote).toBe(false);
      expect(store.uiState().error).toBe('Netzwerkfehler: Keine Verbindung zum Server möglich. Bitte überprüfen Sie Ihre Internetverbindung.');

      consoleSpy.mockRestore();
    });

    it('should clear error when calculation starts', async () => {
      (InputDtoSchema.safeParseAsync as jest.Mock).mockResolvedValue({
        success: true,
      });
      quoteService.calculateQuote.mockReturnValue(of(mockQuoteResponse));

      // Set an error state first
      store.uiState.set({
        ...store.uiState(),
        error: 'Previous error'
      });

      await (store as any).calculate();

      expect(store.uiState().error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      // Set an error state first
      store.uiState.set({
        ...store.uiState(),
        error: 'Test error'
      });

      expect(store.uiState().error).toBe('Test error');

      store.clearError();

      expect(store.uiState().error).toBeNull();
    });
  });

  describe('hasError computed', () => {
    it('should return true when there is an error', () => {
      // Set an error state
      store.uiState.set({
        ...store.uiState(),
        error: 'Test error'
      });

      expect(store.hasError()).toBe(true);
    });

    it('should return false when there is no error', () => {
      expect(store.hasError()).toBe(false);
    });

    it('should return false when error is null', () => {
      store.uiState.set({
        ...store.uiState(),
        error: null
      });

      expect(store.hasError()).toBe(false);
    });
  });
});
