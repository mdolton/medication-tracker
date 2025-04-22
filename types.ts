export interface Medication {
  id?: number;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

export interface InteractionCheckRequest {
  medications: Medication[];
}

export interface InteractionAnalysis {
  interactions: string[];
  timingRecommendations: {
    [medicationName: string]: string;
  };
  instructions: {
    [medicationName: string]: string;
  };
}

export interface MedicationListProps {
  medications: Medication[];
  onDeleteMedication: (id: number) => void;
  onCheckInteractions: () => void;
}

export interface MedicationFormProps {
  onSubmit: (medication: Medication) => void;
}

export interface InteractionAnalysisProps {
  analysis: string;
}

export interface ProfileManagerProps {
  onSelectProfile: (id: number | null) => void;
  selectedProfileId: number | null;
} 