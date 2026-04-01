import { z } from 'zod';

export const GeburtsdatumSchema = z
  .string()
  .min(1, 'Geburtsdatum ist erforderlich')
  .refine((dateStr) => {
    const date = new Date(dateStr);

    return !isNaN(date.getTime());
  }, {
    message: 'Bitte geben Sie ein gültiges Datum ein',
  })
  .refine((dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();

    return date <= today;
  }, {
    message: 'Geburtsdatum kann nicht in der Zukunft liegen',
  })
  .refine((dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear() - 
      (today.getMonth() < date.getMonth() || 
       (today.getMonth() === date.getMonth() && today.getDate() < date.getDate()) ? 1 : 0);

    return age >= 18;
  }, {
    message: 'Sie müssen mindestens 18 Jahre alt sein',
  });

export type Geburtsdatum = z.infer<typeof GeburtsdatumSchema>;
