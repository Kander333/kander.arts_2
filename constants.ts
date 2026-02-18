
import { LocationMap } from './types';

// Using the most recent commit hashes provided by the user
const BASE_URL_RECENT = "https://raw.githubusercontent.com/Kander333/kander-arts-test-/9f5f58a2f14af8454b86a115c87db28e632e3131";
const BASE_URL_LEGACY = "https://raw.githubusercontent.com/Kander333/kander-arts-test-/88456fe085a15cbd390f44eb107f8048b01bec6b";

const ASSETS = {
  // Static Scenes (Images) - Using the 9f5f58a hash
  HUB_SCENE: `${BASE_URL_RECENT}/Cinematic_wide_shot_2k_202602181954.jpeg`,
  // Swapping Archive and Protocol images
  ARCHIVE_SCENE: `${BASE_URL_RECENT}/Futuristic_gallery_corridor_202602182000.jpeg`,
  PROTOCOL_SCENE: `${BASE_URL_RECENT}/Abstract_control_room_202602182000.jpeg`,
  
  // Transitions
  // Forward transitions (9f5f58a hash)
  TRANS_TO_ARCHIVE: `${BASE_URL_RECENT}/Camera_moves_to_ARCHIVE.mp4`,
  TRANS_TO_PROTOCOL: `${BASE_URL_RECENT}/Camera_moves_to_PROTOCOL%20_ROOM.mp4`,
  
  // Return transitions (88456fe hash)
  TRANS_FROM_ARCHIVE: `${BASE_URL_LEGACY}/Camera_moves_to_from_archive.mp4`,
  TRANS_FROM_PROTOCOL: `${BASE_URL_LEGACY}/Camera_moves_to_protocal.mp4`, // URL provided by user with 'protocal' typo in filename
};

export const LOCATIONS: LocationMap = {
  hub: {
    id: "hub",
    title: "CENTRAL_HUB",
    description: "System entry point. Active data streams detected leading to the Archive and Protocol Chamber.",
    type: "node",
    imageScene: ASSETS.HUB_SCENE,
    uiOverlay: "HubUI",
    exits: [
      {
        targetId: "protocol",
        label: "PROTOCOL_CHAMBER",
        transitionVideo: ASSETS.TRANS_TO_PROTOCOL,
        coordinates: { x: 35, y: 45 }
      },
      {
        targetId: "archive",
        label: "DATA_ARCHIVE",
        transitionVideo: ASSETS.TRANS_TO_ARCHIVE,
        coordinates: { x: 65, y: 40 }
      }
    ]
  },
  archive: {
    id: "archive",
    title: "DATA_ARCHIVE",
    description: "Deep storage for system logs. Encrypted fragments of the past reside here.",
    type: "node",
    imageScene: ASSETS.ARCHIVE_SCENE,
    uiOverlay: "ArchiveUI",
    exits: [
      {
        targetId: "hub",
        label: "RETURN_TO_HUB",
        transitionVideo: ASSETS.TRANS_FROM_ARCHIVE,
        coordinates: { x: 50, y: 85 }
      }
    ]
  },
  protocol: {
    id: "protocol",
    title: "PROTOCOL_CHAMBER",
    description: "Execution sector for Omega-directives. The reality of the Construct is forged within these walls.",
    type: "terminal",
    imageScene: ASSETS.PROTOCOL_SCENE,
    uiOverlay: "ManifestoUI",
    exits: [
      {
        targetId: "hub",
        label: "EXIT_PROTOCOL",
        transitionVideo: ASSETS.TRANS_FROM_PROTOCOL,
        coordinates: { x: 50, y: 85 }
      }
    ]
  }
};

export const INITIAL_LOCATION_ID = "hub";
