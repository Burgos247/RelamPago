# AGENTS.md — Guía para agentes de IA en RelámPago

## Qué es este proyecto

**RelámPago** es una PWA para cobrar con Bitcoin Lightning Network, pensada para comerciantes y emprendedores de Latinoamérica sin conocimientos técnicos de Bitcoin.

Repo: https://github.com/Burgos247/RelamPago
Deploy: https://relam-pago.vercel.app

## Arquitectura clave

- **Single-file app**: toda la lógica en `index.html` (HTML + CSS + JS inline)
- **Sin backend**: corre completamente en el browser
- **Dependencias via CDN**: `@getalby/lightning-tools` y `qrcode` importados desde esm.sh
- **PWA**: `manifest.json` + `sw.js` (service worker network-first)

## Flujo de cobro

1. Comerciante ingresa nombre + Lightning Address → validación LNURL-pay
2. QR permanente generado con `lightning:{address}`
3. Cobro con monto fijo: `ln.requestInvoice({ satoshi })` → QR con BOLT11
4. Detección de pago: polling a `/verify/{paymentHash}` cada 2s

## Archivos del proyecto

```
index.html        ← app completa (HTML + CSS + JS)
manifest.json     ← PWA manifest
sw.js             ← service worker
vite.config.js    ← dev server config
package.json      ← devDependencies (vite)
```

## Convenciones

- CSS con variables en `:root` para tema oscuro
- Funciones globales en `window.*` (usadas desde onclick en HTML)
- Estados de pantalla con clase `active` en `#screen-setup` / `#screen-dashboard`
- Perfil guardado en `localStorage['relampago_profile']`
- Historial en `localStorage['relampago_history']`

## Deploy

- **Prod**: https://relam-pago.vercel.app (Vercel, auto-deploy desde `main`)
- **Dev**: `npm run dev` → http://localhost:5173

## Dependencias principales

- `@getalby/lightning-tools` — Lightning Address, LNURL, invoice generation
- `qrcode` — canvas QR generation
- Yadio.io API — conversión fiat/BTC tiempo real
