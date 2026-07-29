# 🦆 Taxpond

**Procesa, limpia y concilia millones de registros impositivos en milisegundos. Directamente en tu navegador.**

[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![DuckDB](https://img.shields.io/badge/DuckDB-WASM-yellow)](https://duckdb.org/)

Los sistemas tradicionales colapsan al cruzar reportes financieros masivos, y subir tus libros mayores a la nube expone información confidencial. **Taxpond** resuelve esto cambiando el paradigma: llevamos el motor de la base de datos a tu cliente.

> _"Los datos siempre fueron y serán tuyos. No solo son tuyos, sino que te los podemos mejorar sin exponerlos."_

## ✨ Características Principales

### 🔒 Privacidad Absoluta (Client-Side First)

Todo el procesamiento pesado (agrupaciones, filtros, cruces) ocurre en la memoria de tu dispositivo gracias a **DuckDB WASM**. Tus archivos CSV o Excel con datos financieros y contables sensibles nunca tocan nuestros servidores.

### ⚡ Rendimiento Extremo

Olvida las planillas que se tildan. Sube 500.000 filas y ejecuta agrupaciones o `JOINs` complejos en milisegundos sin consumir cuota de nube.

### ✅ Validador Masivo de Tax IDs

Detecta al instante identificadores impositivos rotos antes de presentar tus declaraciones. Taxpond incluye un motor nativo de expresiones regulares para validar formatos de múltiples países en bloque (CUIT, RUT, RFC, CNPJ) al instante y sin costo.

### 🤖 AI-Powered Data Cleaning (Premium)

Mejoramos tus datos sin exponerlos. A través de integraciones seguras, utilizamos modelos de lenguaje (LLMs) para mapear columnas sucias, categorizar gastos y normalizar formatos de moneda automáticamente.

## 🛠️ Stack Tecnológico

Taxpond está construido sobre una arquitectura moderna enfocada en el rendimiento y la experiencia de usuario:

- **Framework:** Next.js (App Router) + TypeScript
- **Data Engine:** DuckDB (WebAssembly)
- **Styling:** Tailwind CSS + Shadcn UI
- **Icons:** Lucide React

## 🚀 Getting Started

Levanta el entorno de desarrollo local en menos de 2 minutos:

```bash
# 1. Clona el repositorio
git clone [https://github.com/tu-usuario/taxpond.git](https://github.com/tu-usuario/taxpond.git)

# 2. Instala las dependencias
cd taxpond
npm install or pnpm install

# 3. Inicia el servidor de desarrollo
npm run dev or pnpm dev
```

Abre http://localhost:3000 en tu navegador para ver la aplicación en funcionamiento.

🗺️ Roadmap
[ ] Motor de procesamiento CSV/Excel en WASM.

[ ] Grilla de datos interactiva (Filtros y Group By).

[ ] Validador sintáctico de Tax IDs (Regex) para LATAM.

[ ] Integración AI (Chat-to-SQL y Auto-Categorización).

[ ] Live API Verification contra entidades gubernamentales (AFIP, Receita Federal, etc.).

[ ] Soporte para procesamiento Batch mediante colas.

🤝 Contribuciones
Taxpond es un proyecto de modelo Open Core. Creemos que la infraestructura de datos financieros debe ser auditable, transparente y accesible.

Las contribuciones de la comunidad son clave. Ya sea mejorando la UI, agregando validadores Regex para nuevos países, o mejorando el rendimiento de las consultas SQL locales. Lee nuestra guía de contribución CONTRIBUTING.md para empezar.

📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
