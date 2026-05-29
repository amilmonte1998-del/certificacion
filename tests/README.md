# Pruebas de certificados

Cada carpeta tiene:

- `datos.csv`: archivo compatible con Excel y con el backend.
- `plantilla.html`: plantilla lista para subir o usar por consola.

Puedes abrir el `.csv` con Excel si quieres editar los datos. El backend acepta `.xlsx` y `.csv`, asi que estos ejemplos funcionan directamente.

## Ejecutar un ejemplo

Desde `backend`:

```bash
npm run generate -- --excel ../tests/01-reconocimiento-guardameta/datos.csv --template ../tests/01-reconocimiento-guardameta/plantilla.html
```

Cambia el numero de carpeta para probar otros escenarios.

## Placeholders comunes

El backend siempre entiende estos campos si existen en el CSV:

```html
{{nombre}}
{{documento}}
{{curso}}
{{fecha}}
{{horas}}
{{codigo_certificado}}
{{fecha_generacion}}
```

Tambien puedes usar columnas personalizadas. Por ejemplo, una columna `Nombre Empresa` se usa como:

```html
{{nombre_empresa}}
```

Para evitar que un texto largo se sobreponga, usa:

```html
<div data-fit-text data-min-size="24">{{nombre}}</div>
```
