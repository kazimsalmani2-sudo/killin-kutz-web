"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  // Royalty-free smooth salon lounge track
  const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Audio play blocked by browser policies", err));
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="none"
      />

      {/* Main Music Toggle Button */}
      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setShowControls(true)}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 cursor-pointer ${
          isPlaying
            ? 'bg-gold-500 border-transparent text-luxury-black shadow-[0_0_20px_rgba(212,175,55,0.5)]'
            : 'bg-luxury-gray/80 border-gold-500/20 text-gold-400 hover:border-gold-500/50 hover:text-gold-300'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          <div className="flex items-end gap-[2px] h-3.5 w-3.5">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="w-[2px] bg-luxury-black rounded-full animate-bounce"
                style={{
                  height: '100%',
                  animationDuration: `${0.5 + i * 0.15}s`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        ) : (
          <Music className="w-4 h-4" />
        )}
      </motion.button>

      {/* Control panel showing volume and state */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            onMouseLeave={() => setShowControls(false)}
            className="glass px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-gold-500/10 shadow-2xl"
          >
            <button
              onClick={togglePlay}
              className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 hover:bg-gold-500/20 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current pl-[1px]" />}
            </button>

            <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase select-none">
              Lounge Beats
            </span>

            <div className="flex items-center gap-2 border-l border-gray-800 pl-3">
              <button
                onClick={() => setVolume(volume === 0 ? 0.3 : 0)}
                className="text-gray-400 hover:text-gold-400 cursor-pointer"
              >
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
