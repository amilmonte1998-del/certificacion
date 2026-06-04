"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { AnimatedButton } from "./ui-custom";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showAdmin = process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex min-w-0 items-center">
            <Image
              src="/brand/logo.png"
              alt="Certiva"
              width={148}
              height={44}
              priority
              sizes="(max-width: 640px) 128px, 148px"
              className="h-9 w-auto max-w-[136px] object-contain sm:h-10 sm:max-w-[148px]"
            />
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
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
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
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-7 text-center sm:text-left md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center">
              <Image
                src="/brand/logo.png"
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
                  Buscar certificado
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Documentacion</li>
              <li>Contacto</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:pt-8 sm:text-left">
          <p>Copyright {new Date().getFullYear()} Certiva. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Terminos</span>
            <span>Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
