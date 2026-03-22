import express from 'express';
import { v1 as uuid } from 'uuid';
import { z } from 'zod';
import patients from '../data/patients';
import { Patient, PublicPatient } from '../types';
import { toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const publicPatients: PublicPatient[] = patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id, name, dateOfBirth, gender, occupation,
    })
  );
  res.json(publicPatients);
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const patient: Patient = { id: uuid(), ...newPatient };
    patients.push(patient);
    res.json(patient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
});

export default router;
