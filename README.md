# ⚡ RelámPago

**Cobrá con Lightning Network, sin complicaciones.**

RelámPago es una app web (PWA) pensada para comerciantes y emprendedores de Latinoamérica que quieren recibir pagos con Bitcoin Lightning — sin necesidad de saber nada técnico.

> Proyecto desarrollado para la **Lightning Hackathon FOUNDATIONS 2026** de [La Crypta](https://lacrypta.ar).

---

## 🎯 ¿Qué problema resuelve?

Lightning Network permite pagos instantáneos y casi sin comisiones. Pero la experiencia de cobrar sigue siendo para técnicos: invoices, bolt11, sats... RelámPago elimina esa barrera.

**En 2 pasos, cualquier comerciante tiene su propio QR para cobrar.**

---

## ✨ Funcionalidades

| Feature | Descripción |
|---------|-------------|
| **QR permanente** | Generá tu QR una vez y pegalo en tu local. Tu cliente lo escanea y te paga |
| **Cobro con monto fijo** | Ingresá cuánto querés cobrar en tu moneda local y generá un QR específico |
| **9 monedas LATAM** | ARS, MXN, COP, BRL, CLP, PEN, UYU, USD, EUR con conversión en tiempo real |
| **Detección automática de pagos** | La app detecta cuando te pagan y te avisa con sonido y animación |
| **Historial de cobros** | Registro local de todos tus cobros con fecha, monto y concepto |
| **PWA instalable** | Se instala como app nativa en el celular, funciona offline |
| **Página de cobro compartible** | Compartí un link para que te paguen desde cualquier lugar |
| **UX para novatos** | Lenguaje simple, pasos guiados, sin jerga técnica |

---

## 🚀 Demo rápida

```bash
# Clonar el repositorio
git clone https://github.com/Burgos247/RelamPago.git
cd RelamPago

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir http://localhost:5173 en el navegador.

---

## 📱 ¿Cómo se usa?

### Para el comerciante:
1. Ingresá el nombre de tu negocio
2. Poné tu Lightning Address (es gratis — creala en [Alby](https://getalby.com), [Blink](https://blink.sv) o [Primal](https://primal.net))
3. ¡Listo! Ya tenés tu QR permanente para cobrar

### Para cobrar un monto específico:
1. Andá a la pestaña **💰 Cobrar**
2. Elegí tu moneda y poné el monto
3. La app convierte a sats en tiempo real y genera el QR
4. Tu cliente escanea y paga — vos recibís confirmación automática

---

## 🏗️ Arquitectura

- **Single-file app** — Todo en `index.html`, sin build step necesario
- **ES Modules** — Imports directos desde CDN (esm.sh)
- **Zero backend** — Todo corre en el navegador del comerciante
- **PWA** — Service worker con estrategia network-first + manifest instalable

### Dependencias principales:
| Librería | Uso |
|----------|-----|
| `@getalby/lightning-tools` | Resolver Lightning Address, generar invoices |
| `qrcode` | Generación de QR en canvas |
| [Yadio.io API](https://yadio.io) | Conversión fiat/BTC en tiempo real |

### Estructura:
```
RelamPago/
├── index.html        # App completa (HTML + CSS + JS)
├── manifest.json     # PWA manifest
├── sw.js             # Service worker (network-first cache)
├── vite.config.js    # Config del dev server
└── package.json      # Dependencias
```

---

## 🔧 Stack técnico

- **Lightning Address** via LNURL-pay para generar invoices
- **Verificación de pagos** polling al endpoint `/verify/{paymentHash}` del proveedor LNURL
- **Conversión fiat** en tiempo real usando la API de Yadio.io
- **Web Audio API** para sonido de confirmación de pago
- **Web Share API** para compartir QR y página de cobro
- **localStorage** para persistencia de perfil e historial

---

## 🌎 Pensado para LATAM

- Monedas locales como primera opción (fiat-first, no sats-first)
- Lenguaje simple en español, sin jerga de Bitcoin
- Guías paso a paso para usuarios que nunca usaron Lightning
- Links a wallets gratuitas disponibles en la región
- Montos rápidos adaptados a cada moneda

---

## 🏆 Hackathon FOUNDATIONS — Marzo 2026

- **Programa**: Lightning Hackathons de La Crypta
- **Tema**: Lightning Payments Basics
- **Premio**: 1,000,000 sats
- **Info**: [hackaton.lacrypta.ar](https://hackaton.lacrypta.ar)

---

## 📚 Recursos

- [Lightning Network](https://lightning.network/)
- [LNURL Specs](https://github.com/lnurl/luds)
- [Alby Lightning Tools](https://github.com/getAlby/lightning-tools)
- [Veintiuno - Comunidad Bitcoin LATAM](https://veintiuno.lat/)

---

Hecho con ⚡ para la comunidad Lightning de Latinoamérica.
