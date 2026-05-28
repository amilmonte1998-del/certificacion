"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileSpreadsheet, FileText, Sparkles, Upload, ArrowRight, CheckCircle2 } from "lucide-react";
import { GlassCard, AnimatedButton, FloatingGradient } from "@/components/ui-custom";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <FloatingGradient />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Automatización Inteligente</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            <span className="text-foreground">Generador Inteligente de</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Certificados
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Sube un archivo Excel y una plantilla PDF para generar certificados de participación automáticamente. Simple, rápido y profesional.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/admin">
              <AnimatedButton variant="primary" className="text-base px-8 py-4 gap-2 flex items-center">
                Comenzar
                <ArrowRight className="h-5 w-5" />
              </AnimatedButton>
            </Link>
            <Link href="/buscar">
              <AnimatedButton variant="secondary" className="text-base px-8 py-4">
                Consultar Certificado
              </AnimatedButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Abstract Certificate Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 lg:mt-24 relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2 space-y-4">
                <div className="h-4 bg-muted/50 rounded w-3/4" />
                <div className="h-4 bg-muted/30 rounded w-1/2" />
                <div className="h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg mt-6" />
                <div className="h-4 bg-muted/30 rounded w-2/3" />
                <div className="h-4 bg-muted/20 rounded w-1/3" />
              </div>
              <div className="flex flex-col items-center justify-center p-4 border border-dashed border-border/50 rounded-xl">
                <FileText className="h-12 w-12 text-primary/50 mb-2" />
                <span className="text-xs text-muted-foreground">Plantilla PDF</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      icon: FileSpreadsheet,
      title: "Sube tu Excel",
      description: "Carga un archivo Excel con los datos de los participantes: nombres, documentos y más.",
      step: "01",
    },
    {
      icon: Upload,
      title: "Sube la Plantilla",
      description: "Selecciona tu plantilla PDF con el diseño del certificado que deseas generar.",
      step: "02",
    },
    {
      icon: Sparkles,
      title: "Genera Automáticamente",
      description: "El sistema procesa los datos y genera todos los certificados en segundos.",
      step: "03",
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Cómo Funciona
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tres simples pasos para generar certificados profesionales
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={item}>
              <GlassCard className="h-full relative overflow-hidden group">
                {/* Step number background */}
                <div className="absolute -top-4 -right-4 text-8xl font-bold text-muted/20 group-hover:text-primary/10 transition-colors">
                  {step.step}
                </div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 w-8 lg:w-10 h-[2px] bg-gradient-to-r from-border to-transparent z-20" />
                )}
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      title: "Procesamiento Rápido",
      description: "Genera cientos de certificados en segundos con nuestro motor optimizado.",
    },
    {
      title: "Plantillas Personalizadas",
      description: "Usa tus propias plantillas PDF con el diseño de tu organización.",
    },
    {
      title: "Búsqueda Pública",
      description: "Los participantes pueden consultar y descargar sus certificados fácilmente.",
    },
    {
      title: "Datos Seguros",
      description: "Tus archivos y datos se procesan de forma segura y privada.",
    },
  ];

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Todo lo que necesitas para gestionar certificados
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Una plataforma completa diseñada para simplificar la generación y distribución de certificados profesionales.
            </p>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full" />
            <GlassCard hover={false} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">500+</div>
                  <div className="text-xs text-muted-foreground">Certificados/min</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <div className="text-3xl font-bold text-accent mb-1">99.9%</div>
                  <div className="text-xs text-muted-foreground">Disponibilidad</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">PDF</div>
                  <div className="text-xs text-muted-foreground">Formato</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">XLS</div>
                  <div className="text-xs text-muted-foreground">Compatible</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <FloatingGradient />
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <GlassCard hover={false} className="text-center py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Comienza a generar certificados hoy
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Simplifica tu proceso de certificación con nuestra plataforma intuitiva y poderosa.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/admin">
                <AnimatedButton variant="primary" className="text-base px-8 py-4 gap-2 flex items-center">
                  Ir al Panel Admin
                  <ArrowRight className="h-5 w-5" />
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </GlassCard>
      </div>
    </section>
  );
}
