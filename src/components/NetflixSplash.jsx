import { useState, useEffect } from 'react';

export function NetflixSplash({ onAnimationComplete }) {
  const [showText, setShowText] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [showClick, setShowClick] = useState(true);
  const [startZoom, setStartZoom] = useState(false);

  const handleClick = async () => {
    if (audioPlayed) return;
    
    setAudioPlayed(true);
    setShowClick(false);
    setStartZoom(true);
    
    // Try to play the MP3 file first
    try {
      const audio = new Audio('/netflix-sound.mp3');
      audio.volume = 0.8;
      audio.preload = 'auto';
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Netflix MP3 sound played successfully');
        }).catch(error => {
          console.log('MP3 failed, trying Web Audio:', error);
          playWebAudioSound();
        });
      }
    } catch (error) {
      console.log('MP3 creation failed, using Web Audio:', error);
      playWebAudioSound();
    }
  };

  const playWebAudioSound = async () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Create "ta" note
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.connect(gain1);
      gain1.connect(audioContext.destination);
      osc1.frequency.setValueAtTime(150, audioContext.currentTime);
      osc1.type = 'triangle';
      gain1.gain.setValueAtTime(0, audioContext.currentTime);
      gain1.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.1);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      osc1.start(audioContext.currentTime);
      osc1.stop(audioContext.currentTime + 0.8);
      
      // Create "dum" note
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.setValueAtTime(400, audioContext.currentTime);
        osc2.type = 'triangle';
        gain2.gain.setValueAtTime(0, audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 1.2);
      }, 300);
      
      console.log('Web Audio Netflix sound played');
    } catch (error) {
      console.log('All audio methods failed:', error);
    }
  };

  useEffect(() => {
    if (!startZoom) return;

    // Show text after delay
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 500);

    // Complete animation after zoom effect
    const completeTimer = setTimeout(() => {
      onAnimationComplete();
    }, 3200);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [startZoom, onAnimationComplete]);

  return (
    <div className={`fixed inset-0 bg-black flex items-center justify-center z-50 netflix-splash ${startZoom ? 'netflix-zoom-out' : ''}`} onClick={handleClick}>
      {/* Click overlay for sound */}
      {showClick && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-80">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold text-red-600 mb-4">StudentsPark</h1>
            <p className="text-lg text-gray-300">Click to begin</p>
          </div>
        </div>
      )}
      
      <div className="relative">
        {/* Text reveal */}
        <div className={`text-center transition-all duration-1000 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className={`text-6xl font-bold text-white mb-2 netflix-gradient-text transform transition-all duration-1000 ${startZoom ? 'scale-110' : 'scale-100'}`}>
            StudentsPark
          </h1>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center mt-8 space-x-1">
          <div className="netflix-dot netflix-dot-1"></div>
          <div className="netflix-dot netflix-dot-2"></div>
          <div className="netflix-dot netflix-dot-3"></div>
        </div>
      </div>
    </div>
  );
}
