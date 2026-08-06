# FinTrack

App de finanzas personales, construida como PWA para iPhone.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS · React Router · TanStack
Query · Supabase · Zustand · React Hook Form + Zod · Framer Motion · Recharts.

## Estado actual (Paso 1 de N)

Este paso deja lista la **arquitectura base** y la **configuración PWA**.
Todavía no hay pantallas reales (Login, Dashboard, etc.) — esas llegan en los
próximos pasos. Lo que sí funciona ya:

- Proyecto Vite + React 19 + TypeScript estricto, con alias `@/`.
- Tailwind configurado con una paleta inspirada en los colores de sistema de
  iOS y utilidades de glassmorphism (`.glass-card`, `.glass-sheet`).
- Modo claro/oscuro persistente (`ThemeContext`, respeta
  `prefers-color-scheme` la primera vez).
- PWA completa vía `vite-plugin-pwa`: manifest, service worker con estrategias
  de caché (network-first para Supabase, cache-first para imágenes), splash
  screen e instalación desde Safari.
- Cliente de Supabase ya inicializado (`src/services/supabase.ts`), a la
  espera de las tablas y políticas RLS del siguiente paso.
- Íconos placeholder generados (192, 512, maskable, apple-touch-icon). Son
  temporales — cuando tengas un logo definitivo los reemplazamos.

## Estructura de carpetas

```
src/
  components/   # componentes reutilizables de UI
  pages/        # pantallas (Login, Dashboard, Estadísticas, ...)
  hooks/        # hooks personalizados
  services/     # clientes externos (supabase.ts, etc.)
  types/        # tipos e interfaces compartidas
  utils/        # funciones auxiliares puras
  contexts/     # contextos de React (ThemeContext, ...)
  layouts/      # layouts compartidos entre páginas
  routes/       # definición de rutas (React Router)
  styles/       # globals.css con tokens de diseño
  assets/       # imágenes, fuentes, etc.
```

## Cómo probarlo

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia las variables de entorno (aún no son necesarias hasta el paso de
   Auth, pero ya puedes dejarlas listas):
   ```bash
   cp .env.example .env.local
   ```
3. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Deberías ver una tarjeta con efecto glassmorphism, el logo de FinTrack y un
   botón para alternar entre modo claro y oscuro.

4. **Para probarlo en tu iPhone** dentro de la misma red Wi-Fi:
   ```bash
   npm run dev -- --host
   ```
   Vite mostrará una URL tipo `http://192.168.x.x:5173`. Ábrela en Safari en
   tu iPhone.

5. **Para probar la instalación como PWA** (el service worker solo se activa
   en build de producción o con `devOptions.enabled: true`, ya configurado):
   ```bash
   npm run build
   npm run preview -- --host
   ```
   Abre la URL en Safari → botón compartir → "Agregar a pantalla de inicio".

6. Verifica que no haya errores de tipos:
   ```bash
   npm run typecheck
   ```

## Paso 2: Base de datos en Supabase

Ya está diseñado el esquema completo en `supabase/migrations/`:

- `0001_init_schema.sql` — tablas `usuarios`, `configuracion_usuario`,
  `metodos_pago`, `categorias`, `movimientos`, `adjuntos`, `presupuestos`,
  `metas`, con sus relaciones, llaves foráneas, índices y triggers
  (`updated_at` automático, y creación automática del perfil al registrarse).
- `0002_rls_policies.sql` — Row Level Security en todas las tablas (cada
  usuario solo ve y modifica sus propios datos), más un bucket privado de
  Storage para las fotos de boletas con sus propias políticas.

`.env.local` ya quedó configurado con tu URL y publishable key de Supabase.

### Cómo aplicar las migraciones

No tengo acceso de red directo a tu proyecto de Supabase desde este entorno,
así que necesitas correr el SQL tú mismo (toma 2 minutos):

**Opción A — Panel de Supabase (más simple):**
1. Entra a tu proyecto → **SQL Editor** → **New query**.
2. Pega el contenido de `supabase/migrations/0001_init_schema.sql` → **Run**.
3. Pega el contenido de `supabase/migrations/0002_rls_policies.sql` → **Run**.

**Opción B — Supabase CLI (si la tienes instalada):**
```bash
supabase login
supabase link --project-ref piyutmmogwckzyleiiwb
supabase db push
```

### Verificar que quedó bien

En **Table Editor** deberías ver las 8 tablas. Prueba crear un usuario desde
**Authentication → Users → Add user** y confirma que automáticamente aparece
una fila en `usuarios` y otra en `configuracion_usuario` (eso lo hace el
trigger `trg_on_auth_user_created`).

## Paso 3: Login con Supabase Auth

Ya está implementado el flujo completo de autenticación:

- **`/login`** — correo y contraseña, con enlace a recuperar contraseña y a
  registro.
- **`/registro`** — nombre, correo, contraseña y confirmación. Si tu proyecto
  de Supabase exige confirmación por correo (viene activado por defecto),
  muestra la pantalla "Revisa tu correo" en vez de entrar directo.
- **`/recuperar-password`** — pide el correo y envía el enlace de Supabase.
- **`/actualizar-password`** — destino del enlace del correo, para fijar la
  nueva contraseña.
- **`AuthContext`** mantiene la sesión sincronizada en toda la app.
- **Rutas protegidas**: `/` (Dashboard) redirige a `/login` si no hay sesión;
  `/login` y `/registro` redirigen al Dashboard si ya hay una sesión activa.
- Los errores de Supabase (credenciales inválidas, correo ya registrado, etc.)
  se traducen a español en `src/utils/authErrors.ts`.

### Cómo probarlo

1. `npm install && npm run dev`
2. Ve a `/registro`, crea una cuenta. Si tu proyecto pide confirmación de
   correo, revisa tu bandeja (incluido spam) y haz clic en el enlace.
3. Inicia sesión en `/login` — deberías caer en un Dashboard temporal que
   muestra tu correo y un botón para cerrar sesión.
4. Prueba `/recuperar-password` con tu correo y confirma que llega el enlace.

> **Nota:** por defecto Supabase usa una plantilla de correo genérica en
> inglés. Puedes personalizarla en tu panel → **Authentication → Email
> Templates**.

## Paso 4: Dashboard real

Ya está el Dashboard funcionando con datos en vivo de Supabase:

- **Saldo actual**, **ingresos/gastos del mes** y **ahorro del mes**, con
  comparación porcentual vs. el mes anterior (flecha verde/roja).
- **Gráfico circular** de gastos por categoría del mes actual.
- **Gráfico de barras** de ingresos vs. gastos de los últimos 6 meses.
- **Últimos movimientos**, con ícono y color según sea ingreso/gasto/transferencia.
- **Botón flotante (+)** para agregar movimiento (la pantalla real llega en
  el próximo paso; por ahora muestra un placeholder).
- **Barra de navegación inferior** (Inicio, Estadísticas, Presupuesto, Metas,
  Perfil) — las secciones que aún no se construyen muestran un aviso de
  "próximamente"; Perfil ya permite cerrar sesión.

Los cálculos (saldo, resúmenes por período, gastos por categoría, serie
mensual) corren como **funciones SQL** en Supabase (`0003_funciones_resumen.sql`)
en vez de traer todos los movimientos al cliente — son rápidas incluso con
miles de movimientos, y respetan RLS automáticamente.

### Aplicar la nueva migración

Igual que en el Paso 2: pega el contenido de
`supabase/migrations/0003_funciones_resumen.sql` en el **SQL Editor** de tu
panel de Supabase → **Run**. (O `supabase db push` si usas la CLI).

### Cómo probarlo

1. Aplica la migración `0003_funciones_resumen.sql`.
2. `npm install && npm run dev`, inicia sesión.
3. Si no tienes movimientos aún, el Dashboard se ve con estados vacíos (eso es
   esperado — la pantalla para crear movimientos llega en el próximo paso).
   Puedes insertar un par de filas de prueba directo en **Table Editor**
   (`categorias` y `movimientos`) para ver los gráficos con datos reales.

## Próximos pasos

Cuando confirmes que el Dashboard carga bien, seguimos con la pantalla
**Nuevo Movimiento**: crear ingresos, gastos y transferencias, con categoría,
método de pago, fecha, notas y foto de la boleta.

## Paso 5: Nuevo Movimiento

Ya se puede crear movimientos reales desde la app (el botón **+** del
Dashboard ya no es un placeholder):

- Selector de **tipo** (gasto / ingreso / transferencia) tipo segmented
  control de iOS.
- **Categoría**: grilla de chips con ícono y color, filtrada según el tipo
  (no aplica para transferencias).
- **Monto**, **descripción**, **fecha** (por defecto hoy), **método de
  pago** (opcional) y **notas** (opcional).
- **Foto de la boleta**: se puede tomar con la cámara del iPhone o elegir de
  la galería; se sube al bucket privado `adjuntos` de Storage y queda
  vinculada al movimiento en la tabla `adjuntos`.
- Al guardar, se invalidan automáticamente las queries del Dashboard (saldo,
  resúmenes, gráficos, últimos movimientos), así que todo se actualiza solo
  al volver.

**Categorías y métodos de pago por defecto:** para que el formulario sea
usable sin haber construido todavía la pantalla de Categorías, cada usuario
nuevo recibe automáticamente un set por defecto (Alimentación, Transporte,
Vivienda, Entretenimiento, Salud, Compras, Otros gastos, Sueldo, Otros
ingresos, y los métodos Efectivo / Tarjeta débito). Podrás personalizarlos
en el paso de **Categorías**.

### Aplicar la nueva migración

Pega el contenido de `supabase/migrations/0004_seed_datos_default.sql` en el
**SQL Editor** de Supabase → **Run**.

Como tu cuenta ya existía antes de esta migración, el trigger no le sembró
las categorías automáticamente. Corre esto una vez, reemplazando el correo
por el tuyo:

```sql
select public.seed_datos_predeterminados(id)
from auth.users
where email = 'tu-correo@ejemplo.com';
```

### Cómo probarlo

1. Aplica `0004_seed_datos_default.sql` y siembra tu cuenta con el SQL de
   arriba.
2. `npm install && npm run dev`, inicia sesión, toca el botón **+**.
3. Crea un gasto con categoría, monto y una foto de prueba. Confirma que al
   guardar vuelves al Dashboard y que el saldo, los gráficos y "Últimos
   movimientos" ya reflejan el nuevo movimiento.

## Próximos pasos

Cuando confirmes que puedes crear movimientos, seguimos con la pantalla de
**Categorías**: crear, editar y personalizar categorías (color, ícono,
límite mensual).

## Paso 6: Categorías

Ya se pueden crear, editar y eliminar categorías desde la app:

- Se accede desde **Perfil → Gestionar categorías**.
- Tabs de **Gastos / Ingresos**.
- Formulario con nombre, color (paleta de colores de sistema de iOS),
  ícono (grilla de íconos), y **límite mensual** opcional.
- Eliminar categoría pide confirmación; los movimientos que ya la usaban
  quedan sin categoría (no se borran) gracias a `on delete set null`.
- Al guardar o eliminar se invalidan las queries de categorías en toda la
  app (Dashboard, selector del formulario de movimientos, etc.), así que
  todo se mantiene sincronizado sin recargar.

No requiere una migración nueva — usa las tablas y políticas RLS que ya
estaban desde el Paso 2.

### Cómo probarlo

1. `npm install && npm run dev`, inicia sesión.
2. Ve a **Perfil → Gestionar categorías**.
3. Crea una categoría nueva (ej. "Mascotas", ícono, color, límite opcional).
4. Vuelve a **Nuevo movimiento** y confirma que aparece en el selector de
   categorías.
5. Edita esa categoría y cambia su color/ícono; confirma que se refleja en
   el Dashboard (gráfico circular) si tiene movimientos asociados.

## Próximos pasos

Cuando confirmes que Categorías funciona, seguimos con la pantalla de
**Estadísticas**: gráficos de ingresos/gastos por categoría, últimos 12
meses, promedios diario/semanal, comparación mensual/anual, mayor y menor
gasto.

## Paso 7: Estadísticas

Ya está la pantalla completa, con un **selector de mes** (flechas ← →) que
controla todas las métricas del período:

- **Ingresos y gastos** del mes seleccionado, con comparación vs. el mes
  anterior.
- **Promedio diario** y **promedio semanal** de gasto (calculado sobre los
  días transcurridos si es el mes actual, o el mes completo si es uno
  pasado).
- **Mayor gasto** y **menor gasto** del mes, con su categoría y fecha.
- **Gastos por categoría** (mismo gráfico circular del Dashboard, ahora
  ligado al mes seleccionado).
- **Últimos 12 meses**: gráfico de barras ingresos vs. gastos.
- **Comparación anual**: año actual vs. año anterior, ingresos y gastos con
  variación %.

No requiere ninguna migración nueva **excepto** la función SQL del resumen
anual (`0005_resumen_anual.sql`).

### Aplicar la nueva migración

Pega el contenido de `supabase/migrations/0005_resumen_anual.sql` en el
**SQL Editor** de Supabase → **Run**.

### Cómo probarlo

1. Aplica `0005_resumen_anual.sql`.
2. `npm install && npm run dev`, inicia sesión, ve a la pestaña
   **Estadísticas**.
3. Navega entre meses con las flechas y confirma que todo (promedios,
   mayor/menor gasto, gráfico circular) se actualiza.
4. Si no tienes movimientos de años anteriores, la comparación anual
   mostrará 0 para el año pasado — es el comportamiento esperado.

## Próximos pasos

Cuando confirmes que Estadísticas funciona, seguimos con la pantalla de
**Presupuesto**: crear presupuestos mensuales, ver porcentaje utilizado,
dinero restante y alertas al superar el límite.

## Paso 8: Presupuesto

Ya se pueden crear presupuestos mensuales, por categoría o generales:

- **Selector de mes** (mismo componente que en Estadísticas).
- Cada presupuesto muestra una **barra de progreso**, lo gastado, lo
  restante y el **% usado**. La barra cambia de color: normal → naranja
  (>80%) → **rojo si se supera el límite**, con un ícono de alerta.
- **Crear**: eliges una categoría de gasto (o "General" para cubrir todos
  los gastos del mes) y el monto límite. Solo se muestran categorías que
  todavía no tienen presupuesto ese mes, para evitar duplicados.
- **Editar/eliminar**: tocando un presupuesto puedes ajustar el monto o
  eliminarlo.
- El "gastado" de cada presupuesto se calcula en Supabase (función SQL
  `obtener_presupuestos_con_gasto`), no en el cliente.

### Aplicar la nueva migración

Pega el contenido de `supabase/migrations/0006_presupuestos_con_gasto.sql`
en el **SQL Editor** de Supabase → **Run**.

### Cómo probarlo

1. Aplica la migración.
2. `npm install && npm run dev`, ve a la pestaña **Presupuesto**.
3. Crea un presupuesto para alguna categoría en la que ya tengas gastos
   este mes y confirma que la barra de progreso refleja lo gastado.
4. Registra un gasto que supere el límite (o edita el monto límite a algo
   menor) y confirma que aparece en rojo con la alerta.

## Próximos pasos

Cuando confirmes que Presupuesto funciona, seguimos con la pantalla de
**Metas de ahorro**: crear metas, ver su progreso y la animación al
completarlas.

## Paso 9: Metas de ahorro

Ya se pueden crear metas de ahorro y aportar a ellas:

- **Crear meta**: nombre, monto objetivo y fecha límite (opcional).
- **Detalle de meta**: barra de progreso, y un campo para **agregar
  aportes** — cada aporte suma al monto actual.
- Al agregar un aporte que alcanza o supera el objetivo, la meta se marca
  automáticamente como **completada** y se muestra una **animación de
  celebración** (🎉) por un par de segundos.
- Editar (nombre, monto objetivo, fecha límite) y eliminar, igual que en
  Categorías y Presupuesto.
- El aporte se procesa con una función SQL (`agregar_aporte_meta`) que
  suma el monto y evalúa si se completó de forma atómica, evitando
  condiciones de carrera si agregas aportes rápido.

### Aplicar la nueva migración

Pega el contenido de `supabase/migrations/0007_agregar_aporte_meta.sql` en
el **SQL Editor** de Supabase → **Run**.

### Cómo probarlo

1. Aplica la migración.
2. `npm install && npm run dev`, ve a la pestaña **Metas**.
3. Crea una meta con un monto objetivo bajo (ej. $10.000) para probar
   rápido.
4. Entra al detalle y agrega un aporte que alcance el objetivo — deberías
   ver la animación de celebración y la tarjeta pasar a "Completada".

## Próximos pasos

Cuando confirmes que Metas funciona, seguimos con la pantalla de
**Calendario**: ver todos los movimientos organizados por fecha.

## Paso 10: Calendario

Ya está la pantalla de Calendario, accesible desde **Perfil → Ver
calendario**:

- **Grilla mensual** (semana empieza lunes) con el mismo selector de mes de
  Estadísticas/Presupuesto.
- Cada día con movimientos muestra **puntos de color**: verde si hubo
  ingresos ese día, rojo si hubo gastos (pueden aparecer ambos).
- Al tocar un día, aparece debajo la **lista de movimientos de ese día**
  (mismo componente que "Últimos movimientos" del Dashboard).
- No requiere ninguna migración nueva — reutiliza las tablas existentes.

### Cómo probarlo

1. `npm install && npm run dev`, inicia sesión.
2. **Perfil → Ver calendario**.
3. Confirma que los días con movimientos muestran los puntos de color, y que
   al tocarlos aparece el detalle abajo.
4. Navega entre meses con las flechas.

## Próximos pasos

Cuando confirmes que Calendario funciona, seguimos con la pantalla de
**Perfil**: editar datos, cambiar tema, exportar datos y cerrar sesión (ya
implementado, falta lo demás).
