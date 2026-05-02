# # Simulación de Yahtzee: Montecarlo y Procesos de Markov

Este repositorio contiene una aplicación web interactiva que simula el juego clásico de **Yahtzee** para 2 jugadores, implementando el **Método de Montecarlo** para la toma de decisiones y el análisis estadístico, fundamentado sobre un modelo de **Procesos de Decisión de Markov (MDP)**.

## 1. Estructura e Implementación de la Solución
### Distribución de Probabilidad
El problema se modela en torno al lanzamiento de dados convencionales de 6 caras. La distribución de probabilidad asociada es **Uniforme Discreta**, donde la probabilidad de obtener cualquier cara $x \in \{1, 2, 3, 4, 5, 6\}$ es exactamente:
$$P(X = x) = \frac{1}{6}$$
Dado que los lanzamientos son eventos independientes, la probabilidad de un conjunto específico de $n$ dados está dada por $(1/6)^n$.

### Estructuras de Manejo de Información
La solución en JavaScript maneja la información del estado mediante objetos y arreglos (Arrays):
- `gameState`: Un objeto central que almacena el estado global de la partida (jugador actual, lanzamientos restantes, puntuaciones).
- `dice` y `held`: Arreglos de 5 posiciones que actúan como vectores de estado para representar el valor de cada dado y la decisión (acción) de retenerlo o no.
- **Motor de Montecarlo (`analyzeMonteCarlo`)**: Utiliza matrices combinatorias de 32 elementos ($2^5$) para mapear el espacio de acciones posibles en cada iteración del turno.

## 2. Justificación del Uso del Modelo de Markov
Durante tu **video de presentación**, debes justificar por qué este problema encaja en un Modelo de Markov:

En Yahtzee, un turno individual se comporta como un **Proceso de Decisión de Markov (MDP)** por las siguientes razones:
1. **Propiedad de Markov (Falta de Memoria):** El estado futuro de los dados depende *únicamente* del estado presente (los dados actuales en la mesa) y de la acción tomada (qué dados se deciden retener). No importa cómo se llegó a ese estado ni qué pasó en los lanzamientos anteriores.
2. **Estados ($S$):** Definidos por los valores de los 5 dados actuales y los lanzamientos restantes (ej. `[2, 3, 3, 5, 6]`, 1 lanzamiento restante).
3. **Acciones ($A$):** La decisión de qué subconjunto de dados retener (hay $2^5 = 32$ combinaciones posibles).
4. **Probabilidades de Transición ($P$):** Las probabilidades de pasar a un nuevo estado al lanzar los dados no retenidos, dictadas por la distribución uniforme.

**Por qué usamos Montecarlo sobre Markov:** 
Calcular analíticamente el valor exacto de todas las ramas del árbol de Markov es costoso computacionalmente. Por ello, aplicamos el **Método de Montecarlo**: tomamos muestras aleatorias de las transiciones de Markov (simulando miles de futuros posibles) para aproximar estadísticamente el *Valor Esperado* de cada acción, eligiendo la jugada que maximice la recompensa esperada.

## 3. Análisis del Caso Planteado y Explotación de Resultados
La aplicación da respuesta al problema no solo permitiendo jugar, sino brindando herramientas de explotación de la información aleatoria:
- **Análisis de Montecarlo (Pestaña 2):** Responde a la pregunta *"¿Cuál es la mejor jugada posible en un momento dado?"*. El programa grafica el valor esperado de las diferentes combinaciones de retención.
- **Simulador Masivo (Pestaña 3):** Responde a la pregunta sobre el comportamiento del juego a largo plazo. Al enfrentar a la IA (Montecarlo) contra sí misma en 100 partidas automatizadas, se genera un histograma. Como predice el **Teorema del Límite Central**, aunque la probabilidad del dado es uniforme, la suma de puntuaciones a lo largo del juego forma una **Distribución Normal** (campana de Gauss) centrada entre 110 y 120 puntos.

## 4. Estructura del Repositorio
- `index.html`: Interfaz principal del usuario y vista del tablero.
- `style.css`: Hojas de estilo con diseño "Glassmorphism".
- `app.js`: Contiene toda la lógica del negocio, el modelo de transición de estados y el motor de simulación de Montecarlo.

---
*Desarrollado para cumplir con la rúbrica de modelado probabilístico, simulación de Montecarlo y Cadenas de Markov.*
