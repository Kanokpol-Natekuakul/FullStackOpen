import { Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import { Entry, HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry, HealthCheckRating, Diagnosis } from "../../types";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const ratingColor = (rating: HealthCheckRating): string => {
  switch (rating) {
    case HealthCheckRating.Healthy: return "green";
    case HealthCheckRating.LowRisk: return "yellow";
    case HealthCheckRating.HighRisk: return "orange";
    case HealthCheckRating.CriticalRisk: return "red";
  }
};

const DiagnosisList = ({ codes, diagnoses }: { codes?: string[]; diagnoses: Diagnosis[] }) => {
  if (!codes || codes.length === 0) return null;
  return (
    <ul>
      {codes.map(code => {
        const diag = diagnoses.find(d => d.code === code);
        return <li key={code}>{code} {diag?.name}</li>;
      })}
    </ul>
  );
};

const HealthCheckDetails = ({ entry, diagnoses }: { entry: HealthCheckEntry; diagnoses: Diagnosis[] }) => (
  <Box sx={{ border: "1px solid grey", borderRadius: 1, p: 1, mb: 1 }}>
    <Typography>{entry.date} <MonitorHeartIcon /></Typography>
    <Typography><em>{entry.description}</em></Typography>
    <FavoriteIcon sx={{ color: ratingColor(entry.healthCheckRating) }} />
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const OccupationalDetails = ({ entry, diagnoses }: { entry: OccupationalHealthcareEntry; diagnoses: Diagnosis[] }) => (
  <Box sx={{ border: "1px solid grey", borderRadius: 1, p: 1, mb: 1 }}>
    <Typography>{entry.date} <WorkIcon /> <em>{entry.employerName}</em></Typography>
    <Typography><em>{entry.description}</em></Typography>
    {entry.sickLeave && (
      <Typography>sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}</Typography>
    )}
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const HospitalDetails = ({ entry, diagnoses }: { entry: HospitalEntry; diagnoses: Diagnosis[] }) => (
  <Box sx={{ border: "1px solid grey", borderRadius: 1, p: 1, mb: 1 }}>
    <Typography>{entry.date} <LocalHospitalIcon /></Typography>
    <Typography><em>{entry.description}</em></Typography>
    <Typography>discharge: {entry.discharge.date} — {entry.discharge.criteria}</Typography>
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const EntryDetails = ({ entry, diagnoses }: { entry: Entry; diagnoses: Diagnosis[] }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckDetails entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalDetails entry={entry} diagnoses={diagnoses} />;
    case "Hospital":
      return <HospitalDetails entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
