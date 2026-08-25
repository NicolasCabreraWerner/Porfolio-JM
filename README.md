# Portfolio — Jacqueline Mónaco

Sitio estático del portfolio de arquitectura e interiorismo de Jacqueline Mónaco.
Desplegado en Railway desde este repositorio.

## Estructura

```
public/
  index.html      · el sitio completo (HTML + CSS + JS en un archivo)
  images/         · 55 imágenes en WebP, nombradas por hash
server.js         · servidor estático sin dependencias
package.json      · npm start → node server.js
```

## Desarrollo local

```bash
npm start          # http://localhost:3000
```

No hay dependencias que instalar ni paso de build.

## Editar el contenido

El sitio trae un editor incorporado (perfil, proyectos, experiencia, formación).
Está oculto para las visitas y se abre agregando `?edit=1` a la URL:

```
https://<dominio>/?edit=1
```

Aparece el botón **Editar portfolio** abajo a la derecha. Dos formas de guardar:

- **Guardar para mí** — los cambios quedan en ese navegador, sirve para probar.
- **Guardar y exportar HTML** — descarga un `index.html` con los cambios aplicados.
  Reemplazá `public/index.html` por ese archivo, commiteá y Railway redespliega solo.
  Las imágenes no se tocan: el HTML las referencia por ruta relativa.

## Agregar o cambiar imágenes

Poné el `.webp` (o `.jpg`) en `public/images/` y apuntá el `src` del `<figure>`
correspondiente en `index.html`. Conviene no pasar de 1600 px de lado mayor
para que el sitio siga cargando rápido en celular.

## Notas

- El portfolio original era un único HTML de 23,8 MB con las fotos incrustadas
  en base64 y 54 de ellas duplicadas. Acá las imágenes viven como archivos
  aparte, en WebP: el HTML bajó a ~61 KB y las fotos a ~5,9 MB en total, que
  además se cargan solo cuando se abre cada proyecto.
- Los botones "Abrir proyecto ejecutivo (PDF)" se sacaron porque apuntaban a
  archivos que no existían. Para reponerlos: subí los PDF a `public/pdfs/` y
  volvé a agregar el bloque del botón apuntando a `pdfs/<archivo>.pdf`.
