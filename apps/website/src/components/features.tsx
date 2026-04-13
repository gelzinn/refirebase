import { Database, Shield, Zap, Box, Cloud, LineChart } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Firestore Simplificado",
      description: "Queries de uma linha para buscar, filtrar e ordenar dados sem complicações.",
      icon: Database,
      className: "md:col-span-2",
    },
    {
      title: "Auth em Segundos",
      description: "Social login e autenticação de email prontos para uso.",
      icon: Shield,
      className: "md:col-span-1",
    },
    {
      title: "Realtime Sync",
      description: "Dados sincronizados em tempo real com facilidade extrema.",
      icon: Zap,
      className: "md:col-span-1",
    },
    {
      title: "Storage Wrapper",
      description: "Upload e download de arquivos com uma API intuitiva.",
      icon: Cloud,
      className: "md:col-span-1",
    },
    {
      title: "Type Safe",
      description: "Totalmente escrito em TypeScript com auto-complete inteligente.",
      icon: Box,
      className: "md:col-span-1",
    },
  ];

  return (
    <section id="features" className="py-24 bg-black/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Tudo o que você precisa</h2>
          <p className="text-muted-foreground text-lg">Uma experiência de desenvolvedor superior para projetos Firebase.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className={`p-8 rounded-3xl glass hover:bg-white/10 transition-colors group ${feature.className}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
