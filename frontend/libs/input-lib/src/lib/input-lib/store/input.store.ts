import { HttpErrorResponse } from '@angular/common/http';
import { computed,inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { QuoteRequestDto } from '@target/interfaces';
import { InputDtoSchema } from '@target/validations';
import { catchError, lastValueFrom, throwError } from 'rxjs';

import { Input, InputState } from './input.store.interfaces';
import { QuoteService } from './services/quote.service';

const initialState: InputState = {
  geburtsdatum: { value: '', valid: false, error: null },
  leistungsVorgabe: { value: 'Beitrag', valid: true, error: null },
  beitrag: { value: 1000, valid: true, error: null },
  berechnungDerLaufzeit: {
    value: 'Alter bei Rentenbeginn',
    valid: true,
    error: null,
  },
  laufzeit: { value: 10, valid: true, error: null },
  beitragszahlungsweise: { value: 'Einmalbeitrag', valid: true, error: null },
  rentenzahlungsweise: { value: 'Monatliche Renten', valid: true, error: null },
  quote: {
    basisdaten: {
      geburtsdatum: '',
      versicherungsbeginn: '',
      garantieniveau: '',
      alterBeiRentenbeginn: 0,
      aufschubdauer: 0,
      beitragszahlungsdauer: 0,
    },
    leistungsmerkmale: {
      garantierteMindestrente: 0,
      einmaligesGarantiekapital: 0,
      todesfallleistungAbAltersrentenbezug: 0,
    },
    beitrag: {
      einmalbeitrag: 0,
      beitragsdynamik: '',
    },
  },
  isCalculatingQuote: false,
  error: null,
};
const getErrorMessage = (error: unknown): string => {
  if (error instanceof HttpErrorResponse) {
    switch (error.status) {
      case 0:
        return 'Netzwerkfehler: Keine Verbindung zum Server möglich. Bitte überprüfen Sie Ihre Internetverbindung.';
      case 400:
        return 'Ungültige Eingabedaten. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.';
      case 401:
        return 'Nicht autorisiert. Bitte melden Sie sich erneut an.';
      case 403:
        return 'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.';
      case 404:
        return 'Service nicht gefunden. Bitte versuchen Sie es später erneut.';
      case 408:
        return 'Anfrage-Timeout. Der Server benötigt zu lange zum Antworten. Bitte versuchen Sie es erneut.';
      case 429:
        return 'Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.';
      case 500:
        return 'Serverfehler. Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
      case 502:
        return 'Server nicht erreichbar. Bitte versuchen Sie es später erneut.';
      case 503:
        return 'Service vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.';
      case 504:
        return 'Gateway-Timeout. Der Service ist überlastet. Bitte versuchen Sie es später erneut.';
      default:
        return `Ein unerwarteter Fehler ist aufgetreten (${error.status}). Bitte versuchen Sie es später erneut.`;
    }
  }
  
  if (error instanceof Error) {
    if (error.message === 'Invalid input') {
      return 'Ungültige Eingabedaten. Bitte überprüfen Sie alle Pflichtfelder und versuchen Sie es erneut.';
    }
    return `Ein Fehler ist aufgetreten: ${error.message}`;
  }
  
  return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
};

export const InputStore = signalStore(
  { providedIn: 'root' },
  withState({ uiState: initialState }),
  withComputed((store) => ({
    isCalculatingQuote: computed(() => store.uiState().isCalculatingQuote || false),
    hasError: computed(() => !!store.uiState().error),
    quote: computed(() => store.uiState().quote),
    isLoading: computed(() => store.uiState().isCalculatingQuote || false),
    error: computed(() => store.uiState().error),
  })),
  withMethods((store, quoteService = inject(QuoteService)) => ({
    updateInputs: async (input: Input): Promise<void> => {
      const initialNewState = {
        ...store.uiState(),
        [input.key]: { value: input.value, valid: true, error: null },
        error: null, // Clear global error when user updates inputs
      };
      const validationResult = await InputDtoSchema.safeParseAsync(transformUiStateToInputDto(initialNewState));

      if (validationResult.success) {
        patchState(store, { uiState: initialNewState });
        return;
      }

      const validatedState = validationResult.error.issues.reduce(
        (state, { path, message }) => {
          const fieldKey = path[0] as keyof InputState;

          if (fieldKey === 'isCalculatingQuote' || fieldKey === 'quote' || fieldKey === 'error') {
            return state;
          }
          return {
            ...state,
            [fieldKey]: {
              ...(state[fieldKey] as any),
              valid: false,
              error: message,
            },
          };
        },
        initialNewState,
      );

      patchState(store, { uiState: validatedState });
    },
    calculate: async (): Promise<void> => {
      // Clear any existing errors and set loading state
      patchState(store, { 
        uiState: { ...store.uiState(), isCalculatingQuote: true, error: null } 
      });

      const quoteDto = transformUiStateToInputDto(store.uiState());
      const validationResult = await InputDtoSchema.safeParseAsync(quoteDto);

      try {
        if (!validationResult.success) {
          throw new Error('Invalid input');
        }

        const quote = await lastValueFrom(
          quoteService.calculateQuote(quoteDto as QuoteRequestDto).pipe(
            catchError((error) => {
              console.error('Quote calculation error:', error);
              return throwError(() => error);
            })
          )
        );

        patchState(store, { 
          uiState: { ...store.uiState(), quote, isCalculatingQuote: false, error: null } 
        });
      } catch (error) {
        console.error('Error calculating quote:', error);
        const errorMessage = getErrorMessage(error);
        
        patchState(store, { 
          uiState: { ...store.uiState(), isCalculatingQuote: false, error: errorMessage } 
        });
      }
    },
    clearError: (): void => {
      patchState(store, {
        uiState: { ...store.uiState(), error: null }
      });
    },
    clearQuote: (): void => {
      patchState(store, {
        uiState: { ...initialState }
      });
    },
  })),
);

const transformUiStateToInputDto = (state: InputState): QuoteRequestDto => 
  Object.entries(state)
    .filter(([key]) => key !== 'quote' && key !== 'isCalculatingQuote' && key !== 'error')
    .reduce((acc, [key, field]) => ({ ...acc, [key]: (field as any).value }), {} as QuoteRequestDto);
