# Backend de certificados

Genera PDFs locales desde un Excel (`.xlsx` o `.csv`) y una plantilla HTML. Cada PDF se guarda en `storage/certificados` y queda indexado para consulta por documento.

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
