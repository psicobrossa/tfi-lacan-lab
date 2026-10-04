# LACAN·LAB

**Herramienta de investigación asistida que responde consultas sobre un corpus teórico lacaniano con citas verificables y auditoría automática.**

Este repositorio reúne el Trabajo Final Integrador de la Diplomatura en IA Aplicada a Entornos Digitales de Gestión (FCE-UBA, cohorte 2026). Contiene la aplicación, los flujos de trabajo que la sostienen, los _prompts_ utilizados y la documentación del proceso.

---

## Resumen

LACAN·LAB es una herramienta que permite hacerle preguntas a un corpus de textos teóricos —los seminarios de Jacques Lacan— y recibir, junto con la respuesta, las citas exactas de dónde sale cada afirmación y una auditoría que indica cuán confiable es esa respuesta.

El proyecto nació de una inquietud concreta: los modelos de lenguaje producen textos con vocabulario especializado que **parecen** saber más de lo que pueden sostener. Una respuesta puede sonar impecable y, aun así, no estar respaldada por ninguna fuente. De ahí el eje que ordena todo el trabajo:

> **«Respuesta plausible» ≠ «respuesta documentada».**

LACAN·LAB no intenta eliminar el error: intenta volverlo visible. Cada respuesta viene con sus fuentes a la vista y con un semáforo de auditoría, para que quien la lea pueda contrastarla con la edición impresa antes de usarla.

---

## Qué hace

Ante una consulta escrita en lenguaje natural, el sistema:

1. **Valida la entrada** y detecta si la pregunta menciona algún seminario en particular.

2. **Busca los fragmentos más relevantes** del corpus mediante un índice BM25 (un método de ordenamiento por relevancia de términos).

3. **Clasifica la intención** de la consulta y decide qué agente debe intervenir.

4. **Genera una respuesta** basada exclusivamente en los fragmentos recuperados, con citas que incluyen la página.

5. **Audita esa respuesta** con un segundo agente, que emite un veredicto: verde, amarillo o rojo.

6. **Devuelve el resultado** en un contrato explícito: la pregunta, la respuesta, las citas asociadas y la auditoría.

El sistema cuenta con cuatro agentes diferenciados, cada uno con una función específica:

* **Investigador (V1):** redacta la respuesta usando solo los fragmentos adjuntos y conserva las citas con página.

* **Auditor (V2):** evalúa la respuesta anterior y emite el semáforo, revisando atribución correcta, anacronismos, acuerdos artificiales y distinción entre fuente e inferencia.

* **Comparador (V3):** compara dos seminarios respecto de un concepto, declarando explícitamente cuando algo aparece solo en uno de ellos.

* **Verificador (V4):** contrasta una afirmación del usuario contra los documentos y devuelve un veredicto (confirmado, parcialmente confirmado, no encontrado o contradicho).

La aplicación web incorpora además módulos de **Cuadernos**, **Biblioteca**, **Conceptos** y **Comparador de autores**, junto con el sistema de auditoría por semáforo.

---

## Para qué sirve

Sirve para **asistir tareas de investigación y documentación** en el campo del psicoanálisis lacaniano: ubicar pasajes, ordenar material teórico, comparar conceptos entre seminarios y verificar afirmaciones contra las fuentes.

Lo que la herramienta **no** hace, y esto es una decisión de diseño y no una limitación técnica:

* **No emite diagnósticos ni lecturas clínicas.** La salida nunca es decisoria.

* **No trabaja con material clínico.** Ningún dato de pacientes ingresa al flujo: el sistema opera exclusivamente sobre un corpus teórico publicado.

* **No reemplaza la lectura profesional.** La herramienta organiza y recupera; la interpretación, la contextualización conceptual y la responsabilidad quedan del lado humano.

La distinción es importante: recuperar un fragmento no es interpretarlo. El sistema localiza lo escrito; no lo lee en el sentido analítico del término.

---

## Cómo se usa

**Requisitos:** un navegador web actualizado. No hace falta instalar nada.

1. Abrí el archivo `app/lacanlab_consulta_v4_legal.html` en tu navegador (doble clic alcanza).

2. Escribí tu pregunta sobre los seminarios en el campo de consulta. Por ejemplo: _«¿Cómo se articula el objeto a con la transferencia en el Seminario 11?»_

3. Enviá la consulta y esperá la respuesta.

4. Vas a recibir tres cosas: la **respuesta** del agente investigador, las **citas** con su página correspondiente y el **semáforo de auditoría** con su justificación.

**Importante:** la aplicación se conecta a un flujo de trabajo alojado en n8n Cloud. Si ese flujo no está activo, la consulta no va a devolver resultados. El archivo HTML por sí solo no contiene el motor de búsqueda ni el corpus.

**Sobre las citas:** el corpus se armó en parte mediante reconocimiento óptico de caracteres (OCR), por lo que pueden aparecer errores de transcripción. Las citas siempre deben cotejarse con la edición impresa de referencia antes de darlas por válidas.

---

## Herramientas de IA utilizadas

| Herramienta | Para qué se usó |
| --- | --- |
| **n8n Cloud** | Orquestación de todo el flujo: 40 nodos, 3 Data Tables y los cuatro agentes. |
| **Claude Sonnet** | Agente Investigador (V1): redacción de respuestas con citas. |
| **Claude Haiku** | Agentes Auditor (V2), Comparador (V3), Verificador (V4) e inferencia de seminario. |
| **BM25** | Recuperación documental: ordenamiento de fragmentos por relevancia (k1 = 1,5; b = 0,75). |
| **OCR** | Digitalización de 9 seminarios que no tenían capa de texto. |
| **Google Programmable Search** | Búsqueda académica restringida a una lista cerrada de 29 dominios institucionales, usada solo como contexto y nunca como evidencia. |
| **Ollama** | Modelo local utilizado en la versión previa del analizador de viñetas. |
| **Activepieces** | Migración temporal durante el desarrollo, luego abandonada. |

En una etapa anterior del proyecto se desarrolló también un **analizador de viñetas clínicas**, con dos variantes: una local (Ollama) y otra sobre una API comercial. Ese analizador se discontinuó por razones éticas: enviar material clínico a un proveedor externo resulta incompatible con la confidencialidad que exige la práctica analítica. Sus versiones se conservan en el repositorio como evidencia del recorrido.

---

## Estructura del repositorio

```
lacan-lab/
├── README.md                  Este archivo.
├── informe/                   El informe escrito del TFI, en PDF.
├── app/                       La aplicación.
│   ├── lacanlab_consulta_v4_legal.html
│   └── analizador-vinetas/    Versiones previas (v1 API comercial, v2 local).
├── workflows/                 Los flujos de n8n exportados en formato .json.
├── prompts/                   Los system prompts de cada agente.
├── docs/                      Documentación de apoyo.
│   ├── arquitectura.md
│   ├── metodologia-y-prompts.md
│   ├── auditoria-normativa.md
│   └── capturas/              Imágenes del proceso de aprendizaje.
└── presentacion/              La presentación del recorrido de aprendizaje.
```

**`informe/`** — El documento en PDF que acompaña al repositorio, con introducción, marco conceptual, metodología, resultados, análisis crítico y conclusiones.

**`app/`** — El código de la aplicación. El archivo `lacanlab_consulta_v4_legal.html` es la interfaz de consulta. La carpeta `analizador-vinetas/` conserva las versiones anteriores del analizador clínico.

**`workflows/`** — Los flujos de n8n exportados como archivos `.json`. Son la cocina del sistema: muestran cómo se conectan los nodos, las tablas de datos y los agentes. Las credenciales fueron removidas antes de publicarlos.

**`prompts/`** — El texto de los _system prompts_ de cada agente, más el prompt clínico del analizador. Documentar los prompts es parte de lo que pide la consigna del trabajo.

**`docs/`** — Documentación de apoyo: la arquitectura y los parámetros técnicos, la metodología con los errores y ajustes del proceso, la auditoría normativa sobre protección de datos y las capturas del recorrido de aprendizaje.

**`presentacion/`** — La presentación que documenta el proceso de aprendizaje a lo largo de la diplomatura.

**Nota sobre el corpus:** los PDF de los seminarios **no** se incluyen en este repositorio por tratarse de textos con derechos de autor. En `docs/` se explica cómo se armó el corpus (cantidad de documentos, cuáles requirieron OCR, cómo se fragmentaron y cómo se indexaron) para quien quiera reproducir el procedimiento con sus propias ediciones.

---

## Estado del proyecto

**Nivel 1 — Implementación funcional.** La aplicación está operativa y funcionó en uso real. Las pruebas realizadas fueron funcionales.

**Lo que está implementado y verificado:**

* El flujo completo de consulta, recuperación, respuesta con citas y auditoría.

* Los cuatro agentes diferenciados y el sistema de semáforo.

* La interfaz web con sus módulos de Cuadernos, Biblioteca, Conceptos y Comparador.

* El índice BM25 sobre un corpus de 30 PDF, fragmentados en bloques de aproximadamente diez páginas.

**Limitaciones conocidas y trabajo pendiente:**

* **Errores de OCR** en los nueve seminarios digitalizados, que afectan la calidad de algunas citas.

* **Sin evaluación sistemática** de la calidad de la recuperación ni del contenido de las respuestas. Las pruebas fueron funcionales, no métricas.

* **Una corrida con puntajes BM25 en cero** cuya causa no pudo identificarse.

* **Costo por consulta potencialmente alto**, sin métricas de consumo conservadas.

* **Dependencia de plataformas externas:** n8n Cloud y la API de Anthropic.

* **Puntos normativos abiertos:** verificar el historial de ejecuciones y la retención de datos, confirmar con la Agencia de Acceso a la Información Pública si corresponde inscribir la base de datos, y revisar la autenticación y los límites del webhook. El detalle está en `docs/auditoria-normativa.md`.

La presencia de una cita no garantiza la pertinencia de la respuesta: el sistema puede ubicar correctamente un pasaje y, aun así, extraer una conclusión que no se sigue de él. Por eso la verificación final es siempre humana.

---

## Autor y contexto académico

**Cristian David Brossa** (Psicobrossa)\
Licenciado y Profesor en Psicología\
[cristianbrossa@gmail.com](mailto:cristianbrossa@gmail.com)

Trabajo Final Integrador de la **Diplomatura en IA Aplicada a Entornos Digitales de Gestión**\
Facultad de Ciencias Económicas — Universidad de Buenos Aires (FCE-UBA)\
Cohorte 2026

Profesores: Diego Parra · Elio Sanhueza

---

### Una última aclaración

Este proyecto parte de una convicción que atraviesa todo el trabajo: la IA puede asistir la investigación, pero solo bajo condiciones estrictas de control humano, verificabilidad y responsabilidad. La herramienta organiza; el sujeto interpreta. Como sintetiza Sherry Turkle, _«las máquinas no comprenden: nos devuelven versiones de nosotros mismos»_.

LACAN·LAB produce semblantes, pero nunca lectura. Devuelve reflejos, pero no interpreta.
