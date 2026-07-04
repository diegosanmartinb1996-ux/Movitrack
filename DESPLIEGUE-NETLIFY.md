# Publicar MOVITRACK en Netlify

Este sitio es una app **Next.js** con contenido dinámico (los autos se leen desde
Sanity en vivo). Por eso **no se publica arrastrando una carpeta estática**: Netlify
tiene que *construirlo* en su servidor. Hay dos formas de hacerlo.

## Opción A — Conectar con GitHub (recomendada)

Cada vez que se cargue un auto en el panel aparece solo (no hace falta redeploy).
Y cualquier cambio de código se publica solo al subirlo.

1. Sube este proyecto a un repositorio de **GitHub**.
2. En **app.netlify.com** → **Add new site → Import an existing project**.
3. Elige GitHub y selecciona el repositorio.
4. Netlify detecta Next.js solo. Deja el comando `npm run build`. Clic en **Deploy**.
5. En ~2 minutos queda en línea con una URL tipo `movitrack.netlify.app`.

## Opción B — Netlify CLI (sube la carpeta desde el computador)

1. Instala la CLI (una vez): `npm install -g netlify-cli`
2. Desde esta carpeta: `netlify login`
3. Publica: `netlify deploy --build --prod`

## Después de publicar (importante)

1. **Autorizar el dominio en Sanity** para que el panel y el catálogo funcionen:
   - Ve a **sanity.io/manage → proyecto → API → CORS Origins → Add**.
   - Agrega la URL de Netlify (ej. `https://movitrack.netlify.app`) con **Allow credentials**.
2. El panel quedará disponible en `https://tu-sitio/studio`.
3. Cuando tengas tu dominio propio (ej. `movitrack.cl`), se conecta en Netlify
   (**Domain settings**) y se agrega también como CORS origin en Sanity.

## Notas

- Las claves de Sanity que usa el sitio son **públicas** (Project ID) y ya vienen en
  el archivo `.env`, así que Netlify construye sin configuración extra.
- Node 20 se fija en `netlify.toml`.
