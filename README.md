# CertGen

Sistema para generar certificados PDF de forma local desde Excel + plantilla HTML y publicar solo la consulta por documento.

## Backend local

```bash
cd backend
npm install
npm run dev
```

Genera certificados por API o por consola:

```bash
npm run generate -- --excel ./datos.xlsx --template ./templates/certificado-ejemplo.html
```

Los PDFs se guardan en `backend/storage/certificados` con nombres como:

```text
12345678-nombre-del-curso-a1b2c3d4.pdf
```

## Frontend publico

```bash
cd frontend
pnpm install
pnpm dev
```

La pagina principal muestra solo la consulta por documento. Configura `NEXT_PUBLIC_API_URL` si el backend no corre en `http://localhost:3001`.

Para usar el panel local de generacion, copia `frontend/.env.local.example` a `frontend/.env.local` y deja habilitadas las variables `NEXT_PUBLIC_ENABLE_ADMIN=true` y `ENABLE_ADMIN=true`.
