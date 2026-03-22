import express from 'express';
import patients from '../data/patients';
import { PublicPatient } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  const publicPatients: PublicPatient[] = patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id, name, dateOfBirth, gender, occupation,
    })
  );
  res.json(publicPatients);
});

export default router;
