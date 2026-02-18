
export interface Coordinates {
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
}

export interface Exit {
  targetId: string;
  label: string;
  coordinates: Coordinates;
  transitionVideo: string; // URL to the transition video
}

export interface LocationNode {
  id: string;
  title: string;
  description: string; 
  type: 'node' | 'terminal';
  imageScene: string; // URL to the static background image
  uiOverlay: 'HubUI' | 'ArchiveUI' | 'ManifestoUI' | 'StandardUI';
  exits: Exit[];
}

export type LocationMap = Record<string, LocationNode>;

export enum EngineState {
  IDLE = 'IDLE',
  TRANSITION = 'TRANSITION',
  LOADING = 'LOADING'
}