/**
 * Centralized form configuration
 * This file contains all form field configurations and validation rules
 */

export const FORM_VALIDATION_MESSAGES = {
  required: 'Dieses Feld ist erforderlich.',
  invalidDate: 'Bitte geben Sie ein gültiges Datum ein.',
  invalidNumber: 'Bitte geben Sie eine gültige Zahl ein.',
  minAge: 'Sie müssen mindestens 18 Jahre alt sein.',
  maxAge: 'Das maximale Alter beträgt 100 Jahre.',
  minAmount: 'Der Mindestbetrag beträgt 100 €.',
  maxAmount: 'Der Höchstbetrag beträgt 10.000 €.',
  minYears: 'Die Mindestlaufzeit beträgt 5 Jahre.',
  maxYears: 'Die Höchstlaufzeit beträgt 50 Jahre.',
} as const;

export const DROPDOWN_OPTIONS = {
  leistungsvorgabe: [
    { value: 'Beitrag', label: 'Beitrag' },
    { value: 'Einmalbeitrag', label: 'Einmalbeitrag' },
    { value: 'Garantierte Mindestrente', label: 'Garantierte Mindestrente' },
    { value: 'Garantiekapital', label: 'Garantiekapital' },
    { value: 'Gesamtkapital', label: 'Gesamtkapital' },
    { value: 'Gesamtrente', label: 'Gesamtrente' }
  ],
  
  berechnungDerLaufzeit: [
    { value: 'Alter bei Rentenbeginn', label: 'Alter bei Rentenbeginn' },
    { value: 'Aufschubdauer', label: 'Aufschubdauer' }
  ],
  
  beitragszahlungsweise: [
    { value: 'Einmalbeitrag', label: 'Einmalbeitrag' },
    { value: 'Monatliche Beiträge', label: 'Monatliche Beiträge' }
  ],
  
  rentenzahlungsweise: [
    { value: 'Monatliche Renten', label: 'Monatliche Renten' },
    { value: 'Vierteljährliche Renten', label: 'Vierteljährliche Renten' },
    { value: 'Halbjährliche Renten', label: 'Halbjährliche Renten' },
    { value: 'Jährliche Renten', label: 'Jährliche Renten' }
  ]
} as const;

export const FORM_FIELD_DEFAULTS = {
  geburtsdatum: '',
  leistungsVorgabe: 'Beitrag',
  beitrag: 1000,
  berechnungDerLaufzeit: 'Alter bei Rentenbeginn',
  laufzeit: 10,
  beitragszahlungsweise: 'Einmalbeitrag',
  rentenzahlungsweise: 'Monatliche Renten'
} as const;

export const FORM_VALIDATION_RULES = {
  beitrag: {
    min: 100,
    max: 10000,
    step: 50
  },
  laufzeit: {
    min: 5,
    max: 50,
    step: 1
  },
  age: {
    min: 18,
    max: 100
  }
} as const;
