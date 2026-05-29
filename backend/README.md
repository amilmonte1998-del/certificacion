# Backend de certificados

Genera PDFs desde un Excel (`.xlsx` o `.csv`) y una plantilla HTML. Los PDFs se suben a Cloudflare R2 y la informacion para consultarlos se guarda en Supabase Postgres.

## Lo que debes crear

### 1. Supabase

1. Crea un proyecto en Supabase.
2. Entra a **SQL Editor**.
3. Ejecuta el script [supabase/schema.sql](./supabase/schema.sql).
4. Ve a **Project Settings > API** y copia:
   - `Project URL`
   - `service_role key`

La `service_role key` solo va en el backend. No la pongas nunca en el frontend.

### 2. Cloudflare R2

1. En Cloudflare, ve a **R2 Object Storage**.
2. Crea un bucket, por ejemplo `certificados`.
3. Crea un API token o access keys para R2 con permisos de lectura/escritura sobre ese bucket.
4. Copia:
   - `Account ID`
   - `Access Key ID`
   - `Secret Access Key`
   - nombre del bucket

El bucket puede permanecer privado. El backend genera URLs firmadas temporales para descargar.

## Variables de entorno

Copia `.env.example` como `.env` dentro de `backend`:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Completa estos valores:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
R2_ACCOUNT_ID=tu-account-id
R2_ACCESS_KEY_ID=tu-access-key-id
R2_SECRET_ACCESS_KEY=tu-secret-access-key
R2_BUCKET=certificados
```

## Excel

La primera hoja debe incluir, como minimo:

- `nombre` o `nombre completo`
- `documento`, `cedula`, `cc` o `identificacion`

Campos opcionales recomendados:

- `curso`
- `fecha`
- `horas`

Tambien puedes agregar columnas propias y usarlas en la plantilla con placeholders normalizados. Por ejemplo, una columna `Nombre Empresa` se usa como `{{nombre_empresa}}`.

## Plantilla HTML

Usa placeholders con doble llave:

```html
{{nombre}}
{{documento}}
{{curso}}
{{fecha}}
{{horas}}
{{codigo_certificado}}
```

Para nombres largos, envuelve el texto en un elemento con `data-fit-text`:

```html
<div data-fit-text data-min-size="24">{{nombre}}</div>
```

El backend ajusta el tamano del texto antes de imprimir el PDF, evitando sellos o imagenes con espacios en blanco.

## Ejecutar

```bash
npm install
npm run dev
```

Generar desde consola:

```bash
npm run generate -- --excel ./datos.xlsx --template ./templates/certificado-ejemplo.html
```

Generar por API:

```bash
curl -F "excel=@datos.xlsx" -F "plantilla=@plantilla.html" http://localhost:3001/api/certificados/generar
```

Consultar:

```bash
curl "http://localhost:3001/api/certificados?documento=12345678"
```
