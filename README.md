# IMPACTORY 3.0 — GitHub-ready portfolio

This upgrade is based on the previous IMPACTORY 2.0 site, preserving its cinematic hero, face image, Infinite 3D Gallery, gaming cursor, HUD and original project logos.

## Upload to GitHub
Upload **all files and folders** from this package to the **repository root**, keeping the `assets/` folder structure. Commit the changes. Vercel should deploy automatically if connected. Use **Other** framework preset and no build command; output directory is the project root.

## Features
- Animated Idea Factory video in the compact top-left header; autoplay, muted, loop, inline; fallback wordmark.
- Cinematic original hero with face-only asset and original effects.
- Infinite 3D project gallery using seven uploaded official logo files, with keyboard/touch controls.
- Social Universe animated CSS perspective visual (not actual WebGL or movie-quality rendered VFX).
- Glowing gaming cursor and animated HUD.
- Client-side hash navigation (SPA-like section navigation; not a framework/router-based SPA).
- PWA manifest, install icons and service worker with basic offline fallback. HTTPS required for installation (Vercel provides HTTPS).

## Before publishing
1. Replace the generic LinkedIn URL in `index.html` with your real profile link.
2. Add your own social profile links if you want clickable social orbs.
3. Check each logo URL, e.g. `/assets/logos/just-video.png`.
4. Test on desktop and mobile; use Lighthouse to validate installability/performance.

The seven project logos are copied from your supplied originals without alteration. Their filenames are normalized for stable website paths.
