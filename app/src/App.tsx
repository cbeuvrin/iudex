import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, X, Menu, Cookie } from 'lucide-react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Preloader states
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const [startMainAnims, setStartMainAnims] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  // Section progress states
  const [featuresProgress, setFeaturesProgress] = useState(0);
  const [dataProgress, setDataProgress] = useState(0);
  const [securityProgress, setSecurityProgress] = useState(0);
  const [trackingProgress, setTrackingProgress] = useState(0);
  const [impactProgress, setImpactProgress] = useState(0);
  const [aboutProgress, setAboutProgress] = useState(0);
  const [faqProgress, setFaqProgress] = useState(0);
  
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

  // Scroll and Parallax tracking (throttled with rAF for performance)
  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);

        if (videoSectionRef.current) {
          const rect = videoSectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          let progress = (viewportHeight - rect.top) / (viewportHeight);
          setVideoProgress(Math.max(0, Math.min(1.2, progress)));
        }

        if (featuresRef.current) {
          const rect = featuresRef.current.getBoundingClientRect();
          const p = (window.innerHeight - rect.top) / window.innerHeight;
          setFeaturesProgress(Math.max(0, Math.min(2, p)));
        }

        if (dataRef.current) {
          const rect = dataRef.current.getBoundingClientRect();
          const sectionHeight = dataRef.current.offsetHeight;
          const p = (window.innerHeight - rect.top) / (sectionHeight * 0.35);
          setDataProgress(Math.max(0, Math.min(8, p)));
        }

        if (securityRef.current) {
          const rect = securityRef.current.getBoundingClientRect();
          const p = (window.innerHeight - rect.top) / window.innerHeight;
          setSecurityProgress(Math.max(0, Math.min(2, p)));
        }

        if (trackingRef.current) {
          const rect = trackingRef.current.getBoundingClientRect();
          const p = (window.innerHeight - rect.top) / window.innerHeight;
          setTrackingProgress(Math.max(0, Math.min(2, p)));
        }

        if (impactRef.current) {
          const rect = impactRef.current.getBoundingClientRect();
          const p = (window.innerHeight - rect.top) / window.innerHeight;
          setImpactProgress(Math.max(0, Math.min(2, p)));
        }

        if (aboutRef.current) {
          const rect = aboutRef.current.getBoundingClientRect();
          const p = (window.innerHeight - rect.top) / window.innerHeight;
          setAboutProgress(Math.max(0, Math.min(2, p)));
        }

        if (faqRef.current) {
          const rect = faqRef.current.getBoundingClientRect();
          const p = (window.innerHeight - rect.top) / window.innerHeight;
          setFaqProgress(Math.max(0, Math.min(2, p)));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Cinematic preloader - shows once per browser session
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('iudex-intro-seen');
    if (hasSeenIntro) {
      setTimeout(() => {
        setIntroComplete(true);
        setLoadingProgress(100);
        setTimeout(() => setStartMainAnims(true), 100);
      }, 50);
      return;
    }

    const totalDuration = 1800; // 1.8 seconds total
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / totalDuration);
      // Ease-in-out cubic: slow → fast → slow
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setLoadingProgress(Math.floor(eased * 100));

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setLoadingProgress(100);
        setIntroComplete(true);
        sessionStorage.setItem('iudex-intro-seen', 'true');
        setTimeout(() => setStartMainAnims(true), 150);
      }
    };

    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
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
    { id: 'demo', label: 'Demo' },
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
      subSource: "Precedentes",
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
      q: "¿DE DÓNDE OBTIENE IUDEX SU INFORMACIÓN?",
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

  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [openFAQAccordion, setOpenFAQAccordion] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {showPrivacy && (
        <div className="fixed inset-0 z-[1000] bg-white overflow-y-auto animate-in fade-in duration-500 selection:bg-black/5">
          <header className={`fixed top-0 left-0 right-0 z-[1001] bg-white px-8 py-6`}>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <button 
                onClick={() => { setShowPrivacy(false); window.scrollTo(0,0); }}
                className="flex items-center gap-3 group text-xs uppercase tracking-[0.2em] font-medium"
              >
                <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <ArrowRight size={14} className="rotate-180" />
                </div>
                <span>Volver al inicio</span>
              </button>
              <img src="/images/logo.png" alt="IUDEX" className="h-10 w-auto" />
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-8 pt-48 pb-64">
            <div className="mb-24">

              <h1 className="text-6xl font-light tracking-tight mb-8">Política de <span className="text-black/40">Privacidad</span></h1>
              <div className="flex items-center gap-4 text-black/50 text-sm">
                <div className="w-6 h-[1px] bg-black/20" />
                <span>Última actualización: 25 de marzo de 2026</span>
              </div>
            </div>

            <div className="space-y-12 text-black/70 leading-relaxed text-justify privacy-content">
              <p className="text-lg font-light text-black">
                TARNIX TECHNOLOGIES, S.A. de C.V. ("IUDEX", "nosotros", "nuestro") reconoce la importancia de su derecho a la privacidad y se compromete a proteger y salvaguardar la información que recopila sobre usted. Esta Política de Privacidad (la "Política") describe el tratamiento que damos a los datos personales cuando usted accede o utiliza los productos, servicios, funcionalidades y tecnologías de IUDEX, incluyendo nuestro sitio web, plataforma y aplicaciones que intercambian información con IUDEX (los "Servicios"). IUDEX proporciona una plataforma de inteligencia artificial segura que optimiza la productividad y automatiza flujos de trabajo complejos para profesionales en áreas legales, fiscales, financieras y de consultoría.
              </p>

              <p>
                Esta Política describe cómo recopilamos, utilizamos y compartimos información que se relaciona con individuos identificables ("Datos Personales") y también cómo puede ejercer sus derechos conforme a las leyes de privacidad y protección de datos aplicables.
              </p>

              <div className="bg-black/[0.02] p-8 rounded-3xl border border-black/5 my-12">
                <h3 className="text-black font-bold uppercase tracking-[0.2em] text-[10px] mb-6 underline decoration-black/10 underline-offset-8">Índice</h3>
                <nav className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                  {[
                    "Alcance de esta Política", "Información que Recopilamos", "Cómo Utilizamos sus Datos Personales",
                    "Con Quién Compartimos sus Datos Personales", "Transferencias Internacionales de Datos",
                    "Cómo Protegemos sus Datos Personales", "Periodo de Conservación de Datos",
                    "Sus Derechos", "Datos de Menores de Edad", "Disposiciones Específicas por Jurisdicción",
                    "Actualizaciones a esta Política", "Información de Contacto"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-black/50 hover:text-black transition-colors cursor-default">
                      <span className="text-[10px] font-mono opacity-30">{(i + 1).toString().padStart(2, '0')}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </nav>
              </div>

              <p className="italic text-sm text-black/60">
                Al utilizar nuestros Servicios, usted acepta esta Política de Privacidad. Si tiene alguna pregunta o inquietud, por favor contáctenos.
              </p>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">1. Alcance de esta Política</h2>
                <div className="space-y-4">
                  <p>Este Aviso de Privacidad aplica al tratamiento de datos personales que realiza TARNIX TECHNOLOGIES S.A. de C.V. cuando usted accede o utiliza nuestros productos, servicios, funcionalidades y tecnologías, incluyendo nuestro sitio web, plataforma y aplicaciones que intercambian información con IUDEX, en la medida en que IUDEX actúe como responsable del tratamiento.</p>
                  <p>Para efectos de este Aviso, IUDEX será responsable respecto de los datos personales que recabamos y tratamos para: (i) alta y administración de cuentas de usuario, (ii) facturación y pagos (cuando aplique), (iii) soporte y atención a clientes, (iv) seguridad de la información, prevención de fraude y administración de accesos, (v) cumplimiento de obligaciones legales, y (vi) comunicaciones relacionadas con la operación del servicio; así como, en su caso, para finalidades secundarias como prospección comercial y marketing, conforme a lo previsto en este Aviso.</p>
                  <p>Este Aviso no regula el tratamiento del contenido, documentos, archivos, información, entradas, consultas, instrucciones, prompts, respuestas, resultados u otros materiales que los Suscriptores o sus usuarios introduzcan, carguen, almacenen o procesen mediante los Servicios (el “Contenido”). Respecto del Contenido, IUDEX actúa, por regla general, como encargado del tratamiento por cuenta del Suscriptor, quien determina las finalidades y los medios del tratamiento y, por tanto, actúa como responsable. El tratamiento del Contenido se rige por el Contrato de Suscripción y, en su caso, por el anexo o acuerdo de tratamiento de datos que corresponda.</p>
                  <p>En consecuencia, si su solicitud de acceso, rectificación, cancelación u oposición (derechos ARCO), o cualquier otra consulta de privacidad, se relaciona con datos personales incluidos en el Contenido, deberá presentarla ante el Suscriptor correspondiente, en su carácter de responsable. IUDEX podrá apoyar al Suscriptor en la atención de dichas solicitudes, únicamente en los términos del Contrato de Suscripción y conforme a las instrucciones que reciba del Suscriptor.</p>
                  <p>Nuestros Servicios pueden contener enlaces a sitios o servicios de terceros. Este Aviso aplica exclusivamente a los Servicios operados por IUDEX. IUDEX no controla ni es responsable por las prácticas de privacidad de terceros; usted deberá revisar los avisos de privacidad aplicables de dichos terceros antes de proporcionarles datos personales.</p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">2. Información que Recopilamos</h2>
                <div className="space-y-6">
                  <p>En el curso de nuestras operaciones comerciales, la prestación de los Servicios y la operación de nuestros sitios web y aplicaciones, IUDEX puede recabar y recibir datos personales de distintas fuentes, conforme a las finalidades previstas en este Aviso y con base en los principios aplicables de protección de datos personales.</p>
                  <p>Para efectos de este Aviso, los datos personales que recabamos se agrupan, de manera enunciativa más no limitativa, en las siguientes categorías:</p>
                  
                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold underline decoration-black/10 underline-offset-4">2.1 Información que usted nos proporciona directamente</h3>
                    <p className="mb-4">Recabamos datos personales directamente de usted cuando crea una cuenta para utilizar los Servicios, se comunica con nosotros o interactúa con nuestros canales oficiales.</p>
                    <ul className="space-y-4 text-sm">
                      <li>
                        <strong>a) Información de cuenta de usuario.</strong> Cuando usted, su empleador o el Suscriptor crea o administra una cuenta en IUDEX, podemos recabar datos personales como: nombre, correo electrónico, datos relacionados con su actividad profesional (por ejemplo, profesión y experiencia profesional), preferencias de idioma, credenciales de acceso, información necesaria para la administración de la cuenta y, cuando aplique, información de pago y el historial de transacciones con IUDEX.
                      </li>
                      <li>
                        <strong>b) Información de comunicaciones.</strong> Cuando usted se comunica con nosotros (por ejemplo, para solicitar información, soporte, atención al cliente, enviar comentarios o responder encuestas), podemos recabar datos como: nombre, correo electrónico, datos de contacto, información relacionada con su perfil profesional, así como el contenido de los mensajes o solicitudes que envíe.
                      </li>
                      <li>
                        <strong>c) Información de redes sociales.</strong> IUDEX puede mantener presencia en redes sociales (por ejemplo, LinkedIn, YouTube y X). Cuando usted interactúa con nuestras páginas, publicaciones o representantes mediante dichas plataformas, podemos recabar los datos personales que usted decida compartir (por ejemplo, datos de contacto, contenido de mensajes, publicaciones o información de perfil), conforme a la configuración de su cuenta y a los términos de uso de la red social correspondiente. Adicionalmente, las plataformas de redes sociales pueden proporcionarnos estadísticas y métricas agregadas sobre nuestra actividad.
                      </li>
                      <li>
                        <strong>d) Encuestas e investigación de mercado.</strong> Podemos invitarle a participar voluntariamente en encuestas de satisfacción o investigación de mercado. Si usted participa, podremos recabar la información que usted proporcione en sus respuestas.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold underline decoration-black/10 underline-offset-4">2.2 Información que recabamos automáticamente</h3>
                    <p className="mb-4">Cuando usted visita, utiliza o interactúa con los Servicios, podemos recabar automáticamente cierta información técnica y de uso, incluyendo:</p>
                    <ul className="space-y-4 text-sm">
                      <li>
                        <strong>a) Datos de registro.</strong> Por la operación normal de internet y de los sistemas, su navegador o dispositivo puede enviar información como dirección IP, tipo y configuración del navegador, fecha y hora de acceso, e información relacionada con su interacción con los Servicios.
                      </li>
                      <li>
                        <strong>b) Información del dispositivo.</strong> Podemos recabar información del dispositivo con el que accede a los Servicios, como sistema operativo, identificadores del dispositivo o del navegador, idioma, páginas de referencia y salida, y datos de navegación o flujo de clics dentro de nuestros sitios y aplicaciones.
                      </li>
                      <li>
                        <strong>c) Datos de uso.</strong> Podemos recabar información relativa al uso que usted hace de los Servicios, como funcionalidades utilizadas, acciones realizadas, zona horaria, ubicación aproximada, fechas y horas de acceso, tiempo de uso dentro de los Servicios, y tipos o volúmenes de consultas enviadas.
                      </li>
                    </ul>
                    <p className="my-4 font-medium italic text-black/80">Aclaración sobre el Contenido. El Contenido que usted o el Suscriptor introduzca o procese en los Servicios se rige por lo previsto en la Sección 1 de este Aviso y por el Contrato de Suscripción aplicable. En el supuesto de que IUDEX deba tratar Contenido para fines de soporte, mantenimiento o seguridad, lo hará conforme a las instrucciones del Suscriptor y en los términos contractuales aplicables.</p>
                    <div className="space-y-4 text-sm">
                      <p><strong>d) Cookies y tecnologías similares.</strong> IUDEX puede utilizar cookies, píxeles, etiquetas, SDKs y tecnologías similares para habilitar el funcionamiento de los Servicios, recordar preferencias y analizar el desempeño del sitio. Estas tecnologías pueden ser propias o de terceros.</p>
                      <p>De manera general, las cookies y tecnologías similares pueden utilizarse para:</p>
                      <ul className="list-disc pl-6 space-y-2 italic">
                        <li>Cookies esenciales: necesarias para la operación del sitio y para habilitar funciones básicas, como autenticación y acceso a áreas seguras.</li>
                        <li>Cookies de rendimiento y análisis: para medir y analizar el uso de los Servicios (por ejemplo, analítica), a fin de mejorar su funcionamiento y contenidos.</li>
                        <li>Cookies funcionales: para recordar configuraciones y preferencias (por ejemplo, idioma o región).</li>
                      </ul>
                      <p>Usted podrá deshabilitar cookies desde la configuración de su navegador. No obstante, la desactivación de ciertas cookies puede afectar el funcionamiento de los Servicios. Cuando corresponda, IUDEX pondrá a su disposición mecanismos para gestionar sus preferencias respecto de cookies no esenciales.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold underline decoration-black/10 underline-offset-4">2.3 Información que recibimos de terceros</h3>
                    <p>Podemos recibir datos personales sobre usted de terceros, tales como: (i) socios o proveedores de seguridad (por ejemplo, para detección de fraude o credenciales comprometidas), (ii) proveedores de marketing y prospección comercial, (iii) proveedores de publicidad y redes sociales, y (iv) organizadores de eventos o empresas de investigación de mercado, conforme a las finalidades previstas en este Aviso.</p>
                    <p className="mt-4">Asimismo, nuestros Suscriptores pueden proporcionarnos datos de contacto de sus usuarios o colaboradores, con el objeto de habilitar el acceso a los Servicios y administrar cuentas.</p>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold underline decoration-black/10 underline-offset-4">2.4 Información disponible públicamente</h3>
                    <p>Podemos recabar y utilizar información disponible públicamente, incluyendo fuentes de acceso público, para fines relacionados con la operación y mejora de nuestros Servicios. En su caso, cuando dicha información contenga datos personales, IUDEX la tratará conforme a este Aviso y únicamente para los fines compatibles con la naturaleza de la fuente y del Servicio.</p>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold underline decoration-black/10 underline-offset-4">2.5 Información agregada y disociada</h3>
                    <p>IUDEX puede generar información agregada y/o disociada a partir de datos personales, de manera que no permita identificar a una persona titular. IUDEX podrá utilizar dicha información para fines estadísticos, analíticos, de investigación, mejora de productos, soporte y operación del negocio. IUDEX no intentará reidentificar la información disociada, salvo que una disposición legal aplicable lo exija.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">3. Cómo Utilizamos sus Datos Personales</h2>
                <div className="space-y-6">
                  <p>IUDEX utiliza los datos personales que recaba para las finalidades descritas a continuación. Para efectos de claridad, distinguimos entre finalidades primarias (necesarias para la existencia, mantenimiento y cumplimiento de la relación jurídica con usted o con el Suscriptor) y finalidades secundarias (no necesarias para dicha relación, típicamente relacionadas con mercadotecnia, publicidad y prospección comercial). En su caso, el tratamiento se realizará conforme a este Aviso y a las disposiciones aplicables.</p>
                  
                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">3.1 Finalidades primarias (necesarias para el Servicio)</h3>
                    <p className="mb-2 text-sm italic">IUDEX podrá tratar sus datos personales para:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li>Proveer, operar, administrar, mantener y mejorar los Servicios, incluyendo el alta, configuración y administración de cuentas y usuarios.</li>
                      <li>Gestionar autenticación, control de acceso y administración de credenciales, así como recordar preferencias de uso dentro de los Servicios.</li>
                      <li>Brindar soporte técnico y atención al cliente, dar seguimiento a solicitudes, aclaraciones, quejas o comentarios.</li>
                      <li>Facturación y cobro de los Servicios, cuando resulte aplicable (incluyendo la administración de pagos y prevención de contracargos o fraudes).</li>
                      <li>Seguridad de la información y continuidad operativa, incluyendo monitoreo, auditoría, prevención, detección e investigación de actividades irregulares o uso indebido; así como protección de infraestructura, redes, sistemas y activos de IUDEX.</li>
                      <li>Cumplimiento de obligaciones legales y atención de requerimientos de autoridad competente, así como el ejercicio o defensa de derechos de IUDEX en procedimientos administrativos o jurisdiccionales.</li>
                      <li>Administración de la relación comercial con Suscriptores, incluyendo comunicaciones operativas relacionadas con el servicio (por ejemplo, avisos de seguridad, confirmaciones, cambios técnicos relevantes o notificaciones de mantenimiento).</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">3.2 Finalidades secundarias (no necesarias)</h3>
                    <p className="mb-2 text-sm italic">Adicionalmente, y en su caso, IUDEX podrá tratar sus datos personales para:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li>Enviar comunicaciones de mercadotecnia, prospección comercial o publicidad sobre productos, servicios, eventos, contenidos y novedades de IUDEX.</li>
                      <li>Realizar analítica comercial y segmentación para identificar intereses profesionales y mejorar la pertinencia de comunicaciones.</li>
                      <li>Medir la efectividad de campañas y publicidad, incluyendo publicidad basada en intereses, cuando ésta se implemente.</li>
                    </ul>
                    <p className="mt-4"><strong>Mecanismo para limitar el uso o divulgación respecto de finalidades secundarias.</strong> Si usted no desea que sus datos personales sean tratados para finalidades secundarias, o desea dejar de recibir comunicaciones de mercadotecnia, puede solicitarlo en cualquier momento escribiendo a contacto@iudex.com. La negativa o revocación correspondiente no será motivo para negar la prestación de los Servicios ni para terminar la relación con IUDEX o con el Suscriptor, en la medida en que dichas finalidades no sean necesarias.</p>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">3.3 Tratamiento para seguridad, integridad y prevención de abuso</h3>
                    <p className="mb-2 text-sm italic">En atención a la naturaleza tecnológica de los Servicios, IUDEX podrá utilizar datos personales y datos técnicos (por ejemplo, datos de registro y uso) para:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li>Verificar identidad y proteger cuentas, prevenir accesos no autorizados y uso indebido;</li>
                      <li>Detectar, investigar y mitigar incidentes de seguridad, incluyendo actividades potencialmente fraudulentas o contrarias a los Términos aplicables; y</li>
                      <li>Mantener la integridad y disponibilidad de los Servicios, incluyendo diagnóstico de fallas, soporte y mantenimiento.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">3.4 Aclaración sobre “Contenido” y uso de información pública</h3>
                    <p><strong>a) Contenido de Suscriptores.</strong> El tratamiento de datos personales que, en su caso, se encuentren dentro del Contenido se realizará en los términos previstos en la Sección 1 y en el Contrato de Suscripción aplicable. IUDEX no utilizará el Contenido para fines de mercadotecnia dirigidos al titular.</p>
                    <p className="mt-2"><strong>b) Información disponible públicamente.</strong> Cuando IUDEX utilice información disponible públicamente (por ejemplo, legislación, criterios jurisdiccionales o documentos de acceso público) para fines de desarrollo, mejora o pruebas de funcionalidades, lo hará de manera compatible con la naturaleza pública de la fuente. En caso de que dicha información contenga datos personales, IUDEX procurará, cuando sea razonablemente posible, minimizar el tratamiento de datos identificables.</p>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">3.5 No venta de datos personales</h3>
                    <p>IUDEX no vende datos personales. Cualquier compartición con terceros (por ejemplo, proveedores de analítica, publicidad o redes sociales) se realiza conforme a lo previsto en la Sección 4 (Con quién compartimos sus datos personales), para finalidades específicas y bajo obligaciones contractuales de confidencialidad y seguridad, según corresponda.</p>
                    <p className="mt-4">La base legal para el procesamiento de sus datos personales varía según el propósito específico:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li><strong>Ejecución del contrato:</strong> Procesamos sus datos cuando es necesario para cumplir con nuestro contrato con usted o su empleador, como para proporcionar los Servicios, gestionar su cuenta y comunicarnos con usted sobre el servicio.</li>
                      <li><strong>Interés legítimo:</strong> En ciertos casos, procesamos sus datos basándonos en nuestro interés legítimo, como para mejorar nuestros Servicios, garantizar la seguridad de la información, realizar análisis de datos para desarrollo de productos, y protegernos de reclamaciones legales. Siempre nos aseguramos de que nuestros intereses legítimos estén equilibrados con sus derechos y libertades.</li>
                      <li><strong>Consentimiento:</strong> Para ciertas actividades, como el envío de comunicaciones de marketing directo, solicitamos su consentimiento explícito. Usted puede retirar su consentimiento en cualquier momento.</li>
                      <li><strong>Cumplimiento legal:</strong> Procesamos sus datos cuando es necesario para cumplir con nuestras obligaciones legales.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">4. Con Quién Compartimos sus Datos Personales</h2>
                <div className="space-y-4">
                  <p>IUDEX podrá compartir sus datos personales únicamente en los supuestos que se describen a continuación, en la medida necesaria para la operación de los Servicios, el cumplimiento de obligaciones legales y las finalidades previstas en este Aviso. Cuando compartimos datos personales, procuramos implementar medidas razonables para que dichos terceros los traten con confidencialidad y seguridad, conforme a la relación jurídica aplicable.</p>
                  <p><strong>4.1 Afiliadas y empresas relacionadas.</strong> Podemos compartir datos personales con nuestras afiliadas o empresas del mismo grupo corporativo, cuando sea necesario para: (i) operar y mejorar los Servicios, (ii) centralizar funciones administrativas (por ejemplo, facturación, soporte, auditoría o seguridad), y (iii) cumplir obligaciones legales y corporativas.</p>
                  <p><strong>4.2 Proveedores que prestan servicios a IUDEX (encargados).</strong> Podemos compartir datos personales con proveedores que nos apoyan en la operación de los Servicios (por ejemplo: alojamiento de infraestructura, almacenamiento, mensajería y correo, soporte, analítica, monitoreo de seguridad, prevención de fraude, facturación, cobranza y herramientas internas), quienes tratarán los datos personales por cuenta de IUDEX y únicamente conforme a nuestras instrucciones, para las finalidades previstas en este Aviso.</p>
                  <p><strong>4.3 Suscriptores (clientes empresariales) y administración de cuentas.</strong> Cuando su acceso a los Servicios sea proporcionado por un Suscriptor (por ejemplo, su empleador o una organización que administra su cuenta), IUDEX podrá compartir con dicho Suscriptor información relacionada con la administración de usuarios y licencias, el estado de la cuenta, métricas operativas del uso del Servicio y eventos de seguridad (por ejemplo, accesos inusuales), en la medida necesaria para: (i) habilitar el acceso, (ii) administrar cuentas, (iii) brindar soporte, (iv) asegurar el cumplimiento del Contrato de Suscripción, y (v) mantener la seguridad del entorno.</p>
                  <p><strong>4.4 Redes sociales, publicidad y medición (cuando aplique).</strong> Cuando IUDEX implemente herramientas de terceros para medición, analítica o publicidad, podremos compartir con dichos terceros información técnica y de interacción (por ejemplo, identificadores de cookies, dirección IP, identificadores del dispositivo o eventos de navegación), con el propósito de medir el desempeño, mejorar el Servicio y, en su caso, mostrar contenidos o publicidad relevante.</p>
                  <p className="mt-4">Cuando corresponda, IUDEX pondrá a su disposición mecanismos para configurar sus preferencias respecto del uso de cookies y tecnologías similares, conforme a lo descrito en la Sección 2 (Cookies y tecnologías similares).</p>
                  <p><strong>4.5 Asesores profesionales.</strong> Podemos compartir datos personales con asesores profesionales (por ejemplo, auditores, contadores y asesores legales) cuando sea razonablemente necesario para: (i) la operación del negocio, (ii) el cumplimiento regulatorio, o (iii) el ejercicio o defensa de derechos de IUDEX.</p>
                  <p><strong>4.6 Autoridades y cumplimiento legal.</strong> Podemos divulgar datos personales a autoridades competentes cuando exista un requerimiento legal, mandamiento u orden de autoridad, o cuando sea necesario para: (i) cumplir obligaciones legales, (ii) responder a solicitudes debidamente fundadas y motivadas, (iii) proteger la seguridad e integridad de los Servicios, o (iv) ejercer o defender derechos de IUDEX en procedimientos administrativos o judiciales.</p>
                  <p><strong>4.7 Operaciones corporativas (fusión, adquisición o reestructura).</strong> En caso de que IUDEX participe en una fusión, adquisición, reestructura, financiamiento, venta de activos o transacción similar, podremos compartir datos personales con potenciales contrapartes, asesores y terceros involucrados, exclusivamente para fines de evaluación, debida diligencia y ejecución de la transacción, y sujeto a obligaciones de confidencialidad. En su caso, si la transacción se concreta y ello implica un cambio de responsable, IUDEX adoptará medidas razonables para comunicarlo conforme a la Sección 11 (Actualizaciones).</p>
                  <p><strong>4.8 Transferencias internacionales.</strong> Algunos de los terceros descritos en esta Sección pueden ubicarse fuera de México o utilizar infraestructura fuera de México. En esos casos, la transferencia internacional se realizará conforme a lo previsto en la Sección 6 (Transferencias Internacionales de Datos).</p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">5. Cómo Protegemos sus Datos Personales</h2>
                <div className="space-y-6">
                  <p>IUDEX implementa medidas de seguridad administrativas, técnicas y físicas razonables y proporcionales para proteger sus datos personales contra daño, pérdida, alteración, destrucción, uso, acceso o tratamiento no autorizado. Estas medidas se aplican considerando la naturaleza de los datos personales tratados, los riesgos asociados al tratamiento y el estado de la tecnología.</p>
                  <p>En particular, IUDEX podrá implementar, entre otras, las siguientes prácticas y controles:</p>
                  
                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">5.1 Medidas administrativas</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li>Políticas y procedimientos internos orientados a la protección de datos personales, confidencialidad y seguridad de la información.</li>
                      <li>Control de accesos con base en roles y necesidad de conocer (principio de privilegio mínimo).</li>
                      <li>Capacitación y concientización del personal con acceso a datos personales.</li>
                      <li>Gestión de proveedores que puedan tratar datos personales, incorporando obligaciones de confidencialidad, seguridad y cumplimiento aplicable en los contratos correspondientes.</li>
                      <li>Gobernanza y supervisión mediante responsables internos y procesos de revisión periódica.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">5.2 Medidas técnicas</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li>Cifrado y/o mecanismos de protección equivalentes para datos en tránsito y, cuando corresponda, en reposo.</li>
                      <li>Registro y monitoreo de eventos relevantes para la seguridad (por ejemplo, accesos, cambios de configuración, intentos fallidos).</li>
                      <li>Segmentación y aislamiento de entornos, cuando sea aplicable, para minimizar el riesgo de acceso entre cuentas u organizaciones.</li>
                      <li>Respaldo y recuperación para continuidad operativa, así como mecanismos de restauración ante incidentes.</li>
                      <li>Pruebas y evaluaciones razonables (por ejemplo, revisión de vulnerabilidades) para mejorar la postura de seguridad.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">5.3 Medidas físicas</h3>
                    <p>Controles físicos razonables en instalaciones propias o de terceros (por ejemplo, centros de datos) para proteger infraestructura, equipos y soportes que puedan contener datos personales.</p>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">5.4 Limitaciones y responsabilidad del usuario</h3>
                    <p>Aunque IUDEX adopta medidas de seguridad razonables, ningún sistema es completamente infalible. Por ello, usted también debe contribuir a la seguridad de su información, incluyendo:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li>mantener la confidencialidad de sus credenciales,</li>
                      <li>utilizar contraseñas robustas y, cuando esté disponible, autenticación multifactor,</li>
                      <li>cerrar sesión en dispositivos compartidos, y</li>
                      <li>notificar a IUDEX cualquier uso no autorizado de su cuenta.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">5.5 Conservación y minimización (relación con seguridad)</h3>
                    <p>IUDEX procura tratar y conservar datos personales únicamente durante el tiempo necesario para cumplir las finalidades informadas y para atender obligaciones legales, contractuales y de seguridad, conforme a la Sección 7 (Periodo de Conservación de Datos).</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">6. Transferencias Internacionales de Datos</h2>
                <div className="space-y-4">
                  <p>IUDEX podrá realizar transferencias internacionales de datos personales cuando sea necesario para operar los Servicios, utilizar infraestructura tecnológica, brindar soporte, garantizar seguridad de la información o contratar proveedores especializados. En estos casos, sus datos personales podrán ser tratados en países distintos a México, conforme a este Aviso y a las medidas contractuales y organizacionales que IUDEX adopte para su protección.</p>
                  <p>Cuando IUDEX transfiera datos personales a terceros ubicados fuera de México, procurará que dichas transferencias se realicen:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm italic">
                    <li>para finalidades compatibles con las descritas en este Aviso;</li>
                    <li>con medidas de seguridad razonables y proporcionales a los riesgos del tratamiento; y</li>
                    <li>bajo obligaciones de confidencialidad y restricciones de uso, a través de los instrumentos contractuales aplicables con proveedores y aliados.</li>
                  </ul>
                  <p>Asimismo, cuando la transferencia internacional implique la intervención de proveedores que actúen por cuenta de IUDEX (por ejemplo, servicios de nube, analítica, mensajería, soporte o monitoreo), IUDEX procurará establecer condiciones para que esos terceros traten los datos personales únicamente conforme a instrucciones y para las finalidades previstas en este Aviso.</p>
                  <p>Si usted desea información adicional sobre transferencias internacionales relacionadas con su cuenta o con el uso de los Servicios, podrá solicitarla a través del correo indicado en la Sección 12 (Información de Contacto).</p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">7. Periodo de Conservación de Datos</h2>
                <div className="space-y-6">
                  <p>IUDEX conserva sus datos personales únicamente durante el tiempo que sea necesario para cumplir con las finalidades descritas en este Aviso, incluyendo la prestación de los Servicios, el cumplimiento de obligaciones legales, contractuales, contables y fiscales, así como para el ejercicio o defensa de derechos en procedimientos administrativos o judiciales.</p>
                  
                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">7.1 Criterios generales de conservación</h3>
                    <p>El periodo de conservación puede variar según:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li>Tipo de dato personal (por ejemplo, datos de cuenta vs. datos de facturación vs. registros de seguridad).</li>
                      <li>Finalidad para la cual se recabó y utiliza el dato.</li>
                      <li>Naturaleza de la relación (usuario final, administrador del Suscriptor, prospecto, cliente, proveedor).</li>
                      <li>Obligaciones legales aplicables (fiscales, mercantiles, administrativas, o requerimientos de autoridad competente).</li>
                      <li>Necesidades de seguridad (p. ej., investigación de incidentes, prevención de abuso, auditorías).</li>
                      <li>Plazos de prescripción para reclamaciones, quejas o controversias (contractuales o extracontractuales).</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">7.2 Conservación durante la relación y posterior a su terminación</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li><strong>Durante la vigencia de la cuenta o del Contrato de Suscripción:</strong> IUDEX conservará los datos personales necesarios para operar la cuenta, administrar accesos, prestar soporte y mantener la seguridad del Servicio.</li>
                      <li><strong>Posterior a la terminación:</strong> IUDEX podrá conservar ciertos datos personales por un periodo adicional cuando ello sea necesario para:
                        <ul className="list-disc pl-6 mt-2">
                          <li>cumplir obligaciones legales;</li>
                          <li>atender auditorías y obligaciones de rendición de cuentas;</li>
                          <li>mantener evidencias de transacciones, facturación o pagos (cuando aplique);</li>
                          <li>prevenir fraude o abuso y proteger la integridad del Servicio; y/o</li>
                          <li>ejercer o defender derechos de IUDEX en controversias.</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">7.3 Eliminación, anonimización o bloqueo</h3>
                    <p className="mb-2 text-sm italic">Cuando deje de ser necesario conservar datos personales para las finalidades informadas, IUDEX adoptará medidas razonables para:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li>eliminarlos de forma segura, o</li>
                      <li>anonimizarlos/disociarlos para que no permitan identificar al titular, o</li>
                      <li>bloquearlos o restringirlos (cuando sea aplicable) limitando su tratamiento a finalidades de cumplimiento, auditoría o defensa de derechos.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">7.4 Conservación del “Contenido” de Suscriptores (dato clave para SaaS)</h3>
                    <p className="mb-2">Cuando IUDEX trate datos personales contenidos en el Contenido (según se define en la Sección 1), los plazos y reglas de conservación estarán principalmente determinados por el Contrato de Suscripción y las instrucciones del Suscriptor (responsable). En particular:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                      <li>IUDEX podrá conservar respaldos y registros necesarios para continuidad y seguridad durante ventanas razonables de operación.</li>
                      <li>A la terminación del servicio, IUDEX podrá eliminar o devolver el Contenido conforme a lo pactado contractualmente, y conservar únicamente lo estrictamente indispensable para cumplimiento legal, auditoría y defensa de derechos.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">8. Sus Derechos</h2>
                <div className="space-y-6">
                  <p>Usted tiene varios derechos en relación con el control de sus datos personales y para recibir información directamente de nosotros sobre cómo procesamos sus datos. A continuación, puede leer sobre sus derechos:</p>
                  <ul className="list-disc pl-6 space-y-4 text-sm italic">
                    <li><strong>Derecho de acceso:</strong> Tiene derecho a solicitar información sobre si estamos procesando sus datos personales y a recibir una copia de los mismos.</li>
                    <li><strong>Derecho de rectificación:</strong> Si considera que sus datos personales son inexactos o incompletos, tiene derecho a solicitar que se corrijan o completen.</li>
                    <li><strong>Derecho de supresión:</strong> En ciertos casos, tiene derecho a que eliminemos sus datos personales. Por ejemplo, cuando los datos ya no sean necesarios para el propósito para el cual fueron recopilados, o cuando retire su consentimiento. Existen situaciones en las que IUDEX no puede eliminar sus datos, por ejemplo, cuando los datos siguen siendo necesarios para el propósito para el cual fueron recopilados, o porque tenemos una obligación legal de conservarlos.</li>
                    <li><strong>Derecho de limitación del tratamiento:</strong> Si considera que sus datos personales son inexactos, que nuestro procesamiento es ilegal o que no necesitamos la información para un propósito específico, tiene derecho a solicitar que limitemos el procesamiento de dichos datos.</li>
                    <li><strong>Derecho de oposición:</strong> Tiene derecho a oponerse al procesamiento de sus datos personales que se basa en nuestro interés legítimo, haciendo referencia a sus circunstancias personales. También puede oponerse en cualquier momento al procesamiento de sus datos personales con fines de marketing directo.</li>
                    <li><strong>Derecho a la portabilidad de datos:</strong> Si procesamos sus datos personales para cumplir un contrato o con base en su consentimiento, puede, en ciertos casos, obtener los datos personales en un formato legible por máquina y transmitirlos a otro responsable del tratamiento.</li>
                    <li><strong>Derecho a retirar el consentimiento:</strong> En aquellos casos en los que procesamos sus datos personales con base en su consentimiento, tiene derecho a retirar su consentimiento en cualquier momento.</li>
                    <li><strong>Derecho a presentar una reclamación:</strong> Si tiene objeciones o inquietudes sobre cómo procesamos sus datos personales, tiene derecho a contactar o presentar una reclamación ante la autoridad competente en materia de protección de datos.</li>
                    <li><strong>Derecho a revocar la autorización para tratamiento de datos sensibles:</strong> Cuando corresponda, usted tiene derecho a revocar su autorización para el tratamiento de datos personales sensibles.</li>
                  </ul>
                  <p>Para ejercer sus derechos, contáctenos en cualquier momento. Nos reservamos el derecho de limitar el cumplimiento de dichas solicitudes a lo que exige la ley aplicable.</p>
                  <p>Para proteger sus datos personales del acceso o eliminación no autorizados, podemos requerirle que verifique su identidad antes de procesar cualquier solicitud. Si no podemos verificar su identidad satisfactoriamente, no proporcionaremos ni eliminaremos sus datos personales.</p>
                  <p>Tenga la seguridad de que no lo discriminaremos por realizar dichas solicitudes. Su derecho a acceder y eliminar sus datos personales es importante para nosotros, y tomaremos medidas razonables para verificar y procesar su solicitud con prontitud.</p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">9. Datos de Menores de Edad</h2>
                <p>Nuestros sitios web y Servicios no están dirigidos a menores de 18 años. IUDEX no recopila intencionalmente Datos Personales de menores de 18 años. Si tiene motivos para creer que un menor de 18 años ha proporcionado Datos Personales a IUDEX a través de nuestros Servicios, por favor envíenos un correo electrónico a contacto@iudex.com y nos esforzaremos por eliminar esa información de nuestros sistemas.</p>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">10. Disposiciones Específicas por Jurisdicción</h2>
                <div className="space-y-6">
                  <p>Sin perjuicio de cualquier disposición en contrario en esta Política, en México, únicamente recopilaremos, usaremos y divulgaremos información sobre usted de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares ("LFPDPPP") y su Reglamento.</p>
                  <p>Conforme a la LFPDPPP, usted tiene los derechos ARCO (Acceso, Rectificación, Cancelación y Oposición):</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm italic">
                    <li><strong>Acceso:</strong> Derecho a conocer qué Datos Personales tenemos sobre usted y para qué los utilizamos.</li>
                    <li><strong>Rectificación:</strong> Derecho a solicitar la corrección de sus Datos Personales cuando sean inexactos o incompletos.</li>
                    <li><strong>Cancelación:</strong> Derecho a solicitar la eliminación de sus Datos Personales de nuestros registros o bases de datos cuando considere que no están siendo tratados conforme a los principios, deberes y obligaciones aplicables.</li>
                    <li><strong>Oposición:</strong> Derecho a oponerse al tratamiento de sus Datos Personales para fines específicos.</li>
                  </ul>
                  <p className="mt-2">Adicionalmente, usted tiene derecho a revocar el consentimiento que nos haya otorgado para el tratamiento de sus Datos Personales, así como a limitar el uso o divulgación de sus datos.</p>
                  <p>Para ejercer cualquiera de estos derechos, puede presentar una solicitud por escrito a nuestro Oficial de Protección de Datos a través del correo electrónico indicado en la sección de contacto. Su solicitud deberá contener:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm italic">
                    <li>Nombre completo y domicilio u otro medio para comunicarle la respuesta.</li>
                    <li>Documentos que acrediten su identidad o la representación legal.</li>
                    <li>Descripción clara y precisa de los Datos Personales respecto de los cuales busca ejercer alguno de los derechos.</li>
                    <li>Cualquier otro elemento que facilite la localización de los Datos Personales.</li>
                  </ul>
                  <p>Responderemos a su solicitud en un plazo máximo de 20 días hábiles contados desde la fecha de recepción.</p>
                  
                  <div className="mt-8">
                    <h3 className="text-black text-sm mb-3 font-bold uppercase tracking-widest">Otros países de Latinoamérica</h3>
                    <p>Si usted se encuentra en otros países de Latinoamérica, procesaremos sus Datos Personales de conformidad con las leyes de protección de datos aplicables en su jurisdicción. Los derechos específicos pueden variar según su país de residencia, pero generalmente incluyen derechos similares de acceso, rectificación, supresión y oposición.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">11. Actualizaciones a esta Política de Privacidad</h2>
                <p>Podemos actualizar esta Política de Privacidad periódicamente en respuesta a desarrollos legales, regulatorios, técnicos o comerciales cambiantes. Cuando actualicemos nuestra Política, tomaremos las medidas apropiadas para informarle, de manera consistente con la importancia de los cambios que realicemos.</p>
                <p className="mt-2 text-xs italic">Puede ver cuándo se actualizó esta Política por última vez verificando la fecha de "última actualización" que se muestra en la parte superior de esta Política.</p>
              </section>

              <section className="bg-black/5 p-8 rounded-3xl border border-black/5">
                <h2 className="text-black font-bold uppercase tracking-[0.2em] text-[10px] mb-6">12. Información de Contacto</h2>
                <div className="space-y-4">
                  <p className="text-xs text-black/60 font-light mb-4">Si tiene alguna pregunta o inquietud sobre nuestro uso de sus Datos Personales, o si desea ejercer cualquiera de sus derechos de privacidad, por favor contáctenos utilizando los siguientes datos:</p>
                  <p className="text-xs uppercase tracking-widest text-black/40 font-bold">Información de contacto del Responsable:</p>
                  <p className="text-sm font-bold">TARNIX TECHNOLOGIES, S.A. de C.V.</p>
                  <div className="pt-4 border-t border-black/5">
                    <p className="text-xs mb-2">Correo electrónico:</p>
                    <a href="mailto:contacto@iudex.com" className="text-black font-medium hover:underline tracking-widest text-sm">contacto@iudex.com</a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
          

      {showTerms && (
        <div className="fixed inset-0 z-[1000] bg-white overflow-y-auto animate-in fade-in duration-500 selection:bg-black/5">
          <header className={`fixed top-0 left-0 right-0 z-[1001] bg-white px-8 py-6`}>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <button 
                onClick={() => { setShowTerms(false); window.scrollTo(0,0); }}
                className="flex items-center gap-3 group text-xs uppercase tracking-[0.2em] font-medium"
              >
                <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <ArrowRight size={14} className="rotate-180" />
                </div>
                <span>Volver al inicio</span>
              </button>
              <img src="/images/logo.png" alt="IUDEX" className="h-10 w-auto" />
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-8 pt-48 pb-64">
            <div className="mb-24">

              <h1 className="text-6xl font-light tracking-tight mb-8">Términos y <span className="text-black/40">Condiciones de Uso</span></h1>
              <div className="flex items-center gap-4 text-black/50 text-sm">
                <div className="w-6 h-[1px] bg-black/20" />
                <span>Fecha de vigencia: 26 de marzo de 2026</span>
              </div>
            </div>

            <div className="space-y-12 text-black/70 leading-relaxed text-justify privacy-content">
                            <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">Preámbulo</h2>
                <div className="space-y-4">
                  <p>
                    El presente documento establece las condiciones que rigen el acceso y utilización de los servicios digitales ofrecidos a través de IUDEX (en lo sucesivo, "el Servicio" o "la Aplicación"). La utilización del Servicio implica la manifestación expresa de voluntad del Usuario de sujetarse a las presentes estipulaciones, en términos de lo previsto por los artículos 1803 y 1807 del Código Civil Federal, relativos al consentimiento y la forma de los contratos celebrados por medios electrónicos.
                  </p>
                  <p>
                    Quien no manifieste su conformidad con estas disposiciones deberá abstenerse de acceder o utilizar el Servicio. La continuación en el uso posterior a cualquier actualización de este instrumento se entenderá como ratificación tácita de los términos modificados.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">I. Naturaleza y Alcance del Servicio</h2>
                <div className="space-y-4">
                  <p>
                    IUDEX constituye una solución tecnológica basada en inteligencia artificial que ofrece capacidades de investigación en materia jurídica, procesamiento y análisis documental, y funcionalidades de asistencia para la elaboración de textos legales.
                  </p>
                  <p>
                    El Servicio opera exclusivamente como herramienta auxiliar de trabajo. Bajo ninguna circunstancia los resultados producidos por la Aplicación deben interpretarse como opinión jurídica profesional, dictamen legal o sustituto del juicio de un abogado debidamente habilitado. El Usuario asume íntegramente la obligación de validar, contrastar y verificar cualquier información o contenido generado antes de emplearlo para propósitos profesionales o en procedimientos de cualquier índole.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">II. Creación de Cuenta y Obligaciones del Usuario</h2>
                <div className="space-y-4">
                  <p>
                    El acceso pleno a las funcionalidades del Servicio requiere la creación de una cuenta mediante el registro de datos que deberán ser verídicos, precisos y mantenerse actualizados, de conformidad con las obligaciones de información previstas en la Ley Federal de Protección al Consumidor.
                  </p>
                  <p>El Usuario asume las siguientes responsabilidades:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Preservar la confidencialidad de sus claves de acceso y credenciales de autenticación.</li>
                    <li>Supervisar y responder por toda actividad ejecutada desde su cuenta, independientemente de que haya sido realizada por el titular o por terceros.</li>
                    <li>Comunicar de manera inmediata a IUDEX cualquier incidente de seguridad, acceso indebido o sospecha de vulneración de su cuenta.</li>
                    <li>No compartir, ceder ni permitir el uso de su cuenta por personas no autorizadas.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">III. Régimen de Propiedad Intelectual</h2>
                <div className="space-y-4">
                  <p>
                    <strong>Titularidad del Servicio:</strong> La totalidad de los elementos que componen la Aplicación —incluyendo de manera enunciativa mas no limitativa: código fuente, modelos algorítmicos, arquitectura de software, elementos gráficos, interfaces, denominaciones comerciales y contenidos propietarios— pertenecen en exclusiva a IUDEX o a terceros que han otorgado las licencias correspondientes. Dichos elementos se encuentran amparados por la legislación mexicana en materia de derechos de autor y propiedad industrial.
                  </p>
                  <p>
                    <strong>Titularidad del Usuario:</strong> Los trabajos, análisis, documentos y demás materiales que el Usuario genere mediante la utilización del Servicio (denominados "Productos del Usuario") son y permanecerán siendo propiedad del Usuario, quien podrá disponer de ellos libremente para sus actividades profesionales. Se hace constar que determinados Productos del Usuario pueden incorporar información proveniente de repositorios externos cuya titularidad corresponde a terceros y no se ve modificada por su procesamiento a través del Servicio.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">IV. Tratamiento de Información Personal y Confidencialidad</h2>
                <div className="space-y-4">
                  <p>
                    La recopilación, almacenamiento y procesamiento de datos personales se efectúa con estricto apego a nuestra Política de Privacidad y a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su Reglamento.
                  </p>
                  <p>
                    La información que el Usuario proporcione, cargue o genere dentro de la Aplicación —comprendiendo archivos, consultas, instrucciones y cualquier otro dato ingresado— (denominada "Información del Usuario") mantiene su carácter de propiedad del Usuario.
                  </p>
                  <p>
                    IUDEX ha implementado controles de seguridad de naturaleza técnica, organizacional y física orientados a salvaguardar la Información del Usuario frente a accesos no autorizados, pérdida accidental, alteración indebida o destrucción. El Usuario reconoce que la elección de parámetros de almacenamiento distintos a los predeterminados para su región puede incidir en el desempeño o disponibilidad del Servicio.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">V. Lineamientos de Conducta</h2>
                <div className="space-y-4">
                  <p>El Usuario se obliga a emplear el Servicio de manera lícita, ética y conforme a la normatividad aplicable. Se consideran conductas prohibidas, de manera enunciativa:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Destinar el Servicio a finalidades contrarias a la ley, constitutivas de fraude o lesivas de derechos de terceros.</li>
                    <li>Procurar acceso a sistemas, bases de datos, información o secciones del Servicio para los cuales no cuente con autorización.</li>
                    <li>Copiar, distribuir, alterar, sublicenciar o comercializar elementos del Servicio sin consentimiento expreso y por escrito.</li>
                    <li>Cargar, transmitir o ejecutar software malicioso, virus informáticos o cualquier código diseñado para interferir con el funcionamiento del sistema.</li>
                    <li>Ejecutar procesos de ingeniería inversa, descompilación o extracción del código fuente.</li>
                    <li>Realizar acciones que comprometan la estabilidad, seguridad o capacidad de los servidores.</li>
                    <li>Hacerse pasar por otra persona física o moral.</li>
                    <li>Emplear el Servicio como medio para el envío de comunicaciones masivas no solicitadas.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">VI. Esquemas de Contratación y Facturación</h2>
                <div className="space-y-4">
                  <p>
                    Los servicios sujetos a contraprestación se regirán por las especificaciones particulares del plan seleccionado, disponibles en el apartado correspondiente de la Aplicación. El procesamiento de pagos se realiza mediante proveedores certificados que observan los estándares de seguridad de la industria.
                  </p>
                  <p>En observancia a la legislación de protección al consumidor, el Usuario tiene derecho a:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Conocer anticipadamente el costo íntegro de los servicios, con desglose de cargos aplicables.</li>
                    <li>Obtener comprobante fiscal por cada operación realizada.</li>
                    <li>Acceder a información detallada sobre las características y limitaciones del plan adquirido.</li>
                    <li>Solicitar la baja del servicio en el momento que lo determine.</li>
                  </ul>
                  <p>La renovación de suscripciones opera de forma automática al concluir cada ciclo de facturación. El Usuario que solicite cancelación conservará acceso hasta la conclusión del período previamente liquidado.</p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">VII. Política sobre Devoluciones</h2>
                <div className="space-y-4">
                  <p>
                    Considerando que IUDEX pone a disposición de los interesados un período de evaluación sin costo que permite conocer las funcionalidades del Servicio, no se efectuarán reembolsos una vez procesado el cargo correspondiente a cualquier modalidad de suscripción.
                  </p>
                  <p>
                    Al formalizar la contratación de un plan de pago, el Usuario manifiesta haber aprovechado la oportunidad de evaluar el Servicio y acepta de manera expresa esta política.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">VIII. Características Especiales del Servicio</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">VIII.1. Consulta de Fuentes Externas</h3>
                    <p>Determinadas funcionalidades permiten ejecutar búsquedas en repositorios específicos, como sitios web de acceso público, bases de datos especializadas o archivos proporcionados por el propio Usuario. Al utilizar estas capacidades, la Aplicación puede generar vínculos a recursos externos relevantes. Para la operación de estas funcionalidades, IUDEX puede recurrir a proveedores especializados cuyo detalle se publica en nuestra documentación de cumplimiento. El Usuario acepta que dichos proveedores pueden procesar información en ubicaciones geográficas distintas a la región principal de procesamiento.</p>
                  </div>
                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">VIII.2. Funcionalidades Experimentales</h3>
                    <div className="space-y-3">
                      <p>Periódicamente, IUDEX puede habilitar características en fase de desarrollo, versiones beta o acceso anticipado a nuevas capacidades. La participación en estas funcionalidades es voluntaria y se sujeta a las siguientes condiciones:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Se proporcionan sin garantía alguna, en su estado actual y según disponibilidad.</li>
                        <li>Pueden ser modificadas sustancialmente o descontinuadas sin previo aviso.</li>
                        <li>El Usuario participa bajo su exclusiva responsabilidad.</li>
                        <li>Los comentarios y sugerencias proporcionados podrán ser utilizados para el perfeccionamiento del Servicio.</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-black text-sm mb-3 font-bold">VIII.3. Entornos de Trabajo Colaborativo</h3>
                    <div className="space-y-3">
                      <p>El Servicio puede incluir funcionalidades que permiten establecer espacios de colaboración donde múltiples usuarios comparten documentos, flujos de trabajo y contenidos. Cuando el Usuario participa en un entorno administrado por otro cliente:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>El administrador del espacio determina los controles de acceso, permisos, configuraciones de almacenamiento y políticas de retención aplicables.</li>
                        <li>Los participantes pueden visualizar, modificar y exportar contenidos conforme a los permisos que les sean asignados.</li>
                        <li>La información cargada y generada en dicho entorno se considera bajo la administración del cliente propietario del espacio.</li>
                      </ul>
                      <p>El Usuario es responsable de verificar la idoneidad de los colaboradores conforme a sus políticas internas, así como de contar con las autorizaciones necesarias respecto de cualquier información que comparta o reciba en contextos de colaboración.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">IX. Exclusión y Limitación de Responsabilidad</h2>
                <div className="space-y-4">
                  <p>
                    El Servicio se proporciona en su estado actual, sin garantías de ninguna especie respecto a disponibilidad ininterrumpida, ausencia de errores, seguridad absoluta o satisfacción de expectativas particulares del Usuario.
                  </p>
                  <p>Dentro del marco permitido por la legislación vigente:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>IUDEX no responderá por perjuicios indirectos, incidentales, especiales, emergentes o de carácter punitivo, incluyendo pero sin limitarse a lucro cesante, pérdida de información, interrupción de actividades o daños intangibles.</li>
                    <li>No se garantiza la precisión, exhaustividad o vigencia de la información procesada o generada mediante el Servicio.</li>
                    <li>IUDEX no será responsable por las consecuencias de decisiones adoptadas por el Usuario con base en los resultados obtenidos de la Aplicación.</li>
                  </ul>
                  <p>El Usuario declara comprender que los sistemas de inteligencia artificial pueden generar resultados imprecisos, incompletos o inadecuados, asumiendo la obligación de verificar toda información antes de su utilización.</p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">X. Obligación de Indemnizar</h2>
                <p>
                  El Usuario se compromete a mantener indemne a IUDEX, sus accionistas, directivos, empleados, representantes y empresas vinculadas, respecto de cualquier reclamación, demanda, responsabilidad, costo o erogación (incluyendo gastos de defensa legal) que se origine por: (i) la forma en que el Usuario emplee el Servicio; (ii) el incumplimiento de estas disposiciones; (iii) la transgresión de derechos de terceros; o (iv) la inexactitud de la información proporcionada por el Usuario.
                </p>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">XI. Caso Fortuito y Fuerza Mayor</h2>
                <p>
                  IUDEX quedará liberada del cumplimiento de sus obligaciones cuando este resulte imposible o se vea significativamente afectado por circunstancias fuera de su control razonable, incluyendo de manera enunciativa: desastres naturales, conflictos armados, actos de terrorismo, epidemias, disposiciones gubernamentales, fallas en infraestructura de telecomunicaciones, ataques cibernéticos o interrupciones en servicios de terceros de los que dependa la operación del Servicio.
                </p>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">XII. Suspensión y Cancelación del Servicio</h2>
                <div className="space-y-4">
                  <p>IUDEX podrá restringir, suspender o dar por terminado el acceso del Usuario, de forma temporal o definitiva, cuando se actualice cualquiera de los siguientes supuestos:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Contravención a las disposiciones contenidas en este instrumento.</li>
                    <li>Utilización abusiva, fraudulenta o contraria a la buena fe.</li>
                    <li>Incumplimiento en las obligaciones de pago.</li>
                    <li>Petición expresa del Usuario.</li>
                    <li>Requerimientos de seguridad, mantenimiento correctivo o implementación de mejoras.</li>
                  </ul>
                  <p>La terminación del servicio conlleva la pérdida de acceso a la cuenta y a la información almacenada, salvo acuerdo específico en contrario que prevea mecanismos de exportación de datos.</p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">XIII. Actualizaciones a este Documento</h2>
                <div className="space-y-4">
                  <p>
                    IUDEX se reserva la facultad de modificar el presente instrumento. Las actualizaciones surtirán efectos a partir de su publicación en la Aplicación. Tratándose de modificaciones sustanciales, se notificará a los Usuarios registrados mediante comunicación electrónica o aviso destacado en la plataforma.
                  </p>
                  <p>
                    La utilización del Servicio con posterioridad a la entrada en vigor de las modificaciones implica su aceptación. El Usuario que no esté conforme con los cambios deberá cesar el uso del Servicio y podrá solicitar la cancelación de su cuenta.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">XIV. Comunicaciones y Notificaciones</h2>
                <p>
                  Salvo disposición legal en contrario, las comunicaciones entre las partes se realizarán por medios electrónicos. IUDEX podrá enviar notificaciones al Usuario mediante correo electrónico a la dirección registrada en su cuenta, avisos dentro de la Aplicación o publicaciones en el sitio web oficial. El Usuario es responsable de mantener actualizada su información de contacto.
                </p>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">XV. Estipulaciones Finales</h2>
                <ul className="list-disc pl-6 space-y-4 text-sm">
                  <li><strong>Divisibilidad:</strong> La invalidez o inaplicabilidad de cualquier cláusula de este instrumento, declarada por autoridad competente, no afectará la vigencia y exigibilidad de las restantes disposiciones.</li>
                  <li><strong>Prohibición de cesión:</strong> El Usuario no podrá ceder, transferir ni sublicenciar los derechos u obligaciones derivados de este instrumento sin autorización previa y por escrito. IUDEX podrá realizar cesiones sin restriction alguna.</li>
                  <li><strong>Naturaleza de la relación:</strong> Este instrumento no establece ni debe interpretarse como constitutivo de relación laboral, sociedad, asociación en participación, mandate ni franquicia entre las partes.</li>
                  <li><strong>No renuncia:</strong> La tolerancia o falta de ejercicio oportuno de cualquier derecho por parte de IUDEX no implica renuncia al mismo ni impedimento para su ejercicio posterior.</li>
                  <li><strong>Integridad del acuerdo:</strong> Este documento, conjuntamente con la Política de Privacidad y demás instrumentos expresamente incorporados, constituye la totalidad del acuerdo entre las partes respecto del objeto aquí regulado, dejando sin efecto cualquier entendimiento, comunicación o acuerdo previo, verbal o escrito.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">XVI. Legislación Aplicable y Competencia Jurisdiccional</h2>
                <div className="space-y-4">
                  <p>
                    El presente instrumento se rige por las leyes de los Estados Unidos Mexicanos. Para la interpretación, ejecución y cumplimiento de las obligaciones aquí contenidas, así como para la resolución de cualquier controversia, las partes se someten expresamente a la jurisdicción de los tribunales competentes con sede en la Ciudad de México, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
                  </p>
                  <p>
                    Previamente al ejercicio de acciones judiciales, las partes procurarán resolver sus diferencias mediante negociación directa y de buena fe durante un plazo razonable no menor a treinta días naturales.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-black font-semibold uppercase tracking-widest text-xs mb-6 font-bold">XVII. Medios de Contacto</h2>
                <div className="space-y-4">
                  <p>Para consultas, aclaraciones o cualquier comunicación relacionada con el Servicio:</p>
                  <p>Correo electrónico: <a href="mailto:contacto@iudex.mx" className="text-black font-medium hover:underline tracking-widest text-sm">contacto@iudex.mx</a></p>
                </div>
              </section>
              
              <p className="text-center text-xs font-medium py-8 border-t border-black/5">
                Al acceder o utilizar IUDEX, el Usuario declara haber leído, comprendido y aceptado íntegramente las disposiciones contenidas en este instrumento.
              </p>
            </div>
          </div>
          
          <footer className="py-12 border-t border-black/5 bg-neutral-50 px-8 text-center text-black/30 text-xs uppercase tracking-widest">
            © 2026 TARNIX TECHNOLOGIES, S.A. de C.V. - Todos los derechos reservados.
          </footer>
        </div>
      )}

      {/* Cinematic Preloader Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-all duration-500 ${
          introComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="max-w-xs w-full px-8 text-center">
          <img 
            src="/images/preloader-logo.png" 
            alt="IUDEX Logo" 
            className={`h-16 w-auto mx-auto mb-12 transition-all duration-700 ${loadingProgress > 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          />
          <div className="relative w-full h-[1px] bg-white/10 rounded-full overflow-hidden mb-4">
            <div 
              className="absolute h-full bg-white/70" 
              style={{ 
                width: `${loadingProgress}%`,
                transition: 'width 0.12s ease-out'
              }}
            />
          </div>
          <div className="flex justify-between items-center text-white/20 text-[9px] uppercase tracking-[0.4em] font-light">
            <span>Cargando sistema</span>
            <span>{loadingProgress}%</span>
          </div>
        </div>
      </div>

      {/* Absolute Header with Logo and Menu */}
      <header className={`absolute top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-transparent'} ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between py-6 relative z-50">
          {/* Logo */}
          <a href="#hero" onClick={() => scrollToSection('hero')} className="flex items-center relative z-50 pl-5 md:pl-8">
            <img src="/images/logo.png" alt="IUDEX" className="h-14 w-auto" />
          </a>

          {/* Right side - Menu */}
          <div className="flex items-center gap-3 relative z-50 pr-5 md:pr-8">
            {/* Menu Button - Simplified Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-12 h-12 flex items-center justify-center transition-all duration-300 text-black z-[60]"
              aria-label="Menu"
            >
              {menuOpen ? <X size={32} className="text-white" /> : <Menu size={32} />}
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
                onClick={() => {
                  if (item.id === 'demo') {
                    setIsDemoModalOpen(true);
                    setMenuOpen(false);
                  } else {
                    scrollToSection(item.id);
                    setMenuOpen(false);
                  }
                }}
                className={`block text-3xl md:text-5xl font-light tracking-tight text-white hover:text-neutral-500 transition-all duration-300 ${
                  menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ 
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
        className="relative min-h-screen bg-white"
      >
        {/* Central Hero Shape - ID Large with Multi-stage Cinematic Transition */}
        <div 
          className="absolute left-1/2 top-1/2 pointer-events-none transform z-0"
          style={{ 
            transition: 'transform 6s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.5s ease-out, filter 3s ease-out',
            transform: `translate(-50%, -50%) ${
              startMainAnims 
                ? (window.innerWidth < 768 ? 'translateY(-22vh) scale(1.4)' : 'translateX(20vw) scale(1)') 
                : 'translateX(0) scale(3.5)'
            }`,
            opacity: startMainAnims ? 0.9 : 0,
            filter: startMainAnims ? 'blur(0px)' : 'blur(40px)'
          }}
        >
          <div className={window.innerWidth < 768 ? "" : "floating"}>
            <img
              src="/images/hero-shape.png"
              alt="IUDEX"
              className="w-full h-auto"
              fetchPriority="high"
            />
          </div>
        </div>

        {/* Hero Content - absolute bottom anchored, definitively away from top */}
        <div 
          className="absolute bottom-8 md:bottom-14 left-8 md:left-16 w-full max-w-2xl md:max-w-3xl pr-8 text-left pointer-events-none z-10"
          style={{ 
            opacity: startMainAnims ? 1 : 0,
            transition: 'opacity 0.8s ease-out'
          }}
        >
          {/* Badge */}
          <div 
            style={{
              opacity: startMainAnims ? 1 : 0,
              transform: startMainAnims ? 'translateY(0px)' : 'translateY(16px)',
              transition: 'opacity 1.0s ease-out, transform 1.0s ease-out',
              transitionDelay: '200ms'
            }}
            className="flex items-center justify-start gap-3 mb-8"
          >
            <div className="hidden md:block w-8 h-[1px] bg-black/40" />
            <span className="text-black/50 text-xs tracking-[0.2em] uppercase">Inteligencia Artificial</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-12">
            <div 
              style={{
                opacity: startMainAnims ? 1 : 0,
                transform: startMainAnims ? 'translateY(0px)' : 'translateY(20px)',
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
                transitionDelay: '400ms'
              }}
            >
              <span className="block">Diseñado para</span>
            </div>
            <div 
              style={{
                opacity: startMainAnims ? 1 : 0,
                transform: startMainAnims ? 'translateY(0px)' : 'translateY(20px)',
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
                transitionDelay: '600ms'
              }}
            >
              <span className="block text-black/50">profesionales del derecho.</span>
            </div>
          </h1>

          <div
            style={{
              opacity: startMainAnims ? 1 : 0,
              transform: startMainAnims ? 'translateY(0px)' : 'translateY(16px)',
              transition: 'opacity 1.0s ease-out, transform 1.0s ease-out',
              transitionDelay: '800ms'
            }}
          >
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm md:text-base text-black/60 leading-relaxed max-w-lg mb-10 mx-auto md:mx-0">
                La única IA legal que entiende el derecho mexicano. Entrenamos nuestro modelo 
                para ajustarse a la tradición jurídica romano-canónica con criterio jurídico 
                y sustento legal.
              </p>
              
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="pointer-events-auto inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition-all shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)] active:scale-95 uppercase tracking-[0.2em]"
              >
                Solicitar Demo
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Data Section */}
      <section
        id="data"
        ref={dataRef}
        className="relative py-16 sm:py-24 px-6 sm:px-12 md:px-16 bg-neutral-50"
      >
        <div
          className="relative z-10 w-full max-w-7xl mx-auto"
        >
          {/* Top Navigation-like labels - enters first, very subtle */}
          <div 
            className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90"
            style={{ 
              opacity: Math.min(1, dataProgress * 1.2),
              transform: `translateY(${(1 - Math.min(1, dataProgress * 1.2)) * 15}px)`,
              willChange: 'transform, opacity'
            }}
          >
            <span>Base de Datos Jurídica</span>
            <span>(01)</span>
          </div>

          {/* Title - enters slightly after labels */}
          <div 
            className="mb-20"
            style={{ 
              opacity: Math.min(1, (dataProgress - 0.1) * 1.5),
              transform: `translateY(${(1 - Math.min(1, (dataProgress - 0.1) * 1.5)) * 20}px)`,
              willChange: 'transform, opacity'
            }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-light">
              Conocimiento <span className="text-black/50">jurídico</span>
            </h2>
          </div>

          {/* Knowledge Items Grid - each item enters on its own scroll step */}
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
                {/* Left: Stat — first to appear */}
                <div 
                  className="w-full md:w-32 lg:w-48 flex-shrink-0"
                  style={{ 
                    opacity: Math.min(1, (dataProgress - (index * 0.8)) * 1.5),
                    transform: `translateY(${(1 - Math.min(1, (dataProgress - (index * 0.8)) * 1.2)) * 20}px)`,
                    willChange: 'transform, opacity'
                  }}
                >
                  <div className="text-6xl md:text-7xl font-bold tracking-tighter mb-1 leading-none">{item.value}</div>
                  <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-black/40">{item.label}</div>
                </div>

                {/* Middle: Description — enters slightly later */}
                <div 
                  className="flex-1"
                  style={{ 
                    opacity: Math.min(1, (dataProgress - (index * 0.8) - 0.15) * 1.5),
                    transform: `translateY(${(1 - Math.min(1, (dataProgress - (index * 0.8) - 0.15) * 1.2)) * 20}px)`,
                    willChange: 'transform, opacity'
                  }}
                >
                  <p className="text-lg md:text-xl text-black/80 leading-snug font-normal max-w-2xl">
                    {item.description}
                  </p>
                </div>

                {/* Right: Source and Tags — last to arrive */}
                <div 
                  className="w-full md:w-64 flex-shrink-0 flex flex-col items-start md:items-end text-left md:text-right"
                  style={{ 
                    opacity: Math.min(1, (dataProgress - (index * 0.8) - 0.3) * 1.5),
                    transform: `translateY(${(1 - Math.min(1, (dataProgress - (index * 0.8) - 0.3) * 1.2)) * 20}px)`,
                    willChange: 'transform, opacity'
                  }}
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
        className="relative flex flex-col items-center justify-center min-h-[100vh] md:min-h-[120vh] py-8 md:py-24 px-6 sm:px-12 md:px-16 bg-white overflow-hidden"
      >
        <div className="flex justify-between w-full max-w-7xl text-[10px] tracking-widest font-bold uppercase mb-8 md:mb-20 text-black/90 px-0">
          <span>Experiencia Visual</span>
          <span>(02)</span>
        </div>
        {/* Centered Content Wrapper */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
          
          <div 
            className="text-center mb-16 md:mb-24 transition-all duration-500"
            style={{ 
              opacity: Math.min(1, videoProgress * 3),
              transform: `translateY(${(1 - Math.min(1, videoProgress * 3)) * 40}px)`
            }}
          >
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-light mb-8">Mejora tu <span className="text-black/50">práctica legal</span></h3>
            <p className="text-black/80 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto text-center">
              IUDEX disminuye errores y aumenta la calidad del trabajo.<br className="hidden md:block" />
              Descubre una nueva forma de eficiencia usando tecnología jurídica.
            </p>
          </div>

          {/* Centered Monitor Mockup (Scaling with Scroll) */}
          <div 
            className="w-full cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
            style={(() => {
              // Zoom spans from progress 0.1 to 1.2 — slower, more gradual
              const zoomP = Math.max(0, Math.min(1, (videoProgress - 0.1) / 1.1));
              const easedP = Math.pow(zoomP, 0.7);
              const scaleDesktop = 0.72 + easedP * 0.28;
              const scaleMobile = 0.82 + easedP * 0.18;
              return {
                opacity: Math.min(1, videoProgress * 3),
                transform: `scale(${window.innerWidth < 768 ? scaleMobile : scaleDesktop})`,
                willChange: 'transform, opacity'
              };
            })()}
          >
            <div className="relative mx-auto w-full max-w-4xl shadow-2xl rounded-[2.5rem] overflow-hidden border border-neutral-200 transition-transform duration-500 group-hover:scale-[1.02]">
              {/* Monitor Body */}
              <div className="relative bg-[#F5F5F7] p-4 pb-14 shadow-inner">
                {/* Screen Area (Black Bezel) - Updated to 15px rounding */}
                <div className="bg-black rounded-[15px] aspect-[16/10] relative shadow-2xl overflow-hidden">
                  <div className="w-full h-full overflow-hidden bg-black">
                    {/* The Video - Matching user-requested 15px rounding */}
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover"
                    >
                       <source src="/videos/iudex-video-31-marzo.mp4" type="video/mp4" />
                    </video>
                  </div>
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
        className="relative flex flex-col pt-16 pb-8 md:pb-16 px-8 md:px-16 bg-white overflow-hidden"
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
          className="w-full"
          style={{ 
            opacity: Math.min(1, featuresProgress * 1.5),
            transform: `translateY(${(1 - Math.min(1, featuresProgress * 1.5)) * 40}px)`,
          }}
        >
          <h2 className="text-4xl md:text-7xl lg:text-[110px] font-light leading-[1] tracking-tighter text-black w-full text-center md:text-left">
            {/* Key verb - always black */}
            <span style={{ color: 'black', transition: 'color 1.2s ease' }}>Redacta</span>{" "}
            {/* Filler - fades out after scroll > 0.8 */}
            <span style={{ color: featuresProgress > 0.8 ? 'rgba(0,0,0,0.12)' : 'black', transition: 'color 1.2s ease' }}>con precisión,</span>{" "}
            {/* Key verb - always black */}
            <span style={{ color: 'black', transition: 'color 1.2s ease' }}>resuelve</span>{" "}
            {/* Filler */}
            <span style={{ color: featuresProgress > 0.8 ? 'rgba(0,0,0,0.12)' : 'black', transition: 'color 1.2s ease' }}>consultas,</span>{" "}
            {/* Key verb - always black */}
            <span style={{ color: 'black', transition: 'color 1.2s ease' }}>aprende</span>{" "}
            {/* Filler */}
            <span style={{ color: featuresProgress > 0.8 ? 'rgba(0,0,0,0.12)' : 'black', transition: 'color 1.2s ease' }}>de cada caso y</span>{" "}
            {/* Key verb - always black */}
            <span style={{ color: 'black', transition: 'color 1.2s ease' }}>protege</span>{" "}
            {/* Filler */}
            <span style={{ color: featuresProgress > 0.8 ? 'rgba(0,0,0,0.12)' : 'black', transition: 'color 1.2s ease' }}>tu información sensible con absoluta seguridad.</span>
          </h2>
        </div>

        {/* Middle Smaller Text (Right Aligned per user request) */}
        <div 
          className="w-full max-w-sm ml-auto text-right mt-12 md:mt-20 mb-8 md:mb-32 space-y-8"
          style={{ 
            opacity: Math.min(1, (featuresProgress - 0.3) * 2),
            transform: `translateY(${(1 - Math.min(1, (featuresProgress - 0.3) * 2)) * 30}px)`,
          }}
        >
          <div className="space-y-6">
            <p className="text-sm md:text-base text-black/60 leading-relaxed">
              Entendemos el mundo del derecho y la tecnología, y esa pasión da forma a cada herramienta que construimos.
            </p>
            <div className="space-y-4">
              <p className="text-sm md:text-base text-black/60 leading-relaxed">
                Si buscas un sistema que realmente entienda tu espacio y proteja lo que estás creando, has encontrado el lugar correcto.
              </p>
              {/* Animated Line Move from Slider - Now full width and thicker */}
              <div className="relative h-[2px] bg-black/10 w-full overflow-hidden">
                <div 
                  className="absolute top-0 right-0 h-full bg-black/60 transition-all duration-[1500ms] ease-out"
                  style={{ width: `${Math.min(100, featuresProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Security Section */}
      <section
        id="security"
        ref={securityRef}
        className="relative flex items-center pt-0 pb-16 sm:py-24 px-8 md:px-16 bg-white"
      >
        <div
          className="relative z-10 w-full max-w-7xl mx-auto"
          style={{ 
            opacity: Math.min(1, securityProgress * 2),
            transform: `translateY(${(1 - Math.min(1, securityProgress * 2)) * 30}px)`,
          }}
        >
          {/* Top Navigation-like labels */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-8 md:mb-20 text-black/90">
            <span>Seguridad e Infraestructura</span>
            <span>(04)</span>
          </div>

          <div className="mb-8 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight">
              Nos alineamos a los más altos estándares de seguridad.
            </h2>
          </div>

          <div className="border-t border-black/10">
            {securityStandards.map((item, index) => (
              <div 
                key={item.id} 
                className="border-b border-black/10"
                style={{ 
                   opacity: Math.min(1, (securityProgress - (index * 0.1) - 0.2) * 3),
                   transform: `translateY(${(1 - Math.min(1, (securityProgress - (index * 0.1) - 0.2) * 2)) * 40}px)`,
                }}
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
        className="relative flex items-center py-16 px-8 md:px-16 bg-[#F9F9F8] overflow-hidden"
      >
        {/* Background Decorative Shape */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] flex items-center justify-center overflow-hidden">
          <div 
            className="background-float"
            style={{ 
              opacity: Math.min(1, trackingProgress * 1.5),
              transform: `scale(${0.8 + trackingProgress * 0.4}) rotate(${12 + trackingProgress * 5}deg)`,
              filter: `blur(${40 - Math.min(40, trackingProgress * 80)}px)`
            }}
          >
            <img 
              src="/images/hero-shape.png" 
              alt="" 
              className="w-[120%] h-auto object-contain blur-2xl rotate-12"
              loading="lazy"
            />
          </div>
        </div>

        <div
          className="relative z-10 w-full max-w-7xl mx-auto"
          style={{ 
            opacity: Math.min(1, trackingProgress * 2),
            transform: `translateY(${(1 - Math.min(1, trackingProgress * 2)) * 30}px)`,
          }}
        >
          {/* Top Navigation-like labels */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90">
            <span>Seguimiento de procesos jurisdiccionales</span>
            <span>(05)</span>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            {/* Left: Content */}
            <div 
              className="w-full lg:w-1/2 flex flex-col items-start text-left"
              style={{ 
                opacity: Math.min(1, (trackingProgress - 0.2) * 3),
                transform: `translateX(${(1 - Math.min(1, (trackingProgress - 0.2) * 2)) * -40}px)`,
              }}
            >
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
                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="h-[64px] px-10 bg-[#24292E] text-white rounded-[2rem] flex items-center justify-center text-[13px] font-bold tracking-widest uppercase hover:bg-black transition-all group overflow-hidden relative shadow-lg"
                >
                  <span className="relative z-10">SOLICITAR DEMO</span>
                </button>
                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="h-[64px] w-[64px] bg-[#E2E2E2] rounded-[2rem] flex items-center justify-center cursor-pointer hover:bg-[#D1D1D1] transition-colors group shadow-lg"
                >
                  <ArrowUpRight size={24} className="text-[#1A1A1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: Coded iPhone Mockup (Minimalist) */}
            <div 
              className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-8 lg:mt-0"
              style={{ 
                opacity: Math.min(1, (trackingProgress - 0.3) * 3),
                transform: `translateX(${(1 - Math.min(1, (trackingProgress - 0.3) * 2)) * 40}px)`,
              }}
            >
              {/* Static ID Shape — hidden on mobile */}
              <div 
                className="hidden lg:block absolute -top-8 -right-32 w-[600px] h-[600px] pointer-events-none z-0"
                style={{ 
                  opacity: Math.min(1, (trackingProgress - 0.4) * 2),
                  transform: `scale(${0.9 + (trackingProgress * 0.35)})`,
                  filter: `blur(${20 - Math.min(20, trackingProgress * 40)}px)`,
                }}
              >
                <img 
                  src="/images/hero-shape.png" 
                  alt="" 
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* iPhone with Balanced Cinematic Entrance */}
              <div 
                className="relative w-[200px] h-[410px] lg:w-[280px] lg:h-[580px] bg-[#0F0F0F] rounded-[3rem] border-[3px] border-[#2A2A2A] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] ring-1 ring-black/5 p-1.5 overflow-hidden z-10"
                style={{ 
                  opacity: Math.min(1, (trackingProgress - 0.35) * 3),
                  transform: `translateY(${(1 - Math.min(1, (trackingProgress - 0.35) * 2)) * 40}px) scale(${0.95 + (trackingProgress * 0.05)})`,
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
        className="relative flex items-center py-16 sm:py-24 px-8 md:px-16 bg-[#F9F9F8]"
      >
        <div 
          className="relative z-10 w-full max-w-7xl mx-auto"
          style={{ 
            opacity: Math.min(1, impactProgress * 2),
            transform: `translateY(${(1 - Math.min(1, impactProgress * 2)) * 30}px)`,
          }}
        >
          {/* Header */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-24 text-black/90">
            <span>Métricas de Impacto</span>
            <span>(06)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
            {/* Column 1: Calidad y Velocidad */}
            <div 
              className="space-y-20"
              style={{ 
                opacity: Math.min(1, (impactProgress - 0.2) * 3),
                transform: `translateY(${(1 - Math.min(1, (impactProgress - 0.2) * 2)) * 40}px)`,
              }}
            >
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
                    className="flex items-start gap-8 group py-10 border-t border-black/10"
                    style={{ 
                      borderColor: 'rgba(0,0,0,0.1)',
                      borderTopStyle: 'dashed',
                      opacity: Math.min(1, (impactProgress - 0.3 - (i * 0.1)) * 3),
                      transform: `translateY(${(1 - Math.min(1, (impactProgress - 0.3 - (i * 0.1)) * 2)) * 30}px)`,
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
            <div 
              className="space-y-20"
              style={{ 
                opacity: Math.min(1, (impactProgress - 0.4) * 3),
                transform: `translateY(${(1 - Math.min(1, (impactProgress - 0.4) * 2)) * 40}px)`,
              }}
            >
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
                  { label: "Recuperación de tiempo", value: "4+", desc: "horas semanalas recuperadas de tareas administrativas no facturables." }
                ].map((stat, i) => (
                   <div 
                    key={i} 
                    className="flex items-start gap-8 group py-10 border-t border-black/10"
                    style={{ 
                      borderColor: 'rgba(0,0,0,0.1)',
                      borderTopStyle: 'dashed',
                      opacity: Math.min(1, (impactProgress - 0.5 - (i * 0.1)) * 3),
                      transform: `translateY(${(1 - Math.min(1, (impactProgress - 0.5 - (i * 0.1)) * 2)) * 30}px)`,
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
        className="relative flex items-center py-16 sm:py-24 px-8 md:px-16 bg-white"
      >
        <div
          className="relative z-10 w-full max-w-7xl mx-auto"
          style={{ 
            opacity: Math.min(1, aboutProgress * 2),
            transform: `translateY(${(1 - Math.min(1, aboutProgress * 2)) * 30}px)`,
          }}
        >
          {/* Top Navigation-like labels */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90">
            <span>Construyendo el Futuro</span>
            <span>(07)</span>
          </div>

          <div className="text-center mb-20 overflow-hidden">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-light mb-8"
              style={{ 
                opacity: Math.min(1, (aboutProgress - 0.2) * 3),
                transform: `translateY(${(1 - Math.min(1, (aboutProgress - 0.2) * 2)) * 40}px)`,
              }}
            >
              Construyendo el <span className="text-black/50">futuro del</span> Derecho.
            </h2>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p 
              className="text-xl text-black/60 leading-relaxed mb-12 text-center"
              style={{ 
                opacity: Math.min(1, (aboutProgress - 0.3) * 3),
                transform: `translateY(${(1 - Math.min(1, (aboutProgress - 0.3) * 2)) * 40}px)`,
              }}
            >
              En IUDEX estamos cambiando la práctica legal mexicana. Somos un equipo de abogados y programadores definiendo un nuevo estándar en la abogacía moderna.
            </p>

            <div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              style={{ 
                opacity: Math.min(1, (aboutProgress - 0.4) * 3),
                transform: `scale(${0.95 + (Math.min(1, (aboutProgress - 0.4) * 2) * 0.05)}) translateY(${(1 - Math.min(1, (aboutProgress - 0.4) * 2)) * 40}px)`,
              }}
            >
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-black text-white rounded-full text-lg font-medium hover:bg-black/80 transition-all duration-300 group shadow-xl hover:shadow-2xl"
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
        className="relative flex items-center py-16 px-8 md:px-16 bg-[#F9F9F8]"
      >
        <div
          className="relative z-10 w-full max-w-7xl mx-auto"
          style={{ 
            opacity: Math.min(1, faqProgress * 2),
            transform: `translateY(${(1 - Math.min(1, faqProgress * 2)) * 30}px)`,
          }}
        >
          {/* Top Navigation-like labels */}
          <div className="flex justify-between w-full text-[10px] tracking-widest font-bold uppercase mb-20 text-black/90">
            <span>Preguntas Frecuentes</span>
            <span>(08)</span>
          </div>

          <div className="mb-24 text-center">
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light tracking-tight"
              style={{ 
                opacity: Math.min(1, (faqProgress - 0.2) * 3),
                transform: `translateY(${(1 - Math.min(1, (faqProgress - 0.2) * 2)) * 40}px)`,
              }}
            >
              Resolviendo <span className="text-black/50">tus dudas.</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto border-t border-black/10">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="border-b border-black/10"
                style={{ 
                   opacity: Math.min(1, (faqProgress - 0.3 - (index * 0.1)) * 3),
                   transform: `translateY(${(1 - Math.min(1, (faqProgress - 0.3 - (index * 0.1)) * 2)) * 30}px)`,
                }}
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
      <footer className="pt-12 pb-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand & Rights */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <img src="/images/tracking-logo.png" alt="IUDEX" className="h-16 w-auto mb-6 object-contain" loading="lazy" />
              <div className="flex flex-col gap-1">
                <div className="text-black/30 text-xs text-center md:text-left">
                  © 2026 IUDEX. Todos los derechos reservados.
                </div>
              </div>
            </div>

            {/* Legal Links Horizontal */}
            <nav className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
              <button 
                onClick={() => setShowPrivacy(true)}
                className="text-black/40 hover:text-black transition-colors text-[10px] uppercase font-bold tracking-[0.2em]"
              >
                Política de Privacidad
              </button>
              <button 
                onClick={() => setShowTerms(true)}
                className="text-black/40 hover:text-black transition-colors text-[10px] uppercase font-bold tracking-[0.2em]"
              >
                Términos
              </button>
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="text-black/40 hover:text-black transition-colors text-[10px] uppercase font-bold tracking-[0.2em]"
              >
                Contacto
              </button>
            </nav>
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
          className={`w-full max-w-7xl px-4 transition-all duration-500 delay-100 ${
            isModalOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {isModalOpen && (
            <div className="relative mx-auto w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden border border-white/10">
              {/* Higher-resolution Monitor Frame in Modal */}
              <div className="relative bg-[#F5F5F7] p-6 pb-20 shadow-inner">
                {/* Screen Area */}
                <div className="bg-black rounded-2xl aspect-video overflow-hidden relative">
                  <video 
                    autoPlay 
                    loop 
                    controls
                    playsInline 
                    className="w-full h-full object-contain bg-black"
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
            <p className="text-black/50 text-[13px] leading-relaxed text-center md:text-left">
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
              <p className="text-black/40 text-sm text-center md:text-left">Completa tus datos y nos pondremos en contacto.</p>
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
                  IUDEX utiliza tu información para entregarte el servicio solicitado. También podemos enviarte correos con información comercial; puedes cancelar tu suscripción en cualquier momento usando el enlace incluido en nuestros mensajes. Consulta los detalles en nuestro <button type="button" onClick={() => { setIsDemoModalOpen(false); setShowPrivacy(true); }} className="underline hover:text-black transition-colors">Aviso de Privacidad</button> y <button type="button" onClick={() => { setIsDemoModalOpen(false); setShowTerms(true); }} className="underline hover:text-black transition-colors">Términos y Condiciones</button>.
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
