import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Medication } from '../types';
import ReactMarkdown from 'react-markdown';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

interface MedicationListProps {
  medications: Medication[];
  onDelete: (id: number) => void;
  onCheckInteractions: (medications: Medication[]) => Promise<string>;
  profileId: number;
}

const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  onDelete,
  onCheckInteractions,
  profileId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clear analysis when medications change
  useEffect(() => {
    setAnalysis(null);
  }, [medications]);

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/latest-analysis`);
        if (response.ok) {
          const data = await response.json();
          setAnalysis(data.analysis);
        }
      } catch (err) {
        console.error('Error fetching latest analysis:', err);
      }
    };

    fetchLatestAnalysis();
  }, [profileId]);

  const handleCheckInteractions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await onCheckInteractions(medications);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to check interactions. Please try again.');
      console.error('Error checking interactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalysis = (text: string | null) => {
    if (!text) return null;
    
    // Remove the first paragraph (usually the introduction)
    const paragraphs = text.split('\n\n');
    const relevantContent = paragraphs.slice(1).join('\n\n');
    
    return relevantContent;
  };

  // Custom components for markdown rendering
  const components = {
    table: ({ children }: { children: React.ReactNode }) => (
      <TableContainer component={Paper} sx={{ mb: 2, mt: 2 }}>
        <Table size="small">
          {children}
        </Table>
      </TableContainer>
    ),
    thead: ({ children }: { children: React.ReactNode }) => (
      <TableHead>
        {children}
      </TableHead>
    ),
    tbody: ({ children }: { children: React.ReactNode }) => (
      <TableBody>
        {children}
      </TableBody>
    ),
    tr: ({ children }: { children: React.ReactNode }) => (
      <TableRow>
        {children}
      </TableRow>
    ),
    th: ({ children }: { children: React.ReactNode }) => (
      <TableCell component="th" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
        {children}
      </TableCell>
    ),
    td: ({ children }: { children: React.ReactNode }) => (
      <TableCell sx={{ whiteSpace: 'normal' }}>
        {children}
      </TableCell>
    ),
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Medications</Typography>
          <Button
            variant="contained"
            onClick={handleCheckInteractions}
            disabled={isLoading || medications.length === 0}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Checking...' : 'Check Interactions'}
          </Button>
        </Box>

        {medications.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No medications added yet
          </Typography>
        ) : (
          <List>
            {medications.map((medication, index) => (
              <React.Fragment key={medication.id || index}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDelete(medication.id || 0)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={medication.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Dosage: {medication.dosage}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          Frequency: {medication.frequency}
                        </Typography>
                        {medication.notes && (
                          <>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              Notes: {medication.notes}
                            </Typography>
                          </>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < medications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {analysis && (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Interaction Analysis
          </Typography>
          <Box sx={{ '& p': { mb: 1 } }}>
            <ReactMarkdown 
              components={components}
            >
              {processAnalysis(analysis) || ''}
            </ReactMarkdown>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MedicationList; 