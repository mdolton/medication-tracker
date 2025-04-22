import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from '../config';

interface Profile {
  id: number;
  name: string;
}

interface ProfileSelectorProps {
  profiles: Profile[];
  selectedProfileId: number | null;
  onProfileSelect: (profileId: number | null) => void;
  onProfilesChange: () => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  selectedProfileId,
  onProfileSelect,
  onProfilesChange,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const handleAddProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProfileName }),
      });
      const newProfile = await response.json();
      onProfilesChange();
      onProfileSelect(newProfile.id);
      setIsAddDialogOpen(false);
      setNewProfileName('');
    } catch (error) {
      console.error('Error adding profile:', error);
    }
  };

  const handleDeleteProfile = async (profileId: number) => {
    try {
      await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
        method: 'DELETE',
      });
      onProfilesChange();
      if (selectedProfileId === profileId) {
        onProfileSelect(profiles[0]?.id || null);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Profiles</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
          variant="contained"
        >
          Add Profile
        </Button>
      </Box>

      <List>
        {profiles.map((profile) => (
          <ListItem
            key={profile.id}
            onClick={() => onProfileSelect(profile.id)}
            secondaryAction={
              profiles.length > 1 && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProfile(profile.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )
            }
            sx={{
              cursor: 'pointer',
              backgroundColor: selectedProfileId !== null && profile.id === selectedProfileId ? 'action.selected' : 'inherit'
            }}
          >
            <ListItemText primary={profile.name} />
          </ListItem>
        ))}
      </List>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add New Profile</DialogTitle>
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
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddProfile} disabled={!newProfileName.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileSelector; 