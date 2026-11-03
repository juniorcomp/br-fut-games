/**
 * Motor de Inteligência Artificial (Argon AI) — Possession Play: Brasileirão
 *
 * Responsável por:
 * 1. Construir o grafo de adjacência dos 31 hexágonos (formato 4-5-4-5-4-5-4)
 * 2. Simular a mecânica de "Hex Chaining" (captura de vizinhos neutros + roubo de vizinhos rivais)
 * 3. Avaliar estados do tabuleiro com heurística multicritério + busca Minimax (lookahead)
 * 4. Fornecer telemetria detalhada e modo "Dica da IA" (Coach) para o jogador humano
 */

const BOARD_ROWS_LAYOUT = [4, 5, 4, 5, 4, 5, 4]; // Total = 31 hexágonos

class ArgonPossessionAI {
  constructor(playersDB) {
    this.playersDB = playersDB;
    // Pool rápido para busca Minimax da IA (os 450 jogadores mais relevantes/versáteis)
    this.aiCandidatePool = playersDB.slice(0, 450);
    this.adjacencyMap = this.buildHexAdjacencyGraph();
  }

  /**
   * Constrói o grafo de adjacência exato para o tabuleiro hexagonal 4-5-4-5-4-5-4 (31 células)
   * Cada hexágono possui até 6 vizinhos (esquerda, direita, 2 acima, 2 abaixo).
   */
  buildHexAdjacencyGraph() {
    const rows = [];
    let idx = 0;
    for (let r = 0; r < BOARD_ROWS_LAYOUT.length; r++) {
      const count = BOARD_ROWS_LAYOUT[r];
      const rowIndices = [];
      for (let c = 0; c < count; c++) {
        rowIndices.push(idx++);
      }
      rows.push(rowIndices);
    }

    const adj = Array.from({ length: 31 }, () => []);

    for (let r = 0; r < rows.length; r++) {
      const currentRow = rows[r];
      const isShortRow = currentRow.length === 4; // Linhas de 4 estão deslocadas +0.5 em relação às de 5

      for (let c = 0; c < currentRow.length; c++) {
        const u = currentRow[c];

        // Vizinhos horizontais na mesma linha
        if (c > 0) adj[u].push(currentRow[c - 1]);
        if (c < currentRow.length - 1) adj[u].push(currentRow[c + 1]);

        // Vizinhos nas linhas adjacentes (r - 1 e r + 1)
        const neighborRowOffsets = [-1, 1];
        for (const dr of neighborRowOffsets) {
          const nr = r + dr;
          if (nr < 0 || nr >= rows.length) continue;
          const targetRow = rows[nr];

          // Se a linha atual tem 4 hexes e a vizinha tem 5 hexes:
          // O hex c na linha de 4 toca (c) e (c + 1) na linha de 5
          if (isShortRow) {
            if (c >= 0 && c < targetRow.length) adj[u].push(targetRow[c]);
            if (c + 1 >= 0 && c + 1 < targetRow.length) adj[u].push(targetRow[c + 1]);
          } else {
            // Se a linha atual tem 5 hexes e a vizinha tem 4 hexes:
            // O hex c na linha de 5 toca (c - 1) e (c) na linha de 4
            if (c - 1 >= 0 && c - 1 < targetRow.length) adj[u].push(targetRow[c - 1]);
            if (c >= 0 && c < targetRow.length) adj[u].push(targetRow[c]);
          }
        }
      }
    }

    return adj;
  }

  /**
   * Verifica se um jogador satisfaz a categoria de um hexágono
   */
  playerMatchesHex(player, hexTile) {
    return hexTile.category.check(player);
  }

  /**
   * Simula o efeito de jogar `player` no hexágono neutro `targetHexIndex` para `activeOwner` (1 ou 2).
   * Retorna os hexes conquistados, roubados e o impacto líquido no placar.
   */
  simulateMove(boardState, targetHexIndex, player, activeOwner) {
    const targetHex = boardState[targetHexIndex];
    if (!targetHex || targetHex.owner !== 0) {
      return { valid: false };
    }

    if (!this.playerMatchesHex(player, targetHex)) {
      return { valid: false };
    }

    const opponentOwner = activeOwner === 1 ? 2 : 1;
    const claimedNeutral = [targetHexIndex];
    const stolenFromOpponent = [];
    const reinforcedOwn = [];

    const neighbors = this.adjacencyMap[targetHexIndex];
    for (const nIdx of neighbors) {
      const neighborHex = boardState[nIdx];
      if (this.playerMatchesHex(player, neighborHex)) {
        if (neighborHex.owner === 0) {
          claimedNeutral.push(nIdx);
        } else if (neighborHex.owner === opponentOwner) {
          stolenFromOpponent.push(nIdx);
        } else if (neighborHex.owner === activeOwner) {
          reinforcedOwn.push(nIdx);
        }
      }
    }

    // Ganho líquido de diferencial de território:
    // Cada hex neutro dá +1 de saldo; cada hex roubado do adversário dá +2 de saldo (+1 pra mim, -1 pro rival)!
    const totalCapturedCount = claimedNeutral.length + stolenFromOpponent.length;
    const netScoreSwing = claimedNeutral.length + stolenFromOpponent.length * 2;

    return {
      valid: true,
      targetHexIndex,
      player,
      claimedNeutral,
      stolenFromOpponent,
      reinforcedOwn,
      totalCapturedCount,
      netScoreSwing
    };
  }

  /**
   * Enumera todas as jogadas válidas possíveis no tabuleiro atual para `activeOwner`,
   * mantendo apenas os melhores jogadores para cada combinação de captura para otimizar performance.
   */
  generateAllValidMoves(boardState, usedPlayerIds, activeOwner) {
    const availablePlayers = this.aiCandidatePool.filter((p) => !usedPlayerIds.has(p.id));
    const moves = [];

    // Pré-calcula a versatilidade restante de cada jogador no tabuleiro atual
    // (para economizar jogadores "coringas" quando um jogador específico faz o mesmo trabalho)
    const playerVersatility = new Map();
    for (const p of availablePlayers) {
      let matchCount = 0;
      for (let i = 0; i < boardState.length; i++) {
        if (this.playerMatchesHex(p, boardState[i])) matchCount++;
      }
      playerVersatility.set(p.id, matchCount);
    }

    for (let hexIdx = 0; hexIdx < boardState.length; hexIdx++) {
      if (boardState[hexIdx].owner !== 0) continue;

      for (const player of availablePlayers) {
        const sim = this.simulateMove(boardState, hexIdx, player, activeOwner);
        if (!sim.valid) continue;

        // Pontuação tática heurística
        const centralityBonus = this.adjacencyMap[hexIdx].length * 0.18;
        const versatilityCost = (playerVersatility.get(player.id) || 1) * 0.06;

        // Bônus por expor menos hexágonos a roubos imediatos ou bloquear vizinhos do rival
        let frontierDefenseBonus = 0;
        for (const nIdx of this.adjacencyMap[hexIdx]) {
          if (boardState[nIdx].owner === 0) {
            frontierDefenseBonus += 0.1;
          }
        }

        const heuristicScore =
          sim.netScoreSwing * 10 +
          sim.stolenFromOpponent.length * 4.5 +
          sim.claimedNeutral.length * 2.5 +
          centralityBonus +
          frontierDefenseBonus -
          versatilityCost;

        moves.push({
          ...sim,
          versatility: playerVersatility.get(player.id) || 1,
          heuristicScore
        });
      }
    }

    // Ordena da maior pontuação heurística para a menor
    moves.sort((a, b) => b.heuristicScore - a.heuristicScore);
    return moves;
  }

  /**
   * Escolhe a jogada da IA de acordo com o nível de dificuldade selecionado:
   * - easy ("Várzea"): Escolhe jogadas simples de 1 hexágono ou subótimas
   * - medium ("Série A"): Usa busca gulosa com pesos táticos e alguma variação
   * - hard ("Seleção / Minimax"): Aplica lookahead Minimax (avalia contra-ataque do jogador humano)
   */
  chooseMove(boardState, usedPlayerIds, difficulty = 'hard', activeOwner = 2) {
    const allMoves = this.generateAllValidMoves(boardState, usedPlayerIds, activeOwner);
    if (allMoves.length === 0) {
      return null;
    }

    // Deduplica por (targetHexIndex + conjunto de hexes capturados) mantendo o jogador mais econômico
    const uniquePatternMoves = [];
    const seenPatterns = new Set();
    for (const m of allMoves) {
      const signature = `${m.targetHexIndex}:${m.claimedNeutral.join(',')}|${m.stolenFromOpponent.join(',')}`;
      if (!seenPatterns.has(signature)) {
        seenPatterns.add(signature);
        uniquePatternMoves.push(m);
      }
    }

    if (difficulty === 'easy') {
      // Nível Várzea: Prefere jogadas simples (1 hexágono) ou sorteia entre a metade inferior/intermediária
      const simpleMoves = uniquePatternMoves.filter((m) => m.totalCapturedCount === 1);
      const pool = simpleMoves.length > 0 ? simpleMoves : uniquePatternMoves;
      const chosen = pool[Math.floor(Math.random() * Math.min(pool.length, 10))];
      return {
        chosen,
        topCandidates: uniquePatternMoves.slice(0, 4),
        totalValidMoves: allMoves.length,
        modeLabel: 'Heurística Várzea (Aleatória Simples)'
      };
    }

    if (difficulty === 'medium') {
      // Nível Série A: Escolhe entre os 3 melhores padrões táticos imediatos
      const topPool = uniquePatternMoves.slice(0, Math.min(3, uniquePatternMoves.length));
      const chosen = topPool[Math.floor(Math.random() * topPool.length)];
      return {
        chosen,
        topCandidates: uniquePatternMoves.slice(0, 4),
        totalValidMoves: allMoves.length,
        modeLabel: 'Avaliação Tática Série A'
      };
    }

    // Nível Difícil (Seleção / Minimax 2-Ply Lookahead):
    // Para os top 10 candidatos distintos da IA, simula o tabuleiro resultante e verifica
    // qual seria o melhor contra-ataque imediato (roubo/combo) do humano no turno seguinte.
    const opponentOwner = activeOwner === 1 ? 2 : 1;
    const candidatesToEvaluate = uniquePatternMoves.slice(0, 10);

    for (const candidate of candidatesToEvaluate) {
      const nextBoard = boardState.map((h) => ({ ...h }));
      for (const idx of candidate.claimedNeutral) {
        nextBoard[idx].owner = activeOwner;
      }
      for (const idx of candidate.stolenFromOpponent) {
        nextBoard[idx].owner = activeOwner;
      }

      const nextUsed = new Set(usedPlayerIds);
      nextUsed.add(candidate.player.id);

      const opponentReplies = this.generateAllValidMoves(nextBoard, nextUsed, opponentOwner);
      const worstOpponentReplySwing =
        opponentReplies.length > 0 ? opponentReplies[0].netScoreSwing : 0;

      // Valor Minimax: ganho imediato ponderado menos o melhor contra-ataque do oponente
      candidate.minimaxScore =
        candidate.heuristicScore - worstOpponentReplySwing * 4.2;
      candidate.expectedOpponentBestSwing = worstOpponentReplySwing;
    }

    candidatesToEvaluate.sort((a, b) => b.minimaxScore - a.minimaxScore);

    return {
      chosen: candidatesToEvaluate[0],
      topCandidates: candidatesToEvaluate.slice(0, 4),
      totalValidMoves: allMoves.length,
      modeLabel: 'Minimax 2-Ply + Grafo de Adjacência'
    };
  }
}

