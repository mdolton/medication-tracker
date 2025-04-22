import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Grid } from '@mui/material';
import MedicationForm from './components/MedicationForm';
import MedicationList from './components/MedicationList';
import ProfileSelector from './components/ProfileSelector';
import { Medication } from './types';
import { API_BASE_URL } from './config';

interface Profile {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);

  const fetchProfiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`);
      const data = await response.json();
      setProfiles(data);
      if (data.length > 0 && !profileId) {
        setProfileId(data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch profiles');
      console.error('Error fetching profiles:', err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (profileId) {
      fetchMedications();
    }
  }, [profileId]);

  const fetchMedications = async () => {
    if (!profileId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/medications`);
      const data = await response.json();
      setMedications(data);
    } catch (err) {
      setError('Failed to fetch medications');
      console.error('Error fetching medications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMedication = async (medication: Omit<Medication, 'id' | 'profileId'>) => {
    if (!profileId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/medications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medication)
      });
      const newMedication = await response.json();
      setMedications(prev => [...prev, newMedication]);
    } catch (err) {
      setError('Failed to add medication');
      console.error('Error adding medication:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedication = async (id: number) => {
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/medications/${id}`, {
        method: 'DELETE'
      });
      setMedications(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError('Failed to delete medication');
      console.error('Error deleting medication:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckInteractions = async (medications: Medication[]): Promise<string> => {
    if (!profileId) return '';
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/check-interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications })
      });
      const data = await response.json();
      return data.analysis;
    } catch (err) {
      setError('Failed to check interactions');
      console.error('Error checking interactions:', err);
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Medication Tracker
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: '33%' } }}>
            <ProfileSelector
              profiles={profiles}
              selectedProfileId={profileId}
              onProfileSelect={setProfileId}
              onProfilesChange={fetchProfiles}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: '67%' } }}>
            {profileId && (
              <>
                <MedicationForm onSubmit={handleAddMedication} />
                <Box mt={4}>
                  <MedicationList
                    medications={medications}
                    onDelete={handleDeleteMedication}
                    onCheckInteractions={handleCheckInteractions}
                    profileId={profileId}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default App; 