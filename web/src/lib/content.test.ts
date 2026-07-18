import { test, expect } from '@playwright/test';
import { preprocessMdx, healFrenchElisions, healLinguisticContent } from './content';

test.describe('French Content Pipeline Linguistic Integrity', () => {
  test('should preserve French accents in component attributes during preprocessing', () => {
    const rawMdx = `
<ConceptLink name="Intelligence artificielle" description="L'intelligence artificielle est un domaine d'étude et de développement. Évaluations et théories.">
  intelligence artificielle
</ConceptLink>
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');
    
    // Expect accents to be fully preserved inside the attribute values
    expect(processed).toContain('description="L\'intelligence artificielle est un domaine d\'étude et de développement. Évaluations et théories."');
    expect(processed).toContain('name="Intelligence artificielle"');
  });

  test('should heal simple French elisions (le/la/de before vowels)', () => {
    // 1. la explosion -> l'explosion
    expect(healFrenchElisions("la explosion")).toBe("l'explosion");
    
    // 2. le algorithme -> l'algorithme
    expect(healFrenchElisions("le algorithme")).toBe("l'algorithme");

    // 3. de apprentissage -> d'apprentissage
    expect(healFrenchElisions("de apprentissage")).toBe("d'apprentissage");

    // 4. Case sensitivity: La explosion -> L'explosion, De apprentissage -> D'apprentissage
    expect(healFrenchElisions("La explosion")).toBe("L'explosion");
    expect(healFrenchElisions("De apprentissage")).toBe("D'apprentissage");
  });

  test('should heal French elisions when separated by JSX tags', () => {
    const textWithTags = `la <ConceptLink name="Explosion combinatoire">explosion combinatoire</ConceptLink> est de <ConceptLink name="Apprentissage automatique">apprentissage automatique</ConceptLink>`;
    const expected = `l'<ConceptLink name="Explosion combinatoire">explosion combinatoire</ConceptLink> est d'<ConceptLink name="Apprentissage automatique">apprentissage automatique</ConceptLink>`;
    expect(healFrenchElisions(textWithTags)).toBe(expected);
  });

  test('should clean up whitespace after apostrophes in French contractions', () => {
    expect(healFrenchElisions("l' explosion combinatoire")).toBe("l'explosion combinatoire");
    expect(healFrenchElisions("d' algorithme")).toBe("d'algorithme");
  });
});

test.describe('Multilingual Linguistic Integrity', () => {
  test('should heal English contractions', () => {
    expect(healLinguisticContent("don 't worry about it ' s functionality", "en")).toBe("don't worry about it's functionality");
    expect(healLinguisticContent("they 're writing code that we 've deployed", "en")).toBe("they're writing code that we've deployed");
  });

  test('should heal Spanish phonotactics', () => {
    expect(healLinguisticContent("geometría y álgebra", "es")).toBe("geometría y álgebra"); // diphthong, no change
    expect(healLinguisticContent("geometría y historia", "es")).toBe("geometría e historia");
    expect(healLinguisticContent("geometría y inteligencia", "es")).toBe("geometría e inteligencia");
    expect(healLinguisticContent("uno o otro", "es")).toBe("uno u otro");
    expect(healLinguisticContent("minutos o horas", "es")).toBe("minutos u horas");
    expect(healLinguisticContent("cielo o infierno", "es")).toBe("cielo o infierno");
  });

  test('should heal Italian elisions', () => {
    expect(healLinguisticContent("lo oro e la amica di accordo", "it")).toBe("l'oro e l'amica d'accordo");
    expect(healLinguisticContent("una altra volta", "it")).toBe("un'altra volta");
  });

  test('should heal Chinese punctuation spacing and width', () => {
    expect(healLinguisticContent("我们 是 开发者 , also 也是 学习者 .", "zh")).toBe("我们是开发者，also 也是学习者。");
    expect(healLinguisticContent("什么是人工智能 ? 就是 AI !", "zh")).toBe("什么是人工智能？就是 AI！");
  });

  test('should heal Arabic/Urdu bi-directional punctuation and ZWNJ', () => {
    expect(healLinguisticContent("کیا یہ ممکن ہے ؟", "ur")).toBe("کیا یہ ممکن ہے؟");
    expect(healLinguisticContent("یہ کتاب ہے , اور وہ قلم ہے ;", "ur")).toBe("یہ کتاب ہے، اور وہ قلم ہے؛");
    expect(healLinguisticContent("کرتے \u200C ہیں", "ur")).toBe("کرتے\u200Cہیں");
  });

  test('should clean up double spaces and corrupted punctuation at the end of sentences', () => {
    expect(healLinguisticContent("Bonjour , . C'est  un test ; .", "fr")).toBe("Bonjour. C'est un test.");
    expect(healLinguisticContent("Hello , , world . This  is   great .", "en")).toBe("Hello, world. This is great.");
  });
});

test.describe('Pedagogical Citation Pipeline Resolution', () => {
  test('should handle out-of-range references by mapping them using modulo fallback', () => {
    const rawMdx = `
Narrative text with an out-of-range citation <Reference id="3">Turing's paper</Reference> and an in-range citation <Reference id="1">First reference</Reference>.

### References
[1] A. Turing, "Computing Machinery and Intelligence", 1950.
[2] J. McCarthy, "Programs with Common Sense", 1959.
    `.trim();

    const processed = preprocessMdx(rawMdx, 'en');

    // Expected that Reference 3 (out of range) gets resolved to ((3 - 1) % 2) + 1 = 1
    // The in-range citation 1 also maps to 1
    expect(processed).toContain('<Reference id="1">');
    expect(processed).toContain('<References');
  });
});

