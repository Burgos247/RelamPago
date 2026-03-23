# CLAUDE.md — Contexto del proyecto RelámPago

## Qué es este proyecto

**RelámPago** es una PWA para cobrar con Bitcoin Lightning Network, pensada para comerciantes y emprendedores de Latinoamérica que no tienen conocimientos técnicos de Bitcoin.

Desarrollado para la Lightning Hackathon FOUNDATIONS 2026 de La Crypta.

## Arquitectura

- **Single-file app**: toda la lógica vive en `index.html` (HTML + CSS + JS inline)
- **Sin backend**: corre completamente en el browser del comerciante
- **Dependencias desde CDN**: `@getalby/lightning-tools` y `qrcode` se importan vía esm.sh
- **PWA**: `manifest.json` + `sw.js` (service worker network-first)

## Flujo principal

1. Comerciante ingresa nombre del negocio + Lightning Address
2. App valida la dirección con LNURL-pay
3. Se genera QR permanente con `lightning:{address}`
4. Para cobrar monto fijo: llama a `ln.requestInvoice({ satoshi })` y genera QR con BOLT11
5. Detección automática de pago via polling al endpoint `/verify/{paymentHash}`

## Stack técnico

- `@getalby/lightning-tools` — Lightning Address resolver, invoice generation
- `qrcode` — generación de QR en canvas
- [Yadio.io API](https://yadio.io) — conversión fiat/BTC en tiempo real
- Web Audio API — sonido de confirmación (thunder effect)
- Web Share API — compartir QR y link de cobro
- localStorage — persistencia de perfil e historial

## Archivos importantes

```
index.html        ← app completa (NO separar en múltiples archivos sin motivo)
manifest.json     ← PWA manifest (nombre, íconos, colores)
sw.js             ← service worker (cache network-first)
vite.config.js    ← solo para dev server, no modifica el HTML
package.json      ← dependencias de dev (vite)
```

## Convenciones

- El CSS usa variables en `:root` para el tema oscuro
- Las funciones globales se exponen en `window.*` para los onclick del HTML
- Los estados de pantalla se manejan con clases CSS `active` en `#screen-setup` y `#screen-dashboard`
- El historial de cobros se guarda en `localStorage` bajo la clave `relampago_history`
- El perfil del comerciante se guarda bajo `relampago_profile`

## Deploy

- **Producción**: https://relam-pago.vercel.app (Vercel, auto-deploy desde main)
- **Dev local**: `npm run dev` → http://localhost:5173
