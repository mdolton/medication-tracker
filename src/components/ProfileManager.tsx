import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  ListItemButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProfileManagerProps } from '../types';

const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port || 3000}/api`;

const ProfileManager: React.FC<ProfileManagerProps> = ({
  onSelectProfile,
  selectedProfileId,
}) => {
  const [profiles, setProfiles] = useState<{ id: number; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`);
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleCreateProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newProfileName }),
      });
      if (!response.ok) {
        throw new Error('Failed to create profile');
      }
      const newProfile = await response.json();
      setProfiles([...profiles, newProfile]);
      setOpen(false);
      setNewProfileName('');
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleDeleteProfile = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }
      setProfiles(profiles.filter(profile => profile.id !== id));
      if (selectedProfileId === id) {
        onSelectProfile(null);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Profiles</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            New Profile
          </Button>
        </Box>

        <List>
          {profiles.map((profile) => (
            <ListItem
              key={profile.id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteProfile(profile.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton
                selected={selectedProfileId === profile.id}
                onClick={() => onSelectProfile(profile.id)}
              >
                <ListItemText primary={profile.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Profile Name"
            fullWidth
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateProfile} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileManager; 