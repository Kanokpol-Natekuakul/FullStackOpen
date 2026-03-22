import { z } from 'zod';
import { Gender, NewPatient } from './types';

const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

export const toNewPatient = (object: unknown): NewPatient =>
  NewPatientSchema.parse(object);
