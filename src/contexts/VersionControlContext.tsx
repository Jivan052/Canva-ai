import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useDataOperations } from '@/hooks/useDataOperations';
import { useDataset } from '@/hooks/useDataset';

// Define version types
export interface Version {
  id: string;
  timestamp: number;
  description: string;
  type: 'import' | 'transform' | 'filter' | 'ai' | 'manual' | 'export';
  source?: string; // e.g., "AI Suggestion", "Manual Edit"
  dataSnapshot: any[]; // Snapshot of the dataset at this point
  metadata?: Record<string, any>; // Additional info like AI prompt, applied filters, etc.
  previewImage?: string; // Base64 encoded snapshot image of the visualization
}

interface VersionControlState {
  versions: Version[];
  currentVersionId: string | null;
  isInitialized: boolean;
}

type VersionControlAction = 
  | { type: 'ADD_VERSION'; payload: Version }
  | { type: 'SWITCH_VERSION'; payload: string }
  | { type: 'RESET_HISTORY' }
  | { type: 'REMOVE_VERSION'; payload: string }
  | { type: 'SET_PREVIEW_IMAGE'; payload: { versionId: string; imageData: string } };

const initialState: VersionControlState = {
  versions: [],
  currentVersionId: null,
  isInitialized: false,
};

// Create reducer function
function versionControlReducer(state: VersionControlState, action: VersionControlAction): VersionControlState {
  switch (action.type) {
    case 'ADD_VERSION':
      return {
        ...state,
        versions: [...state.versions, action.payload],
        currentVersionId: action.payload.id,
        isInitialized: true,
      };
    case 'SWITCH_VERSION':
      return {
        ...state,
        currentVersionId: action.payload,
      };
    case 'RESET_HISTORY':
      return {
        ...initialState,
      };
    case 'REMOVE_VERSION': {
      const newVersions = state.versions.filter(v => v.id !== action.payload);
      return {
        ...state,
        versions: newVersions,
        currentVersionId: newVersions.length > 0 ? 
          (state.currentVersionId === action.payload ? 
            newVersions[newVersions.length - 1].id : 
            state.currentVersionId) : 
          null,
        isInitialized: newVersions.length > 0,
      };
    }
    case 'SET_PREVIEW_IMAGE':
      return {
        ...state,
        versions: state.versions.map(v => 
          v.id === action.payload.versionId 
            ? { ...v, previewImage: action.payload.imageData } 
            : v
        ),
      };
    default:
      return state;
  }
}

// Create context
interface VersionControlContextType {
  versions: Version[];
  currentVersion: Version | null;
  currentVersionId: string | null;
  isInitialized: boolean;
  addVersion: (version: Omit<Version, 'id' | 'timestamp'>) => void;
  switchVersion: (versionId: string) => void;
  resetHistory: () => void;
  removeVersion: (versionId: string) => void;
  setPreviewImage: (versionId: string, imageData: string) => void;
}

const VersionControlContext = createContext<VersionControlContextType | undefined>(undefined);

// Provider component
interface VersionControlProviderProps {
  children: ReactNode;
}

export function VersionControlProvider({ children }: VersionControlProviderProps) {
  const [state, dispatch] = useReducer(versionControlReducer, initialState);
  const { dataset } = useDataset();
  const dataOperations = useDataOperations();

  // Find current version
  const currentVersion = state.currentVersionId 
    ? state.versions.find(v => v.id === state.currentVersionId) || null
    : null;

  // Add a new version
  const addVersion = (version: Omit<Version, 'id' | 'timestamp'>) => {
    const newVersion: Version = {
      ...version,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      dataSnapshot: [...(dataset || [])],
    };
    
    dispatch({ type: 'ADD_VERSION', payload: newVersion });
  };

  // Switch to a different version
  const switchVersion = (versionId: string) => {
    const targetVersion = state.versions.find(v => v.id === versionId);
    if (targetVersion) {
      // Apply the data from this version
      dataOperations.initializeData(targetVersion.dataSnapshot);
      dispatch({ type: 'SWITCH_VERSION', payload: versionId });
    }
  };

  // Reset history
  const resetHistory = () => {
    dispatch({ type: 'RESET_HISTORY' });
  };

  // Remove a version
  const removeVersion = (versionId: string) => {
    dispatch({ type: 'REMOVE_VERSION', payload: versionId });
  };

  // Set preview image for a version
  const setPreviewImage = (versionId: string, imageData: string) => {
    dispatch({ 
      type: 'SET_PREVIEW_IMAGE', 
      payload: { versionId, imageData } 
    });
  };

  // When dataset is first initialized, create an initial version
  useEffect(() => {
    if (dataset && dataset.length > 0 && !state.isInitialized) {
      addVersion({
        description: 'Initial data import',
        type: 'import',
        dataSnapshot: [...dataset],
      });
    }
  }, [dataset]);

  return (
    <VersionControlContext.Provider value={{
      versions: state.versions,
      currentVersion,
      currentVersionId: state.currentVersionId,
      isInitialized: state.isInitialized,
      addVersion,
      switchVersion,
      resetHistory,
      removeVersion,
      setPreviewImage,
    }}>
      {children}
    </VersionControlContext.Provider>
  );
}

// Custom hook
export function useVersionControl() {
  const context = useContext(VersionControlContext);
  if (context === undefined) {
    throw new Error('useVersionControl must be used within a VersionControlProvider');
  }
  return context;
}