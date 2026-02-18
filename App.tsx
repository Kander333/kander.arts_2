
import React, { useState, useCallback, useMemo } from 'react';
import { LOCATIONS, INITIAL_LOCATION_ID } from './constants';
import { EngineState, Exit } from './types';
import { VideoEngine } from './components/VideoEngine';
import { InterfaceLayer } from './components/InterfaceLayer';
import { Scanlines } from './components/Scanlines';
import { Volume2, VolumeX } from 'lucide-react';

function App() {
  const [currentLocationId, setCurrentLocationId] = useState<string>(INITIAL_LOCATION_ID);
  const [engineState, setEngineState] = useState<EngineState>(EngineState.IDLE);
  const [transitionVideoSrc, setTransitionVideoSrc] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [pendingTargetId, setPendingTargetId] = useState<string | null>(null);

  // Derived state
  const currentLocation = useMemo(() => LOCATIONS[currentLocationId], [currentLocationId]);
  
  // Calculate which image should be "behind" the video
  const activeImageSrc = useMemo(() => {
    if (engineState === EngineState.TRANSITION && pendingTargetId) {
      return LOCATIONS[pendingTargetId].imageScene;
    }
    return currentLocation.imageScene;
  }, [currentLocation, engineState, pendingTargetId]);

  const onExitTriggered = (exit: Exit) => {
    if (engineState !== EngineState.IDLE) return;
    setPendingTargetId(exit.targetId);
    setTransitionVideoSrc(exit.transitionVideo);
    setEngineState(EngineState.TRANSITION);
  };

  const handleTransitionComplete = useCallback(() => {
    if (pendingTargetId) {
        setCurrentLocationId(pendingTargetId);
        setPendingTargetId(null);
    }
    setEngineState(EngineState.IDLE);
    setTransitionVideoSrc(null);
  }, [pendingTargetId]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-void text-primary font-sans selection:bg-accent selection:text-black">
      <Scanlines />
      
      {/* 1. THE ENGINE */}
      <VideoEngine 
        imageSrc={activeImageSrc}
        transitionSrc={transitionVideoSrc}
        engineState={engineState}
        onTransitionEnd={handleTransitionComplete}
        muted={muted}
      />

      {/* 2. THE INTERFACE */}
      <InterfaceLayer 
        location={currentLocation}
        engineState={engineState}
        onExitClick={onExitTriggered}
      />

      {/* 3. GLOBAL CONTROLS */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setMuted(!muted)}
          className="p-3 bg-black/50 border border-border-dim text-accent hover:bg-accent hover:text-black transition-colors rounded-full backdrop-blur-md shadow-lg"
          title={muted ? "Unmute Audio" : "Mute Audio"}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </main>
  );
}

export default App;