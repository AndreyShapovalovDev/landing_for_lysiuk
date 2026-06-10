// Единая система анимаций для всего сайта
// Не менять без причины — всё должно дышать в одном ритме

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DUR = {
  fast: 0.4,   // micro: лейблы, иконки, hover
  base: 0.75,  // standard: параграфы, карточки
  slow: 1.1,   // major: заголовки, hero
  epic: 1.5,   // cinematic: монограммы, финальные моменты
} as const;

export const DELAY = {
  none:  0,
  xs:    0.08,
  sm:    0.15,
  md:    0.25,
  lg:    0.4,
  xl:    0.6,
} as const;
