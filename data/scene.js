/** Escenario conceptual: estos edificios no representan sedes reales. */
export const sceneContent = {
  label: 'Del conocimiento a la experiencia',
  note: 'Arquitectura conceptual · Montería, Córdoba',
  models: {
    campus: 'assets/models/city/building-k.glb',
    firm: 'assets/models/city/building-skyscraper-a.glb',
    palm: 'assets/models/nature/tree_palmDetailedShort.glb'
  },
  stops: [
    { label: 'Universidad', title: 'Aquí comienza el potencial.', body: 'La academia aporta conocimiento, pensamiento crítico y una nueva forma de mirar el derecho.', camera: [8, 8, 13], target: [-0.5, 1.1, 0], span: 19 },
    { label: 'Conexión', title: 'El conocimiento encuentra su camino.', body: 'Una alianza une el talento universitario con la experiencia, la ética y la mentoría de la firma.', camera: [10, 11, 15], target: [0, 0.8, 0], span: 20 },
    { label: 'ASD', title: 'La experiencia transforma el talento.', body: 'En ASD, aprender significa participar con acompañamiento y construir criterio profesional.', camera: [12, 8, 13], target: [1.5, 1.4, 0], span: 18 }
  ]
};
