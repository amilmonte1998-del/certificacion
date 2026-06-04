"use client";

import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  AnimatedButton,
  FloatingGradient,
  GlassCard,
  LoadingSpinner,
  Skeleton,
} from "@/components/ui-custom";
import { Footer, Navbar } from "@/components/navigation";

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
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-background",
        className
      )}
    >
      {children}
    </a>
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

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

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

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pb-16">
        <FloatingGradient />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(17,17,17,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.035)_1px,transparent_1px)] bg-[size:52px_52px] pointer-events-none sm:bg-[size:72px_72px]" />

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          {!hasSearched && (
            <div>
              <div className="mb-7 text-center sm:mb-10">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 sm:mb-6 sm:h-16 sm:w-16">
                  <Search className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
                </div>
                <h1 className="mb-3 text-2xl font-bold leading-tight text-foreground sm:text-4xl">
                  Consulta de certificados
                </h1>
                <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                  Ingresa tu numero de documento para buscar y descargar tus certificados
                  digitales.
                </p>
              </div>

              <GlassCard hover={false} className="p-5 sm:p-8">
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
                        onChange={(event) => setDocumentNumber(event.target.value)}
                        placeholder="Ej: 12345678"
                        autoComplete="off"
                        inputMode="numeric"
                        className="w-full rounded-xl border border-border bg-input px-4 py-3.5 pr-12 text-base text-foreground transition placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 sm:py-4 sm:text-lg"
                      />
                      <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    disabled={isSearching || !documentNumber.trim()}
                    className="flex w-full items-center justify-center gap-2 py-3.5 text-base sm:py-4"
                  >
                    {isSearching ? (
                      <>
                        <LoadingSpinner className="h-5 w-5" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        Buscar certificado
                      </>
                    )}
                  </AnimatedButton>
                </form>
              </GlassCard>
            </div>
          )}

          {hasSearched && isSearching && (
            <GlassCard hover={false} className="p-5 sm:p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl sm:h-16 sm:w-16" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </GlassCard>
          )}

          {hasSearched && !isSearching && certificates.length > 0 && (
            <div>
              <div className="mb-7 text-center sm:mb-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 sm:h-16 sm:w-16">
                  <CheckCircle2 className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
                </div>
                <h2 className="mb-1 text-xl font-bold text-foreground sm:text-2xl">
                  {certificates.length === 1
                    ? "Certificado encontrado"
                    : "Certificados encontrados"}
                </h2>
                <p className="text-sm text-muted-foreground">Documento: {documentNumber}</p>
              </div>

              <div className="space-y-5">
                {certificates.map((certificate) => (
                  <GlassCard key={certificate.id} hover={false} className="p-4 sm:p-8">
                    <div className="relative rounded-xl border border-primary/30 bg-secondary/60 p-4 sm:p-6">
                      <Award className="absolute right-3 top-3 h-7 w-7 text-primary/35 sm:right-4 sm:top-4 sm:h-8 sm:w-8" />

                      <div className="mb-6 flex items-start gap-3 pr-7 sm:gap-4 sm:pr-8">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 sm:h-14 sm:w-14">
                          <FileText className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="mb-1 break-words text-lg font-bold leading-snug text-foreground sm:text-xl">
                            {certificate.name}
                          </h3>
                          <p className="break-words text-xs text-muted-foreground sm:text-sm">
                            Archivo: {certificate.fileName}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {certificate.course && (
                          <div className="flex items-start gap-3 text-sm">
                            <Award className="h-4 w-4 shrink-0 text-primary" />
                            <span className="text-muted-foreground">Curso:</span>
                            <span className="min-w-0 break-words font-medium text-foreground">
                              {certificate.course}
                            </span>
                          </div>
                        )}
                        {certificate.date && (
                          <div className="flex items-start gap-3 text-sm">
                            <Calendar className="h-4 w-4 shrink-0 text-primary" />
                            <span className="text-muted-foreground">Fecha:</span>
                            <span className="min-w-0 break-words text-foreground">
                              {certificate.date}
                            </span>
                          </div>
                        )}
                        {certificate.hours && (
                          <div className="flex items-start gap-3 text-sm">
                            <FileText className="h-4 w-4 shrink-0 text-primary" />
                            <span className="text-muted-foreground">Duracion:</span>
                            <span className="min-w-0 break-words text-foreground">
                              {certificate.hours} horas
                            </span>
                          </div>
                        )}
                        <div className="flex items-start gap-3 text-sm">
                          <Calendar className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-muted-foreground">Generado:</span>
                          <span className="min-w-0 break-words text-foreground">
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
            </div>
          )}

          {hasSearched && !isSearching && notFound && (
            <div>
              <div className="mb-7 text-center sm:mb-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 sm:h-16 sm:w-16">
                  <AlertCircle className="h-7 w-7 text-destructive sm:h-8 sm:w-8" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
                  Certificado no encontrado
                </h2>
                <p className="mx-auto max-w-md text-muted-foreground">
                  No encontramos certificados asociados al documento{" "}
                  <span className="break-words font-medium text-foreground">
                    {documentNumber}
                  </span>
                  .
                </p>
              </div>

              <GlassCard hover={false} className="mb-6 p-5 sm:p-8">
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
            </div>
          )}

          {hasSearched && !isSearching && error && (
            <GlassCard hover={false} className="p-5 text-center sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 sm:h-16 sm:w-16">
                <AlertCircle className="h-7 w-7 text-destructive sm:h-8 sm:w-8" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
                No pudimos consultar
              </h2>
              <p className="mx-auto mb-6 max-w-md text-muted-foreground">{error}</p>
              <AnimatedButton variant="primary" onClick={handleReset}>
                Volver a intentar
              </AnimatedButton>
            </GlassCard>
          )}

          {hasSearched && (
            <div className="mt-8 text-center">
              <Link
                href="/"
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
