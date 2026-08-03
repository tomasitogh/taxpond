# Design Decisions — Taxpond

## General Principles

- **Librería UI:** Shadcn UI + Lucide React para iconos.
- **Estilo visual:** Limpio y minimalista, con bordes sutiles y sin sombras pesadas.
- **Responsividad:** Los layouts deben adaptarse a diferentes tamaños de pantalla.

---

## Typography

- **Inter:** Se usa para toda la interfaz: encabezados, botones, texto general, etiquetas de navegación.
- **Space Grotesk (o similar geométrica):** Se usa exclusivamente para datos numéricos y financieros. Se recomienda aplicar la clase `tabular-nums` para que los números ocupen el mismo ancho y se alineen correctamente en tablas y gráficos.
- **Tabular lining:** Un consejo extra sobre UX: Dado que es un SaaS de impuestos y datos, las tablas numéricas (grids) se verán muy beneficiadas si usas fuentes "tabular lining" (números que ocupan el mismo ancho). Esto hará que tus reportes financieros se vean perfectamente alineados en las columnas.

---

## Geometry & Shapes

- **Botones:** Todos los botones deben ser completamente redondeados con la clase `rounded-full`.
- **Contenedores / Cards:** Usar `rounded-xl` con bordes de 1px sutiles. No se deben usar sombras pesadas (`shadow-lg` o similares). Preferir separación visual mediante bordes y espaciado.

---

## Colors (Light / Dark Mode)

El proyecto soporta modo claro y oscuro a través de clases `dark:` de Tailwind. Los modos se alternan con un toggle en la navbar.

### Light Mode

- **Fondo principal:** Blanco puro (`bg-white`).
- **Texto principal:** Negro (`text-black`).
- **Bordes:** Gris claro (`border-gray-200` o similar).
- **Botones de acción principal:** Amarillo (`bg-[#FFD600]`) con texto negro (`text-black`).

### Dark Mode

- **Fondo principal:** Negro puro (`bg-black`).
- **Texto principal:** Blanco (`text-white`).
- **Bordes:** Gris oscuro (`border-gray-800` o similar).
- **Botones de acción principal:** Amarillo (`bg-[#FFD600]`) con texto negro (`text-black`). **No cambian** entre modos.

---

## Navigation Bar (Navbar)

Componente global usado en el layout de toda la aplicación.

### Estructura

| Sección       | Contenido                                                                    | Comportamiento                                                                                      |
| ------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Izquierda** | Logo "Taxpond"                                                               | Enlace al home (`/`).                                                                               |
| **Centro**    | Links "Products" y "Company"                                                 | Al hacer hover sobre "Products", se despliega un dropdown modal centrado justo debajo de la navbar. |
| **Derecha**   | Selector de idioma (ES \| EN) + Toggle de modo oscuro/claro (icono Sun/Moon) | El toggle cambia la apariencia global de la app.                                                    |

### Dropdown de "Products"

- Aparece al hacer hover sobre el link "Products".
- Contiene una opción con:
  - **Título:** "Tax reports processor"
  - **Subtítulo:** "Try for free!" (texto más pequeño, opacidad reducida).
- Al hacer clic, redirige a la ruta `/tax-processor`.

---

## Pages

### 1. Homepage (`app/page.tsx`)

- Extremadamente minimalista.
- Debajo de la navbar, un lienzo limpio y vacío que da la bienvenida al usuario a Taxpond.
- No hay elementos visuales adicionales en esta página inicial.

### 2. Tax Processor Page (`app/tax-processor/page.tsx`)

- Layout centrado en pantalla usando flexbox o grid.
- **Lado izquierdo:** Área de "Upload file" grande y claramente definida, con un icono de Upload.
- **Centro:** Icono de flecha hacia la derecha que indica el flujo de datos.
- **Lado derecho:** Área placeholder mostrando una visualización de gráfico de barras (puede ser un SVG placeholder o un mockup en CSS puro).

---

## Code Guidelines

- Código simple, modular y bien estructurado.
- Priorizar la estructura y el layout de la UI por sobre la lógica de negocio.
- No implementar lógica de backend compleja en etapas iniciales.
