import { useState, useEffect } from 'react';
import { extractFlashcardsFromContext } from './tutorStringsAndHelpers';

interface UseTutorFlashcardsProps {
  pageContext?: string;
}

export function useTutorFlashcards({ pageContext }: UseTutorFlashcardsProps) {
  const [flashcards, setFlashcards] = useState<{ term: string; definition: string }[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardMastery, setCardMastery] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pageContext) {
      const cards = extractFlashcardsFromContext(pageContext);
      setFlashcards(cards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  }, [pageContext]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('op_srs_mastery');
      if (saved) {
        try {
          setCardMastery(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  const handleRateCard = (rating: 'easy' | 'medium' | 'hard') => {
    if (flashcards.length === 0) return;
    const currentCard = flashcards[currentCardIndex];
    const updatedMastery = { ...cardMastery, [currentCard.term]: rating };
    setCardMastery(updatedMastery);
    localStorage.setItem('op_srs_mastery', JSON.stringify(updatedMastery));

    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 200);
  };

  return {
    flashcards,
    currentCardIndex,
    setCurrentCardIndex,
    isFlipped,
    setIsFlipped,
    cardMastery,
    handleRateCard
  };
}
