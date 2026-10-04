# Auditoría normativa de LACAN·LAB

Revisión del proyecto frente a la **Ley 25.326 de Protección de los Datos Personales** (Argentina, 2000), que considera sensibles, entre otros, los datos vinculados a la salud.

## Criterio de fondo

Es probable que un sistema que recibe viñetas clínicas quede comprendido en la categoría de datos sensibles; un sistema que procesa preguntas sobre un corpus teórico se aleja de ella. Pero el desplazamiento no vuelve neutro al sistema desde el punto de vista legal: persisten

- el texto libre del campo de consulta,
- la intervención de proveedores externos,
- la posible conservación de ejecuciones,
- el *webhook* expuesto, y
- los derechos de autor sobre el corpus.

Por eso el carácter «publicable» del corpus solo refiere a la ausencia de datos clínicos. La obligación de registrar la base no puede descartarse sin confirmación de la autoridad competente (Agencia de Acceso a la Información Pública, AAIP). Reducir el riesgo por diseño no equivale a eliminarlo.

## Puntos con estado parcial

| Punto | Estado | Acción necesaria |
| --- | --- | --- |
| 2. Base de datos | Parcial (a evaluar) | Verificar historial de ejecuciones y retención; confirmar con la AAIP si corresponde inscribir la base; verificar el alcance del consentimiento para la transferencia internacional. |
| 3. Claves expuestas | Parcial | Evaluar autenticación y límites del webhook; mover el identificador de Google Custom Search a una variable de entorno; revisar el JSON antes de publicarlo. |
| 5. Eliminación de datos | Parcial | Verificar qué puede eliminarse en n8n y en los proveedores; probar que el correo llegue. |

## Medidas ya incorporadas en la interfaz

- Aviso explícito de no ingresar datos personales, clínicos ni material sujeto a secreto profesional.
- El flujo no contempla el ingreso de datos clínicos.
- La salida no es decisoria; la verificación final es humana.

## Fuentes

- Ley 25.326 (2000, 2 de noviembre). *Protección de los datos personales*. https://www.argentina.gob.ar/normativa/nacional/norma-64790/texto
- AAIP. *Inscribir un responsable de bases de datos personales privadas*. https://www.argentina.gob.ar/aaip/datospersonales/inscribir-responsable-privado
- AAIP. *Registrar bases de datos personales privadas*. https://www.argentina.gob.ar/registrar-bases-de-datos-personales-privadas
