import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { GEO_STRINGS, WEATHER_STATIONS, QUIZ_QUESTIONS, ClimateData, QuizQuestion } from './geo-map/geoData';
import { getMapElements } from './geo-map/mapElements';
import { MapCanvas } from './geo-map/MapCanvas';
import { GeoHeader } from './geo-map/GeoHeader';
import { GeoSidebar } from './geo-map/GeoSidebar';

export { GEO_STRINGS, WEATHER_STATIONS, QUIZ_QUESTIONS };
export type { ClimateData, QuizQuestion };

export const GeoMapExplorer = () => {
  const { language } = useLanguage();
  const langKey = ((language || 'EN').toUpperCase() === 'FR' ? 'FR' : 'EN') as 'EN' | 'FR';
  const t = (GEO_STRINGS as any)[langKey] || GEO_STRINGS.EN;

  // Map state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedLayer, setSelectedLayer] = useState<'political' | 'physical' | 'demographic' | 'economic'>('political');
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');

  // Telemetry Inspector state
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [inspectedData, setInspectedData] = useState<{
    type: string;
    name: string;
    coordinates?: string;
    elevation?: string;
    biome?: string;
    country?: string;
    capital?: string;
    population?: string;
    tradeNotes?: string;
    stationKey?: string;
  } | null>(null);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestIndex, setCurrentQuestIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [xpEarned, setXpEarned] = useState<number>(0);

  // Constants
  const maxZoom = 4;
  const minZoom = 1;

  // Controls Handlers
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in' && zoom < maxZoom) {
      setZoom(prev => Math.min(prev + 0.5, maxZoom));
    } else if (direction === 'out' && zoom > minZoom) {
      setZoom(prev => Math.max(prev - 0.5, minZoom));
    }
  };

  const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 40;
    setPan(prev => {
      switch (direction) {
        case 'up': return { ...prev, y: prev.y + step };
        case 'down': return { ...prev, y: prev.y - step };
        case 'left': return { ...prev, x: prev.x + step };
        case 'right': return { ...prev, x: prev.x - step };
      }
    });
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Map element definitions
  const mapElements = useMemo(() => {
    return getMapElements();
  }, []);

  const handleElementClick = (element: any, category: string) => {
    if (mode === 'quiz') {
      handleQuizAttempt(element.id);
      return;
    }

    setInspectedData({
      type: category,
      name: element.name,
      coordinates: element.coords,
      elevation: element.elevation,
      biome: element.biome,
      country: element.country,
      capital: element.capital,
      population: element.population,
      tradeNotes: element.notes,
      stationKey: element.stationKey
    });
  };

  const handleBackgroundClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (mode === 'quiz') return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const xRaw = ((e.clientX - rect.left) / rect.width) * 800;
    const yRaw = ((e.clientY - rect.top) / rect.height) * 450;
    const mapX = (xRaw - pan.x) / zoom;
    const mapY = (yRaw - pan.y) / zoom;
    const lonVal = ((mapX - 400) / 400) * 180;
    const latVal = ((225 - mapY) / 225) * 90;
    const latConstrained = Math.max(Math.min(latVal, 90), -90);
    const lonConstrained = Math.max(Math.min(lonVal, 180), -180);
    const latStr = `${Math.abs(latConstrained).toFixed(1)}° ${latConstrained >= 0 ? 'N' : 'S'}`;
    const lonStr = `${Math.abs(lonConstrained).toFixed(1)}° ${lonConstrained >= 0 ? 'E' : 'W'}`;

    let estimatedElevation = '0 - 150 m (Plaines/Océan)';
    let estimatedBiome = 'Océanique / Tempéré';

    if (Math.abs(latConstrained) < 23.5) {
      estimatedBiome = 'Équatorial / Tropical';
    } else if (Math.abs(latConstrained) > 60) {
      estimatedBiome = 'Toundra / Calotte Polaire';
      estimatedElevation = '100 - 800 m';
    }

    setInspectedData({
      type: 'Surface Terrestre / Océan',
      name: `Point Sondé (${latStr}, ${lonStr})`,
      coordinates: `${latStr}, ${lonStr}`,
      elevation: estimatedElevation,
      biome: estimatedBiome,
      country: 'Eaux Internationales / Domaine Public'
    });
  };

  const currentQuestion = QUIZ_QUESTIONS[currentQuestIndex];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestIndex(0);
    setQuizScore(0);
    setShowFeedback(null);
    setIsQuizComplete(false);
    setXpEarned(0);
  };

  const handleQuizAttempt = (elementId: string) => {
    if (!quizStarted || isQuizComplete) return;
    const isCorrect = elementId === currentQuestion.targetId;
    if (isCorrect) {
      setShowFeedback('correct');
      setQuizScore(prev => prev + 1);
      setXpEarned(prev => prev + 50);
    } else {
      setShowFeedback('incorrect');
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(null);
    if (currentQuestIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestIndex(prev => prev + 1);
    } else {
      setIsQuizComplete(true);
    }
  };

  return (
    <div className="my-8 w-full bg-slate-950 border border-slate-800/80 rounded-3xl p-6 shadow-2xl overflow-hidden font-sans">
      <GeoHeader
        t={t}
        mode={mode}
        setMode={setMode}
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
        handleZoom={handleZoom}
        handleReset={handleReset}
        handlePan={handlePan}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full aspect-[16/9] bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center cursor-crosshair select-none">
            <MapCanvas
              pan={pan}
              zoom={zoom}
              handleBackgroundClick={handleBackgroundClick}
              mapElements={mapElements}
              selectedLayer={selectedLayer}
              hoveredElement={hoveredElement}
              setHoveredElement={setHoveredElement}
              handleElementClick={handleElementClick}
              mode={mode}
              handleQuizAttempt={handleQuizAttempt}
            />
          </div>

          <div className="w-full flex justify-between items-center mt-3 text-[9px] text-slate-500 font-mono">
            <span className="font-mono">WGS-84 Coordinate Plane</span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-0.5 bg-slate-500" />
              <span>1,500 km</span>
            </span>
          </div>
        </div>

        <GeoSidebar
          mode={mode}
          t={t}
          inspectedData={inspectedData}
          quizStarted={quizStarted}
          isQuizComplete={isQuizComplete}
          currentQuestion={currentQuestion}
          quizScore={quizScore}
          xpEarned={xpEarned}
          showFeedback={showFeedback}
          handleStartQuiz={handleStartQuiz}
          handleNextQuestion={handleNextQuestion}
        />
      </div>
    </div>
  );
};
