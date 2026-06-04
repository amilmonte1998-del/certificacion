"use client";

import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
import { motion } from "framer-motion";
=======
>>>>>>> 48f20a8978bd39c67f533567afe29fd0f5f071c7
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
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
<<<<<<< HEAD
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-colors group-hover:bg-primary/30" />
              <BrandMark />
            </div>
            <span className="text-lg font-semibold text-foreground">Certiva</span>
=======
          <Link href="/" className="flex min-w-0 items-center">
            <Image
              src="/brand/logo-text.png"
              alt="Certiva"
              width={148}
              height={44}
              priority
              sizes="(max-width: 640px) 128px, 148px"
              className="h-9 w-auto max-w-[136px] object-contain sm:h-10 sm:max-w-[148px]"
            />
>>>>>>> 48f20a8978bd39c67f533567afe29fd0f5f071c7
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Consultar certificado
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
<<<<<<< HEAD
            className="p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
=======
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
>>>>>>> 48f20a8978bd39c67f533567afe29fd0f5f071c7
            aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
<<<<<<< HEAD
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 py-4 md:hidden"
          >
=======
          <div className="border-t border-border py-4 md:hidden">
>>>>>>> 48f20a8978bd39c67f533567afe29fd0f5f071c7
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Consultar certificado
              </Link>
              {showAdmin && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <AnimatedButton variant="primary" className="w-full text-sm">
                    Panel local
                  </AnimatedButton>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
<<<<<<< HEAD
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
=======
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-7 text-center sm:text-left md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center">
              <Image
                src="/brand/logo-text.png"
                alt="Certiva"
                width={132}
                height={40}
                sizes="132px"
                className="h-8 w-auto object-contain sm:h-9"
              />
            </Link>
            <p className="mx-auto max-w-md text-sm text-muted-foreground sm:mx-0">
              Consulta y descarga certificados digitales emitidos por la organizacion de forma
              rapida y segura.
>>>>>>> 48f20a8978bd39c67f533567afe29fd0f5f071c7
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
<<<<<<< HEAD
                  Buscar Certificado
=======
                  Buscar certificado
>>>>>>> 48f20a8978bd39c67f533567afe29fd0f5f071c7
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Soporte</h4>
<<<<<<< HEAD
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">Documentacion</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Contacto</span>
              </li>
=======
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Documentacion</li>
              <li>Contacto</li>
>>>>>>> 48f20a8978bd39c67f533567afe29fd0f5f071c7
            </ul>
          </div>
        </div>

<<<<<<< HEAD
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Certiva. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
=======
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:pt-8 sm:text-left">
          <p>Copyright {new Date().getFullYear()} Certiva. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
>>>>>>> 48f20a8978bd39c67f533567afe29fd0f5f071c7
            <span>Terminos</span>
            <span>Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
