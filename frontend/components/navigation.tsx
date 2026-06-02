"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatedButton } from "./ui-custom";

function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span
      className={`${className} relative block shrink-0 overflow-hidden rounded-xl border border-primary/30 bg-white shadow-lg shadow-primary/15`}
    >
      <Image
        src="/logo.jpg"
        alt="Logo de Certiva"
        fill
        sizes="40px"
        className="scale-[1.45] object-contain"
        priority
      />
    </span>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showAdmin = process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-colors group-hover:bg-primary/30" />
              <BrandMark />
            </div>
            <span className="text-lg font-semibold text-foreground">Certiva</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Consultar Certificado
            </Link>
            {showAdmin && (
              <Link href="/admin">
                <AnimatedButton variant="primary" className="px-4 py-2 text-sm">
                  Panel local
                </AnimatedButton>
              </Link>
            )}
          </div>

          <button
            className="p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 py-4 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Consultar Certificado
              </Link>
              {showAdmin && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <AnimatedButton variant="primary" className="w-full text-sm">
                    Panel local
                  </AnimatedButton>
                </Link>
              )}
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <BrandMark className="h-9 w-9" />
              <span className="font-semibold text-foreground">Certiva</span>
            </Link>
            <p className="max-w-md text-sm text-muted-foreground">
              Consulta y descarga certificados emitidos por la organizacion de forma rapida y segura.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Buscar Certificado
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">Documentacion</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Contacto</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Certiva. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Terminos</span>
            <span>Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
