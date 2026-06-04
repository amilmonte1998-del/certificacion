# Certiva

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

## Ejemplos de prueba

En [tests](tests) hay varias carpetas con datos y plantillas HTML:

- `01-reconocimiento-guardameta`: inspirado en el reconocimiento de la imagen, usa nombre y documento.
- `02-certificado-minimo`: solo nombre y documento.
- `03-curso-horas-fecha`: curso, fecha e intensidad horaria.
- `04-evento-corporativo-columnas-extra`: columnas personalizadas como empresa, cargo y ciudad.
- `05-taller-nombres-largos`: prueba de ajuste automatico para nombres largos.
- `06-constancia-asistencia`: constancia en formato vertical.

Cada ejemplo trae `datos.csv`, que puedes abrir con Excel y que el backend procesa directamente.

## Frontend publico

```bash
cd frontend
npm install
npm run dev
```

La pagina principal muestra solo la consulta por documento. Configura `NEXT_PUBLIC_API_URL` si el backend no corre en `http://localhost:3001`.

Para usar el panel local de generacion, copia `frontend/.env.local.example` a `frontend/.env.local` y deja habilitadas las variables `NEXT_PUBLIC_ENABLE_ADMIN=true` y `ENABLE_ADMIN=true`.
