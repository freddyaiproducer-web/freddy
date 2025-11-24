import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Home, Smartphone, CheckCircle, ArrowRight, Menu, X, MessageCircle, Cpu, Zap, Layers, Video, ChevronLeft, ChevronRight, Briefcase, MousePointer2 } from 'lucide-react';

// --- CONFIGURAÇÃO DE IMAGENS ---
// IMAGENS DO CLIENTE (Revertido para o formato Thumbnail que estava funcionando)

// 1. Link da tua foto MOBILIADA (Depois):
const USER_PROVIDED_AFTER = "https://drive.google.com/thumbnail?id=1SIJW5qNCWP3PtsaJlUYszDAoXLf_SM8n&sz=w2000"; 

// 2. Link da tua foto VAZIA (Antes):
const USER_PROVIDED_BEFORE = "https://drive.google.com/thumbnail?id=1gOH7hU1CaBqsw3U7harnf6RYlgbqBoFu&sz=w2000";

// --- IMAGENS PADRÃO (Fallback - Caso o Drive falhe) ---
const DEFAULT_AFTER = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"; 
const DEFAULT_BEFORE = "https://images.unsplash.com/photo-1588854337443-4e89921f92e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

// Example Video IDs
const HORIZONTAL_VIDEOS = [
  "fDwXEgQSBmA", // Exemplo padrão
  "cc1OpF-XmhA", // Exemplo padrão
];

// Updated Vertical Videos (Shorts)
const VERTICAL_VIDEOS = [
  "vr40Dic1CE0", // Teu vídeo (confirmado)
  "OQerebUg5-8", // Exemplo padrão
  "p-5VNp-Ejf0", // Exemplo padrão
];

const ImageComparisonSlider = ({ beforeImage, afterImage }: { beforeImage: string, afterImage: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Se houver erro no carregamento das imagens do Drive, usa as padrões
  const finalBefore = imageError ? DEFAULT_BEFORE : beforeImage;
  const finalAfter = imageError ? DEFAULT_AFTER : afterImage;

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, percent)));
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
        if(isDragging) handleMove(e.clientX);
    }
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, handleMove]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden rounded-xl cursor-ew-resize group bg-gray-900 shadow-2xl"
      onMouseDown={onMouseDown}
      onTouchMove={onTouchMove}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Layer 1: After Image (Full width - Right Side) */}
      <img 
        src={finalAfter} 
        alt="Depois - Mobiliado" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" 
        draggable="false"
        onError={() => setImageError(true)}
      />
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 text-xs rounded-full font-bold pointer-events-none backdrop-blur-sm border border-white/10 z-20">
        DEPOIS
      </div>

      {/* Layer 2: Before Image (Clipped from right - Left Side) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
            src={finalBefore} 
            alt="Antes - Vazio" 
            className="absolute inset-0 w-full h-full object-cover" 
            draggable="false"
            onError={() => setImageError(true)}
        />
        <div className="absolute top-4 left-4 bg-white/80 text-brand-dark px-3 py-1 text-xs rounded-full font-bold backdrop-blur-sm shadow-sm z-20">
          ANTES
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-brand-primary border-2 border-brand-bg transition-transform hover:scale-110">
          <div className="flex gap-0.5">
            <ChevronLeft size={16} strokeWidth={3} />
            <ChevronRight size={16} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Video Carousel State
  const [hIndex, setHIndex] = useState(0);
  const [vIndex, setVIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextVideo = (type: 'horizontal' | 'vertical') => {
    if (type === 'horizontal') {
      setHIndex((prev) => (prev + 1) % HORIZONTAL_VIDEOS.length);
    } else {
      setVIndex((prev) => (prev + 1) % VERTICAL_VIDEOS.length);
    }
  };

  const prevVideo = (type: 'horizontal' | 'vertical') => {
    if (type === 'horizontal') {
      setHIndex((prev) => (prev - 1 + HORIZONTAL_VIDEOS.length) % HORIZONTAL_VIDEOS.length);
    } else {
      setVIndex((prev) => (prev - 1 + VERTICAL_VIDEOS.length) % VERTICAL_VIDEOS.length);
    }
  };

  const whatsappLink = "https://wa.me/5548988320359?text=Hola%20Freddy,%20vi%20tu%20landing%20page%20y%20quiero%20cotizar%20un%20servicio.";

  const navLinks = [
    { name: 'Exemplos', href: '#exemplos' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Preços', href: '#precos' },
    { name: 'Portfólio', href: '#exemplos' }, 
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden bg-brand-bg text-brand-dark">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-dark/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-brand-primary shadow-[0_0_15px_rgba(0,181,216,0.3)]">
               <Home size={20} className="text-brand-dark" />
             </div>
             <div className="flex flex-col">
               <span className={`font-serif font-bold text-xl leading-none ${isScrolled ? 'text-white' : 'text-brand-dark'}`}>
                 Floripa
               </span>
               <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isScrolled ? 'text-brand-primary' : 'text-brand-gold'}`}>
                 Virtual Staging
               </span>
             </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                className={`text-sm font-medium transition-colors hover:text-brand-primary ${isScrolled ? 'text-gray-300' : 'text-brand-dark'}`}
              >
                {item.name}
              </a>
            ))}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,181,216,0.4)] hover:shadow-[0_0_30px_rgba(0,181,216,0.6)] flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Falar com Freddy
            </a>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`md:hidden ${isScrolled ? 'text-white' : 'text-brand-dark'}`}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-brand-dark border-t border-white/10 p-6 flex flex-col gap-4 md:hidden animate-fadeIn shadow-2xl">
            {navLinks.map((item) => (
               <a key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-medium">
                 {item.name}
               </a>
            ))}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-brand-primary text-white py-3 rounded text-center font-bold">
              Chamar no WhatsApp
            </a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/5 to-transparent -z-10"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute top-40 left-10 grid grid-cols-4 gap-2 opacity-20">
           {[...Array(8)].map((_, i) => (
             <div key={i} className={`w-2 h-2 bg-brand-primary rounded-sm ${i % 2 === 0 ? 'opacity-50' : 'opacity-100'}`}></div>
           ))}
        </div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slideUp z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-dark/5 border border-brand-dark/10 text-brand-dark text-xs font-bold tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
              TECNOLOGIA + IMÓVEIS
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-tight text-brand-dark mb-6">
              Transforme <br/>
              <span className="relative">
                imóveis vazios
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-gold opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span> <br/>
              em vendas reais.
            </h1>
            <p className="text-lg text-brand-muted mb-8 max-w-lg leading-relaxed">
              Utilizamos Inteligência Artificial para mobiliar fotos e criar vídeos de alto impacto. Aumente o valor percebido do seu portfólio hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-brand-dark text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-primary transition-all shadow-xl hover:-translate-y-1 flex justify-center items-center gap-3 border border-brand-dark hover:border-brand-primary">
                Começar Agora
                <ArrowRight size={20} />
              </a>
              <a href="#exemplos" className="px-8 py-4 rounded-xl border-2 border-brand-gold/30 text-brand-dark font-bold hover:border-brand-gold hover:bg-brand-gold/10 transition-all flex justify-center items-center gap-2">
                <Play size={18} className="fill-brand-gold text-brand-gold" />
                Ver Produtos
              </a>
            </div>
          </div>
          
          <div className="relative animate-fadeIn delay-300 lg:h-auto flex flex-col items-center justify-center">
            {/* Interactive Slider Container - 16:9 Aspect Ratio */}
            <div className="relative w-full max-w-2xl aspect-video bg-brand-dark rounded-2xl p-2 shadow-2xl rotate-1 hover:rotate-0 transition-all duration-500 group z-20">
              
              <ImageComparisonSlider 
                beforeImage={USER_PROVIDED_BEFORE} 
                afterImage={USER_PROVIDED_AFTER} 
              />

              {/* Instructions Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 z-30 border border-gray-100 animate-pulse-slow">
                 <div className="bg-brand-bg p-2 rounded-full text-brand-primary">
                    <MousePointer2 size={18} />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-brand-dark">ARRASTE PARA VER</span>
                   <span className="text-[10px] text-brand-muted">Comparar Antes/Depois</span>
                 </div>
              </div>
            </div>

            {/* Background Decor */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-brand-gold/20 rounded-full opacity-50 animate-spin-slow"></div>
          </div>
        </div>
      </section>

      {/* --- VIDEO EXAMPLES SECTION --- */}
      <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
        {/* Scroll Anchor Fix */}
        <div id="exemplos" className="absolute -top-32 left-0 w-full h-0"></div>

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/20 blur-[100px] rounded-full -z-10"></div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-brand-gold font-bold tracking-widest uppercase text-xs mb-3">
              <Video size={14} />
              <span className="animate-pulse">Nossos Produtos</span>
            </div>
            <h2 className="font-serif text-4xl font-bold mb-4">Veja em Ação</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Do TikTok ao YouTube. Produções otimizadas para gerar visualizações.</p>
          </div>

          <div className="flex flex-col items-center gap-20">
            
            {/* 1. Vertical Carousel (Reels/TikTok) - TOP PRIORITY */}
            <div className="flex flex-col items-center gap-6 w-full">
               <div className="flex items-center justify-between mb-2 px-4 w-full max-w-md">
                 <h3 className="font-bold text-2xl flex items-center gap-2 text-white"><Smartphone size={24} className="text-brand-primary"/> Vertical (9:16)</h3>
                 <div className="flex gap-2">
                   <button onClick={() => prevVideo('vertical')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"><ChevronLeft size={20}/></button>
                   <button onClick={() => nextVideo('vertical')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"><ChevronRight size={20}/></button>
                 </div>
               </div>

               {/* PHONE MOCKUP CONTAINER - Fixed width for desktop visibility */}
               <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.3)] border-[8px] border-gray-900 bg-black w-[300px] h-[533px] md:w-[340px] md:h-[604px] shrink-0">
                  {/* Notch simulation */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-2xl z-20"></div>
                  
                  <iframe 
                    key={VERTICAL_VIDEOS[vIndex]}
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${VERTICAL_VIDEOS[vIndex]}?rel=0&playsinline=1`}
                    title="Vertical Video Example"
                    className="absolute inset-0 w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
               </div>
               <p className="text-sm text-gray-500 text-center uppercase tracking-widest mt-2">Ideal para Instagram & TikTok</p>
            </div>

            {/* Decorative Divider */}
            <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"></div>

            {/* 2. Horizontal Carousel (YouTube) - BELOW */}
            <div className="flex flex-col gap-6 w-full max-w-4xl">
               <div className="flex items-center justify-between mb-2 px-4">
                 <h3 className="font-bold text-2xl flex items-center gap-2 text-white"><Zap size={24} className="text-brand-gold"/> Horizontal (16:9)</h3>
                 <div className="flex gap-2">
                   <button onClick={() => prevVideo('horizontal')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"><ChevronLeft size={20}/></button>
                   <button onClick={() => nextVideo('horizontal')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"><ChevronRight size={20}/></button>
                 </div>
               </div>
               
               <div className="rounded-2xl overflow-hidden shadow-2xl border border-brand-gold/20 bg-black aspect-video relative group w-full">
                  <iframe 
                    key={HORIZONTAL_VIDEOS[hIndex]}
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${HORIZONTAL_VIDEOS[hIndex]}?rel=0&playsinline=1`}
                    title="Horizontal Video Example"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
               </div>
               <p className="text-sm text-gray-500 text-center uppercase tracking-widest">Ideal para Site & YouTube</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* --- SERVICES / "THE PROCESS" --- */}
      <section className="py-24 bg-white relative">
        {/* Scroll Anchor Fix */}
        <div id="servicos" className="absolute -top-32 left-0 w-full h-0"></div>

        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-4xl font-bold mb-4 text-brand-dark">Soluções Digitais</h2>
            <p className="text-brand-muted">Combinamos design de interiores com poder computacional para acelerar suas vendas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 rounded-2xl bg-brand-bg hover:bg-white hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-brand-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Home size={100} className="text-brand-primary" />
              </div>
              <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6 text-brand-primary">
                <Layers size={28} />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3 text-brand-dark">Virtual Staging</h3>
              <p className="text-brand-muted mb-6">Mobiliamos digitalmente fotos de imóveis vazios. Ideal para lançamentos e imóveis parados.</p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-brand-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Ver exemplos <ArrowRight size={16}/>
              </a>
            </div>

            {/* Card 2 - Featured */}
            <div className="group p-8 rounded-2xl bg-brand-dark text-white shadow-2xl transform md:-translate-y-4 border border-brand-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent pointer-events-none"></div>
              
              <div className="w-14 h-14 bg-gradient-to-br from-brand-primary to-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg">
                <Smartphone size={28} />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Vídeos Verticais</h3>
              <p className="text-gray-300 mb-6">Edição profissional para Reels e TikTok. Transformamos fotos estáticas em tours dinâmicos que retêm a atenção.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={16} className="text-brand-primary"/> Formato 9:16 Otimizado</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={16} className="text-brand-primary"/> Música Viral</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={16} className="text-brand-primary"/> Script de Vendas</li>
              </ul>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-white text-brand-dark text-center rounded-lg font-bold hover:bg-brand-primary hover:text-white transition-colors">
                Quero Viralizar
              </a>
            </div>

            {/* Card 3 */}
            <div className="group p-8 rounded-2xl bg-brand-bg hover:bg-white hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-brand-gold/30 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Play size={100} className="text-brand-gold" />
              </div>
              <div className="w-14 h-14 bg-brand-gold/10 rounded-xl flex items-center justify-center mb-6 text-brand-gold">
                <Zap size={28} />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3 text-brand-dark">Vídeos Horizontais</h3>
              <p className="text-brand-muted mb-6">Produções cinematográficas para YouTube. Tours detalhados que valorizam cada m² do imóvel.</p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-brand-gold font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Saber mais <ArrowRight size={16}/>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="py-24 bg-brand-bg relative">
          {/* Scroll Anchor Fix */}
          <div id="precos" className="absolute -top-32 left-0 w-full h-0"></div>

          <div className="container mx-auto px-6">
               <div className="text-center mb-16">
                  <h2 className="font-serif text-4xl font-bold mb-4 text-brand-dark">Planos e Preços</h2>
                  <p className="text-brand-muted">Escolha o pacote ideal para o seu momento.</p>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Standard */}
                  <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col bg-white">
                      <div className="mb-4">
                          <h3 className="font-bold text-lg text-brand-dark">Vídeo Padrão</h3>
                          <p className="text-xs text-brand-muted uppercase tracking-wider">Individual</p>
                      </div>
                      <div className="mb-6">
                          <span className="text-3xl font-bold text-brand-dark">R$ 125</span>
                          <span className="text-sm text-gray-500"> / unidade</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-6 flex-grow">
                          Um vídeo de alta qualidade (16x9 ou 9x16) para uma única propriedade.
                      </p>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full py-2 border-2 border-brand-dark text-brand-dark rounded-lg font-bold text-sm hover:bg-brand-dark hover:text-white transition-colors text-center">
                          Contratar
                      </a>
                  </div>

                  {/* Card 2: Volume (Highlighted) */}
                   <div className="border-2 border-brand-primary rounded-2xl p-6 shadow-xl relative flex flex-col bg-white transform md:-translate-y-4">
                      <div className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                          MAIS POPULAR
                      </div>
                      <div className="mb-4">
                          <h3 className="font-bold text-lg text-brand-dark">Pacote Volume</h3>
                          <p className="text-xs text-brand-primary uppercase tracking-wider font-bold">5 Propriedades</p>
                      </div>
                      <div className="mb-2">
                          <span className="text-3xl font-bold text-brand-dark">R$ 500</span>
                          <span className="text-sm text-gray-500"> / total</span>
                      </div>
                      <p className="text-xs text-brand-primary font-bold mb-6 bg-brand-primary/10 inline-block px-2 py-1 rounded w-fit">
                          R$ 100 por vídeo
                      </p>
                      <p className="text-sm text-gray-600 mb-6 flex-grow">
                          Ideal para imobiliárias com giro médio de imóveis. Economize 20%.
                      </p>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-brand-primary text-white rounded-lg font-bold text-sm hover:bg-cyan-400 transition-colors text-center shadow-lg">
                          Garanta o Desconto
                      </a>
                  </div>

                   {/* Card 3: Monthly Plan (Updated) */}
                   <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col bg-white">
                      <div className="mb-4">
                          <h3 className="font-bold text-lg text-brand-dark">Planos Mensais</h3>
                          <p className="text-xs text-brand-muted uppercase tracking-wider">Recorrência</p>
                      </div>
                      <div className="mb-6">
                          <span className="text-2xl font-bold text-brand-dark">Sob Consulta</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-6 flex-grow">
                          Volume constante de vídeos todos os meses com atendimento prioritário.
                      </p>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full py-2 border-2 border-brand-dark text-brand-dark rounded-lg font-bold text-sm hover:bg-brand-dark hover:text-white transition-colors text-center">
                          Falar com Especialista
                      </a>
                  </div>

                  {/* Card 4: Enterprise */}
                  <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col bg-white">
                      <div className="mb-4">
                          <h3 className="font-bold text-lg text-brand-dark">Imobiliárias</h3>
                          <p className="text-xs text-brand-muted uppercase tracking-wider">Parcerias</p>
                      </div>
                      <div className="mb-6">
                          <span className="text-2xl font-bold text-brand-dark">Sob Consulta</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-6 flex-grow">
                          Integração total com seu fluxo de vendas e personalização de marca.
                      </p>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full py-2 border-2 border-gray-200 text-gray-400 rounded-lg font-bold text-sm hover:border-brand-dark hover:text-brand-dark transition-colors text-center">
                          Contactar
                      </a>
                  </div>

               </div>
          </div>
      </section>

      {/* --- FOOTER / AI PRODUCER STUDIO BRANDING --- */}
      <footer className="bg-brand-dark text-white pt-20 pb-10 border-t border-brand-primary/20 relative overflow-hidden">
        {/* Abstract AI Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-ai via-brand-dark to-brand-dark"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div className="text-center md:text-left">
              <h2 className="font-serif text-3xl font-bold mb-2">Pronto para começar?</h2>
              <p className="text-gray-400">Leve sua imobiliária para a era da Inteligência Artificial.</p>
            </div>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-brand-ai to-brand-primary px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-brand-primary/50 transition-all transform hover:scale-105">
              Solicitar Orçamento
            </a>
          </div>

          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* AI Producer Logo Area (Reverted to Icon + Text) */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-ai flex items-center justify-center">
                 <Cpu size={20} className="text-white" />
              </div>
              <div>
                <span className="block font-bold text-lg leading-tight">Ai Producer Studio</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Innovation & Media</span>
              </div>
            </div>

            <div className="flex gap-6 text-sm text-gray-400">
              <a href="https://www.instagram.com/floripa.virtualstaging/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">Instagram</a>
              <a href="https://www.youtube.com/@aiproducerstudio-v8r" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">YouTube</a>
              <a href="mailto:aiproducerstudio1@gmail.com" className="hover:text-brand-primary transition-colors">Email</a>
            </div>
          </div>
          
          <div className="text-center mt-12 text-xs text-gray-600">
            © 2024 Floripa Virtual Staging. A product by Ai Producer Studio.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;