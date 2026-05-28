"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Users,
  Calendar,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard, AnimatedButton, LoadingSpinner, FloatingGradient } from "@/components/ui-custom";
import { Navbar } from "@/components/navigation";

interface FileUploadZoneProps {
  accept: string;
  icon: React.ElementType;
  title: string;
  description: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  fileType: "excel" | "pdf";
}

function FileUploadZone({
  accept,
  icon: Icon,
  title,
  description,
  file,
  onFileSelect,
  fileType,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <GlassCard hover={false} className="h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-xl border border-primary/30 bg-primary/5 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {fileType === "excel" ? (
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                ) : (
                  <FileText className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={removeFile}
                className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Eliminar archivo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span>Archivo cargado correctamente</span>
            </div>
          </motion.div>
        ) : (
          <motion.label
            key="upload-zone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300",
              isDragging
                ? "border-primary bg-primary/10 scale-[1.02]"
                : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
            )}
          >
            <input
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="sr-only"
            />
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                isDragging ? "bg-primary/20" : "bg-muted/50"
              )}
            >
              <Upload
                className={cn(
                  "h-6 w-6 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground text-sm">
                Arrastra tu archivo aquí
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                o haz clic para seleccionar
              </p>
            </div>
          </motion.label>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
}

function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
  return (
    <GlassCard className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      {trend && (
        <span className="ml-auto text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </GlassCard>
  );
}

export default function AdminPage() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock statistics
  const stats = {
    totalParticipants: 248,
    generatedPdfs: 1520,
    lastGeneration: "28 May 2026",
  };

  const handleGenerate = async () => {
    if (!excelFile || !pdfFile) {
      setError("Por favor, sube ambos archivos antes de continuar.");
      return;
    }

    setError(null);
    setIsGenerating(true);

    // Simulate generation process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsGenerating(false);
    setGenerationComplete(true);
  };

  const resetGeneration = () => {
    setExcelFile(null);
    setPdfFile(null);
    setGenerationComplete(false);
    setError(null);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="relative pt-24 pb-16">
        <FloatingGradient />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground">
              Genera certificados de participación de forma masiva
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            <StatCard
              icon={Users}
              label="Total Participantes"
              value={stats.totalParticipants}
            />
            <StatCard
              icon={FileText}
              label="PDFs Generados"
              value={stats.generatedPdfs}
              trend="+12%"
            />
            <StatCard
              icon={Calendar}
              label="Última Generación"
              value={stats.lastGeneration}
            />
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {generationComplete ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <GlassCard hover={false} className="max-w-2xl mx-auto text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    ¡Certificados Generados!
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Se han generado 248 certificados correctamente.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <AnimatedButton
                      variant="primary"
                      className="gap-2 flex items-center"
                    >
                      <Download className="h-4 w-4" />
                      Descargar Todos
                    </AnimatedButton>
                    <AnimatedButton
                      variant="secondary"
                      onClick={resetGeneration}
                    >
                      Generar Nuevos
                    </AnimatedButton>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
              >
                {/* Upload Zones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <FileUploadZone
                    accept=".xlsx,.xls,.csv"
                    icon={FileSpreadsheet}
                    title="Archivo Excel"
                    description="Lista de participantes (.xlsx, .xls, .csv)"
                    file={excelFile}
                    onFileSelect={setExcelFile}
                    fileType="excel"
                  />
                  <FileUploadZone
                    accept=".pdf"
                    icon={FileText}
                    title="Plantilla PDF"
                    description="Diseño del certificado (.pdf)"
                    file={pdfFile}
                    onFileSelect={setPdfFile}
                    fileType="pdf"
                  />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 flex items-center gap-3"
                    >
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Generate Button */}
                <div className="flex justify-center">
                  <AnimatedButton
                    variant="primary"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-10 py-4 text-base gap-3 flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <LoadingSpinner className="w-5 h-5" />
                        Generando Certificados...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generar Certificados
                      </>
                    )}
                  </AnimatedButton>
                </div>

                {/* Loading Progress */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mt-8 max-w-md mx-auto"
                    >
                      <GlassCard hover={false}>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Procesando archivos...
                            </span>
                            <span className="text-primary font-medium">68%</span>
                          </div>
                          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "68%" }}
                              transition={{ duration: 2, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            Generando 168 de 248 certificados
                          </p>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
