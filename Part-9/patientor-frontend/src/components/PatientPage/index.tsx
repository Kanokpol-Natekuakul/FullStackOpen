import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { Patient, Gender, Diagnosis, EntryWithoutId } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case Gender.Male: return <MaleIcon />;
    case Gender.Female: return <FemaleIcon />;
    default: return <TransgenderIcon />;
  }
};

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!id) return;
    patientService.getById(id).then(setPatient);
  }, [id]);

  if (!patient || !id) return <div>Loading...</div>;

  const handleAddEntry = async (entry: EntryWithoutId) => {
    const newEntry = await patientService.addEntry(id, entry);
    setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4">
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography>date of birth: {patient.dateOfBirth}</Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>entries</Typography>
      {patient.entries.map(entry => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}

      <AddEntryForm patientId={id} diagnoses={diagnoses} onAdd={handleAddEntry} />
    </Box>
  );
};

export default PatientPage;
