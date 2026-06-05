# Estado actual de la demo Wandr

Este documento describe la demo actual a nivel de flujo de usuario, rutas habilitadas y comportamiento funcional observable. La app es un MVP móvil en React/Vite con datos mock persistidos en `localStorage`.

## Resumen de producto

Wandr permite que una persona arme una ruta urbana en Lima segun su contexto del dia: ubicacion, tiempo disponible, intereses, ritmo, comida, presupuesto y apertura social. A partir de ese brief, la demo genera un "strand": una secuencia caminable de paradas con horarios, ratings, duracion, distancia, estados y una capa social de viajeros con rutas superpuestas.

El alcance actual cubre:

- bienvenida y entrada al flujo;
- onboarding de preferencias;
- generacion de strand;
- vista principal del strand;
- replan de ruta;
- detalle y acciones por parada;
- deteccion de overlaps sociales;
- perfiles de wandrs cercanos;
- envio de nod;
- perfil propio del usuario demo;
- persistencia local del estado.

## Rutas habilitadas

| Ruta | Pantalla | Estado |
| --- | --- | --- |
| `/` | Welcome | Activa. Entrada a la demo con CTA a onboarding. |
| `/onboarding` | Onboarding | Activa. Captura preferencias y genera strand. |
| `/profile` | Perfil propio | Activa. Muestra Valeria Torres, preferencias actuales y strand activo. |
| `/strand/:itineraryId` | Strand principal | Activa para itinerarios mock existentes o generados. |
| `/strand/:itineraryId/stop/:stopId` | Detalle de parada | Activa como panel/modal sobre el strand. |
| `/strand/:itineraryId/overlaps` | Wandrs nearby | Activa si el strand tiene overlap social y social mode esta habilitado. |
| `/strand/:itineraryId/wandr/:wandrId` | Perfil de wandr | Activa como bottom sheet desde overlaps. |
| `*` | 404 | Activa. Redirige funcionalmente a onboarding mediante CTA. |

IDs de itinerario soportados por datos mock:

- `lima-cultural-barranco`
- `lima-foodie-barranco`
- `lima-urbanist-dual`
- `lima-bohemian-barranco`

## Historia de usuario principal

Como viajera en Lima, quiero decirle a Wandr como quiero que se sienta mi dia, cuanto tiempo tengo y si estoy abierta a cruzarme con otras personas, para recibir una ruta caminable que pueda adaptar, recorrer y usar para encontrar overlaps sociales sin depender de chat o geolocalizacion exacta.

## Flujo principal

1. La usuaria entra en `/`.
2. Ve una pantalla de bienvenida con el posicionamiento de Wandr: una ruta personal basada en vibe, tiempo y posibilidad de conocer gente.
3. Toca `Plan my strand`.
4. Entra a `/onboarding`.
5. Comparte ubicacion o, si falla el permiso, continua manualmente.
6. Elige uno o dos distritos entre Barranco y Miraflores.
7. Configura el brief:
   - duracion: 2h, 3h, 4h o 6h;
   - hasta dos intereses: Cultural, Foodie, Urbanista, Bohemio;
   - ritmo: slow/scenic, balanced o fast highlights;
   - comida: meal stop, snack/coffee only o no food;
   - modo social: not today, open to wandrs u only easy moments;
   - preferencias sociales si el modo social esta activo;
   - reglas: prefer walking y avoid visited;
   - presupuesto: low, mid, high o flexible.
8. Toca `Generate strand`.
9. La app genera un itinerario mock segun el primer interes seleccionado y navega a `/strand/:itineraryId`.
10. La usuaria ve el strand principal con resumen, metricas, tags, nota de origen, CTA de replan, nudge social si hay overlaps y visualizacion tipo ADN de paradas.

## Reglas actuales de generacion

La seleccion del itinerario se basa principalmente en el primer interes:

| Primer interes | Itinerario generado | Enfoque |
| --- | --- | --- |
| Cultural | `lima-cultural-barranco` | Arte, museos, lunch y Barranco caminable. |
| Foodie | `lima-foodie-barranco` | Cafe, mercado, lunch y cierre escenico. |
| Urbanista | `lima-urbanist-dual` | Miraflores + Barranco, malecon y handoff urbano. |
| Bohemio | `lima-bohemian-barranco` | Barranco tarde/noche, bares, cafe y mirador. |

La preferencia de comida modifica paradas y tags:

- `MEAL` conserva o fuerza una parada de comida completa.
- `SNACK` cambia paradas de comida por cafe/snack cuando hay override.
- `NONE` reemplaza comida por paradas no gastronomicas cuando hay override.

La duracion elegida se refleja en la metrica `totalDurationHours`. Los distritos seleccionados actualizan `districts` y `startLabel`, pero la ruta sigue usando templates mock.

## Flujo del strand

En `/strand/:itineraryId`, la usuaria puede:

- ver titulo, descripcion, fecha demo, vibe y tags de la ruta;
- revisar metricas: numero de stops, distancia total, ventana horaria y rating promedio;
- ver banner de "visited/deprioritized" si `avoidVisited` esta activo;
- tocar `Replan` para simular regeneracion;
- tocar `Refresh options` desde el banner de visitados;
- abrir perfil propio desde el enlace `Profile`;
- abrir overlaps desde el nudge social;
- tocar nodos de la visualizacion para ver detalle de parada;
- ejecutar acciones de parada segun tipo/estado.

El replan muestra overlay `REWEAVING` por aproximadamente 2.4 segundos y luego aplica una variante mock. Las variantes actuales cambian una parada o conservan la ruta segun el itinerario y muestran un toast.

## Acciones por parada

Al abrir una parada, la demo muestra:

- hora;
- nombre;
- tier: Landmark o Local;
- distrito;
- walk-in/visited si aplica;
- rating y reviews;
- distancia a la siguiente parada;
- descripcion;
- tags;
- nota de origen del contenido.

Acciones disponibles:

| Caso | Acciones |
| --- | --- |
| Parada ya visitada | Sin acciones. |
| Ultima parada | `Keep it`, `Swap`. |
| Categoria `LOOKOUT` o `LANDMARK` | `Navigate`, `Skip`. |
| Otras categorias | `Check in`, `Skip`. |

Comportamiento:

- `Check in` marca la parada y las anteriores como `done`, avanza la siguiente a `active` y muestra toast.
- `Navigate` abre Google Maps con el query mock de la parada.
- `Keep it` cierra el panel.
- `Skip` y `Swap` disparan replan.

## Flujo social

Si el modo social esta activo y el itinerario tiene overlap mock:

1. En el strand aparece un nudge con cantidad/resumen de wandrs cercanos.
2. Al tocarlo, la app navega a `/strand/:itineraryId/overlaps`.
3. Se muestra una vista `Wandrs nearby` con:
   - razon del overlap;
   - stop y ventana de tiempo;
   - cards de wandrs con iniciales, nombre, meta, tags y match score;
   - toggle `Open to meeting wandrs`.
4. Cada card permite entrar a `/strand/:itineraryId/wandr/:wandrId`.
5. El perfil de wandr muestra:
   - informacion basica;
   - razon de compatibilidad;
   - mini strand del otro viajero;
   - CTA `Send nod`.
6. Al enviar nod:
   - se guarda el nod en `sentNods`;
   - si el perfil tiene `mutualNod: true`, se desbloquea un mensaje de meetup sugerido;
   - si ya se envio, muestra toast `Nod already sent`.

Wandrs mock disponibles:

- `maya`: mutual nod activo en el template cultural.
- `sam`: nod no mutuo.
- `rafa`: nod no mutuo.

Los overlaps varian por itinerario:

| Itinerario | Overlap | Cantidad |
| --- | --- | --- |
| `lima-cultural-barranco` | MATE - Museo Mario Testino | 3 wandrs |
| `lima-foodie-barranco` | Isolina Taberna Peruana | 2 wandrs |
| `lima-urbanist-dual` | Puente de los Suspiros | 2 wandrs |
| `lima-bohemian-barranco` | Juanito de Barranco | 1 wandr |

## Perfil propio

La ruta `/profile` muestra el perfil hardcodeado de `Valeria Torres`.

La pantalla resume:

- cantidad de distritos seleccionados;
- ventana horaria;
- paradas visitadas;
- intereses, ritmo, presupuesto y comida;
- strand activo;
- metricas del strand;
- proxima parada;
- CTA para volver al strand o crear uno si no existe.

## Estado persistido

La demo persiste en `localStorage` bajo la key `wandr-demo-state-v1`:

- preferencias de onboarding;
- itinerarios disponibles y activo;
- version de replan por itinerario;
- toggle de meetups;
- nods enviados;
- toast activo.

Esto permite que el perfil y el strand reflejen acciones previas aunque la usuaria cambie de ruta o recargue.

## Limitaciones conocidas de la demo

- No hay backend real; todo depende de `mockWandrService` y `mockCatalog`.
- Los lugares estan modelados como si vinieran de Google Places, pero son datos mock.
- La capa social no usa usuarios reales, chat, matching real ni geolocalizacion exacta.
- La ubicacion solo se usa en onboarding para calcular distancia a Barranco/Miraflores.
- El itinerario se decide por el primer interes, no por una optimizacion completa de todos los campos.
- `preferWalking`, `budget`, `groupComposition`, `groupSize` y algunos campos sociales quedan principalmente reflejados como estado/preferencia, no como logica profunda de generacion.
- `Wandr Local / Upgrade` aparece como upsell visual, pero no tiene flujo implementado.
- `/strand/:itineraryId/overlaps` no renderiza la vista principal debajo; funciona como vista social dedicada.
- Si se navega a un itinerary ID inexistente, la app muestra una pantalla de "Generate a strand first".

## Archivos relevantes

- `src/app/router.tsx`: definicion de rutas.
- `src/features/demo/DemoAppContext.tsx`: estado, persistencia y acciones de demo.
- `src/features/demo/mockWandrService.ts`: fachada de generacion, replan, overlaps y wandrs.
- `src/features/demo/mockCatalog.ts`: preferencias, itinerarios, variantes, food overrides y perfiles mock.
- `src/features/onboarding/components/OnboardingForm.tsx`: flujo de onboarding.
- `src/pages/StrandShellPage.tsx`: shell de strand y rutas hijas.
- `src/features/strand/components/StrandReplicaView.tsx`: vista principal interactiva del strand.
- `src/features/strand/components/StrandReplicaDetailPanel.tsx`: panel de detalle de parada.
- `src/pages/OverlapsSheetRoute.tsx`: vista de overlaps.
- `src/pages/WandrSheetRoute.tsx`: perfil de wandr y nod.
- `src/pages/OwnProfilePage.tsx`: perfil propio.
