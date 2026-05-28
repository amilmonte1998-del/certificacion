"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";

import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  AnimatedButton,
  FloatingGradient,
  GlassCard,
  LoadingSpinner,
  Skeleton,
} from "@/components/ui-custom";
import { Navbar } from "@/components/navigation";

interface Certificate {
  id: string;
  name: string;
  document: string;
  course?: string;
  date?: string;
  hours?: string | number;
  fileName: string;
  createdAt: string;
  downloadUrl: string;
}

function DownloadLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.a
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      href={href}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
        className
      )}
    >
      {children}
    </motion.a>
  );
}

function formatDate(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function CertificateSearch() {
  const [documentNumber, setDocumentNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentNumber.trim()) {
      return;
    }

    setIsSearching(true);
    setNotFound(false);
    setCertificates([]);
    setHasSearched(true);
    setError(null);

    try {
      const response = await fetch(
        apiUrl(`/api/certificados?documento=${encodeURIComponent(documentNumber.trim())}`)
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "No fue posible consultar el documento.");
      }

      const foundCertificates = Array.isArray(data.certificates) ? data.certificates : [];
      setCertificates(foundCertificates);
      setNotFound(foundCertificates.length === 0);
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "No fue posible conectar con el servidor de certificados."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setDocumentNumber("");
    setCertificates([]);
    setNotFound(false);
    setHasSearched(false);
    setError(null);
  };

  const showForm = !hasSearched || (!certificates.length && !notFound && !isSearching && !error);

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-24 sm:px-6">
        <FloatingGradient />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="search-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                  >
                    <Search className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
                    Consultar Certificado
                  </h1>
                  <p className="mx-auto max-w-md text-muted-foreground">
                    Ingresa tu numero de documento para buscar y descargar los certificados disponibles.
                  </p>
                </div>

                <GlassCard hover={false} className="p-8">
                  <form onSubmit={handleSearch}>
                    <div className="mb-6">
                      <label
                        htmlFor="document"
                        className="mb-2 block text-sm font-medium text-foreground"
                      >
                        Numero de documento
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="document"
                          value={documentNumber}
                          onChange={(e) => setDocumentNumber(e.target.value)}
                          placeholder="Ej: 12345678"
                          className="w-full rounded-xl border border-border/50 bg-input px-4 py-4 text-lg text-foreground transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <User className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    <AnimatedButton
                      type="submit"
                      variant="primary"
                      disabled={isSearching || !documentNumber.trim()}
                      className="flex w-full items-center justify-center gap-2 py-4 text-base"
                    >
                      {isSearching ? (
                        <>
                          <LoadingSpinner className="h-5 w-5" />
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
                      <Skeleton className="h-16 w-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </GlassCard>
              </motion.div>
            ) : certificates.length ? (
              <motion.div
                key="certificate-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                  >
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h2 className="mb-1 text-2xl font-bold text-foreground">
                    {certificates.length === 1
                      ? "Certificado encontrado"
                      : "Certificados encontrados"}
                  </h2>
                  <p className="text-sm text-muted-foreground">Documento: {documentNumber}</p>
                </div>

                <div className="space-y-5">
                  {certificates.map((certificate) => (
                    <GlassCard key={certificate.id} hover={false} className="p-6 sm:p-8">
                      <div className="relative rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-5 sm:p-6">
                        <Award className="absolute right-4 top-4 h-8 w-8 text-primary/30" />

                        <div className="mb-6 flex items-start gap-4 pr-8">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <FileText className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="mb-1 text-xl font-bold text-foreground">
                              {certificate.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Archivo: {certificate.fileName}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {certificate.course && (
                            <div className="flex items-center gap-3 text-sm">
                              <Award className="h-4 w-4 shrink-0 text-primary" />
                              <span className="text-muted-foreground">Curso:</span>
                              <span className="font-medium text-foreground">
                                {certificate.course}
                              </span>
                            </div>
                          )}
                          {certificate.date && (
                            <div className="flex items-center gap-3 text-sm">
                              <Calendar className="h-4 w-4 shrink-0 text-primary" />
                              <span className="text-muted-foreground">Fecha:</span>
                              <span className="text-foreground">{certificate.date}</span>
                            </div>
                          )}
                          {certificate.hours && (
                            <div className="flex items-center gap-3 text-sm">
                              <FileText className="h-4 w-4 shrink-0 text-primary" />
                              <span className="text-muted-foreground">Duracion:</span>
                              <span className="text-foreground">{certificate.hours} horas</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 shrink-0 text-primary" />
                            <span className="text-muted-foreground">Generado:</span>
                            <span className="text-foreground">
                              {formatDate(certificate.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <DownloadLink
                          href={apiUrl(certificate.downloadUrl)}
                          className="flex-1 gap-2 py-4"
                        >
                          <Download className="h-5 w-5" />
                          Descargar PDF
                        </DownloadLink>
                        <AnimatedButton
                          variant="secondary"
                          onClick={handleReset}
                          className="flex-1 py-4"
                        >
                          Nueva busqueda
                        </AnimatedButton>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            ) : notFound ? (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
                  >
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </motion.div>
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    Certificado no encontrado
                  </h2>
                  <p className="mx-auto max-w-md text-muted-foreground">
                    No encontramos certificados asociados al documento{" "}
                    <span className="font-medium text-foreground">{documentNumber}</span>.
                  </p>
                </div>

                <GlassCard hover={false} className="mb-6 p-8">
                  <h3 className="mb-4 font-medium text-foreground">Puedes revisar:</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li>Que el numero de documento este escrito correctamente.</li>
                    <li>Que uses el mismo documento con el que te registraste.</li>
                    <li>Que el certificado ya haya sido generado por la organizacion.</li>
                  </ul>

                  <div className="mt-6">
                    <AnimatedButton
                      variant="primary"
                      onClick={handleReset}
                      className="flex w-full items-center justify-center gap-2 py-4"
                    >
                      <Search className="h-5 w-5" />
                      Intentar de nuevo
                    </AnimatedButton>
                  </div>
                </GlassCard>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard hover={false} className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    No pudimos consultar
                  </h2>
                  <p className="mx-auto mb-6 max-w-md text-muted-foreground">{error}</p>
                  <AnimatedButton variant="primary" onClick={handleReset}>
                    Volver a intentar
                  </AnimatedButton>
                </GlassCard>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {!showForm && (
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
