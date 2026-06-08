"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Canvas Game ───────────────────────────────────────────────────────────────
interface Ring { id: number; x: number; y: number; speed: number; caught: boolean }
interface Hook { x: number; y: number; tx: number; ty: number; state: "idle"|"flying"|"returning"; len: number; maxLen: number; caught: boolean; caughtRingId: number | null }

function GameCanvas({ onScore, onMiss, onClose }: {
  onScore: (s: number) => void;
  onMiss: (m: number) => void;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    rings: [] as Ring[],
    hook: { x: 80, y: 0, tx: 400, ty: 200, state: "idle", len: 0, maxLen: 0, caught: false, caughtRingId: null } as Hook,
    score: 0,
    missed: 0,
    ringId: 0,
    lastSpawn: 0,
    frame: 0,
    pudgeImg: null as HTMLImageElement | null,
    gameOver: false,
  });

  const scoreRef  = useRef(0);
  const missedRef = useRef(0);
  const loopRef   = useRef<((ts: number) => void) | undefined>(undefined);
  const [display, setDisplay] = useState({ score: 0, missed: 0, over: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      state.current.hook.y = canvas.height - 160;
      state.current.hook.x = 90;
    };
    resize();
    window.addEventListener("resize", resize);

    // Load Pudge image
    const img = new Image();
    img.src = "/pudzh.jpg";
    img.onload = () => { state.current.pudgeImg = img; };

    // Draw ring
    function drawRing(x: number, y: number, alpha = 1) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#e8b830";
      ctx.lineWidth = 5;
      ctx.shadowColor = "#f0c840";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.stroke();
      // Diamond
      ctx.fillStyle = "#a0d8ef";
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#fff";
      ctx.beginPath();
      ctx.moveTo(x, y - 22);
      ctx.lineTo(x - 6, y - 17);
      ctx.lineTo(x, y - 12);
      ctx.lineTo(x + 6, y - 17);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw chain link
    function drawChain(x1: number, y1: number, x2: number, y2: number) {
      ctx.save();
      ctx.strokeStyle = "#777";
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Draw bone hook
    function drawHook(x: number, y: number, angle: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      // Bone shaft
      ctx.fillStyle = "#c8a060";
      ctx.strokeStyle = "#7a5030";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-5, -20, 10, 28, 4);
      ctx.fill(); ctx.stroke();
      // Top knob
      ctx.beginPath();
      ctx.ellipse(0, -20, 12, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#d4b070"; ctx.fill(); ctx.stroke();
      // Bottom knob
      ctx.beginPath();
      ctx.ellipse(0, 8, 12, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#d4b070"; ctx.fill(); ctx.stroke();
      // Hook curve
      ctx.strokeStyle = "#8b5028";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.bezierCurveTo(0, 22, -10, 28, -18, 22);
      ctx.bezierCurveTo(-26, 16, -22, 8, -14, 8);
      ctx.stroke();
      ctx.strokeStyle = "#b07040";
      ctx.lineWidth = 3.5;
      ctx.stroke();
      // Blood drip
      ctx.fillStyle = "#8b0000";
      ctx.beginPath();
      ctx.ellipse(-16, 26, 3, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function loop(ts: number) {
      if (state.current.gameOver) return;
      const s = state.current;
      const W = canvas!.width;
      const H = canvas!.height;

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "rgba(10,8,6,0.98)";
      ctx.fillRect(0, 0, W, H);

      // Spawn rings
      if (ts - s.lastSpawn > 1600) {
        s.lastSpawn = ts;
        s.rings.push({
          id: s.ringId++,
          x: 80 + Math.random() * (W - 160),
          y: -30,
          speed: 1.4 + Math.random() * 1.3,
          caught: false,
        });
      }

      // Move rings
      s.rings = s.rings.filter(r => {
        if (r.caught) return false;
        r.y += r.speed;
        if (r.y > H - 130) {
          missedRef.current++;
          s.missed = missedRef.current;
          if (missedRef.current >= 5) {
            s.gameOver = true;
            setDisplay(d => ({ ...d, over: true }));
          }
          setDisplay(d => ({ ...d, missed: missedRef.current }));
          return false;
        }
        return true;
      });

      // Hook physics
      const h = s.hook;
      if (h.state === "flying") {
        const speed = 18;
        const dx = h.tx - h.x;
        const dy = h.ty - h.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        h.len += speed;

        const ratio = Math.min(h.len / h.maxLen, 1);
        const hx = s.hook.x + dx * ratio;
        const hy = (H - 160) + dy * ratio;

        // Check ring collision
        if (!h.caught) {
          for (const r of s.rings) {
            const rdx = hx - r.x;
            const rdy = hy - r.y;
            if (Math.sqrt(rdx*rdx + rdy*rdy) < 40) {
              h.caught = true;
              h.caughtRingId = r.id;
              r.caught = true;
              scoreRef.current++;
              s.score = scoreRef.current;
              setDisplay(d => ({ ...d, score: scoreRef.current }));
              break;
            }
          }
        }

        if (h.len >= h.maxLen) h.state = "returning";

        // Draw chain + hook
        const angle = Math.atan2(dy, dx);
        drawChain(s.hook.x, H - 160, hx, hy);
        drawHook(hx, hy, angle + Math.PI / 2);
      } else if (h.state === "returning") {
        h.len -= 20;
        if (h.len <= 0) {
          h.state = "idle";
          h.caught = false;
          h.caughtRingId = null;
        } else {
          const dx = h.tx - h.x;
          const dy = h.ty - (H - 160);
          const ratio = Math.max(h.len / h.maxLen, 0);
          const hx = s.hook.x + dx * ratio;
          const hy = (H - 160) + dy * ratio;
          const angle = Math.atan2(dy, dx);
          drawChain(s.hook.x, H - 160, hx, hy);
          drawHook(hx, hy, angle + Math.PI / 2);
        }
      }

      // Draw rings
      for (const r of s.rings) {
        drawRing(r.x, r.y);
      }

      // Draw Pudge
      if (s.pudgeImg) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(s.pudgeImg, -160, H - 220, 160, 160);
        ctx.restore();
      } else {
        // Fallback
        ctx.fillStyle = "#8b0000";
        ctx.beginPath();
        ctx.arc(80, H - 160, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("🪝", 80, H - 155);
      }

      // Score HUD
      ctx.fillStyle = "rgba(248,245,240,0.25)";
      ctx.font = "300 11px Inter";
      ctx.letterSpacing = "3px";
      ctx.textAlign = "center";
      ctx.fillText("ПОЙМАНО", W / 2 - 80, 40);
      ctx.fillStyle = "#e8b830";
      ctx.font = "300 48px Cormorant Garamond";
      ctx.fillText(String(s.score), W / 2 - 80, 85);

      ctx.fillStyle = "rgba(248,245,240,0.25)";
      ctx.font = "300 11px Inter";
      ctx.fillText("ЖИЗНИ", W / 2 + 80, 40);
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(W / 2 + 50 + i * 20, 68, 7, 0, Math.PI * 2);
        ctx.fillStyle = i < (5 - s.missed) ? "#e8b830" : "rgba(248,245,240,0.1)";
        ctx.fill();
      }

      // Hint
      ctx.fillStyle = "rgba(248,245,240,0.15)";
      ctx.font = "300 10px Inter";
      ctx.textAlign = "center";
      ctx.fillText("КЛИКАЙ ЧТОБЫ ПОЙМАТЬ КОЛЬЦО КРЮКОМ", W / 2, H - 20);

      s.frame = requestAnimationFrame(loop);
    }

    loopRef.current = loop;
    state.current.frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(state.current.frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const fireHook = useCallback((clientX: number, clientY: number) => {
    const s = state.current;
    if (s.hook.state !== "idle" || s.gameOver) return;
    const canvas = canvasRef.current!;
    const H = canvas.height;
    const dx = clientX - s.hook.x;
    const dy = clientY - (H - 160);
    s.hook.tx = clientX;
    s.hook.ty = clientY;
    s.hook.maxLen = Math.sqrt(dx*dx + dy*dy);
    s.hook.len = 0;
    s.hook.state = "flying";
    s.hook.caught = false;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    fireHook(e.clientX, e.clientY);
  }, [fireHook]);

  const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) fireHook(touch.clientX, touch.clientY);
  }, [fireHook]);

  return (
    <div className="fixed inset-0 z-[9980]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: "crosshair", touchAction: "none" }}
        onClick={handleClick}
        onTouchStart={handleTouch}
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-20 right-5 w-10 h-10 flex items-center justify-center rounded-full"
        style={{ border: "1px solid rgba(248,245,240,0.2)", color: "rgba(248,245,240,0.5)", fontSize: 20, background: "rgba(0,0,0,0.5)" }}
      >×</button>

      {/* Game over */}
      <AnimatePresence>
        {display.over && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center p-12 rounded-2xl"
              style={{ background: "rgba(12,10,8,0.97)", border: "1px solid rgba(248,245,240,0.12)" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.5rem",
                fontWeight: 300, color: "#f8f5f0", fontStyle: "italic" }}>Игра окончена!</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px",
                letterSpacing: "0.3em", textTransform: "uppercase", color: "#e8b830", marginTop: 12 }}>
                Поймано колец: {display.score}
              </p>
              <div className="flex gap-3 justify-center mt-8">
                <button onClick={() => {
                  scoreRef.current = 0; missedRef.current = 0;
                  const s = state.current;
                  s.rings = []; s.score = 0; s.missed = 0;
                  s.gameOver = false; s.hook.state = "idle";
                  s.lastSpawn = 0;
                  setDisplay({ score: 0, missed: 0, over: false });
                  if (loopRef.current) s.frame = requestAnimationFrame(loopRef.current);
                }}
                  className="px-6 py-3 text-[10px] tracking-[0.25em] uppercase"
                  style={{ background: "#f8f5f0", color: "#1a1a1a", fontFamily: "'Inter', sans-serif", borderRadius: 2 }}>
                  Ещё раз
                </button>
                <button onClick={onClose}
                  className="px-6 py-3 text-[10px] tracking-[0.25em] uppercase"
                  style={{ border: "1px solid rgba(248,245,240,0.2)", color: "rgba(248,245,240,0.5)",
                    fontFamily: "'Inter', sans-serif", borderRadius: 2 }}>
                  Закрыть
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Wrapper ───────────────────────────────────────────────────────────────────
export default function RingGame() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-3 px-6 py-3 rounded-sm"
        style={{
          border: "1px solid rgba(248,245,240,0.15)",
          background: "rgba(248,245,240,0.04)",
          color: "rgba(248,245,240,0.4)",
          fontFamily: "'Inter', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontWeight: 300,
          backdropFilter: "blur(8px)",
        }}
      >
        <span>💍</span>
        <span>Поймай кольцо — мини-игра</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameCanvas
              onScore={s => {}}
              onMiss={m => {}}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
