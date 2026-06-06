"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const [playing,   setPlaying]   = useState(false);
  const [shown,     setShown]     = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Создаём audio элемент один раз
  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop   = true;
    audio.volume = 0.12;
    audioRef.current = audio;

    // Показываем popup через 3.5 сек
    const t = setTimeout(() => setShown(true), 3500);

    return () => {
      clearTimeout(t);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => {
      setPlaying(true);
    }).catch(() => {
      // Браузер заблокировал автоплей — ничего страшного
    });
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const toggle = () => {
    playing ? pause() : play();
    setShown(false);
    setDismissed(true);
  };

  const dismiss = () => {
    setShown(false);
    setDismissed(true);
  };

  return (
    <>
      {/* Popup — предложение включить музыку */}
      <AnimatePresence>
        {shown && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-6 z-[9985] p-5 rounded-xl flex flex-col gap-3 max-w-[230px]"
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎵
              </motion.span>
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-light"
                style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-50)" }}
              >
                Музыка
              </span>
            </div>

            <p
              className="font-light leading-relaxed"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: "var(--fg-50)",
                fontSize: "1rem",
                lineHeight: "1.65",
              }}
            >
              Включить фоновую музыку для погружения в атмосферу?
            </p>

            <div className="flex gap-2 mt-1">
              <button
                onClick={toggle}
                className="flex-1 py-2.5 text-[9px] tracking-[0.2em] uppercase font-light rounded-sm transition-all duration-300 hover:opacity-80"
                style={{
                  background: "var(--fg)",
                  color: "var(--bg)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Включить
              </button>
              <button
                onClick={dismiss}
                className="flex-1 py-2.5 text-[9px] tracking-[0.2em] uppercase font-light rounded-sm transition-all duration-300 hover:opacity-70"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--fg-30)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Нет
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Кнопка плеера */}
      <motion.button
        onClick={toggle}
        aria-label={playing ? "Выключить музыку" : "Включить музыку"}
        className="fixed bottom-6 right-6 z-[9986] w-11 h-11 rounded-full flex items-center justify-center"
        style={{
          background: "var(--bg-2)",
          border: playing ? "1px solid rgba(255,255,255,0.2)" : "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 3 }}
      >
        {/* Пульс когда играет */}
        <AnimatePresence>
          {playing && (
            <>
              <motion.div
                key="r1"
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid var(--fg-15)" }}
                animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                key="r2"
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid var(--fg-08)" }}
                animate={{ scale: [1, 2.3], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
              />
            </>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {playing ? (
            <motion.div
              key="on"
              initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Volume2 size={15} strokeWidth={1.5} style={{ color: "var(--fg-80)" }} />
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <VolumeX size={15} strokeWidth={1.5} style={{ color: "var(--fg-30)" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
