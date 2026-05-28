"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatedButton } from "./ui-custom";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
              <FileText className="relative h-8 w-8 text-primary" />
            </div>
            <span className="font-semibold text-lg text-foreground">CertGen</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/buscar"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Consultar Certificado
            </Link>
            <Link href="/admin">
              <AnimatedButton variant="primary" className="text-sm px-4 py-2">
                Panel Admin
              </AnimatedButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 py-4"
          >
            <div className="flex flex-col gap-4">
              <Link
                href="/buscar"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Consultar Certificado
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <AnimatedButton variant="primary" className="w-full text-sm">
                  Panel Admin
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">CertGen</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Genera certificados de participación de forma automática y profesional.
              Simplifica tu flujo de trabajo con nuestra plataforma inteligente.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4 text-sm">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Generar Certificados
                </Link>
              </li>
              <li>
                <Link href="/buscar" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Buscar Certificado
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4 text-sm">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground text-sm">Documentación</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Contacto</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} CertGen. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Términos</span>
            <span>Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
