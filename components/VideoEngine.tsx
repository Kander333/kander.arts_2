
import React, { useEffect, useRef, useState } from 'react';
import { EngineState } from '../types';

interface VideoEngineProps {
  imageSrc: string;
  transitionSrc: string | null;
  engineState: EngineState;
  onTransitionEnd: () => void;
  muted: boolean;
}

export const VideoEngine: React.FC<VideoEngineProps> = ({
  imageSrc,
  transitionSrc,
  engineState,
  onTransitionEnd,
  muted
}) => {
  const transitionVideoRef = useRef<HTMLVideoElement>(null);
  const isMounted = useRef(true);
  
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    if (img.complete) {
      setImageLoaded(true);
    } else {
      img.onload = () => { if (isMounted.current) setImageLoaded(true); };
      img.onerror = () => { if (isMounted.current) setImageLoaded(true); };
    }
  }, [imageSrc]);

  useEffect(() => {
    if (engineState === EngineState.TRANSITION && transitionSrc) {
      if (isMounted.current) {
        setIsVideoReady(false);
        setIsTransitioning(false);
      }
      const video = transitionVideoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.load(); 
      }
    } else if (engineState === EngineState.IDLE) {
      const timeout = setTimeout(() => {
        if (isMounted.current) {
          setIsTransitioning(false);
          setIsVideoReady(false);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [engineState, transitionSrc]);

  const handleCanPlay = () => {
    if (engineState === EngineState.TRANSITION) {
      requestAnimationFrame(() => {
        if (!isMounted.current) return;
        setIsVideoReady(true);
        setIsTransitioning(true);
        const video = transitionVideoRef.current;
        if (video) {
          video.play().catch(err => {
            console.warn("Playback prevented:", err instanceof Error ? err.message : "Interrupted");
            onTransitionEnd();
          });
        }
      });
    }
  };

  const handleTransitionEnded = () => {
    onTransitionEnd();
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    let errorMsg = "UNKNOWN_ERROR";
    
    if (error) {
      switch (error.code) {
        case 1: errorMsg = "ABORTED"; break;
        case 2: errorMsg = "NETWORK_ERROR"; break;
        case 3: errorMsg = "DECODE_ERROR"; break;
        case 4: errorMsg = "SRC_NOT_SUPPORTED_404"; break;
      }
    }
    
    console.error(`TRANSITION_ERROR: ${errorMsg} | SRC: ${transitionSrc?.split('/').pop()}`);
    onTransitionEnd();
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-void z-0 overflow-hidden pointer-events-none select-none transform-gpu">
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          backgroundColor: '#050505',
          backgroundImage: `url("${imageSrc}")`,
          zIndex: 5
        }}
      />

      {transitionSrc && (
        <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
            <video
              key={transitionSrc}
              ref={transitionVideoRef}
              src={transitionSrc}
              muted={muted}
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              onCanPlay={handleCanPlay}
              onEnded={handleTransitionEnded}
              onError={handleVideoError}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 transform-gpu ${
                isTransitioning && isVideoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
        </div>
      )}

      <div className="absolute inset-0 z-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/60 background-scanlines"></div>
      
      {engineState === EngineState.TRANSITION && !isVideoReady && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md">
           <div className="flex flex-col items-center gap-6">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-accent/10 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="font-mono text-[10px] text-accent tracking-[0.4em] uppercase animate-pulse">
                SYNCING_STREAM...
              </span>
           </div>
        </div>
      )}
    </div>
  );
};