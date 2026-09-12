import React, { useState, useRef, useEffect } from "react";
import { Wind, Volume2, VolumeX } from "lucide-react";

export default function ZenSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const timerRef = useRef(null);

  const startSoundscape = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master gain node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Pink noise generation for organic wind/breeze effect
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to shape wind tone
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      // Low frequency oscillator to gently modulate wind intensity
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.18, ctx.currentTime); // gentle breathing rhythm

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(140, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      whiteNoise.connect(filter);
      filter.connect(masterGain);

      lfo.start();
      whiteNoise.start();

      setIsPlaying(true);
    } catch (e) {
      console.warn("Audio Context init error", e);
    }
  };

  const stopSoundscape = () => {
    if (audioCtxRef.current) {
      try {
        if (gainNodeRef.current && audioCtxRef.current.currentTime) {
          gainNodeRef.current.gain.setTargetAtTime(
            0,
            audioCtxRef.current.currentTime,
            0.15
          );
        }
        setTimeout(() => {
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
        }, 200);
      } catch (e) {
        console.warn(e);
      }
    }
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      stopSoundscape();
    } else {
      startSoundscape();
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className={`zen-sound-pill ${isPlaying ? "active" : ""}`}
      title={
        isPlaying
          ? "Pause calm field ambience"
          : "Play calming agricultural field ambience"
      }
      aria-label="Calm farm ambience soundscape"
    >
      <Wind size={13} className={isPlaying ? "animate-spin-slow" : ""} />
      <span className="zen-sound-label">
        {isPlaying ? "Breeze On" : "Ambience"}
      </span>
      {isPlaying && (
        <span className="zen-sound-waves" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      )}
    </button>
  );
}
