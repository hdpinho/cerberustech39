import type { SiteContent } from "../types";

/**
 * Todo el texto del sitio en español (Venezuela).
 * Edita aquí sin tocar los componentes. Tono: directo, profesional, tuteo.
 */
export const site: SiteContent = {
  meta: {
    title: "Cerberus Tech 39 · Soluciones tecnológicas en Venezuela",
    description:
      "Desarrollo web y de software, ciberseguridad, infraestructura, datos e inteligencia artificial para empresas en Venezuela y clientes remotos. Construimos, protegemos y automatizamos.",
    ogAlt: "Cerberus Tech 39 — Construimos, protegemos y automatizamos tu tecnología.",
  },

  company: {
    name: "Cerberus Tech 39, C.A.",
    shortName: "Cerberus Tech 39",
    tagline: "Construimos, protegemos y automatizamos tu tecnología.",
    city: "Caracas",
    country: "Venezuela",
  },

  nav: {
    links: [
      { label: "Servicios", href: "#servicios" },
      { label: "Paquetes", href: "#paquetes" },
      { label: "Proceso", href: "#proceso" },
      { label: "Nosotros", href: "#nosotros" },
      { label: "Contacto", href: "#contacto" },
    ],
    cta: "Agenda tu diagnóstico",
    skip: "Saltar al contenido",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },

  hero: {
    label: "// soluciones tecnológicas integrales",
    title: ["Tecnología que trabaja.", "Y que se defiende."],
    subtitle:
      "Desarrollamos, aseguramos y automatizamos la tecnología de tu empresa, con estándares internacionales y desde Caracas.",
    primaryCta: "Agenda tu diagnóstico",
    secondaryCta: "Ver servicios",
    globo: {
      etiqueta:
        "Globo 3D interactivo: sede en Caracas, Venezuela, con atención remota hacia Latinoamérica, Estados Unidos y Europa. Arrástralo para girarlo.",
      sede: { nombre: "Caracas", lat: 10.4806, lon: -66.9036 },
      // Regiones de atención remota (sección 1 del documento de marca), no clientes
      destinos: [
        { nombre: "Latinoamérica", lat: -14, lon: -58 },
        { nombre: "Estados Unidos", lat: 38.5, lon: -96 },
        { nombre: "Europa", lat: 48.5, lon: 9 },
      ],
      leyendaSede: "sede · Caracas, Venezuela",
      leyendaRemota: "atención remota · Latinoamérica · EE. UU. · Europa",
      ayuda: "arrastra para girar",
    },
  },

  guardians: {
    label: "// tres guardianes",
    title: "Un guardián que vigila en todas las direcciones.",
    intro:
      "En la mitología, Cerbero es el guardián de tres cabezas que nada deja pasar. Nosotros tomamos esa idea al pie de la letra: cada cabeza cuida un frente de tu tecnología, y las tres trabajan juntas.",
    pillars: [
      {
        id: "construimos",
        title: "Construimos",
        summary: "Web, apps, sistemas a la medida e infraestructura.",
        detail: "Software que hace lo que tu negocio necesita, sobre una base que aguanta el crecimiento.",
        icon: "hammer",
        imagen: "construimos",
        imagenAlt: "Módulos de servidor y paneles de código holográficos ensamblándose en el aire, unidos por trazos de circuito.",
      },
      {
        id: "protegemos",
        title: "Protegemos",
        summary: "Seguridad de la información, riesgo tecnológico y continuidad.",
        detail: "Encontramos tus puntos débiles y los cerramos antes de que alguien más los encuentre.",
        icon: "lock",
        imagen: "protegemos",
        imagenAlt: "Escudo de cristal formado por circuitos luminosos sobre el pasillo de un centro de datos.",
      },
      {
        id: "automatizamos",
        title: "Automatizamos",
        summary: "Inteligencia artificial y automatización de procesos.",
        detail: "IA que opera de verdad dentro de tu negocio, con seguridad y control.",
        icon: "workflow",
        imagen: "automatizamos",
        imagenAlt: "Núcleo de inteligencia artificial: una esfera de cristal con una red neuronal de luz que recibe flujos de datos.",
      },
    ],
  },

  services: {
    label: "// servicios",
    title: "Seis líneas de servicio. Un solo equipo responsable.",
    intro:
      "Desde una landing page hasta un sistema empresarial con su propia seguridad. Escoge una línea o combínalas: nosotros nos encargamos de que todo encaje.",
    more: "Ver detalle",
    close: "Cerrar",
    quote: "Solicitar cotización",
    ecosistema: {
      etiqueta:
        "Diagrama 3D interactivo de las seis líneas de servicio orbitando alrededor del núcleo: DEV, DAT, INF, SEG, IA y CON. La misma información está en las tarjetas de esta sección.",
      ayuda: "pasa el puntero o pulsa una línea · arrastra para girar",
      ayudaTactil: "toca una línea para ver su detalle · desliza para girar",
    },
    list: [
      {
        code: "DEV",
        title: "Desarrollo web y de software",
        benefit: "Desde una landing page hasta un sistema empresarial.",
        icon: "code",
        items: [
          "Páginas web, landing pages y tiendas en línea",
          "Web apps y plataformas SaaS a la medida",
          "Apps móviles Android/iOS y aplicaciones de escritorio",
          "APIs e integraciones con bancos, ERP y pasarelas de pago",
        ],
        stackLabel: "Tecnologías",
        stack: ["React", "Next.js", "Node.js", "Python", ".NET", "Flutter"],
      },
      {
        code: "DAT",
        title: "Datos y bases de datos",
        benefit: "Tus datos ordenados, disponibles y convertidos en decisiones.",
        icon: "database",
        items: [
          "Diseño y administración de bases de datos",
          "Rendimiento, respaldo y alta disponibilidad",
          "Migraciones y limpieza de datos",
          "Tableros e inteligencia de negocio",
        ],
        stackLabel: "Tecnologías",
        stack: ["PostgreSQL", "SQL Server", "MySQL", "MongoDB", "Power BI"],
      },
      {
        code: "INF",
        title: "Infraestructura y nube",
        benefit:
          "Redes, servidores y nube pensados para la realidad venezolana: cortes, latencia y crecimiento.",
        icon: "server",
        items: [
          "Redes, cableado estructurado y Wi-Fi empresarial",
          "Servidores, virtualización y suministro de hardware",
          "Migración a AWS, Azure y Google Cloud",
          "DevOps, contenedores y continuidad del negocio",
        ],
        stackLabel: "Tecnologías",
        stack: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform"],
      },
      {
        code: "SEG",
        title: "Ciberseguridad, cambios y riesgo tecnológico",
        benefit:
          "Encontramos tus puntos débiles y los cerramos antes de que alguien más los encuentre.",
        icon: "shield",
        items: [
          "Diagnóstico de seguridad y análisis de vulnerabilidades",
          "Matrices de riesgo tecnológico y planes de tratamiento",
          "Gestión de cambios (RFC, comité de cambios, planes de reversión) según ITIL",
          "Políticas y procedimientos según ISO/IEC 27001",
          "Apoyo en cumplimiento para el sector financiero venezolano",
        ],
        stackLabel: "Marcos",
        stack: ["ISO 27001", "NIST CSF 2.0", "OWASP", "ITIL 4", "COBIT 2019", "ISO 31000"],
      },
      {
        code: "IA",
        title: "Inteligencia artificial y automatización",
        benefit: "IA que opera de verdad dentro de tu negocio, con seguridad y control.",
        icon: "bot",
        items: [
          "Asistentes de IA para WhatsApp, web y soporte",
          "Automatización de procesos repetitivos",
          "Lectura y extracción de datos de documentos",
          "Integración de modelos de lenguaje en tus sistemas",
        ],
        stackLabel: "Tecnologías",
        stack: ["Claude API", "n8n", "Python", "RAG", "Make"],
      },
      {
        code: "CON",
        title: "Consultoría y acompañamiento",
        benefit: "Criterio técnico para decidir bien antes de invertir.",
        icon: "compass",
        items: [
          "Hoja de ruta de transformación digital",
          "CTO y CISO como servicio para PyMEs y startups",
          "Evaluación de proveedores y auditoría de proyectos",
          "Capacitación de equipos en IA y seguridad",
        ],
        stackLabel: "Enfoque",
        stack: ["Hoja de ruta", "CTO as a Service", "CISO as a Service", "Auditoría"],
      },
    ],
  },

  packages: {
    label: "// paquetes",
    title: "Paquetes claros para empezar rápido.",
    intro:
      "Cada paquete es un punto de partida: lo ajustamos a tu caso y te enviamos la cotización por escrito, sin compromiso.",
    recommended: "Recomendado",
    cta: "Solicitar cotización",
    forWhom: "Para",
    list: [
      {
        id: "start",
        name: "Start",
        audience: "Emprendedores y negocios que salen a internet",
        includes: [
          "Landing o web de hasta 5 secciones",
          "Dominio, hosting y correo",
          "WhatsApp y SEO básico",
        ],
        service: "DEV",
      },
      {
        id: "business",
        name: "Business",
        audience: "Empresas que venden y atienden en línea",
        includes: [
          "Web corporativa o tienda",
          "Panel administrativo y pasarelas de pago",
          "Analítica",
        ],
        recommended: true,
        service: "DEV",
      },
      {
        id: "pro",
        name: "Pro",
        audience: "Operaciones que necesitan su propio sistema",
        includes: ["Web app a la medida", "Roles, permisos e integraciones", "Soporte inicial"],
        service: "DEV",
      },
      {
        id: "shield",
        name: "Shield",
        audience: "Empresas que quieren saber qué tan expuestas están",
        includes: [
          "Diagnóstico de seguridad",
          "Análisis de vulnerabilidades",
          "Informe y plan de acción",
        ],
        service: "SEG",
      },
      {
        id: "ai",
        name: "AI",
        audience: "Equipos saturados de tareas repetitivas",
        includes: ["Asistente de IA", "Automatización de 1 a 3 procesos", "Capacitación"],
        service: "IA",
      },
      {
        id: "care",
        name: "Care",
        audience: "Empresas sin departamento de TI propio",
        includes: [
          "Mesa de ayuda mensual",
          "Mantenimiento, respaldos y monitoreo",
          "Tiempos de respuesta acordados",
        ],
        service: "INF",
      },
    ],
    commitmentsTitle: "Nuestros compromisos contigo",
    commitments: [
      {
        title: "Todo por escrito",
        body: "Alcance, plazos e inversión definidos antes de empezar.",
        icon: "file-check",
      },
      {
        title: "Sin costos ocultos",
        body: "Pagos por etapas, en USD o en bolívares a la tasa oficial del BCV.",
        icon: "receipt",
      },
      {
        title: "Todo es tuyo",
        body: "Código, datos, accesos y documentación se entregan al cliente.",
        icon: "key",
      },
      {
        title: "Soporte posterior",
        body: "Garantía de funcionamiento y acompañamiento tras la entrega.",
        icon: "life-buoy",
      },
    ],
  },

  process: {
    label: "// proceso",
    title: "Un método en seis pasos. Sin sorpresas.",
    intro: "Sabes en qué punto está tu proyecto en todo momento, y nada avanza sin tu visto bueno.",
    steps: [
      { title: "Diagnóstico", body: "Escuchamos y traducimos tu necesidad a requerimientos claros." },
      { title: "Propuesta", body: "Alcance, arquitectura, plazos e inversión por escrito." },
      { title: "Diseño", body: "Experiencia de usuario, arquitectura y revisión de seguridad." },
      { title: "Construcción", body: "Entregas cortas con demostraciones frecuentes." },
      { title: "Pruebas", body: "Funcionales, de seguridad y de aceptación contigo." },
      { title: "Puesta en marcha", body: "Publicación, capacitación y soporte posterior." },
    ],
  },

  trust: {
    label: "// por qué confiar",
    title: "La seguridad no es un extra. Es el punto de partida.",
    intro:
      "Nuestro equipo viene de la seguridad, la gestión de cambios y el riesgo tecnológico, donde un error cuesta caro. Esa disciplina la aplicamos a cada proyecto, sea grande o pequeño.",
    reasons: [
      {
        title: "Seguridad desde el diseño",
        body: "Revisamos la seguridad desde la arquitectura, no al final. Cada entrega pasa por pruebas de seguridad antes de publicarse.",
        icon: "fingerprint",
      },
      {
        title: "Método, no improvisación",
        body: "Gestión de cambios con planes de reversión, entregas cortas y documentación. Sabes qué se hace, cuándo y por qué.",
        icon: "layers",
      },
      {
        title: "Tu información es tuya",
        body: "Código, datos, accesos y documentación quedan a tu nombre. Firmamos acuerdos de confidencialidad cuando lo necesitas.",
        icon: "key",
      },
    ],
    frameworksTitle: "Marcos de referencia con los que trabajamos",
    frameworksNote:
      "Alineamos nuestros procesos y entregables con estos marcos internacionales.",
    frameworks: ["ISO/IEC 27001", "NIST CSF 2.0", "OWASP", "ITIL 4", "COBIT 2019", "ISO 31000"],
    imagenAlt: "Candado de cristal con una red de puntos de luz sobre una placa de circuito iluminada en azul.",
    teamTitle: "Quiénes están detrás",
    leader: {
      name: "Héctor De Pinho",
      role: "CEO y especialista tecnológico",
      body: "Al frente de la firma y de su dirección técnica.",
    },
    team: {
      name: "Equipo de especialistas",
      body: "Profesionales con amplia trayectoria en el mercado tecnológico venezolano.",
      areas: [
        "Desarrollo",
        "Infraestructura",
        "Seguridad",
        "Gestión de cambios",
        "Riesgo tecnológico",
        "Inteligencia artificial",
      ],
    },
  },

  sectors: {
    label: "// sectores y formación",
    title: "Hablamos el idioma de tu industria.",
    intro: "Soluciones pensadas para la operación real de cada sector, en Venezuela y de forma remota.",
    imagenAlt: "Ciudad latinoamericana de noche, con montañas al fondo y una red de arcos de luz que conecta sus edificios.",
    list: [
      { name: "Comercio y retail", icon: "store" },
      { name: "Banca y fintech", icon: "landmark" },
      { name: "Logística y aduanas", icon: "truck" },
      { name: "Restaurantes y servicios", icon: "utensils" },
      { name: "Salud y educación", icon: "heart-pulse" },
      { name: "Emprendedores", icon: "rocket" },
    ],
    trainingTitle: "Formación para tu equipo",
    training: [
      {
        title: "Talleres de IA aplicada",
        body: "Para gerencia y operaciones: qué automatizar primero y cómo medir el retorno.",
        icon: "presentation",
      },
      {
        title: "Concienciación en seguridad",
        body: "Para todo el personal: el eslabón humano es la primera línea de defensa.",
        icon: "users",
      },
      {
        title: "Mentoría técnica",
        body: "Para equipos y fundadores que quieren decidir con criterio propio.",
        icon: "graduation-cap",
      },
    ],
  },

  purpose: {
    label: "// propósito",
    title: "Lo que nos mueve.",
    mission:
      "Diseñar, construir y proteger soluciones tecnológicas de clase mundial que impulsen la transformación digital de empresas y personas.",
    vision:
      "Ser la firma venezolana de referencia en soluciones tecnológicas integrales, reconocida dentro y fuera del país por su calidad, seguridad e innovación.",
    valuesTitle: "Valores",
    values: [
      { name: "Vigilancia", body: "La protección del cliente va primero." },
      { name: "Excelencia", body: "Estándares internacionales en cada entrega." },
      { name: "Integridad", body: "Precios, plazos y riesgos transparentes." },
      { name: "Innovación", body: "IA y automatización con retorno medible." },
    ],
  },

  faq: {
    label: "// preguntas frecuentes",
    title: "Lo que nos preguntan antes de empezar.",
    list: [
      {
        q: "¿Trabajan con clientes fuera de Venezuela?",
        a: "Sí. Atendemos empresas y personas en toda Venezuela y trabajamos de forma remota con clientes en Latinoamérica, Estados Unidos y Europa, con reuniones por videollamada y entregas en línea.",
      },
      {
        q: "¿Cómo cobran?",
        a: "Por etapas, según lo acordado en la propuesta escrita. Puedes pagar en USD o en bolívares a la tasa oficial del BCV. No hay costos ocultos: lo que firmas es lo que pagas.",
      },
      {
        q: "¿De quién es el código?",
        a: "Tuyo. Al cierre te entregamos el código fuente, los datos, los accesos y la documentación. No dependes de nosotros para seguir operando.",
      },
      {
        q: "¿Cuánto tarda una web?",
        a: "Menos de lo que imaginas. Una landing page puede estar en línea en cuestión de días, y una web corporativa en pocas semanas. Los sistemas a la medida avanzan por etapas, con demostraciones frecuentes para que veas el progreso desde el principio. El plazo exacto de tu proyecto queda por escrito en la propuesta, antes de empezar.",
      },
      {
        q: "¿Qué pasa después de la entrega?",
        a: "Te acompañamos. Toda entrega incluye garantía de funcionamiento, capacitación y soporte posterior. Si prefieres que nos encarguemos del día a día, el paquete Care cubre mantenimiento, respaldos y monitoreo.",
      },
      {
        q: "¿Firman acuerdos de confidencialidad?",
        a: "Sí. Firmamos un acuerdo de confidencialidad antes de que compartas información sensible de tu negocio. La protección del cliente va primero.",
      },
    ],
  },

  contact: {
    label: "// contacto",
    title: "Hablemos de tu proyecto.",
    intro:
      "Cuéntanos qué necesitas y agendamos tu diagnóstico. Te respondemos con próximos pasos claros.",
    whatsappCta: "Escríbenos por WhatsApp",
    whatsappMessage:
      "Hola, Cerberus Tech 39. Me gustaría agendar un diagnóstico para mi proyecto.",
    emailLabel: "Correo",
    locationLabel: "Sede",
    location: "Caracas, Venezuela",
    reach: "Atención en todo el país y remota para Latinoamérica, Estados Unidos y Europa.",
    imagenAlt: "Mano sosteniendo un teléfono del que surge una proyección holográfica de mensajes, correos y un escudo.",
    form: {
      name: "Nombre",
      company: "Empresa",
      email: "Correo electrónico",
      whatsapp: "WhatsApp",
      service: "Servicio de interés",
      servicePlaceholder: "Selecciona una opción",
      serviceOther: "Todavía no lo sé",
      message: "Mensaje",
      consent: "Acepto que Cerberus Tech 39 use estos datos para responder a mi solicitud, según la",
      consentLink: "política de privacidad",
      submit: "Enviar solicitud",
      sending: "Enviando…",
      success: "¡Listo! Recibimos tu mensaje y te escribiremos muy pronto.",
      error: "No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.",
      rateLimited: "Ya recibimos varias solicitudes desde este equipo. Espera unos minutos e inténtalo de nuevo.",
      optional: "opcional",
      unavailable:
        "El formulario estará disponible muy pronto. Mientras tanto, escríbenos por WhatsApp o por correo.",
      unavailableEmailOnly: "El formulario estará disponible muy pronto. Mientras tanto, escríbenos por correo.",
      errors: {
        name: "Escribe tu nombre.",
        email: "Escribe un correo válido.",
        whatsapp: "Escribe un número válido, con código de país (p. ej. +58 412 000 0000).",
        service: "Selecciona un servicio.",
        message: "Cuéntanos un poco más (mínimo 10 caracteres).",
        consent: "Necesitamos tu autorización para responderte.",
      },
    },
  },

  footer: {
    navTitle: "Navegación",
    socialTitle: "Síguenos",
    privacy: "Política de privacidad",
    rights: "Todos los derechos reservados.",
  },

  privacy: {
    title: "Política de privacidad",
    updated: "Última actualización: octubre de 2026",
    sections: [
      {
        title: "Quiénes somos",
        body: [
          "Cerberus Tech 39, C.A. (en adelante, «Cerberus Tech 39») es una firma de soluciones tecnológicas con sede en Caracas, Venezuela. Esta política explica qué datos recogemos en este sitio y cómo los usamos.",
        ],
      },
      {
        title: "Qué datos recogemos",
        body: [
          "Solo los que nos das en el formulario de contacto: nombre, empresa, correo electrónico, número de WhatsApp, servicio de interés y el mensaje que escribas.",
          "Este sitio no usa cookies de seguimiento. Si en el futuro activamos analítica, será una herramienta respetuosa con la privacidad, sin perfiles individuales, y te lo indicaremos con un aviso.",
        ],
      },
      {
        title: "Para qué los usamos",
        body: [
          "Únicamente para responder a tu solicitud, preparar una propuesta y darle seguimiento. No vendemos, alquilamos ni cedemos tus datos a terceros con fines comerciales.",
        ],
      },
      {
        title: "Con quién los compartimos",
        body: [
          "El formulario se procesa a través de un proveedor de envío de formularios que actúa como encargado del tratamiento y solo transmite el mensaje a nuestro correo.",
        ],
      },
      {
        title: "Cuánto tiempo los guardamos",
        body: [
          "Mientras dure la relación comercial o hasta que nos pidas eliminarlos. Si no llegamos a trabajar juntos, los eliminamos en un plazo razonable.",
        ],
      },
      {
        title: "Tus derechos",
        body: [
          "Puedes pedirnos en cualquier momento acceder a tus datos, corregirlos o eliminarlos. Escríbenos a nuestro correo de contacto y te responderemos lo antes posible.",
        ],
      },
    ],
  },
};
