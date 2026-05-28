"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  User,
  Calendar,
  Award,
} from "lucide-react";
import Link from "next/link";
import { GlassCard, AnimatedButton, LoadingSpinner, FloatingGradient, Skeleton } from "@/components/ui-custom";
import { Navbar } from "@/components/navigation";

interface Certificate {
  id: string;
  name: string;
  document: string;
  course: string;
  date: string;
  hours: number;
}

export default function SearchPage() {
  const [documentNumber, setDocumentNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentNumber.trim()) return;

    setIsSearching(true);
    setNotFound(false);
    setCertificate(null);
    setHasSearched(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response - simulate finding a certificate for specific documents
    if (documentNumber === "12345678" || documentNumber === "87654321") {
      setCertificate({
        id: "CERT-2026-001",
        name: documentNumber === "12345678" ? "María García López" : "Carlos Rodríguez Pérez",
        document: documentNumber,
        course: "Diplomado en Desarrollo Web Avanzado",
        date: "15 de Mayo, 2026",
        hours: 120,
      });
    } else {
      setNotFound(true);
    }

    setIsSearching(false);
  };

  const handleReset = () => {
    setDocumentNumber("");
    setCertificate(null);
    setNotFound(false);
    setHasSearched(false);
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="relative min-h-screen pt-24 pb-16 flex items-center justify-center">
        <FloatingGradient />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {!hasSearched || (!certificate && !notFound && !isSearching) ? (
              <motion.div
                key="search-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Header */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
                  >
                    <Search className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                    Consultar Certificado
                  </h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Ingresa tu número de documento para buscar y descargar tu certificado de participación.
                  </p>
                </div>

                {/* Search Card */}
                <GlassCard hover={false} className="p-8">
                  <form onSubmit={handleSearch}>
                    <div className="mb-6">
                      <label
                        htmlFor="document"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Número de Documento
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="document"
                          value={documentNumber}
                          onChange={(e) => setDocumentNumber(e.target.value)}
                          placeholder="Ej: 12345678"
                          className="w-full px-4 py-4 rounded-xl bg-input border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <User className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Prueba con: 12345678 o 87654321
                      </p>
                    </div>

                    <AnimatedButton
                      type="submit"
                      variant="primary"
                      disabled={isSearching || !documentNumber.trim()}
                      className="w-full py-4 text-base gap-2 flex items-center justify-center"
                    >
                      {isSearching ? (
                        <>
                          <LoadingSpinner className="w-5 h-5" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5" />
                          Buscar Certificado
                        </>
                      )}
                    </AnimatedButton>
                  </form>
                </GlassCard>

                {/* Back link */}
                <div className="mt-8 text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio
                  </Link>
                </div>
              </motion.div>
            ) : isSearching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard hover={false} className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <div className="flex gap-4">
                      <Skeleton className="h-12 flex-1 rounded-xl" />
                      <Skeleton className="h-12 flex-1 rounded-xl" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : certificate ? (
              <motion.div
                key="certificate-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Success Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    ¡Certificado Encontrado!
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Documento: {certificate.document}
                  </p>
                </div>

                {/* Certificate Card */}
                <GlassCard hover={false} className="p-8 mb-6">
                  {/* Certificate Preview */}
                  <div className="relative rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6 mb-6">
                    <div className="absolute top-4 right-4">
                      <Award className="h-8 w-8 text-primary/30" />
                    </div>
                    
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {certificate.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {certificate.id}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Award className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">Curso:</span>
                        <span className="text-foreground font-medium">{certificate.course}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">Fecha:</span>
                        <span className="text-foreground">{certificate.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">Duración:</span>
                        <span className="text-foreground">{certificate.hours} horas</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <AnimatedButton
                      variant="primary"
                      className="flex-1 py-4 gap-2 flex items-center justify-center"
                    >
                      <Download className="h-5 w-5" />
                      Descargar PDF
                    </AnimatedButton>
                    <AnimatedButton
                      variant="secondary"
                      onClick={handleReset}
                      className="flex-1 py-4"
                    >
                      Nueva Búsqueda
                    </AnimatedButton>
                  </div>
                </GlassCard>

                {/* Back link */}
                <div className="text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio
                  </Link>
                </div>
              </motion.div>
            ) : notFound ? (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Not Found Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Certificado No Encontrado
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    No hemos encontrado un certificado asociado al documento <span className="font-medium text-foreground">{documentNumber}</span>.
                  </p>
                </div>

                {/* Suggestions Card */}
                <GlassCard hover={false} className="p-8 mb-6">
                  <h3 className="font-medium text-foreground mb-4">
                    Posibles soluciones:
                  </h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center shrink-0 text-xs font-medium text-foreground">1</span>
                      Verifica que el número de documento esté escrito correctamente.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center shrink-0 text-xs font-medium text-foreground">2</span>
                      Asegúrate de usar el mismo documento con el que te registraste.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center shrink-0 text-xs font-medium text-foreground">3</span>
                      Contacta al organizador si el problema persiste.
                    </li>
                  </ul>

                  <div className="mt-6">
                    <AnimatedButton
                      variant="primary"
                      onClick={handleReset}
                      className="w-full py-4 gap-2 flex items-center justify-center"
                    >
                      <Search className="h-5 w-5" />
                      Intentar de Nuevo
                    </AnimatedButton>
                  </div>
                </GlassCard>

                {/* Back link */}
                <div className="text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio
                  </Link>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
