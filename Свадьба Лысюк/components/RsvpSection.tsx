"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import FloatingInput from "./FloatingInput";

type AttendingOption = "yes" | "no" | "";

export default function RsvpSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [name, setName]             = useState("");
  const [attending, setAttending]   = useState<AttendingOption>("");
  const [guestCount, setGuestCount] = useState("1");
  const [companions, setCompanions] = useState("");
  const [comment, setComment]       = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !attending) return;
    setSubmitting(true);
    // TODO: подключить Formspree / Google Sheets / Telegram бот
    // await fetch("https://formspree.io/f/YOUR_ID", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, attending, guestCount, comment }),
    // });
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const labelClass = "block text-[9px] tracking-[0.38em] uppercase mb-3 font-light";
  const inputStyle: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond', serif",
    background: "transparent",
    borderBottom: "1px solid var(--border)",
    color: "var(--fg)",
    width: "100%",
    outline: "none",
    padding: "10px 0",
    fontSize: "1rem",
    transition: "border-color 0.3s",
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'Inter', sans-serif",
    border: active ? "1px solid var(--fg-50)" : "1px solid var(--border)",
    color: active ? "var(--fg)" : "var(--fg-30)",
    background: active ? "var(--fg-08)" : "transparent",
  });

  return (
    <section
      id="rsvp"
      ref={ref}
      className="relative py-32 md:py-48 px-8 md:px-16 lg:px-24 bg-section-2 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, var(--bg), transparent)" }} />

      <div className="relative max-w-xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <p className="text-[10px] tracking-[0.45em] uppercase mb-6 font-light"
            style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}>
            Анкета гостя
          </p>
          <h2 className="text-[clamp(2.2rem,4.5vw,4rem)] leading-[0.95]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--fg)" }}>
            Подтверждение
            <br /><span style={{ fontStyle: "italic" }}>присутствия</span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-sm font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--fg-50)" }}
          >
            Просим подтвердить ваше присутствие до{" "}
            <span style={{ color: "var(--fg)", fontStyle: "normal", fontWeight: 400 }}>
              30 июня 2026
            </span>
          </motion.p>
        </motion.div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form" onSubmit={handleSubmit}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-10"
            >
              {/* ФИО */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <FloatingInput label="Фамилия Имя Отчество" value={name} onChange={setName} required />
              </motion.div>

              {/* Присутствие */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}>
                  Сможете ли присутствовать? *
                </label>
                <div className="flex gap-3">
                  {[
                    { value: "yes", label: "Буду" },
                    { value: "no",  label: "К сожалению, не смогу" },
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setAttending(opt.value as AttendingOption)}
                      className="flex-1 py-3 px-3 text-[10px] tracking-[0.2em] uppercase font-light transition-all duration-300 rounded-sm"
                      style={btnStyle(attending === opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Количество гостей */}
              <AnimatePresence>
                {attending === "yes" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}>
                        Сколько человек придёт (включая вас)?
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {["1", "2", "3", "4", "5"].map(n => (
                          <button key={n} type="button"
                            onClick={() => setGuestCount(n)}
                            className="w-12 h-12 text-sm font-light transition-all duration-250 rounded-sm"
                            style={btnStyle(guestCount === n)}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Имена сопровождающих — всегда видно когда attending=yes и count>1 */}
                    <AnimatePresence>
                      {parseInt(guestCount) > 1 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          <FloatingInput
                            label="Кто придёт с вами"
                            value={companions}
                            onChange={setCompanions}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Пожелания */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
              >
                <FloatingInput
                  label="Пожелания молодожёнам"
                  value={comment}
                  onChange={setComment}
                  multiline
                  rows={3}
                />
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit" disabled={submitting || !name || !attending}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
                className="relative w-full py-4 text-[10px] tracking-[0.35em] uppercase font-light transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden group mt-2"
                style={{ fontFamily: "'Inter', sans-serif", border: "1px solid var(--border)", color: "var(--fg-50)" }}
              >
                <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                  style={{ background: "var(--fg-08)" }} />
                <span className="relative">
                  {submitting ? "Отправляем..." : "Подтвердить присутствие"}
                </span>
              </motion.button>
            </motion.form>
          ) : (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center gap-6 py-16"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ border: "1px solid var(--border)" }}>
                <Check size={20} strokeWidth={1.5} style={{ color: "var(--fg-50)" }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: "italic",
                color: "var(--fg)", fontSize: "2rem" }}>
                Спасибо!
              </p>
              <p className="text-sm font-light max-w-xs leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}>
                Ваш ответ получен. Будем счастливы видеть вас 7 сентября!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 pt-10 flex flex-col gap-5"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p
            className="text-center font-light mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              fontSize: "1.4rem", color: "var(--fg-50)", letterSpacing: "0.01em" }}
          >
            Несколько слов от нас
          </p>
          {[
            "Поцелуй рождается сам — из взгляда, из момента, из чувства. Мы будем рады провести этот вечер без командного «горько».",
            "Цветы прекрасны, но недолговечны. Если хочется сделать нам приятное — будем благодарны за вклад в жизнь нашей семьи.",
          ].map((wish, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-px h-4 mt-1.5 flex-shrink-0" style={{ background: "var(--fg-15)" }} />
              <p className="font-light leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                  color: "var(--fg-30)", fontSize: "1rem", lineHeight: "1.8" }}>
                {wish}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Organizer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.75 }}
          className="mt-12 pt-10 text-center"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-[9px] tracking-[0.35em] uppercase mb-5 font-light"
            style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}>
            Организационные вопросы или сюрприз?
          </p>
          <p className="mb-4 font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              color: "var(--fg-50)", fontSize: "1.05rem", lineHeight: "1.75" }}>
            Свяжитесь с нашим организатором заранее
          </p>
          <a href="tel:89885326600" className="inline-flex flex-col items-center gap-1 group">
            <span className="font-light transition-opacity duration-300 group-hover:opacity-70"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "var(--fg)" }}>
              Маргарита — организатор
            </span>
            <span className="text-xs tracking-[0.2em] font-light"
              style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}>
              8-988-532-66-00
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
