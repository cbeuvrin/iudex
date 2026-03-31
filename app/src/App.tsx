import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, User, X, Cookie, Building } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('iudex-cookies');
    if (!consent && introComplete) {
      const timer = setTimeout(() => setShowCookies(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [introComplete]);

  const handleCookieConsent = (accepted: boolean) => {
    localStorage.setItem('iudex-cookies', accepted ? 'accepted' : 'declined');
    setShowCookies(false);
  };
  
  const heroRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

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

    const sections = [heroRef, videoSectionRef, dataRef, featuresRef, securityRef, trackingRef, impactRef, aboutRef, faqRef];
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
      description: "Integración de más de 300,000 tesis aisladas y jurisprudencias. El sistema permite localizar criterios vigentes de la SCJN y Tribunales Colegiados para dar sustento técnico a la argumentación jurídica con base en las publicaciones más recientes del Semanario Judicial de la Federación.",
      source: "SCJN & TRIBUNALES",
      subSource: "Semanario Judicial de la Federación",
      tags: ["Jurisprudencia", "Tesis Aisladas", "Criterios"]
    },
    {
      value: '10M+',
      label: 'SENTENCIAS',
      description: "Repositorio de 10 millones de sentencias analizadas con rigor jurídico. IUDEX identifica tendencias y puntos ciegos, otorgando una ventaja estratégica en la preparación de argumentos.",
      source: "PODER JUDICIAL",
      subSource: "Corte & colegiados",
      tags: ["SCJN", "Tribunales", "Juzgados"]
    },
    {
      value: '100%',
      label: 'LEYES FEDERALES',
      description: "Vigencia normativa al 100%. IUDEX integra diariamente todas las reformas publicadas en el Diario Oficial de la Federación, garantizando que el análisis jurídico se fundamente en la legislación federal actualizada.",
      source: "DOF & LEGISLACIÓN",
      subSource: "Actualización Diaria",
      tags: ["Leyes federales", "Reglamentos Federales", "Vigencia"]
    },
    {
      value: '+25',
      label: 'TRATADOS INTERNACIONALES',
      description: "Acceso íntegro al acervo de tratados y convenciones internacionales suscritos por el Estado Mexicano. Permite utilizar el bloque de constitucionalidad, facilitando la aplicación del control de convencionalidad de acuerdo con los estándares vigentes.",
      source: "MARCO NORMATIVO",
      subSource: "SRE y Organismos Internacionales",
      tags: ["BLOQUE DE CONSTITUCIONALIDAD", "CONTROL DE CONVENCIONALIDAD", "DERECHOS HUMANOS"]
    }
  ];

  const securityStandards = [
    { 
      id: 'iso',
      title: 'ISO 27001', 
      content: 'Arquitectura y procesos diseñados bajo el estándar internacional líder en ciberseguridad, alineados para proteger la confidencialidad, integridad y disponibilidad de la información. Actualmente nos encontramos en proceso de certificación.'
    },
    { 
      id: 'soc2',
      title: 'SOC 2', 
      content: 'Infraestructura en la nube respaldada por los criterios de confianza más estrictos de la industria, asegurando que la información esté blindada contra accesos no autorizados. Actualmente nos encontramos en proceso de certificación.'
    },
    { 
      id: 'lfpdppp',
      title: 'LFPDPPP', 
      content: 'Protocolos de tratamiento de datos en estricto apego a la legislación mexicana, garantizando el secreto profesional y la privacidad absoluta de la información.'
    },
    { 
      id: 'gdpr',
      title: 'GDPR', 
      content: 'Tratamiento de datos personales alineado con los estándares del GDPR. Implementamos medidas técnicas de privacidad desde el diseño para asegurar el resguardo de la información y expedientes.'
    },
  ];

  const faqItems = [
    {
      q: "¿DE DONDE OBTIENEN IUDEX SU INFORMACIÓN?",
      a: "IUDEX utiliza una base de datos robusta y permanentemente actualizada. Nuestro ecosistema de información integra legislación federal, tesis aisladas, jurisprudencias y resoluciones del Poder Judicial de la Federación (PJF)."
    },
    {
      q: "¿IUDEX TIENE UN LÍMITE DE RESPUESTAS COMO OTRAS INTELIGENCIAS ARTIFICIALES?",
      a: "No. IUDEX ha sido desarrollado específicamente para las exigencias del sector legal. Entendemos que el ejercicio del derecho no se detiene, por lo que ofrecemos acceso ilimitado a nuestra herramienta, sin restricciones de volumen ni topes de consumo diario."
    },
    {
      q: "¿QUÉ TIPO DE ARCHIVOS Y FORMATOS PUEDE PROCESAR IUDEX?",
      a: "IUDEX cuenta con una capacidad avanzada de procesamiento de datos multiformato. Puede cargar y analizar documentos en Word, Excel y PDF, así como fotografías y escaneos (OCR)."
    },
    {
      q: "¿CÓMO GARANTIZA IUDEX LA CONFIDENCIALIDAD DE LA INFORMACIÓN?",
      a: "La privacidad de sus datos es nuestro pilar fundamental. En IUDEX, implementamos los más altos estándares nacionales e internacionales en materia de protección de datos personales. Utilizamos protocolos de encriptación de extremo a extremo para cada consulta, documento y respuesta generada en su sesión."
    },
    {
      q: "¿A QUÉ JUICIOS LE DA SEGUIMIENTO IUDEX?",
      a: "IUDEX brinda un seguimiento diario a los juicios sustanciados en el fuero federal, como lo son los tramitados ante el Tribunal Federal de Justicia Administrativa, Tribunales Colegiados de Circuito, Juzgados de Distrito, entre otros."
    },
    {
      q: "¿IUDEX SUSTITUYE LA NECESIDAD DE PASANTES O PERSONAL JUNIOR?",
      a: "El objetivo de IUDEX no es reemplazar el talento humano, sino incrementarlo con las herramientas correctas. La plataforma mejora la eficiencia del Abogado al ejecutar tareas complejas de investigación, análisis y monitoreo, permitiendo que el personal Junior invierta su tiempo en tareas de mayor valor."
    }
  ];

  const [openAccordion, setOpenAccordion] = useState<string | null>('lfpdppp');
  const [openFAQAccordion, setOpenFAQAccordion] = useState<number | null>(null);

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
            className={`h-16 w-auto mx-auto mb-12 transition-all duration-1000 ${loadingProgress > 10 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
            <img src="/images/logo.png" alt="IUDEX" className="h-14 w-auto" />
          </a>

          {/* Right side - Login & Menu */}
          <div className="flex items-center gap-3">
            {/* Iniciar Sesión - Desktop Button */}
            <a
              href="https://chat.iudex.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full border border-black/20 hover:bg-black hover:text-white transition-all duration-300 text-xs uppercase tracking-[0.2em] font-medium"
            >
              <User size={14} />
              Iniciar Sesión
            </a>

            {/* Iniciar Sesión - Mobile Icon only */}
            <a
              href="https://chat.iudex.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-black/20 hover:bg-black hover:text-white transition-all duration-300"
            >
              <User size={18} />
            </a>

            {/* Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-6 py-2 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-xs uppercase tracking-[0.2em] font-medium"
            >
              {menuOpen ? "Cerrar" : "+ Click Menu"}
            </button>
          </div>
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
          <nav className="space-y-3 text-left">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block text-3xl md:text-5xl font-light tracking-tight text-white hover:text-neutral-500 transition-all duration-300 ${
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
              <p className="text-sm md:text-base text-black/60 leading-relaxed max-w-lg">
                La única IA legal que entiende el derecho mexicano. Entrenamos nuestro modelo 
                para ajustarse a la tradición jurídica romano-canónica con criterio jurídico 
                y sustento legal.
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
          className={`relative z-10 w-full max-w-7xl mx-auto transition-all duration-1000 ${
            visibleSections.has('data') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Top Navigation-like labels */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90">
            <span>Base de Datos Jurídica</span>
            <span>(01)</span>
          </div>

          <div className="mb-20">
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
        className="relative min-h-screen flex flex-col items-center justify-center py-32 px-16 bg-white overflow-hidden"
      >
        <div className="flex justify-between w-full max-w-7xl text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90 px-0">
          <span>Experiencia Visual</span>
          <span>(02)</span>
        </div>
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
            className="w-full cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
            style={{ 
              opacity: Math.min(1, videoProgress * 2),
              transform: `scale(${0.4 + (Math.min(1, videoProgress) * 0.6)})`,
              willChange: 'transform, opacity'
            }}
          >
            <div className="relative mx-auto w-full max-w-4xl shadow-2xl rounded-[2.5rem] overflow-hidden border border-neutral-200 transition-transform duration-500 group-hover:scale-[1.02]">
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
                     <source src="/videos/iudex-video-31-marzo.mp4" type="video/mp4" />
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
        <div className="w-full max-w-7xl mx-auto mb-20">
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase text-black/90 px-0">
            <span>Redacta, resuelve, aprende y protege</span>
            <span>(03)</span>
          </div>
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
            <span className={`transition-colors duration-1000 delay-1000 ${visibleSections.has('features') ? 'text-black/10' : 'text-black'}`}>tu información sensible con absoluta seguridad.</span>
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

      </section>

      {/* Security Section */}
      <section
        id="security"
        ref={securityRef}
        className="relative min-h-screen flex items-center py-32 px-8 md:px-16 bg-white"
      >
        <div
          className={`relative z-10 w-full max-w-7xl mx-auto transition-all duration-1000 ${
            visibleSections.has('security') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Top Navigation-like labels */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90">
            <span>Seguridad e Infraestructura</span>
            <span>(04)</span>
          </div>

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
          {/* Top Navigation-like labels */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90">
            <span>Seguimiento de Procesos</span>
            <span>(05)</span>
          </div>
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
                Monitoreo constante de tus asuntos federales desde una sola plataforma. 
                IUDEX detecta nuevos acuerdos y organiza el historial de cada expediente 
                para que consultes los cambios al momento.
              </p>

              {/* Buttons moved below text */}
              <div className="flex items-center gap-1.5">
                <a 
                  href="https://chat.iudex.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[64px] px-10 bg-[#24292E] text-white rounded-[2rem] flex items-center justify-center text-[13px] font-bold tracking-widest uppercase hover:bg-black transition-all group overflow-hidden relative shadow-lg"
                >
                  <span className="relative z-10">INICIAR SESIÓN</span>
                </a>
                <a 
                  href="https://chat.iudex.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[64px] w-[64px] bg-[#E2E2E2] rounded-[2rem] flex items-center justify-center cursor-pointer hover:bg-[#D1D1D1] transition-colors group shadow-lg"
                >
                  <ArrowUpRight size={24} className="text-[#1A1A1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
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

              {/* iPhone with Balanced Cinematic Entrance */}
              <div 
                className={`relative w-[280px] h-[580px] bg-[#0F0F0F] rounded-[3rem] border-[3px] border-[#2A2A2A] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] ring-1 ring-black/5 p-1.5 overflow-hidden z-10 ${
                  visibleSections.has('tracking') ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-lg'
                }`}
                style={{ 
                  transition: 'all 1200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '400ms'
                }}
              >
                {/* Subtle Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />
                
                {/* Inner Screen */}
                <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative flex flex-col p-6 pt-10">
                  <div className="text-black font-bold text-lg mb-8 flex items-center justify-between">
                    IUDEX
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] text-black/30 group cursor-pointer hover:bg-black hover:text-white transition-colors uppercase font-bold">
                      SM
                    </div>
                  </div>
                  
                  {/* Mock UI: Minimalist Case List */}
                  <div className="space-y-3">
                    {[
                      { id: '452/2025', status: 'Trámite', title: 'Amparo Indirecto', color: 'bg-blue-500' },
                      { id: '128/2026', status: 'Acuerdo', title: 'Juicio Ejecutivo', color: 'bg-orange-500' },
                      { id: '891/2026', status: 'Sentencia', title: 'Toca', color: 'bg-green-500' },
                      { id: '334/2026', status: 'Notificación', title: 'Juicio Ordinario', color: 'bg-purple-500' },
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

      {/* Impact Section */}
      <section
        id="impact"
        ref={impactRef}
        className="relative min-h-screen flex items-center py-32 px-8 md:px-16 bg-[#F9F9F8]"
      >
        <div 
          className={`relative z-10 w-full max-w-7xl mx-auto transition-all duration-1000 ${
            visibleSections.has('impact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-24 text-black/90">
            <span>Métricas de Impacto</span>
            <span>(06)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
            {/* Column 1: Calidad y Velocidad */}
            <div className="space-y-20">
              <div className="space-y-4">
                <span className="text-black/40 text-[10px] font-bold tracking-[0.2em] uppercase text-left block">Efectividad Operativa</span>
                <h3 className="text-4xl md:text-5xl font-light tracking-tight leading-tight text-left">
                  Eleva el estándar de <span className="text-black/50">cada escrito</span>
                </h3>
              </div>

              <div className="space-y-0">
                {[
                  { label: "Consistencia técnica", value: "97%", desc: "de los usuarios reportan mayor consistencia técnica en sus escritos." },
                  { label: "Velocidad de redacción", value: "3x", desc: "más rápido el proceso de generar un primer borrador estructurado." },
                  { label: "Control de errores", value: "85%", desc: "menos errores de forma detectados en la revisión final de documentos." }
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className={`flex items-start gap-8 group py-10 ${i !== 0 ? 'border-t border-black/10' : ''} transition-all duration-1000 ${
                      visibleSections.has('impact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                    }`}
                    style={{ 
                      borderColor: 'rgba(0,0,0,0.1)',
                      borderTopStyle: 'dashed',
                      transitionDelay: `${i * 0.15 + 0.2}s`
                    }}
                  >
                    <div className="text-5xl md:text-6xl font-bold tracking-tighter text-black/20 group-hover:text-black transition-colors duration-500 w-32 shrink-0">
                      {stat.value}
                    </div>
                    <div className="flex-1 pt-2 text-left">
                       <h4 className="text-xs font-bold tracking-widest uppercase mb-2">{stat.label}</h4>
                       <p className="text-black/50 text-sm md:text-base leading-relaxed max-w-xs">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Eficiencia y Retorno */}
            <div className="space-y-20">
              <div className="space-y-4">
                <span className="text-black/40 text-[10px] font-bold tracking-[0.2em] uppercase text-left block">Impacto en el Flujo</span>
                <h3 className="text-4xl md:text-5xl font-light tracking-tight leading-tight text-left">
                  Recupera el activo <span className="text-black/50">más valioso: el tiempo</span>
                </h3>
              </div>

              <div className="space-y-0">
                {[
                  { label: "Uso recurrente", value: "92%", desc: "de los usuarios integran la herramienta en su flujo de trabajo diario." },
                  { label: "Revisión manual", value: "20+", desc: "horas promedio de revisión manual ahorradas al mes por abogado." },
                  { label: "Recuperación de tiempo", value: "4+", desc: "horas semanales recuperadas de tareas administrativas no facturables." }
                ].map((stat, i) => (
                   <div 
                    key={i} 
                    className={`flex items-start gap-8 group py-10 ${i !== 0 ? 'border-t border-black/10' : ''} transition-all duration-1000 ${
                      visibleSections.has('impact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                    }`}
                    style={{ 
                      borderColor: 'rgba(0,0,0,0.1)',
                      borderTopStyle: 'dashed',
                      transitionDelay: `${i * 0.15 + 0.5}s`
                    }}
                  >
                    <div className="text-5xl md:text-6xl font-bold tracking-tighter text-black/20 group-hover:text-black transition-colors duration-500 w-32 shrink-0">
                      {stat.value}
                    </div>
                    <div className="flex-1 pt-2 text-left">
                       <h4 className="text-xs font-bold tracking-widest uppercase mb-2">{stat.label}</h4>
                       <p className="text-black/50 text-sm md:text-base leading-relaxed max-w-xs">{stat.desc}</p>
                    </div>
                  </div>
                ))}
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
          className={`relative z-10 w-full max-w-7xl mx-auto transition-all duration-1000 ${
            visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Top Navigation-like labels */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90">
            <span>Construyendo el Futuro</span>
            <span>(07)</span>
          </div>

          <div className="text-center mb-20 overflow-hidden">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-light mb-8 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
              visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
              Construyendo el <span className="text-black/50">futuro del</span> Derecho.
            </h2>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className={`text-xl text-black/60 leading-relaxed mb-12 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
              visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`} style={{ transitionDelay: '0.2s' }}>
              En IUDEX estamos cambiando la práctica legal mexicana. Somos un equipo de abogados y programadores definiendo un nuevo estándar en la abogacía moderna.
            </p>

            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
              visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`} style={{ transitionDelay: '0.4s' }}>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-full text-lg font-medium hover:bg-black/80 transition-all duration-300 group shadow-xl hover:shadow-2xl"
              >
                Solicitar Demo
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        ref={faqRef}
        className="relative min-h-[80vh] flex items-center py-32 px-8 md:px-16 bg-[#F9F9F8]"
      >
        <div
          className={`relative z-10 w-full max-w-7xl mx-auto transition-all duration-1000 ${
            visibleSections.has('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Top Navigation-like labels */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90">
            <span>Preguntas Frecuentes</span>
            <span>(08)</span>
          </div>

          <div className="mb-24 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight">
              Resolviendo <span className="text-black/50">tus dudas.</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto border-t border-black/10">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`border-b border-black/10 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
                  visibleSections.has('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 0.12 + 0.3}s` }}
              >
                <button
                  onClick={() => setOpenFAQAccordion(openFAQAccordion === index ? null : index)}
                  className="w-full py-10 flex items-center justify-between group text-left"
                >
                  <span className={`text-lg md:text-xl font-medium tracking-tight uppercase transition-all duration-300 ${
                    openFAQAccordion === index ? 'text-black' : 'text-black/60 group-hover:text-black'
                  }`}>
                    {item.q}
                  </span>
                  <div className="relative w-5 h-5 flex items-center justify-center shrink-0 ml-4">
                    <span className={`absolute w-full h-[1px] bg-black transition-transform duration-500 ${openFAQAccordion === index ? 'rotate-0' : 'rotate-90'}`} />
                    <span className="absolute w-full h-[1px] bg-black" />
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFAQAccordion === index ? 'max-h-96 opacity-100 pb-12' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-base md:text-lg text-black/50 leading-relaxed font-light">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 pt-16 pb-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src="/images/logo.png" alt="IUDEX" className="h-10 w-auto" />
            </div>
            <div className="flex items-center gap-8 text-black/40 text-sm">
              <button 
                onClick={() => scrollToSection('features')} 
                className="hover:text-black transition-colors duration-300"
              >
                Nosotros
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="hover:text-black transition-colors duration-300"
              >
                Contacto
              </button>
              <button className="hover:text-black transition-colors duration-300">Privacidad</button>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-black font-semibold tracking-[0.2em] uppercase mb-1">Rest Assured</span>
              <div className="text-black/30 text-sm">
                © 2026 IUDEX. Todos los derechos reservados.
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Video Fullscreen Modal */}
      <div 
        className={`fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center transition-all duration-700 ${
          isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsModalOpen(false)}
      >
        <button 
          onClick={() => setIsModalOpen(false)}
          className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors duration-300 z-[120]"
        >
          <X size={40} strokeWidth={1} />
        </button>
        
        <div 
          className={`w-full max-w-7xl px-4 transition-all duration-1000 delay-300 ${
            isModalOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {isModalOpen && (
            <div className="relative mx-auto w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden border border-white/10">
              {/* Higher-resolution Monitor Frame in Modal */}
              <div className="relative bg-[#F5F5F7] p-6 pb-20 shadow-inner">
                {/* Screen Area */}
                <div className="bg-black rounded-2xl p-2 md:p-6 aspect-video overflow-hidden relative shadow-inner">
                  <video 
                    autoPlay 
                    loop 
                    controls
                    playsInline 
                    className="w-full h-full object-contain rounded-lg shadow-2xl bg-black"
                  >
                    <source src="/videos/iudex-video-31-marzo.mp4" type="video/mp4" />
                  </video>
                </div>
                
                {/* iMac Bottom Chin Area (Zoomed Version) */}
                <div className="absolute bottom-0 left-0 right-0 h-20 flex items-center justify-center">
                  <img 
                    src="/images/logo.png" 
                    alt="IUDEX Logo" 
                    className="h-8 opacity-40 contrast-125 grayscale brightness-0" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cookie Consent Banner */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-2xl transition-all duration-700 pointer-events-none ${
          showCookies ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className={`bg-white/80 backdrop-blur-2xl border border-neutral-200 p-5 md:p-6 rounded-[2rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] flex flex-col md:flex-row items-center gap-6 pointer-events-auto`}>
          <div className="bg-black/5 p-3 rounded-2xl shrink-0 hidden md:block">
            <Cookie size={24} className="text-black" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-black font-bold text-sm mb-0.5">Control de Privacidad</h4>
            <p className="text-black/50 text-[13px] leading-relaxed">
              Utilizamos cookies para optimizar tu experiencia y analizar el tráfico. Al aceptar, consientes el uso sugerido por nuestra política de datos.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => handleCookieConsent(false)}
              className="px-5 py-2.5 text-xs font-semibold text-black/40 hover:text-black transition-colors"
            >
              Declinar
            </button>
            <button 
              onClick={() => handleCookieConsent(true)}
              className="px-7 py-2.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
      {/* Demo Request Modal */}
      {isDemoModalOpen && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setIsDemoModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <div 
            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] p-8 md:p-12 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
            >
              <X size={20} />
            </button>

            <div className="mb-10 text-center md:text-left">
              <span className="text-black/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-3 block">Acceso Prioritario</span>
              <h3 className="text-3xl font-light mb-4">Solicitar <span className="text-black/50">Demo</span></h3>
              <p className="text-black/40 text-sm">Completa tus datos y un especialista legal tech te contactará.</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest pl-1">Nombre (s)</label>
                  <input type="text" className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-black/20 focus:bg-white transition-all" placeholder="Ej. Juan" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest pl-1">Apellidos</label>
                  <input type="text" className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-black/20 focus:bg-white transition-all" placeholder="Ej. Pérez" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest pl-1">Correo electrónico</label>
                <input type="email" className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-black/20 focus:bg-white transition-all" placeholder="juan@despacho.com" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest pl-1">Organización</label>
                  <select className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-black/20 focus:bg-white transition-all appearance-none cursor-pointer">
                    <option>Despacho</option>
                    <option>Empresa</option>
                    <option>Gobierno</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest pl-1">Puesto</label>
                  <input type="text" className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-black/20 focus:bg-white transition-all" placeholder="Socio, Titular, etc." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest pl-1">Número de abogados</label>
                <input type="number" className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-black/20 focus:bg-white transition-all" placeholder="Ej. 15" />
              </div>

              <button className="w-full bg-black text-white py-5 rounded-2xl font-bold tracking-widest text-xs uppercase shadow-xl hover:bg-neutral-800 transition-all hover:scale-[1.01] active:scale-[0.99] mt-4">
                Enviar Solicitud
              </button>

              <div className="pt-6 border-t border-neutral-100 mt-8">
                <p className="text-[10px] text-black/30 leading-relaxed text-center">
                  IUDEX utiliza tu información para entregarte el servicio solicitado. También podemos enviarte correos con información comercial; puedes cancelar tu suscripción en cualquier momento usando el enlace incluido en nuestros mensajes. Consulta los detalles en nuestro Aviso de Privacidad.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
