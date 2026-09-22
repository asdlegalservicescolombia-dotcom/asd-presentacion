/** Única fuente de contenido editorial. El orden de este arreglo define la navegación. */
export const presentation = {
  title: 'Talento que trasciende',
  location: 'Montería, Córdoba · Colombia',
  contact: { email: 'contacto@asdservicioslegales.com.co', website: 'https://asdservicioslegales.co/' },
  sections: [
    {
      id: 'inicio', type: 'hero', label: 'La visión', eyebrow: 'UNA ALIANZA CON PROPÓSITO',
      title: 'El talento aprende.\nEl derecho evoluciona.',
      accent: 'El derecho evoluciona.',
      description: 'Conectamos el conocimiento de las facultades con la experiencia de ASD Servicios Legales para formar la próxima generación de abogados de Córdoba.',
      cta: 'Descubrir la alianza', ctaTarget: 'proposito',
      tags: ['Talento universitario', 'Experiencia jurídica', 'Impacto compartido'],
      image: { src: 'assets/images/mentoria.webp', alt: 'Escena ilustrativa de una abogada mentora revisando un expediente con dos estudiantes adultos.', caption: 'APRENDER HACIENDO. CRECER ACOMPAÑADOS.', credit: 'Escena ilustrativa generada con IA · Higgsfield' },
      note: 'Una propuesta de colaboración entre ASD y las facultades de Derecho de la región.'
    },
    {
      id: 'proposito', type: 'ecosystem', label: 'El propósito', eyebrow: '01 / VISIÓN ESTRATÉGICA',
      title: 'Dos mundos.\nUna misma ambición.',
      description: 'Construir un ecosistema de simbiosis profesional: la academia aporta nuevas perspectivas; la firma las transforma en criterio, experiencia y práctica responsable.',
      nodes: [
        { title: 'La academia', subtitle: 'CONOCIMIENTO QUE RENUEVA', items: ['Pensamiento jurídico actualizado', 'Investigación y mirada crítica', 'Nuevas herramientas tecnológicas'] },
        { title: 'La firma', subtitle: 'EXPERIENCIA QUE FORMA', items: ['Mentoría de abogados titulados', 'Estrategia procesal y de litigio', 'Ética aplicada a decisiones reales'] }
      ],
      outcome: 'La próxima generación de abogados de Córdoba',
      pillars: ['Rigor jurídico', 'Ética profesional', 'Aprendizaje recíproco']
    },
    {
      id: 'beneficios', type: 'benefits', label: 'Valor compartido', eyebrow: '02 / IMPACTO BILATERAL',
      title: 'Cuando uno crece,\ncrecemos todos.',
      description: 'Una relación ganar–ganar con aportes concretos para la firma y oportunidades de desarrollo para el estudiante.',
      audiences: [
        { id: 'firma', label: 'Para la firma', heading: 'El futuro también fortalece el presente.', items: [
          { title: 'Talento de confianza', summary: 'Conocer hoy a quienes pueden crecer mañana con ASD.', detail: 'Observar de cerca el criterio, la redacción y el compromiso de los estudiantes permite construir una cantera para futuras oportunidades. La participación no implica una promesa de contratación.', icon: 'people' },
          { title: 'Más foco estratégico', summary: 'Apoyo procesal que libera capacidad del equipo.', detail: 'Revisión de estados, vigilancia judicial en Montería y proyección de memoriales de trámite bajo supervisión. El abogado responsable revisa y asume las actuaciones que le corresponden.', icon: 'target' },
          { title: 'Conocimiento vivo', summary: 'La conversación académica entra al despacho.', detail: 'Investigación de jurisprudencia, nuevas corrientes doctrinales y uso responsable de herramientas tecnológicas para enriquecer el análisis del equipo.', icon: 'spark' },
          { title: 'Vínculo institucional', summary: 'Una relación duradera con las facultades de la región.', detail: 'La propuesta busca formalizar alianzas que fortalezcan el intercambio académico, la responsabilidad social y la presencia institucional de ASD.', icon: 'building' }
        ] },
        { id: 'estudiantes', label: 'Para el estudiante', heading: 'Convertir el conocimiento en criterio profesional.', items: [
          { title: 'Práctica con contexto real', summary: 'Comprender cómo se construye una estrategia jurídica.', detail: 'Acercamiento supervisado a expedientes, análisis procesal y asuntos corporativos, según el plan de formación y las actividades autorizadas para cada participante.', icon: 'building' },
          { title: 'Mentoría cercana', summary: 'Aprender de las decisiones, no solo de los resultados.', detail: 'Retroalimentación de abogados titulados sobre investigación, redacción jurídica, negociación y preparación de audiencias, dentro de las funciones permitidas.', icon: 'people' },
          { title: 'Trayectoria con propósito', summary: 'Construir experiencia que pueda documentarse.', detail: 'Un plan de aprendizaje y seguimiento puede fortalecer el perfil profesional. El reconocimiento como práctica, consultorio jurídico o judicatura exige verificar por separado la modalidad y sus requisitos; no es automático.', icon: 'target' },
          { title: 'Conexiones profesionales', summary: 'Acercarse al entorno jurídico de Montería.', detail: 'Interacción profesional supervisada con el ecosistema judicial, notarial y empresarial, cultivando relaciones basadas en respeto, responsabilidad y confidencialidad.', icon: 'spark' }
        ] }
      ]
    },
    {
      id: 'ruta', type: 'timeline', label: 'La experiencia', eyebrow: '03 / RUTA DE FORMACIÓN PROPUESTA',
      title: 'De la teoría\na la práctica con criterio.',
      description: 'Un recorrido progresivo. Cada etapa conecta una responsabilidad con una oportunidad de aprender.',
      steps: [
        { label: 'Conectar', title: 'Alinear expectativas.', body: 'Conversación con la facultad y el estudiante para definir modalidad, objetivos, disponibilidad, tutoría y condiciones de participación.', deliverable: 'Plan de formación acordado', activities: ['Validación de requisitos', 'Definición de roles y tutor responsable', 'Acuerdo sobre objetivos y seguimiento'] },
        { label: 'Comprender', title: 'Aprender el contexto.', body: 'Inducción a la cultura de ASD, el manejo reservado de la información y los métodos de investigación y seguimiento de asuntos.', deliverable: 'Inducción y protocolo de trabajo', activities: ['Ética y confidencialidad', 'Lectura guiada de expedientes', 'Herramientas y control de fuentes'] },
        { label: 'Contribuir', title: 'Participar con acompañamiento.', body: 'Apoyo a tareas jurídicas graduadas según el nivel del estudiante, con revisión del abogado responsable antes de cualquier actuación.', deliverable: 'Trabajo revisado y retroalimentación', activities: ['Investigación jurídica', 'Seguimiento procesal autorizado', 'Borradores de escritos y análisis'] },
        { label: 'Proyectar', title: 'Convertir experiencia en aprendizaje.', body: 'Evaluación de avances, reflexión sobre el criterio adquirido y documentación del proceso para la institución académica, cuando corresponda.', deliverable: 'Balance de competencias y próximos pasos', activities: ['Evaluación con el tutor', 'Evidencias sin datos de clientes', 'Orientación para el desarrollo profesional'] }
      ],
      note: 'Ruta propuesta, ajustable con cada universidad. Duración, cupos, condiciones y modalidad se definen al formalizar la alianza.'
    },
    {
      id: 'talento', type: 'profile', label: 'El talento', eyebrow: '04 / EL PERFIL QUE QUEREMOS POTENCIAR',
      title: 'Curiosidad para aprender.\nCarácter para ejercer.',
      description: 'Estudiantes de Derecho de últimos semestres con interés por el litigio, la investigación y una práctica profesional responsable.',
      quote: 'Buscamos a quienes quieren construir su criterio, asumir retos y aportar desde el primer día.',
      traits: [
        { title: 'Redacción jurídica', text: 'Claridad, estructura y precisión para argumentar.' },
        { title: 'Iniciativa con criterio', text: 'Preguntar, investigar y proponer dentro del rol asignado.' },
        { title: 'Competencia digital', text: 'Usar tecnología con verificación de fuentes y cuidado de la información.' },
        { title: 'Integridad profesional', text: 'Reserva, responsabilidad y respeto por cada persona.' }
      ],
      commitment: 'Nuestro compromiso propuesto: mentoría, retroalimentación y tareas con un propósito formativo concreto.'
    },
    {
      id: 'alianza', type: 'closing', label: 'El siguiente paso', eyebrow: '05 / CONSTRUYAMOS LA ALIANZA',
      title: 'El próximo capítulo\nlo escribimos juntos.',
      description: 'Invitamos a las facultades de Derecho de Montería y la región a conversar sobre una alianza que conecte formación, práctica y futuro profesional.',
      actions: [
        { title: 'Abrir la conversación', text: 'Identificar a los responsables académicos y el interés compartido.' },
        { title: 'Diseñar el acuerdo', text: 'Precisar modalidad, supervisión, objetivos y condiciones.' },
        { title: 'Construir el plan', text: 'Definir selección, acompañamiento y evaluación de la experiencia.' }
      ],
      cta: 'Conversemos sobre la alianza',
      note: 'Propuesta institucional. No constituye una convocatoria abierta ni garantiza cupos, contratación o reconocimiento académico. Cualquier modalidad de práctica o judicatura requiere validación específica antes de ofrecerse.'
    }
  ]
};

export const promptFormats = {
  propuesta: 'una propuesta formal de dos páginas dirigida a las facultades de Derecho de Montería',
  convocatoria: 'un borrador de convocatoria para estudiantes de Derecho de últimos semestres',
  carrusel: 'un carrusel de Instagram de cuatro diapositivas, con texto y sugerencia visual por diapositiva',
  video: 'un guion de video de 45 segundos, con narración y descripción de escenas'
};

export function buildPrompt(format) {
  return `Actúa como Director de Recursos Humanos y Relaciones Institucionales de ASD Servicios Legales, firma de asesoría jurídica con sede en Montería, Colombia.\n\nRedacta ${promptFormats[format] || promptFormats.propuesta}.\n\nObjetivo: atraer talento universitario de últimos semestres y explorar alianzas formativas con facultades de Derecho. Presenta una relación ganar–ganar: mentoría de abogados titulados, aprendizaje supervisado con asuntos reales e investigación jurídica; a cambio, iniciativa, buena redacción, criterio y uso responsable de tecnología.\n\nDestaca la formación de la próxima generación de abogados de Córdoba. Tono corporativo, inspirador, claro y profesional. Explica los beneficios para la firma y para el estudiante sin superlativos no verificables ni promesas de contratación.\n\nNo inventes convenios vigentes, cupos, fechas, remuneración, duración ni acreditaciones. Marca esos datos como pendientes de definición cuando sean necesarios. Distingue práctica empresarial, consultorio jurídico y judicatura: no prometas equivalencias ni reconocimiento automático. Toda modalidad debe validarse con la universidad y bajo los requisitos aplicables. No atribuyas a estudiantes actuaciones reservadas a profesionales habilitados.\n\nCierra con una invitación a conversar sobre la alianza: contacto@asdservicioslegales.com.co. Entrega un borrador sujeto a revisión institucional antes de publicar.`;
}
