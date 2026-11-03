/**
 * OpenPrimer - Widget Healer & Schema Normalization Subsystem
 *
 * Provides deep semantic validation, Wikidata entity resolution, language leakage detection,
 * and automated structural repair for all lesson interactive widgets.
 */

import { callVertexAI } from '@/lib/vertex-client';
import {
  resolvePersonDates,
  isPlaceholderDates,
  formatPersonDates,
  resolveEventDates,
  resolveChemicalData,
  resolveScientificFormula,
  resolveGoingFurtherResource
} from '@/lib/wikidata-resolver';
import {
  resolveMediaImage,
  searchYouTubeVideo,
  fetchWikimediaAudio,
  fetchWithTimeout
} from '@/lib/media-resolver';

export function getDisciplineFallbackSentence(discipline?: string, lang: string = 'fr'): { sentence: string; answer: string } {
  const normDisc = (discipline || '').toLowerCase();
  const normLang = lang.toLowerCase().split('-')[0];

  const sentences: Record<string, Record<string, { sentence: string; answer: string }>> = {
    linguistics: {
      fr: { sentence: "Le _____ est l'unité minimale de son dans une langue.", answer: "phonème" },
      en: { sentence: "The _____ is the smallest unit of sound in a language.", answer: "phoneme" },
      es: { sentence: "El _____ es la unidad mínima de sonido en una lengua.", answer: "fonema" },
      de: { sentence: "Das _____ ist die kleinste lautliche Einheit einer Sprache.", answer: "Phonem" },
      zh: { sentence: "_____ 是语言中最小的声音单位。", answer: "音位" }
    },
    physics: {
      fr: { sentence: "La vitesse de la lumière dans le vide est d'environ 300 000 _____ par seconde.", answer: "kilomètres" },
      en: { sentence: "The speed of light in a vacuum is approximately 300,000 _____ per second.", answer: "kilometers" },
      es: { sentence: "La velocidad de la luz en el vacío es de aproximadamente 300.000 _____ por segundo.", answer: "kilómetros" },
      de: { sentence: "Die Lichtgeschwindigkeit im Vakuum beträgt etwa 300.000 _____ pro Sekunde.", answer: "Kilometer" },
      zh: { sentence: "真空中光速约为每秒 30 _____ 公里。", answer: "万" }
    },
    astronomy: {
      fr: { sentence: "La Terre tourne autour du _____.", answer: "Soleil" },
      en: { sentence: "The Earth revolves around the _____.", answer: "Sun" },
      es: { sentence: "La Tierra gira alrededor del _____.", answer: "Sol" },
      de: { sentence: "Die Erde dreht sich um die _____.", answer: "Sonne" },
      zh: { sentence: "地球围绕_____公转。", answer: "太阳" }
    },
    chemistry: {
      fr: { sentence: "L'eau est composée de deux atomes d'hydrogène et d'un atome d'_____.", answer: "oxygène" },
      en: { sentence: "Water is composed of two hydrogen atoms and one _____ atom.", answer: "oxygen" },
      es: { sentence: "El agua está compuesta por dos átomos de hidrógeno y uno de _____.", answer: "oxígeno" },
      de: { sentence: "Wasser besteht aus zwei Wasserstoffatomen und einem _____atom.", answer: "Sauerstoff" },
      zh: { sentence: "水分子由两个氢原子和一个_____原子组成。", answer: "氧" }
    },
    biology: {
      fr: { sentence: "Le _____ est l'organe central qui pompe le sang dans le corps.", answer: "cœur" },
      en: { sentence: "The _____ is the central organ that pumps blood throughout the body.", answer: "heart" },
      es: { sentence: "El _____ es el órgano central que bombea sangre por todo el cuerpo.", answer: "corazón" },
      de: { sentence: "Das _____ ist das zentrale Organ, das Blut durch den Körper pumpt.", answer: "Herz" },
      zh: { sentence: "_____是向全身泵送血液的中心器官。", answer: "心脏" }
    },
    mathematics: {
      fr: { sentence: "Un triangle rectangle possède un angle _____.", answer: "droit" },
      en: { sentence: "A right triangle always has one _____ angle.", answer: "right" },
      es: { sentence: "Un triángulo rectángulo tiene un ángulo _____.", answer: "recto" },
      de: { sentence: "Ein rechtwinkliges Dreieck hat einen _____ Winkel.", answer: "rechten" },
      zh: { sentence: "直角三角形包含一个_____角。", answer: "直" }
    },
    history: {
      fr: { sentence: "La Révolution française a débuté en _____.", answer: "1789" },
      en: { sentence: "The French Revolution began in the year _____.", answer: "1789" },
      es: { sentence: "La Revolución Francesa comenzó en el año _____.", answer: "1789" },
      de: { sentence: "Die Französische Revolution begann im Jahr _____.", answer: "1789" },
      zh: { sentence: "法国大革命开始于 _____ 年。", answer: "1789" }
    },
    computers: {
      fr: { sentence: "Un algorithme est une suite finie d'_____.", answer: "instructions" },
      en: { sentence: "An algorithm is a finite sequence of _____.", answer: "instructions" },
      es: { sentence: "Un algoritmo es una secuencia finita de _____.", answer: "instrucciones" },
      de: { sentence: "Ein Algorithmus ist eine endliche Abfolge von _____.", answer: "Anweisungen" },
      zh: { sentence: "算法是有限的_____序列。", answer: "指令" }
    }
  };

  let category = 'astronomy';
  if (normDisc.includes('ling') || normDisc.includes('lang') || normDisc.includes('phon')) {
    category = 'linguistics';
  } else if (normDisc.includes('phys')) {
    category = 'physics';
  } else if (normDisc.includes('chem') || normDisc.includes('chim')) {
    category = 'chemistry';
  } else if (normDisc.includes('bio') || normDisc.includes('anat') || normDisc.includes('med')) {
    category = 'biology';
  } else if (normDisc.includes('math') || normDisc.includes('alg') || normDisc.includes('geom')) {
    category = 'mathematics';
  } else if (normDisc.includes('hist') || normDisc.includes('polit')) {
    category = 'history';
  } else if (normDisc.includes('comp') || normDisc.includes('prog') || normDisc.includes('info') || normDisc.includes('web')) {
    category = 'computers';
  }

  const langSentences = sentences[category] || sentences['astronomy'];
  return langSentences[normLang] || langSentences['en'] || { sentence: "The Earth revolves around the _____.", answer: "Sun" };
}

