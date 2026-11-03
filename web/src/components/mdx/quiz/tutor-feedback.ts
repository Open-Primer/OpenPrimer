/**
 * OpenPrimer - Quiz AI Tutor Feedback Client
 */

export async function fetchQuizTutorFeedback({
  questions,
  answers,
  totalCorrect,
  totalQuestions,
  language,
  onChunk,
  onDone,
  onError
}: {
  questions: any[];
  answers: Record<string, boolean>;
  totalCorrect: number;
  totalQuestions: number;
  language: string;
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (err: any) => void;
}) {
  try {
    const qResults = questions.map((q: any, i) => {
      let qText = q.props.q;
      if (!qText && q.props.children) {
        const stringChild = (Array.isArray(q.props.children) ? q.props.children : [q.props.children]).find(
          (c: any) => typeof c === 'string'
        );
        if (stringChild) {
          qText = String(stringChild);
        }
      }
      qText = qText || `question_${i}`;
      return {
        question: qText,
        correct: answers[qText] === true
      };
    });

    const response = await fetch('/api/tutor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `The student has just completed the end-of-course quiz.\nScore obtained: ${totalCorrect}/${totalQuestions}.\nHere are the results:\n${qResults.map((r, i) => `Question ${i+1}: "${r.question}" - Answer: ${r.correct ? 'CORRECT' : 'INCORRECT'}`).join('\n')}\n\nGenerate a personalized feedback comment of one paragraph about their result (strengths and weaknesses) and offer constructive complementary explanations to deepen understanding of any unvalidated concepts. Please reply in the requested language.`
          }
        ],
        persona: 'curious_polymath',
        language: language,
        pageContext: `Course title: ${typeof document !== 'undefined' ? document.title : 'OpenPrimer Lesson'}`
      })
    });

    if (response.ok) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      if (!reader) {
        onDone();
        return;
      }
      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const parsed = JSON.parse(line.slice(5).trim());
              if (parsed.text) {
                accumulated += parsed.text;
                onChunk(accumulated);
              }
            } catch {}
          }
        }
      }
    }
  } catch (err) {
    onError(err);
  } finally {
    onDone();
  }
}
