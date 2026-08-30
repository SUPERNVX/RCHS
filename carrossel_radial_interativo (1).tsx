import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Sparkles,
  Maximize2
} from 'lucide-react';

// Dados com exatamente 5 itens elegantes em estilo P&B
const CAROUSEL_ITEMS = [
  {
    id: 1,
    number: '5',
    title: 'Exploração Submarina',
    subtitle: 'Abissal & Profundo',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
    tag: 'Océano'
  },
  {
    id: 2,
    number: '6',
    title: 'Precision Tools',
    subtitle: 'Design & Mecânica',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    tag: 'Engenharia'
  },
  {
    id: 3,
    number: '7',
    title: 'Galhada Silvestre',
    subtitle: 'Natureza Selvagem',
    image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?q=80&w=800&auto=format&fit=crop',
    tag: 'Fauna'
  },
  {
    id: 4,
    number: '8',
    title: 'Bokeh Noturno',
    subtitle: 'Luzes Urbanas',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
    tag: 'Fotografia'
  },
  {
    id: 5,
    number: '9',
    title: 'Arquitetura Vertical',
    subtitle: 'Metrópole Cinzenta',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    tag: 'Estruturas'
  }
];

export default function App() {
  const [items] = useState(CAROUSEL_ITEMS);
  const [rotation, setRotation] = useState(0); // Ângulo atual de rotação
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [radius, setRadius] = useState(270); // Raio menor ajustado
  const [selectedCard, setSelectedCard] = useState(null);
  const [showControls, setShowControls] = useState(false);

  // Referências para arrastar com mouse/touch
  const dragStartRef = useRef(0);
  const rotationStartRef = useRef(0);
  const containerRef = useRef(null);

  const totalItems = items.length;
  const anglePerItem = 360 / totalItems; // 72 graus por item para 5 imagens

  // Calcula o item ativo mais próximo do topo/centro
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const activeIndex = Math.round(normalizedRotation / anglePerItem) % totalItems;
  const activeItem = items[(totalItems - activeIndex) % totalItems] || items[0];

  // Efeito de Autoplay: Move 1 passo completo, aguarda 1.5s (1500ms) e repete
  useEffect(() => {
    if (!isPlaying || isDragging) return;

    const timer = setInterval(() => {
      setRotation((prev) => prev + anglePerItem);
    }, 1500);

    return () => clearInterval(timer);
  }, [isPlaying, isDragging, anglePerItem]);

  // Navegação para item anterior / próximo (passo completo)
  const handlePrev = () => {
    setIsPlaying(false);
    setRotation((prev) => prev - anglePerItem);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setRotation((prev) => prev + anglePerItem);
  };

  // Centraliza um item específico ao clicar
  const handleCardClick = (index, item, e) => {
    e.stopPropagation();
    setIsPlaying(false);
    const itemAngle = index * anglePerItem;
    setRotation(-itemAngle);
    setSelectedCard(item);
  };

  // Suporte a arrastar (Pointer Events para mouse e touch)
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsPlaying(false);
    dragStartRef.current = e.clientX;
    rotationStartRef.current = rotation;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current;
    // Fator de sensibilidade
    const newRotation = rotationStartRef.current + deltaX * 0.3;
    setRotation(newRotation);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Encaixa no slot de card mais próximo ao soltar
    setRotation((prev) => Math.round(prev / anglePerItem) * anglePerItem);
  };

  // Suporte a Roda do Mouse (Wheel)
  const handleWheel = (e) => {
    e.preventDefault();
    setIsPlaying(false);
    const step = e.deltaY > 0 ? anglePerItem : -anglePerItem;
    setRotation((prev) => Math.round((prev + step) / anglePerItem) * anglePerItem);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between overflow-hidden select-none font-sans relative">
      
      {/* Background Decorativo e Efeitos de Luz */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,40,40,0.5)_0%,rgba(10,10,10,0.95)_100%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-800/10 rounded-full blur-3xl pointer-events-none" />

      {/* CABEÇALHO */}
      <header className="relative z-10 p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-inner">
            <Sparkles className="w-5 h-5 text-neutral-200" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase">Radial Dynamic</h1>
            <p className="text-xs text-neutral-400">5 Imagens • Rotação a cada 1.5s</p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-xs font-medium transition-all hover:bg-neutral-800 active:scale-95"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pausar' : 'Iniciar'}
          </button>
          
          <button 
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-full border text-xs transition-all ${
              showControls ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500'
            }`}
            title="Ajustes de Layout"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* PAINEL DE CONTROLES EXPANSÍVEL */}
      {showControls && (
        <div className="absolute top-20 right-6 md:right-8 z-30 bg-neutral-900/95 backdrop-blur-md border border-neutral-800 p-5 rounded-2xl shadow-2xl w-72 text-xs space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
            <span className="font-semibold text-neutral-200">Ajustes do Raio</span>
            <button onClick={() => setRadius(270)} className="text-neutral-500 hover:text-white flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Raio da Órbita</span>
              <span className="text-white font-mono">{radius}px</span>
            </div>
            <input 
              type="range" 
              min="180" 
              max="400" 
              value={radius} 
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-white bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            O carrossel contem 5 cards e pausa por 1.5s entre cada movimento.
          </p>
        </div>
      )}

      {/* PALCO CENTRAL DO CARROSSEL */}
      <main 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        className="relative z-10 flex-1 flex flex-col justify-center items-center cursor-grab active:cursor-grabbing touch-none my-2"
      >
        {/* Ponto Central Teórico do Círculo */}
        <div className="relative w-full h-[320px] md:h-[380px] flex items-center justify-center">

          {/* Guia visual do Arco */}
          <div 
            className="absolute rounded-full border border-dashed border-neutral-800/60 pointer-events-none transition-all duration-500"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              top: `calc(50% + ${radius * 0.4}px)`,
              transform: 'translate(-50%, -50%)',
              left: '50%'
            }}
          />

          {/* CARDS ROTATIVOS */}
          <div 
            className="absolute w-full h-full flex items-center justify-center pointer-events-none"
            style={{
              transform: `translateY(${radius * 0.4}px)`
            }}
          >
            {items.map((item, index) => {
              // Ângulo base deste card + rotação acumulada do carrossel
              const itemBaseAngle = index * anglePerItem;
              const currentAngle = itemBaseAngle + rotation;
              
              // Normaliza o ângulo para estar entre -180 e 180 para cálculos de posição frontal
              const normalizedAngle = ((currentAngle % 360) + 540) % 360 - 180;
              const isCenter = Math.abs(normalizedAngle) < anglePerItem / 2;

              // Distância do topo para escala e opacidade
              const distanceFromCenter = Math.abs(normalizedAngle);
              const opacity = Math.max(0.3, 1 - distanceFromCenter / 140);
              const scale = isCenter ? 1.05 : Math.max(0.78, 1 - distanceFromCenter / 200);

              return (
                <div
                  key={item.id}
                  onClick={(e) => handleCardClick(index, item, e)}
                  className={`absolute pointer-events-auto cursor-pointer origin-center ${
                    isDragging ? 'transition-none' : 'transition-transform duration-700 ease-out'
                  }`}
                  style={{
                    transform: `
                      rotate(${currentAngle}deg) 
                      translateY(-${radius}px) 
                      scale(${scale})
                    `,
                    opacity: opacity,
                    zIndex: isCenter ? 20 : Math.round(100 - distanceFromCenter)
                  }}
                >
                  {/* DESIGN DO CARD (Inspirado na referência P&B) */}
                  <div className={`
                    relative w-40 h-48 md:w-48 md:h-60 rounded-3xl overflow-hidden p-4 flex flex-col justify-between border shadow-2xl transition-all duration-500 group
                    ${isCenter 
                      ? 'border-neutral-300 shadow-white/10 ring-1 ring-white/30' 
                      : 'border-neutral-800/80 hover:border-neutral-600 bg-neutral-900'
                    }
                  `}>
                    
                    {/* Imagem de Fundo (Monocromática) */}
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Overlay Escuro com Gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/90" />

                    {/* Tag Topo */}
                    <div className="relative z-10 flex justify-between items-center">
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        {item.tag}
                      </span>
                      <Maximize2 className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Número Central Destaque */}
                    <div className="relative z-10 my-auto text-center">
                      <span className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg select-none">
                        {item.number}
                      </span>
                    </div>

                    {/* Rodapé do Card */}
                    <div className="relative z-10">
                      <h3 className="text-xs md:text-sm font-bold text-white truncate group-hover:text-neutral-200">
                        {item.title}
                      </h3>
                      <p className="text-[10px] md:text-[11px] text-neutral-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INFORMAÇÃO DO ITEM EM DESTAQUE */}
        <div className="mt-4 md:mt-6 text-center max-w-sm px-4 z-10">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            {activeItem.number} / 5 — {activeItem.tag}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
            {activeItem.title}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {activeItem.subtitle}
          </p>
        </div>
      </main>

      {/* RODAPÉ E CONTROLES DE NAVEGAÇÃO */}
      <footer className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full border-t border-neutral-900 gap-4">
        
        {/* Indicadores Visuais (5 Dots) */}
        <div className="flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setRotation(-idx * anglePerItem);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                (totalItems - activeIndex) % totalItems === idx 
                  ? 'w-7 bg-white' 
                  : 'w-2 bg-neutral-800 hover:bg-neutral-600'
              }`}
            />
          ))}
        </div>

        {/* Botões Esquerda / Direita */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-white transition-all active:scale-90"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-white transition-all active:scale-90"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* MODAL DETALHES AO CLICAR NO CARD */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full overflow-hidden p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-60 rounded-2xl overflow-hidden">
              <img 
                src={selectedCard.image} 
                alt={selectedCard.title} 
                className="w-full h-full object-cover filter grayscale"
              />
              <div className="absolute top-4 left-4 text-4xl font-black text-white bg-black/50 px-3 py-1 rounded-xl backdrop-blur-md">
                {selectedCard.number}
              </div>
            </div>
            <div>
              <span className="text-xs text-neutral-500 uppercase font-mono">{selectedCard.tag}</span>
              <h3 className="text-xl font-bold text-white">{selectedCard.title}</h3>
              <p className="text-sm text-neutral-400 mt-1">{selectedCard.subtitle}</p>
            </div>
            <button 
              onClick={() => setSelectedCard(null)}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}