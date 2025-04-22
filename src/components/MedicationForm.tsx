import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { Medication } from '../types';

interface MedicationFormProps {
  onSubmit: (medication: Omit<Medication, 'id' | 'profileId'>) => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      dosage,
      frequency,
      startDate,
      notes
    });
    setName('');
    setDosage('');
    setFrequency('');
    setStartDate('');
    setNotes('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
          <TextField
            fullWidth
            label="Medication Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
          <TextField
            fullWidth
            label="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
          <TextField
            fullWidth
            label="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 100%' }}>
          <TextField
            fullWidth
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
          />
        </Box>
        <Box sx={{ flex: '1 1 100%', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Add Medication
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MedicationForm; 