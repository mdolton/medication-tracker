export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  profileId: number;
  notes?: string;
}

export interface Profile {
  id: number;
  name: string;
  medications: Medication[];
}

export interface MedicationFormProps {
  onSubmit: (medication: Medication) => void;
}

export interface MedicationListProps {
  medications: Medication[];
  onCheckInteractions: () => void;
  onDeleteMedication: (id: number) => void;
}

export interface InteractionAnalysis {
  id: number;
  analysis: string;
  medicationIds: string[];
  createdAt: Date;
  profile: Profile;
}

export interface ProfileManagerProps {
  onSelectProfile: (profileId: number | null) => void;
  selectedProfileId: number | null;
} 