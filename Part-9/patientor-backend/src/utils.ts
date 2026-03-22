import { Gender, NewPatient } from './types';

const isString = (text: unknown): text is string =>
  typeof text === 'string' || text instanceof String;

const isGender = (value: string): value is Gender =>
  Object.values(Gender).map(String).includes(value);

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) throw new Error('Missing or invalid name');
  return name;
};

const parseDateOfBirth = (date: unknown): string => {
  if (!date || !isString(date)) throw new Error('Missing or invalid dateOfBirth');
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) throw new Error('Missing or invalid ssn');
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender))
    throw new Error('Missing or invalid gender');
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) throw new Error('Missing or invalid occupation');
  return occupation;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') throw new Error('Incorrect or missing data');
  const obj = object as Record<string, unknown>;
  return {
    name: parseName(obj.name),
    dateOfBirth: parseDateOfBirth(obj.dateOfBirth),
    ssn: parseSsn(obj.ssn),
    gender: parseGender(obj.gender),
    occupation: parseOccupation(obj.occupation),
  };
};
