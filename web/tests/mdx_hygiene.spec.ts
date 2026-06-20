import { test, expect } from '@playwright/test';
import { preprocessMdx } from '../src/lib/content';

test.describe('MDX Structural Hygiene & HistoricalPerson Deduplication', () => {
  test('should strip HistoricalPerson from alert titles and deduplicate in body text', () => {
    const rawMdx = `
<Alert type="NOTE">
**Mini-Biographie : <HistoricalPerson name="Phineas_Gage" lang="fr" bio="Ouvrier...">Phineas Gage (1823 - 1860)</HistoricalPerson>**
</Alert>
 <HistoricalPerson name="Phineas_Gage" lang="fr" bio="Ouvrier...">Phineas Gage</HistoricalPerson> était un contremaître des chemins de fer...
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');

    // Verify title tag is stripped
    expect(processed).toContain('**Mini-Biographie : Phineas Gage (1823 - 1860)**');
    expect(processed).not.toContain('**Mini-Biographie : <HistoricalPerson');

    // Verify first body mention remains a HistoricalPerson tag
    expect(processed).toContain('<HistoricalPerson name="Phineas_Gage"');
    
    // Verify there are no duplicate HistoricalPerson tags nested or adjacent
    const matches = processed.match(/<HistoricalPerson/g) || [];
    expect(matches.length).toBe(1);
  });

  test('should strip HistoricalPerson from headings', () => {
    const rawMdx = `
### <HistoricalPerson name="Isaac_Newton" lang="fr" bio="...">Isaac Newton</HistoricalPerson> et la gravitation
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');
    expect(processed).toContain('### Isaac Newton et la gravitation');
    expect(processed).not.toContain('<HistoricalPerson');
  });

  test('should normalize FaitHistorique to HistoricalFact', () => {
    const rawMdx = `
<FaitHistorique title="Fondation du laboratoire" date="1879">
  Le premier laboratoire de psychologie expérimentale...
</FaitHistorique>
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');
    expect(processed).toContain('<HistoricalFact title="Fondation du laboratoire" date="1879">');
    expect(processed).toContain('</HistoricalFact>');
    expect(processed).not.toContain('<FaitHistorique');
  });

  test('should inject isFinal={true} to Quiz and EssayEvaluation when isSummative is true', () => {
    const rawMdx = `
<Quiz durationLimit={300}>
  <Question options="A|||B" correctIndex="0">Question 1</Question>
</Quiz>
<EssayEvaluation prompt="Structured essay" />
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr', true);
    expect(processed).toContain('<Quiz isFinal={true} durationLimit={300}>');
    expect(processed).toContain('<EssayEvaluation isFinal={true} prompt="Structured essay" />');
  });
});
