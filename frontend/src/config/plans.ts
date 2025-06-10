interface PlanStyle {
  color: string;
  description: string;
  popular?: boolean;
}

export const planStyles: Record<string, PlanStyle> = {
  Basic: {
    color: "cyan",
    description: "Ideal para sitios web personales y proyectos pequeños"
  },
  "Mid-size": {
    color: "purple",
    description: "Perfecto para sitios web de empresas y aplicaciones",
    popular: true
  },
  Power: {
    color: "emerald",
    description: "Para aplicaciones de alto rendimiento y bases de datos"
  }
} as const