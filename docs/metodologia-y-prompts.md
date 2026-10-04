# Metodología y prompts

El proyecto se desarrolló en cuatro etapas sucesivas. En cada una se diferenciaron las decisiones del autor, las resoluciones de la herramienta y los errores o desajustes que aparecieron en el proceso.

## Etapas del desarrollo

| Etapa | Decisión del autor | Resolución de la herramienta | Error o ajuste |
| --- | --- | --- | --- |
| Borrador conceptual → versión funcional local | Se definió el marco clínico, las restricciones de vocabulario y una estructura de salida clara; se sustituyeron los datos ficticios del borrador por información real, se explicitó que las viñetas eran simuladas por razones de confidencialidad y se asumió la necesidad de una implementación efectiva. | Generación de las lecturas. | Dependencias mal ubicadas, módulos perdidos, detalles de interfaz que ocultaban resultados; se revisó el flujo y se ajustó la arquitectura. |
| API comercial | Se mantuvieron la interfaz y el esquema de análisis y se reemplazó el motor por un modelo de mayor capacidad; la variante se conservó como parte de la evolución documentada. | El registro clínico se sostenía con más consistencia y la deriva hacia formulaciones genéricas disminuía. | Dependía de una clave de pago que impediría su uso a quien clonara el repositorio; no pudo adoptarse como entrega final. |
| Orquestación | Se diseñaron flujos que distinguían entre un agente investigador y un auditor, y se puso el proyecto en producción. | Operaciones del flujo. | Bloques de razonamiento que interferían con la extracción del contenido, límites de *tokens* que truncaban respuestas, fragmentos fuera del formato esperado. |
| Recuperación documental (BM25) | Se construyó un corpus de seminarios, se fragmentaron los documentos, y se diseñó un flujo que valida la entrada, identifica el seminario, ordena los fragmentos por relevancia y deriva la consulta a un agente específico sin invocar un modelo en cada paso; la plataforma se eligió por criterio pragmático: fue la única con la que se logró completar el flujo de manera estable. | OCR de los textos sin capa digital. | Reconocimiento imperfecto (cotejo de las citas con las ediciones impresas), normalización del corpus; nodos mal tipados, credenciales faltantes, límites de ejecución. |

El autor tomó las decisiones conceptuales y de diseño; la herramienta resolvió las operaciones; y los fallos, inevitables en un sistema en construcción, se convirtieron en parte del aprendizaje que estructura el proyecto.

## Dos lógicas de prompts

- **Lógica clínica (analizador):** procesamiento preliminar de textos clínicos y reducción a seis campos lacanianos estructurados. Etapa discontinuada por razones éticas.
- **Lógica documental (LACAN·LAB):** recuperación, verificación y auditoría de fragmentos del corpus teórico. No utiliza el conocimiento general del modelo.

El detalle de cada agente está en [`../prompts/README.md`](../prompts/README.md) y la arquitectura en [`arquitectura.md`](arquitectura.md).

## Límites de la evidencia

Las pruebas fueron funcionales: no se construyó una muestra formal de consultas con criterios de precisión definidos de antemano, ni se conservaron métricas de tiempo y consumo. Los resultados deben leerse como evidencia de funcionamiento y de aprendizaje del desarrollo, no como validación cuantitativa.

- **Límites técnicos** (reducibles): OCR, fragmentación, recuperación (por ejemplo, TOP_K = 5 puede dejar fuera pasajes relevantes), configuración del modelo.
- **Límites epistemológicos** (no dependen de la potencia del sistema): una cita no garantiza la pertinencia de la conclusión; el auditor es otro modelo de lenguaje; generar texto no equivale a interpretación clínica.
