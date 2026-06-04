"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Download,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react";

import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AnimatedButton, FloatingGradient, GlassCard, LoadingSpinner } from "@/components/ui-custom";
import { Navbar } from "@/components/navigation";

interface FileUploadZoneProps {
  accept: string;
  icon: React.ElementType;
  title: string;
  description: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

interface GenerationResult {
  batch: {
    id: string;
    totalRows: number;
    generatedCount: number;
    skippedCount: number;
    errorCount: number;
  };
  downloadUrl: string;
  skipped: Array<{ rowNumber: number; reason: string }>;
  errors: Array<{ rowNumber: number; document?: string; reason: string }>;
}

interface Stats {
  totalParticipants: number;
  generatedPdfs: number;
  totalBatches: number;
  lastGeneration: string | null;
}

function FileUploadZone({
  accept,
  icon: Icon,
  title,
  description,
  file,
  onFileSelect,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];

    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <GlassCard hover={false} className="h-full">
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="break-words text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {file ? (
        <div className="relative rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={() => onFileSelect(null)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              aria-label="Eliminar archivo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-primary">
            <CheckCircle2 className="h-4 w-4" />
            <span>Archivo listo</span>
          </div>
        </div>
      ) : (
        <label
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-6 transition-all duration-300 sm:p-8",
            isDragging
              ? "scale-[1.02] border-primary bg-primary/10"
              : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={(event) => onFileSelect(event.target.files?.[0] || null)}
            className="sr-only"
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Arrastra tu archivo aqui</p>
            <p className="mt-1 text-xs text-muted-foreground">o haz clic para seleccionar</p>
          </div>
        </label>
      )}
    </GlassCard>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <GlassCard className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xl font-bold text-foreground sm:text-2xl">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </GlassCard>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Sin lotes";
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminClient() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalParticipants: 0,
    generatedPdfs: 0,
    totalBatches: 0,
    lastGeneration: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl("/api/estadisticas"))
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    if (!excelFile || !templateFile) {
      setError("Carga el Excel y la plantilla HTML antes de continuar.");
      return;
    }

    const formData = new FormData();
    formData.append("excel", excelFile);
    formData.append("plantilla", templateFile);

    setError(null);
    setResult(null);
    setIsGenerating(true);

    try {
      const response = await fetch(apiUrl("/api/certificados/generar"), {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "No fue posible generar los certificados.");
      }

      setResult(data);
      setStats((current) => ({
        totalParticipants: current.totalParticipants + data.batch.generatedCount,
        generatedPdfs: current.generatedPdfs + data.batch.generatedCount,
        totalBatches: current.totalBatches + 1,
        lastGeneration: new Date().toISOString(),
      }));
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "No fue posible generar los certificados."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const resetGeneration = () => {
    setExcelFile(null);
    setTemplateFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="relative overflow-hidden px-4 pb-12 pt-24 sm:pb-16">
        <FloatingGradient />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:52px_52px] pointer-events-none sm:bg-[size:64px_64px]" />

        <div className="relative z-10 mx-auto max-w-7xl sm:px-2 lg:px-4">
          <div className="mb-8 sm:mb-10">
            <h1 className="mb-2 text-2xl font-bold leading-tight text-foreground sm:text-4xl">
              Panel local de generacion
            </h1>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Carga un Excel y una plantilla HTML para crear PDFs con texto real.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-3 sm:mb-10 sm:grid-cols-3 sm:gap-4">
            <StatCard icon={Users} label="Participantes" value={stats.totalParticipants} />
            <StatCard icon={FileText} label="PDFs generados" value={stats.generatedPdfs} />
            <StatCard icon={Calendar} label="Ultima generacion" value={formatDate(stats.lastGeneration)} />
          </div>

            {result ? (
              <div>
                <GlassCard hover={false} className="mx-auto max-w-3xl py-10 text-center sm:py-12">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:h-20 sm:w-20">
                    <CheckCircle2 className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
                  </div>

                  <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
                    Certificados generados
                  </h2>
                  <p className="mb-8 text-sm text-muted-foreground sm:text-base">
                    {result.batch.generatedCount} PDF de {result.batch.totalRows} filas procesadas.
                  </p>

                  {(result.skipped.length > 0 || result.errors.length > 0) && (
                    <div className="mb-8 rounded-xl border border-border/50 bg-muted/20 p-4 text-left text-sm text-muted-foreground">
                      <p className="mb-2 font-medium text-foreground">Revision del lote</p>
                      {result.skipped.length > 0 && (
                        <p>{result.skipped.length} filas omitidas por falta de nombre o documento.</p>
                      )}
                      {result.errors.length > 0 && (
                        <p>{result.errors.length} filas tuvieron errores al generar PDF.</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <a
                      href={apiUrl(result.downloadUrl)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 sm:w-auto"
                    >
                      <Download className="h-4 w-4" />
                      Descargar lote
                    </a>
                    <AnimatedButton variant="secondary" onClick={resetGeneration}>
                      Generar otro lote
                    </AnimatedButton>
                  </div>
                </GlassCard>
              </div>
            ) : (
              <div>
                <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                  <FileUploadZone
                    accept=".xlsx,.csv"
                    icon={FileSpreadsheet}
                    title="Archivo Excel"
                    description="Lista de participantes"
                    file={excelFile}
                    onFileSelect={setExcelFile}
                  />
                  <FileUploadZone
                    accept=".html,.htm"
                    icon={FileCode2}
                    title="Plantilla HTML"
                    description="Diseno del certificado con placeholders"
                    file={templateFile}
                    onFileSelect={setTemplateFile}
                  />
                </div>

                {error && (
                  <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                    <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="flex justify-center">
                  <AnimatedButton
                    variant="primary"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex w-full items-center justify-center gap-3 px-8 py-4 text-base sm:w-auto sm:px-10"
                  >
                    {isGenerating ? (
                      <>
                        <LoadingSpinner className="h-5 w-5" />
                        Generando PDFs...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generar certificados
                      </>
                    )}
                  </AnimatedButton>
                </div>
              </div>
            )}
        </div>
      </div>
    </main>
  );
}
