import { QUIZ_QUESTIONS } from './geoData';
import React from 'react';

interface MapCanvasProps {
  quizStarted?: boolean;
  inspectedData?: any;
  pan: { x: number; y: number };
  zoom: number;
  handleBackgroundClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  mapElements: any;
  selectedLayer: 'political' | 'physical' | 'demographic' | 'economic';
  hoveredElement: string | null;
  setHoveredElement: (id: string | null) => void;
  handleElementClick: (el: any, category: string) => void;
  mode: 'explore' | 'quiz';
  handleQuizAttempt: (id: string) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  inspectedData = null,
  quizStarted = false,
  pan,
  zoom,
  handleBackgroundClick,
  mapElements,
  selectedLayer,
  hoveredElement,
  setHoveredElement,
  handleElementClick,
  mode,
  handleQuizAttempt
}) => {
  return (
              <svg 
                viewBox="0 0 800 450" 
                className="w-full h-auto select-none rounded-xl"
                onClick={handleBackgroundClick}
              >
                
                {/* Lat/Lon Grid Overlay */}
                <g stroke="rgba(148, 163, 184, 0.04)" strokeWidth="0.75" strokeDasharray="4,4">
                  {[75, 150, 225, 300, 375].map((y) => (
                    <line key={`v-${y}`} x1="0" y1={y} x2="800" y2={y} />
                  ))}
                  {[100, 200, 300, 400, 500, 600, 700].map((x) => (
                    <line key={`h-${x}`} x1={x} y1="0" x2={x} y2="450" />
                  ))}
                </g>

                {/* Main Vector Layer container with active transform matrix */}
                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} className="transition-transform duration-300 ease-out">
                  
                  {/* WORLD MAP BACKGROUND OUTLINES */}
                  <g className="map-base">
                    {mapElements.regions.map((reg: any) => {
                      const isHovered = hoveredElement === reg.id;
                      const isActive = inspectedData?.id === reg.id;

                      let fillColor = reg.color;
                      let strokeColor = reg.stroke;

                      if (mode === 'quiz') {
                        fillColor = isHovered ? "rgba(255, 255, 255, 0.1)" : "rgba(148, 163, 184, 0.05)";
                        strokeColor = "rgba(148, 163, 184, 0.2)";
                      } else if (selectedLayer === 'demographic') {
                        if (reg.id === 'poly_asia') {
                          fillColor = "rgba(239, 68, 68, 0.35)";
                          strokeColor = "#ef4444";
                        } else if (reg.id === 'poly_europe') {
                          fillColor = "rgba(245, 158, 11, 0.3)";
                          strokeColor = "#f59e0b";
                        } else {
                          fillColor = "rgba(16, 185, 129, 0.1)";
                          strokeColor = "#10b981";
                        }
                      } else if (selectedLayer === 'economic') {
                        fillColor = "rgba(148, 163, 184, 0.08)";
                        strokeColor = "rgba(255, 255, 255, 0.15)";
                      }

                      return (
                        <polygon
                          key={reg.id}
                          points={reg.polygon}
                          fill={isHovered || isActive ? reg.hoverColor : fillColor}
                          stroke={strokeColor}
                          strokeWidth="1.25"
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={() => setHoveredElement(reg.id)}
                          onMouseLeave={() => setHoveredElement(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(reg, 'regions');
                          }}
                        />
                      );
                    })}
                  </g>

                  {/* LAYER: PHYSICAL RELIEF & HYDROGRAPHY */}
                  {selectedLayer === 'physical' && mode === 'explore' && (
                    <g className="physical-layer">
                      
                      {/* Mountain Chains */}
                      {mapElements.physical.filter((p: any) => p.points).map((mnt: any) => (
                        <polyline
                          key={mnt.id}
                          points={mnt.points}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          strokeDasharray="4,3"
                          className="cursor-pointer hover:stroke-amber-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(mnt, 'physical');
                          }}
                        />
                      ))}

                      {/* Rivers */}
                      {mapElements.physical.filter((p: any) => p.path).map((river: any) => (
                        <path
                          key={river.id}
                          d={river.path}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          className="cursor-pointer hover:stroke-sky-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(river, 'physical');
                          }}
                        />
                      ))}

                      {/* Deserts */}
                      {mapElements.physical.filter((p: any) => p.r).map((desert: any) => (
                        <circle
                          key={desert.id}
                          cx={desert.x}
                          cy={desert.y}
                          r={desert.r}
                          fill="rgba(245, 158, 11, 0.15)"
                          stroke="#f59e0b"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                          className="cursor-pointer hover:fill-amber-500/25 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(desert, 'physical');
                          }}
                        />
                      ))}
                    </g>
                  )}

                  {/* LAYER: DEMOGRAPHICS (CHOROPLETH CLUSTERS) */}
                  {selectedLayer === 'demographic' && mode === 'explore' && (
                    <g className="demographics-layer">
                      {mapElements.demographics.map((cluster: any) => {
                        const isHovered = hoveredElement === cluster.id;
                        return (
                          <g key={cluster.id}>
                            <circle
                              cx={cluster.x}
                              cy={cluster.y}
                              r={cluster.r + (isHovered ? 6 : 0)}
                              fill="rgba(239, 68, 68, 0.15)"
                              className="animate-pulse"
                            />
                            <circle
                              cx={cluster.x}
                              cy={cluster.y}
                              r={cluster.r * 0.6}
                              fill="rgba(239, 68, 68, 0.35)"
                              stroke="#ef4444"
                              strokeWidth="1.5"
                              className="cursor-pointer transition-all duration-200"
                              onMouseEnter={() => setHoveredElement(cluster.id)}
                              onMouseLeave={() => setHoveredElement(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleElementClick(cluster, 'demographics');
                              }}
                            />
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* LAYER: ECONOMIC FLUX & SHIPPING CHOKE POINTS */}
                  {selectedLayer === 'economic' && mode === 'explore' && (
                    <g className="economic-layer">
                      <path
                        d="M 120,130 L 162,200 L 250,225 L 375,180 L 442,168 L 622,228 L 680,290"
                        fill="none"
                        stroke="rgba(99, 102, 241, 0.3)"
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                      />

                      {mapElements.economic.map((node: any) => {
                        const isHovered = hoveredElement === node.id;
                        return (
                          <g 
                            key={node.id}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredElement(node.id)}
                            onMouseLeave={() => setHoveredElement(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleElementClick(node, 'economic');
                            }}
                          >
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r="8"
                              fill="none"
                              stroke="#818cf8"
                              strokeWidth="1.5"
                              className={isHovered ? "animate-ping" : ""}
                            />
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r="4"
                              fill="#6366f1"
                              stroke="#ffffff"
                              strokeWidth="1"
                            />
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* WEATHER STATION INTERACTIVE PIN DROPS */}
                  {mode === 'explore' && (
                    <g className="weather-pins">
                      {mapElements.stations.map((pin: any) => (
                        <g 
                          key={pin.id}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(pin, 'stations');
                          }}
                        >
                          <circle
                            cx={pin.x}
                            cy={pin.y}
                            r="5"
                            className="fill-sky-500 stroke-white stroke-1"
                          />
                          <path
                            d={`M ${pin.x},${pin.y} L ${pin.x},${pin.y - 7}`}
                            className="stroke-sky-400 stroke-1"
                          />
                          <rect
                            x={pin.x - 18}
                            y={pin.y - 15}
                            width="36"
                            height="8"
                            rx="2"
                            className="fill-slate-900/90 stroke-slate-800 stroke-[0.5]"
                          />
                          <text
                            x={pin.x}
                            y={pin.y - 9}
                            textAnchor="middle"
                            className="text-[6px] font-black fill-sky-400 font-sans"
                          >
                            {pin.name}
                          </text>
                        </g>
                      ))}
                    </g>
                  )}

                  {/* QUIZ HITBOX ANCHORS */}
                  {mode === 'quiz' && quizStarted && (
                    <g className="quiz-hitboxes">
                      {QUIZ_QUESTIONS.map((q) => {
                        let targetX = 350;
                        let targetY = 220;

                        if (q.targetId.startsWith('phys_')) {
                          const asset = mapElements.physical.find((p: any) => p.id === q.targetId);
                          if (asset) {
                            targetX = asset.x || (asset.points ? parseInt(asset.points.split(' ')[0].split(',')[0]) : 240);
                            targetY = asset.y || (asset.points ? parseInt(asset.points.split(' ')[0].split(',')[1]) : 240);
                          }
                        } else if (q.targetId.startsWith('demo_')) {
                          const asset = mapElements.demographics.find((p: any) => p.id === q.targetId);
                          if (asset) {
                            targetX = asset.x;
                            targetY = asset.y;
                          }
                        } else if (q.targetId.startsWith('econ_')) {
                          const asset = mapElements.economic.find((p: any) => p.id === q.targetId);
                          if (asset) {
                            targetX = asset.x;
                            targetY = asset.y;
                          }
                        } else if (q.targetId.startsWith('poly_')) {
                          const asset = mapElements.regions.find((r: any) => r.id === q.targetId);
                          if (asset) {
                            if (q.targetId === 'poly_france') {
                              targetX = 372;
                              targetY = 120;
                            } else if (q.targetId === 'poly_europe') {
                              targetX = 390;
                              targetY = 100;
                            }
                          }
                        }

                        return (
                          <circle
                            key={`hitbox-${q.id}`}
                            cx={targetX}
                            cy={targetY}
                            r="20"
                            className="fill-transparent stroke-transparent hover:fill-indigo-500/10 hover:stroke-indigo-500/30 stroke-1 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuizAttempt(q.targetId);
                            }}
                          />
                        );
                      })}
                    </g>
                  )}

                </g>
              </svg>

  );
};
