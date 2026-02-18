
import React from 'react';
import { Exit, LocationNode, EngineState } from '../types';
import { ArrowUpRight, Circle, Disc, XCircle, ArrowLeft } from 'lucide-react';
import { GlitchText } from './GlitchText';
import { INITIAL_LOCATION_ID } from '../constants';

interface InterfaceLayerProps {
  location: LocationNode;
  engineState: EngineState;
  onExitClick: (exit: Exit) => void;
}

export const InterfaceLayer: React.FC<InterfaceLayerProps> = ({
  location,
  engineState,
  onExitClick
}) => {
  const isTransitioning = engineState === EngineState.TRANSITION;
  const isRoot = location.id === INITIAL_LOCATION_ID;
  const returnExit = location.exits.find(e => e.targetId === INITIAL_LOCATION_ID);

  const handleReturn = () => {
    if (returnExit) {
      onExitClick(returnExit);
    }
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      
      {/* GLOBAL HUD ELEMENTS */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-auto transition-opacity duration-500">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-accent">
            <Disc className={`w-4 h-4 ${isTransitioning ? 'animate-spin' : 'animate-spin-slow'}`} />
            <span className="text-xs font-mono tracking-[0.2em]">
              {isTransitioning ? 'KANDER.SYSTEM // REROUTING...' : 'KANDER.SYSTEM // ONLINE'}
            </span>
          </div>
          
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50 blur-sm' : 'opacity-90'}`}>
            <GlitchText 
              text={location.title} 
              as="h1" 
              className="text-4xl md:text-6xl text-primary font-bold mt-2 uppercase"
              speed={30}
            />
          </div>
          
          <p className={`font-mono text-xs text-primary/60 max-w-md mt-2 border-l-2 border-accent/50 pl-3 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {location.description}
          </p>
        </div>
        
        <div className="hidden md:block text-right font-mono text-xs text-primary/40">
           <div>COORDS: {Math.random().toFixed(4)} , {Math.random().toFixed(4)}</div>
           <div>NET: SECURE</div>
        </div>
      </header>

      {/* RETURN BUTTON */}
      {!isRoot && returnExit && (
        <button 
          onClick={handleReturn}
          className="absolute top-32 left-6 md:top-auto md:bottom-24 md:left-8 pointer-events-auto group flex items-center gap-4 z-40 transition-all duration-300 hover:translate-x-1 animate-in fade-in slide-in-from-left-4 duration-1000"
        >
          <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-300 group-hover:border-accent group-hover:bg-accent/10 group-hover:scale-110">
            <ArrowLeft className="w-5 h-5 text-primary group-hover:text-accent" />
          </div>
          <div className="hidden md:flex flex-col items-start text-primary/60 group-hover:text-primary">
            <span className="text-[10px] tracking-[0.2em] uppercase text-accent/70">System_Command</span>
            <span className="text-sm font-mono font-bold tracking-wider">REBOOT_TO_HUB</span>
          </div>
        </button>
      )}

      {/* NAVIGATION HOTSPOTS */}
      <div className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {location.exits.map((exit) => (
          <button
            key={exit.targetId}
            onClick={() => onExitClick(exit)}
            style={{
              left: `${exit.coordinates.x}%`,
              top: `${exit.coordinates.y}%`,
            }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer focus:outline-none"
          >
            <div className="relative flex items-center gap-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border border-accent/30 rounded-full w-full h-full transition-all duration-300 group-hover:scale-150 group-hover:border-accent group-hover:rotate-45"></div>
                <div className="absolute inset-0 border border-white/10 rounded-full w-full h-full animate-ping opacity-20"></div>
                <ArrowUpRight className="w-5 h-5 text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <div className="bg-black/80 backdrop-blur-sm border border-border-dim px-3 py-1 flex flex-col items-start transition-all duration-300 opacity-70 group-hover:opacity-100 group-hover:border-accent">
                <span className="text-[10px] text-accent font-mono uppercase tracking-widest">ACCESS</span>
                <span className="text-sm font-bold text-primary font-mono">{exit.label}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* MANIFESTO OVERLAY - SHOW ON PROTOCOL CHAMBER */}
      {(location.id === 'protocol' || location.uiOverlay === 'ManifestoUI') && !isTransitioning && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-1/2 h-[60vh] p-8 md:pr-12 pointer-events-auto overflow-y-auto animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-black/90 border border-border-dim p-8 shadow-2xl backdrop-blur-md relative">
                <div className="absolute top-0 right-14 p-2 text-xs font-mono text-accent">READ_ONLY</div>
                <h2 className="text-2xl font-mono mb-6 border-b border-white/20 pb-4">PROTOCOL_OMEGA</h2>
                <div className="font-mono text-sm leading-relaxed space-y-4 text-primary/80">
                    <p>&gt; The Construct is a state of raw data stream.</p>
                    <p>&gt; Navigation is volition. Choice is the only input.</p>
                    <GlitchText text="SYSTEM_STABLE_CONNECTED" className="text-accent block mt-8" />
                </div>
            </div>
        </div>
      )}

      {/* FOOTER HUD */}
      <div className="absolute bottom-0 w-full p-6 border-t border-white/5 bg-gradient-to-t from-black via-black/50 to-transparent flex justify-between items-end">
        <div className="font-mono text-[10px] text-gray-500">
          SESSION_ID: {Math.floor(Math.random() * 999999)}<br/>
          MEMORY_USAGE: 40MB
        </div>
      </div>
    </div>
  );
};
