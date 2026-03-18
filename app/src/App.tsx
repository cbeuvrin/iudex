import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Preloader states
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const [startMainAnims, setStartMainAnims] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // Scroll and Parallax tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);

      if (videoSectionRef.current) {
        const rect = videoSectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Calculation: 0 when just entering, 1 when fully centered
        let progress = (viewportHeight - rect.top) / (viewportHeight);
        progress = Math.max(0, Math.min(1.2, progress)); // Extra headroom for completion
        setVideoProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          } else {
            setVisibleSections((prev) => {
              const next = new Set(prev);
              next.delete(entry.target.id);
              return next;
            });
          }
        });
      },
      { threshold: 0.15, rootMargin: '-50px' }
    );

    const sections = [heroRef, videoSectionRef, dataRef, featuresRef, securityRef, trackingRef, aboutRef];
    sections.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Simulated loading logic for cinematic intro
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIntroComplete(true);
          // Scale down the ID and start text animations shortly after black screen fades
          setTimeout(() => setStartMainAnims(true), 100);
        }, 800); 
      }
      setLoadingProgress(Math.floor(progress));
    }, 500 / 10); // Sped up: ~0.5s total loading time
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const menuItems = [
    { id: 'hero', label: 'Inicio' },
    { id: 'data', label: 'Base de Datos' },
    { id: 'features', label: 'Características' },
    { id: 'security', label: 'Seguridad' },
    { id: 'tracking', label: 'Seguimiento' },
    { id: 'about', label: 'Nosotros' },
  ];


  const knowledgeItems = [
    {
      value: '300k+',
      label: 'TESIS Y JURISPRUDENCIA',
      description: '"Nuestra base de datos incluye más de 300,000 tesis aisladas y jurisprudencias, permitiendo una búsqueda exhaustiva y precisa para fortalecer cualquier argumento legal con los criterios más recientes de la SCJN y Tribunales Colegiados."',
      source: "SCJN & TRIBUNALES",
      subSource: "Semanario Judicial de la Federación",
      tags: ["Jurisprudencia", "Tesis Aisladas", "Criterios"]
    },
    {
      value: '10M+',
      label: 'SENTENCIAS',
      description: '"Acceso a más de 10 millones de sentencias analizadas por nuestra IA para identificar patrones, criterios y tendencias judiciales en todas las materias del derecho mexicano, brindando una ventaja estratégica sin precedentes."',
      source: "PODER JUDICIAL",
      subSource: "Corte y Colegiados",
      tags: ["Precedentes", "Sentencias", "Criterios"]
    },
    {
      value: '100%',
      label: 'LEYES FEDERALES',
      description: '"Garantizamos el 100% de actualización en leyes federales. Nuestro sistema monitorea diariamente el Diario Oficial de la Federación para asegurar que siempre trabajes con la ley vigente y sus últimas reformas."',
      source: "DOF & LEGISLACIÓN",
      subSource: "Actualización Diaria",
      tags: ["Leyes Federales", "Normativas", "Vigencia"]
    }
  ];

  const securityStandards = [
    { 
      id: 'iso',
      title: 'ISO 27001', 
      content: 'Arquitectura y procesos diseñados bajo el estándar internacional líder en ciberseguridad, alineados para proteger la confidencialidad, integridad y disponibilidad de todos tus expedientes. Actualmente nos encontramos en proceso de certificación.'
    },
    { 
      id: 'soc2',
      title: 'SOC 2', 
      content: 'Infraestructura en la nube respaldada por los criterios de confianza más estrictos de la industria, asegurando que la información de tu despacho esté blindada contra accesos no autorizados. Actualmente nos encontramos en proceso de certificación.'
    },
    { 
      id: 'lfpdppp',
      title: 'LFPDPPP', 
      content: 'Protocolos de tratamiento de datos en estricto apego a la legislación mexicana, garantizando el secreto profesional y la privacidad absoluta de la información de tus clientes.'
    },
  ];

  const [openAccordion, setOpenAccordion] = useState<string | null>('lfpdppp');

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Cinematic Preloader Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-all duration-1000 ${
          introComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="max-w-xs w-full px-8 text-center">
          <img 
            src="/images/preloader-logo.png" 
            alt="IUDEX Logo" 
            className={`h-12 w-auto mx-auto mb-12 transition-all duration-1000 ${loadingProgress > 10 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          />
          <div className="relative w-full h-[1px] bg-white/10 rounded-full overflow-hidden mb-4">
            <div 
              className="absolute h-full bg-white transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-white/20 text-[9px] uppercase tracking-[0.4em] font-light">
            <span>Cargando sistema</span>
            <span>{loadingProgress}%</span>
          </div>
        </div>
      </div>

      {/* Fixed Header with Logo and Menu */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-transparent'} ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between px-8 py-6">
          {/* Logo */}
          <a href="#hero" onClick={() => scrollToSection('hero')} className="flex items-center">
            <img src="/images/logo.png" alt="IUDEX" className="h-10 w-auto" />
          </a>

          {/* Menu Button - Top Right */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-6 py-2 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-xs uppercase tracking-[0.2em] font-medium"
          >
            {menuOpen ? "Cerrar" : "+ Click Menu"}
          </button>
        </div>
      </header>

      {/* Side Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/5 z-30 transition-opacity duration-700 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[45%] z-40 menu-overlay transition-transform duration-700 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col items-start justify-center px-12 md:px-24">
          <nav className="space-y-6 text-left">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block text-5xl md:text-7xl font-light tracking-tight text-white hover:text-neutral-500 transition-all duration-300 ${
                  menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ 
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${(index * 0.1) + 0.3}s` 
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div 
            className={`mt-16 transition-all duration-700 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
            style={{ transitionDelay: '0.8s' }}
          >
            <a
              href="https://chat.iudex.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-neutral-200 transition-colors duration-300"
            >
              Iniciar Sesión
              <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-white"
      >
        {/* Central Hero Shape - ID Large with Multi-stage Cinematic Transition */}
        <div 
          className="absolute left-1/2 top-1/2 pointer-events-none transform"
          style={{ 
            transition: 'transform 6s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.5s ease-out, filter 3s ease-out',
            transform: `translate(-50%, -50%) ${
              startMainAnims 
                ? 'translateX(20vw) scale(1)' 
                : 'translateX(0) scale(3.5)'
            }`,
            opacity: startMainAnims ? 0.9 : 0,
            filter: startMainAnims ? 'blur(0px)' : 'blur(40px)'
          }}
        >
          <div className="floating">
            <img
              src="/images/hero-shape.png"
              alt="IUDEX"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Hero Content - Bottom Left */}
        <div className="absolute bottom-16 left-8 md:left-16 max-w-4xl pointer-events-none">
          {/* Badge */}
          <div 
            className={`flex items-center gap-3 mb-8 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
              startMainAnims ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="w-8 h-[1px] bg-black/40" />
            <span className="text-black/50 text-xs tracking-[0.2em] uppercase">Inteligencia Artificial</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-12">
            {/* Title Line 1 Wrapper (Entrance) */}
            <div 
              className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
                startMainAnims ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              {/* Line 1 Content (Parallax) */}
              <span 
                className="block"
                style={{ transform: `translateY(${scrollY * -0.6}px)` }}
              >
                Diseñado para
              </span>
            </div>
            {/* Title Line 2 Wrapper (Entrance) */}
            <div 
              className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
                startMainAnims ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: '1000ms' }}
            >
              {/* Line 2 Content (Parallax) */}
              <span 
                className="block text-black/50"
                style={{ transform: `translateY(${scrollY * -0.5}px)` }}
              >
                profesionales del derecho.
              </span>
            </div>
          </h1>

          {/* Paragraph Wrapper (Entrance) */}
          <div
            className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
              startMainAnims ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            }`}
            style={{ transitionDelay: '1200ms' }}
          >
            {/* Paragraph Content (Parallax) */}
            <div style={{ transform: `translateY(${scrollY * -0.3}px)` }}>
              <p className="text-sm md:text-base text-black/60 leading-relaxed max-w-sm">
                La única IA legal que entiende el derecho mexicano. Entrenamos nuestro modelo 
                para ajustarse a la tradición jurídica romano canónica de forma creativa y con efecto.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Data Section */}
      <section
        id="data"
        ref={dataRef}
        className="relative min-h-screen flex items-center py-32 px-8 md:px-16 bg-neutral-50"
      >
        <div
          className={`relative z-10 w-full max-w-6xl mx-auto transition-all duration-1000 ${
            visibleSections.has('data') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="mb-20">
            <span className="text-black/40 text-xs tracking-[0.2em] uppercase mb-4 block">Base de Datos</span>
            <h2 className="text-4xl md:text-6xl font-light">
              Conocimiento <span className="text-black/50">jurídico</span>
            </h2>
          </div>

          {/* Knowledge Items Grid Styled like Reference */}
          <div className="space-y-0">
            {knowledgeItems.map((item, index) => (
              <div 
                key={index} 
                className={`py-12 flex flex-col md:flex-row items-start gap-12 ${index !== 0 ? 'border-t border-black/10' : ''}`}
                style={{ 
                  borderColor: 'rgba(0,0,0,0.1)',
                  borderTopStyle: 'dashed' 
                }}
              >
                {/* Left: Stat */}
                <div 
                  className={`w-full md:w-32 lg:w-48 flex-shrink-0 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
                    visibleSections.has('data') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${(index * 0.1) + 0.1}s` }}
                >
                  <div className="text-6xl md:text-7xl font-bold tracking-tighter mb-1 leading-none">{item.value}</div>
                  <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-black/40">{item.label}</div>
                </div>

                {/* Middle: Description */}
                <div 
                  className={`flex-1 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
                    visibleSections.has('data') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${(index * 0.1) + 0.3}s` }}
                >
                  <p className="text-lg md:text-xl text-black/80 leading-snug font-normal max-w-2xl">
                    {item.description}
                  </p>
                </div>

                {/* Right: Source and Tags */}
                <div 
                  className={`w-full md:w-64 flex-shrink-0 flex flex-col items-start md:items-end text-left md:text-right transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
                    visibleSections.has('data') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${(index * 0.1) + 0.5}s` }}
                >
                  <div className="mb-4">
                    <div className="text-sm font-bold tracking-wider uppercase mb-1">{item.source}</div>
                    <div className="text-xs text-black/40 font-medium">{item.subSource}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                    {item.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="px-3 py-1 rounded-full border border-black/10 text-[10px] tracking-wide uppercase font-medium text-black/40 hover:border-black/30 hover:text-black transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* iMac Video Section */}
      <section
        id="video-showcase"
        ref={videoSectionRef}
        className="relative min-h-screen flex flex-col items-center justify-center py-32 px-8 bg-white overflow-hidden"
      >
        {/* Centered Content Wrapper */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
          
          {/* Header Text (Now Centered) */}
          <div 
            className="text-center mb-24 transition-all duration-1000"
            style={{ 
              opacity: Math.min(1, videoProgress * 1.5),
              transform: `translateY(${(1 - Math.min(1, videoProgress)) * 30}px)`
            }}
          >
            <h3 className="text-4xl md:text-6xl font-light mb-8">Mejora tu <span className="text-black/50">práctica legal</span></h3>
            <p className="text-black/80 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
              IUDEX disminuye errores y aumenta la calidad del trabajo.<br className="hidden md:block" />
              Descubre una nueva forma de eficiencia usando tecnología jurídica.
            </p>
          </div>

          {/* Centered Monitor Mockup (Scaling with Scroll) */}
          <div 
            className="w-full"
            style={{ 
              opacity: Math.min(1, videoProgress * 2),
              transform: `scale(${0.4 + (Math.min(1, videoProgress) * 0.6)})`,
              willChange: 'transform, opacity'
            }}
          >
            <div className="relative mx-auto w-full max-w-4xl shadow-2xl rounded-[2.5rem] overflow-hidden border border-neutral-200">
              {/* Monitor Body */}
              <div className="relative bg-[#F5F5F7] p-4 pb-14 shadow-inner">
                {/* Screen Area (Black Bezel) */}
                <div className="bg-black rounded-2xl p-4 aspect-video overflow-hidden relative shadow-inner">
                  {/* The Video */}
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                  >
                     <source src="/videos/iudex-video.mp4" type="video/mp4" />
                     <source src="/videos/iudex-video.mov" type="video/quicktime" />
                  </video>
                </div>
                
                {/* iMac Bottom Chin Area */}
                <div className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-center">
                  <img 
                    src="/images/logo.png" 
                    alt="IUDEX Logo" 
                    className="h-6 opacity-30 contrast-125 grayscale brightness-0" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Inspired by Reference) */}
      <section
        id="features"
        ref={featuresRef}
        className="relative min-h-screen flex flex-col pt-20 px-8 md:px-16 bg-white overflow-hidden"
      >
        {/* Top Navigation-like labels */}
        <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90">
          <span>MEJORA TU PRÁCTICA LEGAL</span>
          <span>(01)</span>
        </div>

        {/* Main Large Heading (Full Width) */}
        <div 
          className={`w-full transition-all duration-1000 ${
            visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="text-4xl md:text-7xl lg:text-[110px] font-light leading-[1] tracking-tighter text-black w-full text-left">
            <span className="text-black">Redacta</span>{" "}
            <span className={`transition-colors duration-1000 delay-500 ${visibleSections.has('features') ? 'text-black/10' : 'text-black'}`}>con precisión,</span> 
            <span className="text-black"> resuelve</span>{" "}
            <span className={`transition-colors duration-1000 delay-700 ${visibleSections.has('features') ? 'text-black/10' : 'text-black'}`}>consultas,</span> 
            <span className="text-black"> aprende</span>{" "}
            <span className={`transition-colors duration-1000 delay-1000 ${visibleSections.has('features') ? 'text-black/10' : 'text-black'}`}>de cada caso y</span> 
            <span className="text-black"> protege</span>{" "}
            <span className={`transition-colors duration-1000 delay-1000 ${visibleSections.has('features') ? 'text-black/10' : 'text-black'}`}>tu información jurídica con seguridad absoluta.</span>
          </h2>
        </div>

        {/* Middle Smaller Text (Right Aligned per user request) */}
        <div 
          className={`w-full max-w-sm ml-auto text-right mt-20 mb-20 space-y-6 transition-all duration-1000 delay-300 ${
            visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-sm md:text-base text-black/60 leading-relaxed">
            Entendemos el mundo del derecho y la tecnología, y esa pasión da forma a cada herramienta que construimos.
          </p>
          <p className="text-sm md:text-base text-black/60 leading-relaxed">
            Si buscas un sistema que realmente entienda tu espacio y proteja lo que estás creando, has encontrado el lugar correcto.
          </p>
        </div>

        {/* Bottom Slider (Confusion to Clarity) - Moved to Right */}
        <div 
          className={`w-full max-w-sm ml-auto mb-32 transition-all duration-1000 delay-500 ${
            visibleSections.has('features') ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex justify-between text-[10px] font-bold tracking-widest text-black/40 uppercase mb-4">
            <span>Confusión</span>
            <span>Claridad</span>
          </div>
          <div className="relative h-[2px] bg-black/10 w-full overflow-hidden">
            <div 
              className="absolute top-0 right-0 h-full bg-black transition-all duration-1000"
              style={{ width: visibleSections.has('features') ? '100%' : '0%' }}
            />
            {/* Dots */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-black/40" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 bg-black" />
          </div>
        </div>

        {/* Bottom Fake Cookie Bar (Like Reference) */}
        <div className="mt-auto w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-8 border-t border-black/5">
          <span className="text-[10px] font-bold tracking-widest text-black/40 mb-4 md:mb-0">
            EL SISTEMA PROTEGE TU INFORMACIÓN CONFIDENCIAL
          </span>
          <div className="flex gap-4">
            <button className="bg-black text-white text-[10px] font-bold tracking-widest px-8 py-4 rounded-full hover:scale-105 transition-transform">
              ACEPTAR TÉRMINOS
            </button>
            <button className="bg-white border border-black/10 text-[10px] font-bold tracking-widest px-8 py-4 rounded-full hover:bg-black/5 transition-colors">
              SEGURIDAD
            </button>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section
        id="security"
        ref={securityRef}
        className="relative min-h-screen flex items-center py-32 px-8 md:px-16 bg-white"
      >
        <div
          className={`relative z-10 w-full max-w-6xl mx-auto transition-all duration-1000 ${
            visibleSections.has('security') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight">
              Nos alineamos a los más altos estándares de seguridad.
            </h2>
          </div>

          <div className="border-t border-black/10">
            {securityStandards.map((item, index) => (
              <div 
                key={item.id} 
                className={`border-b border-black/10 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
                  visibleSections.has('security') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${(index * 0.15) + 0.3}s` }}
              >
                <button
                  onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                  className="w-full py-8 flex items-center justify-between group transition-all duration-300"
                >
                  <span className={`text-2xl md:text-3xl tracking-tight transition-all duration-300 ${
                    openAccordion === item.id 
                      ? 'font-medium translate-x-1' 
                      : 'font-light group-hover:font-medium'
                  }`}>
                    {item.title}
                  </span>
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <span className={`absolute w-full h-[1px] bg-black transition-transform duration-500 ${openAccordion === item.id ? 'rotate-0' : 'rotate-90'}`} />
                    <span className="absolute w-full h-[1px] bg-black" />
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openAccordion === item.id ? 'max-h-96 opacity-100 pb-12' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-base md:text-lg text-black/60 leading-relaxed max-w-2xl mx-auto md:px-20">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking Section (Refactored to "Integrated Platform" Style) */}
      <section
        id="tracking"
        ref={trackingRef}
        className="relative min-h-[60vh] flex items-center py-32 px-8 md:px-16 bg-[#F9F9F8] overflow-hidden"
      >
        {/* Background Decorative Shape */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] flex items-center justify-center overflow-hidden">
          <div className="background-float">
            <img 
              src="/images/hero-shape.png" 
              alt="" 
              className="w-[120%] h-auto object-contain blur-2xl rotate-12" 
            />
          </div>
        </div>

        <div
          className={`relative z-10 w-full max-w-7xl mx-auto transition-all duration-1000 ${
            visibleSections.has('tracking') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            {/* Left: Content */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-black/5 shadow-sm mb-8">
                <div className="w-2.5 h-2.5 bg-[#E2E2E2] rounded-sm" />
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-black/60">LA PLATAFORMA INTEGRADA</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-[#1A1A1A] mb-8">
                Seguimiento de juicios <br className="hidden md:block" />
                <span className="text-[#A1A1A1]">federales en tiempo real</span>
              </h2>

              <p className="text-lg md:text-xl text-[#1A1A1A]/60 leading-relaxed font-light max-w-2xl mb-12">
                Única IA legal que entiende el derecho mexicano. Entrenamos nuestro modelo 
                para ajustarse a la tradición jurídica romano canónica de forma creativa y estratégica.
              </p>

              {/* Buttons moved below text */}
              <div className="flex items-center gap-1.5">
                <button className="h-[64px] px-10 bg-[#24292E] text-white rounded-[2rem] flex items-center justify-center text-[13px] font-bold tracking-widest uppercase hover:bg-black transition-all group overflow-hidden relative shadow-lg">
                  <span className="relative z-10">DESCARGAR IUDEX</span>
                </button>
                <div className="h-[64px] w-[64px] bg-[#E2E2E2] rounded-[2rem] flex items-center justify-center cursor-pointer hover:bg-[#D1D1D1] transition-colors group shadow-lg">
                  <ArrowUpRight size={24} className="text-[#1A1A1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Right: Coded iPhone Mockup (Minimalist) */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
              {/* Static ID Shape - Straight and Solid */}
              <div 
                className={`absolute top-1/2 -right-20 lg:-right-32 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-100 z-0 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
                  visibleSections.has('tracking') ? 'opacity-100 scale-125' : 'opacity-0 scale-95 blur-xl'
                }`}
                style={{ transitionDelay: '0.4s' }}
              >
                <img 
                  src="/images/hero-shape.png" 
                  alt="" 
                  className="w-full h-full object-contain" 
                />
              </div>

              {/* iPhone with Super-slow Cinematic Entrance */}
              <div 
                className={`relative w-[280px] h-[580px] bg-[#0F0F0F] rounded-[3rem] border-[3px] border-[#2A2A2A] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] ring-1 ring-black/5 p-1.5 overflow-hidden z-10 transition-all duration-[5000ms] cubic-bezier(0.19, 1, 0.22, 1) ${
                  visibleSections.has('tracking') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'
                }`}
                style={{ transitionDelay: '0.8s' }}
              >
                {/* Subtle Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />
                
                {/* Inner Screen */}
                <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative flex flex-col p-6 pt-10">
                  <div className="text-black font-bold text-lg mb-8 flex items-center justify-between">
                    IUDEX
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] text-black/30 group cursor-pointer hover:bg-black hover:text-white transition-colors">
                      CB
                    </div>
                  </div>
                  
                  {/* Mock UI: Minimalist Case List */}
                  <div className="space-y-3">
                    {[
                      { id: '452/2024', status: 'Trámite', title: 'Amparo Indirecto', color: 'bg-blue-500' },
                      { id: '128/2024', status: 'Acuerdo', title: 'Juicio Ejecutivo', color: 'bg-orange-500' },
                      { id: '891/2023', status: 'Sentencia', title: 'Apelación Civil', color: 'bg-green-500' },
                      { id: '334/2024', status: 'Notificación', title: 'Civil Federal', color: 'bg-purple-500' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-white border-b border-neutral-100 flex items-center gap-4 group cursor-pointer hover:bg-neutral-50 transition-colors">
                        <div className={`w-1 h-8 rounded-full ${item.color.replace('500', '400')}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">{item.id}</span>
                            <span className="text-[9px] font-bold text-black/40">{item.status}</span>
                          </div>
                          <div className="text-sm font-medium text-black">{item.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Navigation Mockup */}
                  <div className="absolute bottom-6 left-0 right-0 px-6 flex items-center justify-between text-black/20">
                    <div className="flex flex-col items-center gap-1 opacity-100 text-black">
                      <div className="w-1.5 h-1.5 rounded-full bg-black mb-1" />
                    </div>
                    <div className="w-8 h-1 bg-black/5 rounded-full" />
                    <div className="w-2 h-2 rounded-full border-2 border-black/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="relative min-h-screen flex items-center py-32 px-8 md:px-16 bg-white"
      >
        <div
          className={`relative z-10 w-full max-w-6xl mx-auto transition-all duration-1000 ${
            visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-20">
            <span className="text-black/40 text-xs tracking-[0.2em] uppercase mb-4 block">Nosotros</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8">
              Construyendo el <span className="text-black/50">futuro</span> del Derecho
            </h2>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-black/60 leading-relaxed mb-12">
              En IUDEX estamos cambiando la práctica legal mexicana. Somos un equipo de abogados 
              y programadores definiendo un nuevo estándar en la abogacía moderna.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://chat.iudex.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-lg font-medium hover:bg-black/80 transition-all duration-300 group"
              >
                Comenzar ahora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <button
                onClick={() => scrollToSection('hero')}
                className="inline-flex items-center gap-3 px-8 py-4 border border-black/30 rounded-full text-lg hover:bg-black hover:text-white transition-all duration-300"
              >
                Contactar
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-32 pt-16 border-t border-black/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <img src="/images/logo.png" alt="IUDEX" className="h-8 w-auto" />
              </div>
              <div className="flex items-center gap-8 text-black/40 text-sm">
                <button onClick={() => scrollToSection('features')} className="hover:text-black transition-colors duration-300">Nosotros</button>
                <button onClick={() => scrollToSection('about')} className="hover:text-black transition-colors duration-300">Contacto</button>
                <button className="hover:text-black transition-colors duration-300">Privacidad</button>
              </div>
              <div className="text-black/30 text-sm">
                © 2024 IUDEX. Todos los derechos reservados.
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}

export default App;
