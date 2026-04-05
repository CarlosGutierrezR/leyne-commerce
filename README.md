# 🛍️ Leyne Commerce

Plataforma de e-commerce moderna construida con arquitectura **Headless Commerce**, diseñada para transformar un catálogo tradicional en PDF en una experiencia digital real, escalable y orientada a negocio.

---

## ✨ Visión del Proyecto

Este proyecto nace de una necesidad concreta:

> Convertir un catálogo estático (PDF) en una tienda online funcional, interactiva y preparada para escalar.

El objetivo no fue solo “mostrar productos”, sino construir una **base sólida de e-commerce real**, con:

* Navegación estructurada
* Carrito persistente
* Checkout funcional
* Integración de pagos (Stripe)
* Modelo de datos escalable

---

## 🧠 Enfoque Arquitectónico

Se ha seguido un enfoque **Headless Commerce**, separando completamente:

* 🖥️ Frontend (experiencia de usuario)
* ⚙️ Backend (lógica de negocio + datos)
* 💳 Pagos (Stripe)

Esto permite:

* Escalar cada capa de forma independiente
* Mejorar rendimiento (Core Web Vitals)
* Mantener flexibilidad tecnológica

---

## 🏗️ Stack Tecnológico

### Frontend

* **Next.js 15+ (App Router)**
* **React Server Components**
* **Tailwind CSS**
* Estado: **Zustand**

### Backend

* **Node.js + Express**
* **Prisma ORM**
* Arquitectura REST

### Base de Datos

* **PostgreSQL (Neon - serverless)**

### Pagos

* **Stripe (modo test)**

### Infraestructura

* Preparado para deploy en:

  * **Vercel (frontend)**
  * **Node server (backend)**

---

## 📂 Estructura del Proyecto

```
leyne-commerce/
│
├── apps/
│   ├── storefront/        → Frontend (Next.js)
│   │   ├── app/           → Rutas App Router
│   │   ├── features/      → Lógica por dominios (catalog, cart, checkout)
│   │   └── public/        → Imágenes y assets
│   │
│   └── api/               → Backend (Express + Prisma)
│       ├── prisma/        → Schema + seed
│       ├── src/
│       │   ├── routes/    → Endpoints REST
│       │   ├── lib/       → Integraciones (Stripe)
│       │   └── generated/ → Cliente Prisma
│
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## 🧩 Modelo de Datos

El sistema está diseñado para escalar más allá de un catálogo simple:

* **Category** → Tipo de producto (ej: Pijamas)
* **Collection** → Línea o cápsula (ej: Primavera, Sensualidad)
* **Product** → Producto individual
* **ProductVariant** → Variante vendible
* **ProductImage** → Galería real

Esto permite separar correctamente:

> 🏷️ Taxonomía comercial vs 🎨 narrativa editorial

---

## 🛒 Funcionalidades Implementadas

### Catálogo

* Render dinámico desde base de datos
* Agrupación por categorías y colecciones
* Imágenes reales conectadas desde assets

### Producto (PDP)

* Galería interactiva
* Selección visual de imágenes
* CTA funcional de carrito

### Carrito

* Persistencia local + sincronización backend
* Añadir, eliminar y vaciar productos
* Estado consistente entre sesiones

### Checkout

* Formulario controlado
* Creación de orden en backend
* Integración con Stripe Checkout

### Pagos

* Flujo real con Stripe (test)
* Confirmación vía webhook (fuente de verdad)
* Estado de orden sincronizado

---

## 🔐 Flujo de Pago

1. Usuario crea orden
2. Se genera sesión de Stripe
3. Usuario paga en Stripe
4. Stripe envía webhook
5. Backend actualiza la orden → `paid`
6. Frontend refleja estado real

> ⚠️ El redirect NO confirma el pago. Solo el webhook.

---

## 🎯 Decisiones Clave

* No usar Redux → simplicidad con Zustand
* No depender de imágenes estáticas → uso de BD real
* No confiar en frontend para pagos → webhook obligatorio
* No mezclar colección con categoría → modelo escalable

---

## ⚠️ Estado Actual

### ✅ Estable

* Catálogo dinámico
* Carrito funcional
* Checkout conectado
* Base de datos poblada
* Galería interactiva

### 🔄 En progreso

* Stripe en modo test (requiere variables .env)
* Validación de stock
* Navegación por colecciones (rutas dedicadas)

---

## 🚀 Cómo ejecutar el proyecto

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Backend

```bash
pnpm --filter api dev
```

### 3. Frontend

```bash
pnpm --filter storefront dev
```

### 4. Seed de base de datos

```bash
pnpm --filter api exec tsx prisma/seed.ts
```

---

## 🔑 Variables de entorno (Backend)

```
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STOREFRONT_URL=http://localhost:3000
```

---

## 📌 Conclusión

Este proyecto no es solo una tienda, es:

> 🧱 Una base sólida de e-commerce real, preparada para escalar desde un catálogo simple hasta una plataforma completa.

Transforma un negocio tradicional en una experiencia digital moderna, manteniendo control total sobre datos, UX y lógica de negocio.

---

## 👨‍💻 Autor

Desarrollado por **Carlos Gutiérrez**
Ingeniería de Sistemas · Ciberseguridad 

---
