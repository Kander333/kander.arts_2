
import React, { useEffect, useRef, useState } from 'react';
import { EngineState } from '../types';

interface VideoEngineProps {
  imageSrc: string;
  transitionSrc: string | null;
  preloadSrcs: string[];
  engineState: EngineState;
  onTransitionEnd: () => void;
  muted: boolean;
}

export const VideoEngine: React.FC<VideoEngineProps> = ({
  imageSrc,
  transitionSrc,
  preloadSrcs,
  engineState,
  onTransitionEnd,
  muted
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Image preloading logic
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    setImageLoaded(false);
    if (img.complete) {
      setImageLoaded(true);
    } else {
      img.onload = () => { if (isMounted.current) setImageLoaded(true); };
      img.onerror = () => { if (isMounted.current) setImageLoaded(true); };
    }
  }, [imageSrc]);

  // Handle playing the specific transition video
  useEffect(() => {
    if (engineState === EngineState.TRANSITION && transitionSrc) {
      const activeVideo = videoRefs.current.get(transitionSrc);
      if (activeVideo) {
        activeVideo.currentTime = 0;
        activeVideo.play().catch(err => {
          console.warn("Playback prevented or interrupted:", err);
          onTransitionEnd();
        });
      } else {
        // Fallback if video isn't in preloaded map for some reason
        onTransitionEnd();
      }
    }
  }, [engineState, transitionSrc, onTransitionEnd]);

  const handleVideoError = (src: string) => {
    console.error(`TRANSITION_ERROR: Failed to load ${src}`);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-void z-0 overflow-hidden pointer-events-none select-none transform-gpu">
      {/* BACKGROUND IMAGE LAYER */}
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          backgroundColor: '#050505',
          backgroundImage: `url("${imageSrc}")`,
          zIndex: 5
        }}
      />

      {/* TRANSITION VIDEOS LAYER */}
      <div className="absolute inset-0 z-10 w-full h-full">
        {preloadSrcs.map((src) => (
          <video
            key={src}
            ref={(el) => {
              if (el) videoRefs.current.set(src, el);
              else videoRefs.current.delete(src);
            }}
            src={src}
            muted={muted}
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            onEnded={() => {
                if (src === transitionSrc) onTransitionEnd();
            }}
            onError={() => handleVideoError(src)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 transform-gpu ${
              transitionSrc === src && engineState === EngineState.TRANSITION ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* OVERLAY EFFECTS */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/60 background-scanlines"></div>
    </div>
  );
};
