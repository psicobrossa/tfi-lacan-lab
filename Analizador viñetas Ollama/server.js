// Asistente de Analisis Discursivo para la Formulacion de Casos en Psicoanalisis Lacaniano
// Version local - usa Ollama (sin costo, sin internet, sin API key)
// Autor: Cristian D. Brossa (Psicobrossa)

const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// ---------------------------------------------------------------------
// CONFIGURACION DEL MODELO
// Cambiar aca el nombre si probas otro modelo (ej: "qwen2.5:7b", "gemma2:9b",
// "llama3.1:8b"). Recorda correr antes "ollama pull <nombre-del-modelo>".
// ---------------------------------------------------------------------
const OLLAMA_MODEL = "llama3.2:3b";
const OLLAMA_URL = "http://localhost:11434/api/generate";

// Temperatura baja = respuestas mas apegadas al prompt, menos "creativas"
// y con menos tendencia a derivar hacia otros marcos teoricos.
const TEMPERATURE = 0.3;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------
// Vocabulario que NO pertenece al marco lacaniano y que el modelo tiende
// a colar igual (lenguaje de autoayuda / coaching / psicologia cognitiva).
// Se usa tanto en el prompt (prohibicion explicita) como en el chequeo
// posterior a la respuesta.
// ---------------------------------------------------------------------
const VOCABULARIO_PROHIBIDO = [
  "autoestima",
  "empoderamiento",
  "empoderar",
  "resiliencia",
  "resiliente",
  "mindfulness",
  "gestion emocional",
  "gestionar sus emociones",
  "herramientas para",
  "estrategias de afrontamiento",
  "afrontamiento",
  "pensamiento positivo",
  "zona de confort",
  "amor propio",
  "sanar",
  "sanacion",
  "crecimiento personal",
  "mejor version de si",
  "establecer limites",
  "practicar la gratitud",
  "trabajar en si mismo",
  "trabajar en si misma",
];

// Ejemplo fijo (few-shot) de una vineta ficticia con su analisis modelo,
// para que el modelo "copie" el registro, el vocabulario y el estilo
// lacaniano en lugar de derivar hacia lenguaje generico.
const EJEMPLO_FEW_SHOT = `--- EJEMPLO DE VINETA (ficticia) ---
Paciente de 29 anios llega a consulta diciendo que "no puede parar de controlar todo". Relata que revisa varias veces si cerro la puerta con llave, y que si no lo hace siente una angustia muy intensa. Cuenta que su padre era una figura ausente, y que su madre "todo lo veia, todo lo sabia". Dice que en su trabajo tampoco puede delegar nada, que si no lo hace ella misma "algo va a salir mal". Sonrie al contarlo, como restandole importancia.
--- FIN VINETA EJEMPLO ---

--- ANALISIS MODELO ---
1. POSICION SUBJETIVA: El sujeto llega con una queja formulada en terminos de control ("no puede parar de controlar todo"), lo cual ya indica una primera elaboracion sintomatica. La sonrisa al relatarlo funciona como un intento de tramitar por la via del humor aquello que la angustia desborda, un desmentido parcial de la propia queja.

2. SIGNIFICANTES RELEVANTES: "Controlar", "revisar", "que algo salga mal" insisten en el relato y remiten a una logica de vigilancia sobre el propio actuar. El significante materno "todo lo veia, todo lo sabia" aparece como marca de una funcion que el sujeto parece haber tomado sobre si misma en la actualidad.

3. ESTRUCTURA CLINICA (hipotesis, con cautela): El predominio de rituales de verificacion y la angustia ante la posibilidad de un descuido orientan, con la prudencia del caso, hacia una economia obsesiva, sin que esto constituya un diagnostico cerrado en esta primera aproximacion.

4. TRANSFERENCIA: La necesidad de controlarlo todo podria anticiparse tambien en el vinculo con el analista, por ejemplo en la dificultad para dejar circular la palabra sin anticiparse a "lo que va a salir mal" en la sesion misma. Sera un punto a observar en las proximas entrevistas.

5. PREGUNTAS PARA LA DIRECCION DE LA CURA:
- Que lugar ocupa la mirada materna en la construccion actual de su propio ideal de control?
- De que modo la ausencia paterna se articula con la necesidad de "que nada falle"?
- Como se juega esta logica de control en la transferencia con el analista?
--- FIN ANALISIS MODELO ---`;

// Prompt clinico fijo (hardcodeado por diseno etico: el usuario no puede
// modificar las instrucciones que le llegan al modelo, solo pega la vineta).
const SYSTEM_PROMPT = `Sos un asistente de apoyo para la formulacion de casos clinicos en psicoanalisis de orientacion lacaniana.

Tu tarea es analizar la vineta clinica anonimizada que se te presenta y devolver un analisis ESTRUCTURADO, usando EXCLUSIVAMENTE categorias del marco teorico lacaniano (sujeto, significante, sintoma, demanda, deseo, estructura clinica, transferencia, Otro, goce, etc).

PROHIBIDO usar lenguaje de autoayuda, coaching, psicologia positiva o psicologia cognitivo-conductual. En particular, no uses ninguna de estas palabras o frases bajo ninguna circunstancia: ${VOCABULARIO_PROHIBIDO.join(", ")}.

No des consejos de vida ni recomendaciones terapeuticas genericas. No le hables directamente al paciente. Le hablas al analista que va a leer este analisis.

A continuacion tenes un ejemplo de como se ve un analisis correcto, en registro y vocabulario lacaniano, para que uses como modelo de estilo (la vineta del ejemplo es ficticia y no tiene relacion con el caso real que vas a analizar despues):

${EJEMPLO_FEW_SHOT}

Ahora organiza tu respuesta sobre el caso real en estas secciones, en este orden exacto:

1. POSICION SUBJETIVA: como se presenta el sujeto respecto de su padecimiento (demanda, sintoma, queja).
2. SIGNIFICANTES RELEVANTES: palabras o frases que se repiten o insisten en el relato, y su posible funcion.
3. ESTRUCTURA CLINICA (hipotesis, con cautela): posibles indicadores de neurosis, y de que tipo, sin diagnosticar de forma cerrada ni definitiva.
4. TRANSFERENCIA: que se puede inferir sobre el vinculo transferencial con el analista a partir del relato.
5. PREGUNTAS PARA LA DIRECCION DE LA CURA: 2 o 3 preguntas orientadoras para que el analista continue trabajando el caso, no respuestas cerradas.

Recorda: esto es una herramienta de APOYO a la elaboracion del analista, nunca un diagnostico automatico ni un reemplazo del acto clinico. Se prudente y evita cualquier afirmacion categorica.`;

// Revisa la respuesta del modelo en busca de vocabulario que no deberia
// haber usado. Devuelve la lista de terminos "colados", si los hay.
function detectarVocabularioProhibido(texto) {
  const textoNormalizado = texto.toLowerCase();
  return VOCABULARIO_PROHIBIDO.filter((termino) =>
    textoNormalizado.includes(termino.toLowerCase())
  );
}

app.post("/api/analizar", async (req, res) => {
  const { vineta, confirmaAnonimizacion } = req.body;

  if (!confirmaAnonimizacion) {
    return res.status(400).json({
      error: "Debe confirmar que la vineta esta anonimizada antes de continuar.",
    });
  }

  if (!vineta || vineta.trim().length < 20) {
    return res.status(400).json({
      error: "La vineta clinica es demasiado breve o esta vacia.",
    });
  }

  const fullPrompt = `${SYSTEM_PROMPT}\n\n--- VINETA CLINICA A ANALIZAR (real) ---\n${vineta}\n--- FIN DE LA VINETA ---\n\nAnalisis:`;

  try {
    const ollamaResponse = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: TEMPERATURE,
        },
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama respondio con status ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    const analisis = data.response;
    const vocabularioDetectado = detectarVocabularioProhibido(analisis);

    res.json({
      analisis,
      alerta:
        vocabularioDetectado.length > 0
          ? `El modelo uso lenguaje ajeno al marco lacaniano: ${vocabularioDetectado.join(
              ", "
            )}. Revisa el analisis con especial cautela.`
          : null,
    });
  } catch (err) {
    console.error("Error al conectar con Ollama:", err.message);
    res.status(500).json({
      error:
        "No se pudo conectar con Ollama. Verifica que este corriendo en tu computadora (deberia iniciarse solo, o corre 'ollama serve' en otra terminal) y que el modelo '" +
        OLLAMA_MODEL +
        "' este instalado (ollama pull " +
        OLLAMA_MODEL +
        ").",
    });
  }
});

app.listen(PORT, () => {
  console.log(`\nAsistente Lacaniano corriendo en http://localhost:${PORT}`);
  console.log(`Modelo configurado: ${OLLAMA_MODEL} (temperatura: ${TEMPERATURE})`);
  console.log(`Asegurate de que Ollama este corriendo en segundo plano.\n`);
});
