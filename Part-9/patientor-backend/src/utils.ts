import { z } from 'zod';
import { Gender, NewPatient, EntryWithoutId, HealthCheckRating, Diagnosis } from './types';

const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(z.unknown()).default([]),
});

export const toNewPatient = (object: unknown): NewPatient =>
  NewPatientSchema.parse(object) as NewPatient;

// Entry parsing
const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }
  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
});

const HealthCheckSchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
  diagnosisCodes: z.array(z.string()).optional(),
});

const OccupationalSchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
  sickLeave: z.object({ startDate: z.string(), endDate: z.string() }).optional(),
});

const HospitalSchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({ date: z.string(), criteria: z.string() }),
  diagnosisCodes: z.array(z.string()).optional(),
});

const EntrySchema = z.discriminatedUnion('type', [
  HealthCheckSchema,
  OccupationalSchema,
  HospitalSchema,
]);

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object') throw new Error('Incorrect or missing data');
  const obj = object as Record<string, unknown>;
  // attach diagnosisCodes via the helper if not already present
  const withCodes = { ...obj, diagnosisCodes: parseDiagnosisCodes(obj) };
  return EntrySchema.parse(withCodes) as EntryWithoutId;
};
