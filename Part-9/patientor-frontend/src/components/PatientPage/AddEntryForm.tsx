import { useState } from "react";
import axios from "axios";
import {
  Box, Button, TextField, MenuItem, Select, InputLabel,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  OutlinedInput, Chip, Typography, SelectChangeEvent
} from "@mui/material";
import { EntryWithoutId, HealthCheckRating, Diagnosis } from "../../types";

interface Props {
  patientId: string;
  diagnoses: Diagnosis[];
  onAdd: (entry: EntryWithoutId) => Promise<void>;
}

type EntryType = "HealthCheck" | "OccupationalHealthcare" | "Hospital";

const AddEntryForm = ({ patientId, diagnoses, onAdd }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCodesChange = (e: SelectChangeEvent<string[]>) => {
    const val = e.target.value;
    setDiagnosisCodes(typeof val === "string" ? val.split(",") : val);
  };

  const buildEntry = (): EntryWithoutId => {
    const base = { date, description, specialist, diagnosisCodes: diagnosisCodes.length ? diagnosisCodes : undefined };
    switch (type) {
      case "HealthCheck":
        return { ...base, type: "HealthCheck", healthCheckRating };
      case "OccupationalHealthcare":
        return {
          ...base, type: "OccupationalHealthcare", employerName,
          ...(sickLeaveStart && sickLeaveEnd ? { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } } : {}),
        };
      case "Hospital":
        return { ...base, type: "Hospital", discharge: { date: dischargeDate, criteria: dischargeCriteria } };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onAdd(buildEntry());
      setDate(""); setDescription(""); setSpecialist(""); setDiagnosisCodes([]);
      setEmployerName(""); setSickLeaveStart(""); setSickLeaveEnd("");
      setDischargeDate(""); setDischargeCriteria("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data as string | undefined;
        setError(msg ?? err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ border: "2px dashed grey", p: 2, mb: 2 }}>
      <Typography variant="h6">New entry</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <FormControl fullWidth sx={{ mb: 1 }}>
        <InputLabel>Type</InputLabel>
        <Select value={type} label="Type" onChange={e => setType(e.target.value as EntryType)}>
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
        </Select>
      </FormControl>

      <TextField fullWidth label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 1 }} required />
      <TextField fullWidth label="Description" value={description} onChange={e => setDescription(e.target.value)} sx={{ mb: 1 }} required />
      <TextField fullWidth label="Specialist" value={specialist} onChange={e => setSpecialist(e.target.value)} sx={{ mb: 1 }} required />

      <FormControl fullWidth sx={{ mb: 1 }}>
        <InputLabel>Diagnosis codes</InputLabel>
        <Select multiple value={diagnosisCodes} onChange={handleCodesChange} input={<OutlinedInput label="Diagnosis codes" />}
          renderValue={selected => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(selected as string[]).map(v => <Chip key={v} label={v} />)}
            </Box>
          )}>
          {diagnoses.map(d => <MenuItem key={d.code} value={d.code}>{d.code} {d.name}</MenuItem>)}
        </Select>
      </FormControl>

      {type === "HealthCheck" && (
        <FormControl sx={{ mb: 1 }}>
          <FormLabel>Health check rating</FormLabel>
          <RadioGroup row value={healthCheckRating} onChange={e => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}>
            {Object.entries(HealthCheckRating).filter(([, v]) => typeof v === "number").map(([label, val]) => (
              <FormControlLabel key={val} value={val} control={<Radio />} label={label} />
            ))}
          </RadioGroup>
        </FormControl>
      )}

      {type === "OccupationalHealthcare" && (
        <>
          <TextField fullWidth label="Employer name" value={employerName} onChange={e => setEmployerName(e.target.value)} sx={{ mb: 1 }} required />
          <TextField fullWidth label="Sick leave start" type="date" value={sickLeaveStart} onChange={e => setSickLeaveStart(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 1 }} />
          <TextField fullWidth label="Sick leave end" type="date" value={sickLeaveEnd} onChange={e => setSickLeaveEnd(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 1 }} />
        </>
      )}

      {type === "Hospital" && (
        <>
          <TextField fullWidth label="Discharge date" type="date" value={dischargeDate} onChange={e => setDischargeDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 1 }} required />
          <TextField fullWidth label="Discharge criteria" value={dischargeCriteria} onChange={e => setDischargeCriteria(e.target.value)} sx={{ mb: 1 }} required />
        </>
      )}

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button type="submit" variant="contained">Add</Button>
        <Button variant="outlined" onClick={() => { setError(null); setDate(""); setDescription(""); }}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;
