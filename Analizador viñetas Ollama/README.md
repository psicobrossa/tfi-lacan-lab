# Asistente de Análisis Discursivo para la Formulación de Casos en Psicoanálisis Lacaniano

Herramienta de apoyo a la elaboración clínica, orientada por el psicoanálisis lacaniano. Toma una viñeta clínica anonimizada y devuelve un análisis estructurado (posición subjetiva, significantes relevantes, hipótesis de estructura clínica, transferencia, preguntas para la dirección de la cura).

Desarrollado por **Cristian D. Brossa** (Psicobrossa) como Trabajo Final Integrador de la Diplomatura en IA Aplicada a Entornos Digitales de Gestión (FCE-UBA, Cohorte 2026).

## Versión local (sin costo, sin API key)

Esta versión corre **100% en tu computadora** usando [Ollama](https://ollama.com) con un modelo open-source (`llama3.2:3b` por defecto). No requiere conexión a internet una vez instalado, no envía datos a ningún servidor externo, y no tiene costo de uso.

> **Nota sobre calidad:** al usar un modelo pequeño corriendo localmente, la calidad del análisis es notablemente inferior a la de modelos comerciales como Claude (mayor tendencia a alucinar, mayor deriva hacia lenguaje genérico de autoayuda pese a las instrucciones explícitas del prompt). Esta comparación de calidad entre versiones se documenta en la sección de Análisis Crítico del informe del TFI.

### Mitigaciones aplicadas para reducir la deriva discursiva

Se detectó empíricamente que el modelo local mezclaba categorías lacanianas con vocabulario de otros marcos (autoayuda, coaching, psicología cognitivo-conductual) a pesar de las instrucciones. Se aplicaron cuatro mitigaciones, todas gratuitas y sin necesidad de API paga:

1. **Few-shot prompting**: se incluye en el prompt un ejemplo completo de viñeta ficticia + análisis modelo ya resuelto en registro lacaniano, para que el modelo imite el estilo y vocabulario en lugar de generar desde cero.
2. **Lista negra de vocabulario explícita**: el prompt prohíbe nombrando directamente los términos que el modelo tendía a colar (autoestima, empoderamiento, resiliencia, mindfulness, gestión emocional, etc.), definida en `VOCABULARIO_PROHIBIDO` en `server.js`.
3. **Temperatura baja** (`temperature: 0.3`): reduce la aleatoriedad de la generación, favoreciendo respuestas más apegadas al prompt y menos propensas a derivar hacia otros marcos teóricos.
4. **Chequeo automático post-generación**: el backend escanea la respuesta del modelo en busca de los términos de la lista negra y, si encuentra alguno, muestra una alerta visible en la interfaz para que el analista revise ese resultado con especial cautela. Esto no corrige la respuesta, pero la señaliza — es un mecanismo de control humano (dimensión "bajo control humano" del AIBPS).

Estas mitigaciones mejoran el resultado pero no lo igualan al de un modelo más grande o entrenado específicamente en literatura psicoanalítica; ese techo de calidad sigue siendo una limitación documentada de la versión local frente a la versión con API de Claude.

## Requisitos

- [Node.js](https://nodejs.org) (v18 o superior)
- [Ollama](https://ollama.com) instalado y corriendo
- Modelo descargado: `ollama pull llama3.2:3b`

## Instalación

```bash
npm install
npm start
```

Luego abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Cómo funciona

1. El usuario pega una viñeta clínica ya anonimizada en el formulario.
2. Debe confirmar explícitamente (checkbox) que la viñeta no contiene datos identificatorios.
3. El backend (Express) arma un prompt fijo y hardcodeado —el usuario no puede alterar las instrucciones que recibe el modelo— y se lo envía a Ollama, corriendo localmente.
4. El modelo devuelve el análisis estructurado, que se muestra en pantalla.

## Salvaguardas éticas

- El prompt del sistema está **hardcodeado** en `server.js`: el usuario no puede modificar las instrucciones enviadas al modelo, solo aporta la viñeta.
- Checkbox de **confirmación de anonimización obligatoria** antes de poder enviar cualquier viñeta.
- El prompt instruye explícitamente al modelo a **no diagnosticar de forma cerrada** y a presentar hipótesis con cautela.
- Todo el procesamiento es **local**: ningún dato de pacientes sale de la computadora del usuario.

## Estructura del proyecto

```
asistente-lacaniano-ia/
├── server.js          # Backend Express + integración con Ollama
├── package.json
├── public/
│   └── index.html      # Frontend (identidad visual Psicobrossa)
└── README.md
```

## Stack

- Node.js + Express
- Ollama (modelo local: llama3.2:3b)
- HTML/CSS/JS vanilla en el frontend

## Autor

Cristian D. Brossa — Psicobrossa
Licenciado y Profesor en Psicología (UNLP) — Orientación psicoanalítica lacaniana
