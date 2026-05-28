# CertGen

Sistema para generar certificados PDF desde Excel + plantilla HTML y publicar una consulta por documento.

La arquitectura queda asi:

```text
Excel + plantilla HTML
  -> Backend genera PDF temporal
  -> Cloudflare R2 guarda el PDF
  -> Supabase Postgres guarda el indice
  -> Frontend consulta por documento
  -> Backend entrega una URL firmada de descarga
```

## Backend

```bash
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Antes de generar certificados, configura `backend/.env` con Supabase y Cloudflare R2. El SQL para Supabase esta en [backend/supabase/schema.sql](backend/supabase/schema.sql).

Genera certificados por API o por consola:

```bash
npm run generate -- --excel ./datos.xlsx --template ./templates/certificado-ejemplo.html
```

Los PDFs no quedan guardados en el repo: se suben a R2 con llaves como:

```text
certificados/12345678/lote-id/12345678-nombre-del-curso-a1b2c3d4.pdf
```

## Frontend publico

```bash
cd frontend
pnpm install
pnpm dev
```

La pagina principal muestra solo la consulta por documento. Configura `NEXT_PUBLIC_API_URL` si el backend no corre en `http://localhost:3001`.

Para usar el panel local de generacion, copia `frontend/.env.local.example` a `frontend/.env.local` y deja habilitadas las variables `NEXT_PUBLIC_ENABLE_ADMIN=true` y `ENABLE_ADMIN=true`.
