# Guía Paso a Paso: Creación del Gestor de Recetas en Angular

Esta guía detalla detalladamente todo el proceso realizado para construir la aplicación **GourmetApp**, un gestor de recetas culinarias desarrollado en **Angular** (versión moderna standalone) con persistencia en `localStorage`.

---

## 📋 Requisitos Previos
*   **Node.js** instalado (versión utilizada en el desarrollo: `v24.14.1`).
*   **npm** instalado (versión utilizada en el desarrollo: `11.11.0`).

---

## 🛠️ Paso 1: Inicialización del Proyecto Angular
Para iniciar el proyecto en la carpeta de trabajo actual, se ejecutó el siguiente comando desde la terminal:

```bash
npx -y @angular/cli@latest new recetas-app --directory ./ --routing true --style css --ssr false --standalone true --file-name-style-guide 2016 --defaults --force
```

### Explicación de los parámetros del comando:
*   `npx -y @angular/cli@latest new recetas-app`: Descarga y ejecuta de forma temporal la última versión de la interfaz de línea de comandos de Angular (CLI) para iniciar un proyecto llamado `recetas-app`.
*   `--directory ./`: Indica que el proyecto debe crearse directamente en la carpeta actual en lugar de crear una nueva subcarpeta, evitando anidamiento innecesario.
*   `--routing true`: Crea automáticamente los archivos de enrutamiento (`app.routes.ts`) para navegar entre las vistas de la aplicación.
*   `--style css`: Elige CSS estándar y limpio para las hojas de estilo personalizadas.
*   `--ssr false`: Desactiva el Server-Side Rendering (SSR) y Static Site Generation (SSG). Esto simplifica el compilado a una SPA (Single Page Application) tradicional de lado de cliente.
*   `--standalone true`: Configura el proyecto con la arquitectura moderna de Angular basada en componentes Standalone, lo que elimina la necesidad de manejar archivos pesados de módulos (`AppModule`).
*   `--file-name-style-guide 2016`: Forzar la convención clásica de nombres de archivos de Angular (ej. `lista-recetas.component.ts` en lugar del formato abreviado `lista-recetas.ts`), ideal para cumplir con rúbricas de evaluación escolares.
*   `--defaults`: Salta los cuestionarios interactivos de la terminal, configurando las opciones estándar de Angular de manera automática.
*   `--force`: Permite crear el proyecto de manera segura sobre la carpeta actual aunque esta contenga archivos (como el PDF de la evaluación).

---

## 🗂️ Paso 2: Creación del Modelo de Datos `Receta`
Creamos una interfaz TypeScript que define la estructura estricta que debe tener toda receta dentro de nuestro sistema.

*   **Archivo creado:** `src/app/models/receta.model.ts`
*   **Código:**
```typescript
export interface Receta {
  id: string; // Identificador único generado por fecha/tiempo
  nombre: string; // Nombre del plato
  descripcion: string; // Resumen del plato
  ingredientes: string[]; // Arreglo de ingredientes
  instrucciones: string[]; // Arreglo de pasos a seguir
  tiempoPreparacion: number; // Duración en minutos
  categoria: string; // Tipo de plato (Almuerzo, Postre, etc.)
  esFavorita: boolean; // Estado de favorita
  imagenUrl?: string; // URL opcional de imagen (se usa una por defecto si está vacío)
}
```

---

## 💾 Paso 3: Implementación del Servicio de Persistencia `RecetaService`
Creamos un servicio singleton inyectable para manejar la lógica de negocio y guardar los datos localmente de modo que no se borren al recargar la página.

*   **Archivo creado:** `src/app/services/receta.service.ts`
*   **Funcionalidades principales:**
    1.  **Carga inicial (Mock Data):** Si el navegador no tiene información guardada previamente (`localStorage` vacío), el servicio carga automáticamente 3 recetas de ejemplo para que la app no inicie vacía: *Tacos al Pastor*, *Tarta de Manzana Clásica* y *Ensalada César con Pollo*.
    2.  **Persistencia en LocalStorage:** Cualquier acción de agregar, editar o eliminar recetas invoca a `guardarEnStorage()`, que convierte el arreglo de recetas a formato JSON y lo almacena localmente en la clave `'recetas_app'`.
    3.  **Operaciones CRUD:**
        *   `getRecetas()`: Retorna una copia del listado de recetas.
        *   `getRecetaById(id)`: Busca y retorna una receta por su identificador.
        *   `agregarReceta(receta)`: Genera un ID dinámico (basado en `Date.now()`), inicializa la receta y la inserta en el arreglo.
        *   `actualizarReceta(receta)`: Localiza la receta existente mediante su ID y actualiza sus valores.
        *   `eliminarReceta(id)`: Filtra el listado para excluir la receta con el ID indicado.
        *   `toggleFavorito(id)`: Invierte el valor booleano del atributo `esFavorita` de una receta específica.

---

## 🧱 Paso 4: Generación de Componentes
Generamos los tres componentes requeridos en la evaluación ejecutando los siguientes comandos CLI:

```bash
npx ng g c lista-recetas --skip-tests
npx ng g c form-receta --skip-tests
npx ng g c detalle-receta --skip-tests
```
*(Se usó `--skip-tests` para evitar la creación de archivos `.spec.ts` de pruebas unitarias, manteniendo limpio el código entregable).*

---

## 🚦 Paso 5: Configuración de Rutas (Routing)
Configuramos el sistema de navegación en `src/app/app.routes.ts` para mapear las secciones requeridas.

*   **Archivo modificado:** `src/app/app.routes.ts`
*   **Código:**
```typescript
import { Routes } from '@angular/router';
import { ListaRecetasComponent } from './lista-recetas/lista-recetas.component';
import { FormRecetaComponent } from './form-receta/form-receta.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: ListaRecetasComponent }, // Listado completo
  { path: 'agregar', component: FormRecetaComponent },  // Crear receta
  { path: 'editar/:id', component: FormRecetaComponent }, // Editar receta
  { path: 'favoritos', component: ListaRecetasComponent }, // Listado filtrado por favoritos
  { path: '**', redirectTo: 'inicio' } // Ruta comodín para redirigir errores
];
```

---

## 💻 Paso 6: Desarrollo de los Componentes

### 1. Componente: `lista-recetas`
*   **Archivos:** `lista-recetas.component.ts`, `lista-recetas.component.html`, `lista-recetas.component.css`
*   **Lógica:**
    *   Determina si está mostrando todas las recetas o solo las favoritas comprobando si el URL de la ruta actual contiene la palabra `'favoritos'`.
    *   Implementa una propiedad computada (`get recetasFiltradas`) que realiza búsquedas en tiempo real combinando el término de búsqueda ingresado en el buscador con el nombre, la categoría o los ingredientes de cada receta.
    *   Contiene botones interactivos para marcar favorito (icono de corazón que cambia de color y estado), ver el detalle de preparación en ventana modal, editar (redirige a la ruta `/editar/:id`), y eliminar (solicita confirmación mediante un cuadro `confirm` antes de proceder).

### 2. Componente: `form-receta`
*   **Archivos:** `form-receta.component.ts`, `form-receta.component.html`, `form-receta.component.css`
*   **Lógica:**
    *   Funciona de manera híbrida para **Creación** y **Edición**. En `ngOnInit()` intenta obtener el parámetro de ruta `:id`. Si existe, solicita los datos de la receta al servicio y los precarga en el formulario (activando el modo edición); si no existe, inicializa un formulario vacío para creación.
    *   Facilita la entrada de datos: posee un campo de selección desplegable para categorías (`Desayuno`, `Entrada`, `Almuerzo`, `Cena`, `Postre`, `Bebida`, `Otro`) y entradas de texto multilínea (`textarea`) para ingredientes e instrucciones.
    *   **Procesamiento de texto:** Al guardar la receta, el componente divide los textos de ingredientes e instrucciones línea por línea (`split('\n')`), elimina espacios en blanco al inicio/final de cada línea (`trim()`), y descarta líneas vacías, convirtiéndolos en arreglos estructurados (`string[]`) de forma transparente para el usuario.
    *   Valida que los campos obligatorios estén llenos y que se ingrese al menos un ingrediente y un paso antes de permitir guardar la información.

### 3. Componente: `detalle-receta`
*   **Archivos:** `detalle-receta.component.ts`, `detalle-receta.component.html`, `detalle-receta.component.css`
*   **Lógica:**
    *   Se diseñó como una ventana emergente / modal (`dialog` interactivo) que se sobrepone a la pantalla actual al hacer clic en "Ver Preparación" en la lista de recetas. Esto evita recargas y pérdida de posición en el catálogo.
    *   **Ingredientes interactivos:** Para dar una experiencia premium, el componente carga dinámicamente un arreglo de estados booleanos en función del número de ingredientes de la receta. Permite al usuario hacer clic sobre los ingredientes y tachar los que ya tiene preparados (estilo *checklist* de cocina), facilitando el seguimiento al momento de preparar el platillo.

---

## 🎨 Paso 7: Diseño y Estilos Personalizados
*   **Layout Principal (`app.component`):** Diseñamos una estructura clásica con una barra de navegación fija en la parte superior (Navbar) que resalta de forma dinámica la pestaña activa utilizando la directiva de Angular `routerLinkActive="active-link"`.
*   **Ancho Fijo de Escritorio:** Siguiendo tus indicaciones de omitir la adaptabilidad responsiva móvil, establecimos un contenedor de diseño centrado con un ancho fijo de **1100px** para pantallas de escritorio (`max-width: 1100px; margin: 0 auto;`). Esto asegura que la interfaz se vea siempre perfectamente estructurada en cualquier monitor de computadora sin deformarse por cambios de tamaño fluidos.
*   **Tipografía y Botonera:** Se importó la fuente elegante **Poppins** desde Google Fonts a través de `@import` en `styles.css`. También se crearon clases de diseño para los botones (`btn-primary` en color naranja culinario, `btn-secondary` en gris neutro, `btn-outline-secondary` y `btn-outline-danger` para acciones de edición y eliminación).

---

## 🚀 Paso 8: Cómo ejecutar el Proyecto Localmente
1.  Abre una terminal de comandos (PowerShell, CMD o Bash) en la raíz del proyecto (`c:\CYNTHIA\recetas`).
2.  Ejecuta el servidor de desarrollo local integrado en Angular ejecutando el siguiente comando:
    ```bash
    npm run start
    ```
    *(O equivalentemente: `npx ng serve`)*.
3.  Una vez compilado, abre tu navegador web favorito (Chrome, Edge, Firefox) e ingresa a la siguiente dirección:
    ```
    http://localhost:4200
    ```
4.  ¡Listo! Ya puedes explorar la aplicación GourmetApp, agregar nuevas recetas, marcar tus favoritas, editar y tachar ingredientes.
