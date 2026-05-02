// Constantes de Categorías y Puntuación
const CATEGORIES = {
    ones: { id: 'ones', name: 'Unos' },
    twos: { id: 'twos', name: 'Doses' },
    threes: { id: 'threes', name: 'Treses' },
    fours: { id: 'fours', name: 'Cuatros' },
    fives: { id: 'fives', name: 'Cincos' },
    sixes: { id: 'sixes', name: 'Seises' },
    threeOfAKind: { id: 'threeOfAKind', name: 'Trío' },
    fourOfAKind: { id: 'fourOfAKind', name: 'Póker' },
    fullHouse: { id: 'fullHouse', name: 'Full House' },
    smallStraight: { id: 'smallStraight', name: 'Escalera Menor' },
    largeStraight: { id: 'largeStraight', name: 'Escalera Mayor' },
    yahtzee: { id: 'yahtzee', name: 'Yahtzee' },
    chance: { id: 'chance', name: 'Oportunidad' }
};

const Scoring = {
    ones: (dice) => dice.filter(d => d===1).reduce((a,b)=>a+b, 0),
    twos: (dice) => dice.filter(d => d===2).reduce((a,b)=>a+b, 0),
    threes: (dice) => dice.filter(d => d===3).reduce((a,b)=>a+b, 0),
    fours: (dice) => dice.filter(d => d===4).reduce((a,b)=>a+b, 0),
    fives: (dice) => dice.filter(d => d===5).reduce((a,b)=>a+b, 0),
    sixes: (dice) => dice.filter(d => d===6).reduce((a,b)=>a+b, 0),
    threeOfAKind: (dice) => {
        let counts = getCounts(dice);
        return Object.values(counts).some(c => c >= 3) ? dice.reduce((a,b)=>a+b, 0) : 0;
    },
    fourOfAKind: (dice) => {
        let counts = getCounts(dice);
        return Object.values(counts).some(c => c >= 4) ? dice.reduce((a,b)=>a+b, 0) : 0;
    },
    fullHouse: (dice) => {
        let counts = Object.values(getCounts(dice));
        return ((counts.includes(3) && counts.includes(2)) || counts.includes(5)) ? 25 : 0;
    },
    smallStraight: (dice) => {
        let u = [...new Set(dice)].sort();
        let str = u.join('');
        return (str.includes('1234') || str.includes('2345') || str.includes('3456')) ? 30 : 0;
    },
    largeStraight: (dice) => {
        let u = [...new Set(dice)].sort();
        let str = u.join('');
        return (str.includes('12345') || str.includes('23456')) ? 40 : 0;
    },
    yahtzee: (dice) => {
        let counts = Object.values(getCounts(dice));
        return counts.includes(5) ? 50 : 0;
    },
    chance: (dice) => dice.reduce((a,b)=>a+b, 0)
};

function getCounts(dice) {
    let counts = {};
    dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
    return counts;
}

// Lógica del Juego
let gameState = {
    players: [{}, {}], 
    currentPlayer: 0,
    rollsLeft: 3,
    dice: [1, 1, 1, 1, 1],
    held: [false, false, false, false, false],
    turnCount: 0,
    gameOver: false
};

function rollRandom() {
    return Math.floor(Math.random() * 6) + 1;
}

function initGame() {
    gameState.players = [{}, {}];
    gameState.currentPlayer = 0;
    gameState.rollsLeft = 3;
    gameState.dice = [rollRandom(), rollRandom(), rollRandom(), rollRandom(), rollRandom()];
    gameState.held = [false, false, false, false, false];
    gameState.turnCount = 0;
    gameState.gameOver = false;
    log(`Partida iniciada. Turno del Jugador 1.`);
    render();
}

function log(msg) {
    const el = document.getElementById('game-log');
    el.innerHTML = `<div>&gt; ${msg}</div>` + el.innerHTML;
}

function rollDice() {
    if (gameState.gameOver || gameState.rollsLeft <= 0) return;
    
    // Si es el primer lanzamiento del turno, no se respeta ningún "held"
    if (gameState.rollsLeft === 3) {
        gameState.held = [false, false, false, false, false];
    }

    for (let i = 0; i < 5; i++) {
        if (!gameState.held[i]) {
            gameState.dice[i] = rollRandom();
        }
    }
    gameState.rollsLeft--;
    
    // Animación visual de dados
    const diceEls = document.querySelectorAll('#dice-container .die');
    diceEls.forEach((el, i) => {
        if (!gameState.held[i]) {
            el.classList.add('rolling');
            setTimeout(() => el.classList.remove('rolling'), 400);
        }
    });

    log(`Jugador ${gameState.currentPlayer + 1} lanza los dados. Resultados: [${gameState.dice.join(', ')}]. Lanzamientos restantes: ${gameState.rollsLeft}`);
    render();
}

function scoreCategory(catId) {
    if (gameState.gameOver || gameState.rollsLeft === 3) return; // No puede puntuar sin lanzar
    if (gameState.players[gameState.currentPlayer][catId] !== undefined) return; // Ya puntuado

    const score = Scoring[catId](gameState.dice);
    gameState.players[gameState.currentPlayer][catId] = score;
    log(`Jugador ${gameState.currentPlayer + 1} anota ${score} puntos en ${CATEGORIES[catId].name}.`);

    gameState.currentPlayer = (gameState.currentPlayer + 1) % 2;
    gameState.turnCount++;
    gameState.rollsLeft = 3;
    gameState.held = [false, false, false, false, false];
    
    if (gameState.turnCount >= 26) {
        gameState.gameOver = true;
        let t1 = getTotal(0), t2 = getTotal(1);
        let winner = t1 > t2 ? 'Jugador 1' : (t2 > t1 ? 'Jugador 2' : 'Empate');
        log(`Fin del juego! Ganador: ${winner} (${t1} vs ${t2})`);
        
        const overlay = document.getElementById('winner-overlay');
        if (overlay) {
            document.getElementById('winner-title').textContent = winner === 'Empate' ? '¡Es un Empate!' : `¡${winner} Gana!`;
            document.getElementById('winner-score').textContent = `${t1} puntos vs ${t2} puntos`;
            overlay.style.display = 'flex';
        }
    } else {
        log(`Turno del Jugador ${gameState.currentPlayer + 1}.`);
    }
    
    render();
}

function getTotal(playerIdx) {
    return Object.values(gameState.players[playerIdx]).reduce((a, b) => a + b, 0);
}

// Montecarlo Simulation Engine
function getCombinations() {
    let combs = [];
    for (let i = 0; i < 32; i++) {
        combs.push([
            (i & 16) > 0, (i & 8) > 0, (i & 4) > 0, (i & 2) > 0, (i & 1) > 0
        ]);
    }
    return combs;
}

function analyzeMonteCarlo(dice, rollsLeft, availableCategories, iterations = 1000) {
    const combs = getCombinations();
    let results = [];
    
    // Si no hay rolls, no podemos retener nada diferente
    if (rollsLeft === 0) {
        return [];
    }

    for (let comb of combs) {
        let totalExpected = 0;
        
        for (let i = 0; i < iterations; i++) {
            let simDice = [...dice];
            // Simular roll inmediato
            for (let d = 0; d < 5; d++) {
                if (!comb[d]) simDice[d] = rollRandom();
            }
            
            // Si hay otro roll más (rollsLeft == 2), asumimos una estrategia básica (aleatoria) para el último roll
            // para simplificar el Montecarlo en JS y mantenerlo rápido.
            if (rollsLeft > 1) {
                // Estrategia tonta: reroll de todo. (Un MC completo usaría Expectimax, muy pesado)
                for (let d = 0; d < 5; d++) {
                    simDice[d] = rollRandom();
                }
            }

            // Encontrar mejor categoría disponible greedy
            let bestScore = -1;
            for (let cat of availableCategories) {
                let score = Scoring[cat](simDice);
                if (score > bestScore) bestScore = score;
            }
            if(bestScore === -1) bestScore = 0;
            totalExpected += bestScore;
        }
        
        results.push({
            combination: comb,
            expectedValue: totalExpected / iterations
        });
    }
    
    results.sort((a, b) => b.expectedValue - a.expectedValue);
    return results;
}

// Interfaz Gráfica
function render() {
    // Render Dice
    const diceEls = document.querySelectorAll('#dice-container .die');
    diceEls.forEach((el, i) => {
        el.textContent = gameState.dice[i];
        if (gameState.held[i] && gameState.rollsLeft < 3) {
            el.classList.add('held');
        } else {
            el.classList.remove('held');
        }
    });

    // Puntuaciones
    [0, 1].forEach(pIdx => {
        const scEl = document.getElementById(`scorecard-${pIdx}`);
        if (gameState.currentPlayer === pIdx && !gameState.gameOver) scEl.classList.add('active-player');
        else scEl.classList.remove('active-player');

        const listEl = document.getElementById(`scores-${pIdx}`);
        listEl.innerHTML = '';
        
        Object.keys(CATEGORIES).forEach(catId => {
            const row = document.createElement('div');
            row.className = 'score-row';
            const scored = gameState.players[pIdx][catId] !== undefined;
            const val = scored ? gameState.players[pIdx][catId] : '';
            
            let html = `<span>${CATEGORIES[catId].name}</span>`;
            
            if (scored) {
                row.classList.add('filled');
                html += `<span class="score-value">${val}</span>`;
            } else if (gameState.currentPlayer === pIdx && gameState.rollsLeft < 3 && !gameState.gameOver) {
                const potential = Scoring[catId](gameState.dice);
                html += `<span class="score-value potential">${potential}</span>`;
                row.onclick = () => scoreCategory(catId);
            } else {
                html += `<span class="score-value">-</span>`;
            }
            
            row.innerHTML = html;
            listEl.appendChild(row);
        });
        
        document.getElementById(`total-${pIdx}`).textContent = getTotal(pIdx);
    });

    // Botones y estados
    const btnRoll = document.getElementById('btn-roll');
    if (gameState.gameOver) {
        btnRoll.disabled = true;
        btnRoll.textContent = "Juego Terminado";
        document.getElementById('game-status').textContent = "Fin del Juego";
    } else {
        btnRoll.disabled = gameState.rollsLeft === 0;
        btnRoll.textContent = gameState.rollsLeft === 3 ? "Lanzar Inicial" : `Lanzar Dados (${gameState.rollsLeft} rest)`;
        document.getElementById('game-status').textContent = `Turno del Jugador ${gameState.currentPlayer + 1} - ${3 - gameState.rollsLeft} / 3`;
    }
}

// Listeners
document.getElementById('btn-roll').addEventListener('click', rollDice);
document.getElementById('btn-reset').addEventListener('click', initGame);

document.getElementById('btn-demo').addEventListener('click', () => {
    document.getElementById('btn-demo').disabled = true;
    log("Iniciando modo Demo Rápida...");
    
    function stepDemo() {
        if (gameState.gameOver) {
            document.getElementById('btn-demo').disabled = false;
            return;
        }
        
        if (gameState.rollsLeft === 3) {
            rollDice();
            setTimeout(stepDemo, 400);
        } else {
            // Pick the best available category to score
            const pIdx = gameState.currentPlayer;
            const availCats = Object.keys(CATEGORIES).filter(c => gameState.players[pIdx][c] === undefined);
            
            let bestScore = -1;
            let bestCat = availCats[0];
            for (let c of availCats) {
                let s = Scoring[c](gameState.dice);
                if (s > bestScore) { bestScore = s; bestCat = c; }
            }
            scoreCategory(bestCat);
            setTimeout(stepDemo, 400);
        }
    }
    
    stepDemo();
});

document.querySelectorAll('#dice-container .die').forEach(el => {
    el.addEventListener('click', () => {
        if (gameState.rollsLeft === 3 || gameState.rollsLeft === 0 || gameState.gameOver) return;
        const idx = parseInt(el.dataset.index);
        gameState.held[idx] = !gameState.held[idx];
        render();
    });
});

document.getElementById('btn-suggest').addEventListener('click', () => {
    if (gameState.rollsLeft === 3 || gameState.rollsLeft === 0) {
        alert("Debes haber lanzado los dados y tener lanzamientos restantes para usar Montecarlo.");
        return;
    }
    const availCats = Object.keys(CATEGORIES).filter(c => gameState.players[gameState.currentPlayer][c] === undefined);
    log("Calculando IA (Montecarlo, 500 iteraciones)...");
    setTimeout(() => {
        const results = analyzeMonteCarlo(gameState.dice, gameState.rollsLeft, availCats, 500);
        const best = results[0];
        gameState.held = [...best.combination];
        let heldStr = best.combination.map((h, i) => h ? (i+1) : '').filter(x=>x).join(', ');
        if(!heldStr) heldStr = "Ninguno";
        log(`Sugerencia IA: Retener [${heldStr}]. Valor Esperado: ${best.expectedValue.toFixed(2)} pts.`);
        render();
    }, 10);
});

// INIT
initGame();
