/**
 * Controlador Principal — Possession Play: Brasileirão
 * Suporta 4 Modos de Jogo:
 * 1. vs IA (🤖): Jogador Azul contra IA Argon (Relógio total 4:00)
 * 2. Mesma Tela (👥): 2 Jogadores locais alternando turnos sem limite de 25/30s por jogada, apenas relógio principal (4:00)
 * 3. Desafio Diário (🌟): Tabuleiro fixo do dia onde o jogador tenta conquistar o máximo de hexágonos e pontos em 10 jogadas
 * 4. Jogar Online (🌐): Gera código de partida (ex: BR-4821) com seed compartilhada e sincronização em tempo real entre abas/janelas
 */

class PossessionGameApp {
  constructor() {
    this.ai = new ArgonPossessionAI(PLAYERS_DB);
    this.gameMode = 'ai'; // 'ai' | 'local' | 'daily' | 'online'
    this.boardState = [];
    this.usedPlayerIds = new Set();
    this.matchMoveHistory = []; // Guarda o histórico tático para análise pós-jogo
    this.currentTurn = 1; // 1 = Azul, 2 = Vermelho
    this.selectedHexIndex = null;
    this.isGameOver = false;
    this.aiThinking = false;

    // Relógio Principal (4:00 = 240s por jogador, sem shotclock de 25/30s forçando perda de vez)
    this.p1TimeRemaining = 240;
    this.p2TimeRemaining = 240;
    this.timerInterval = null;

    // Estado do Modo Desafio Diário
    this.dailyScore = 0;
    this.dailyMovesLeft = 10;

    // Estado do Modo Online (Código da Sala + BroadcastChannel + Seed)
    this.roomCode = null;
    this.onlineRole = 1; // 1 = Host (Azul), 2 = Convidado (Vermelho)
    this.onlineChannel = null;
    this.lastBoardSignature = '';

    this.autocompleteIndex = -1;
    this.currentFilteredPlayers = [];

    this.cacheDOM();
    this.bindEvents();
    this.checkURLRoomCode();
    this.startNewGame();
  }

  cacheDOM() {
    this.hexBoardEl = document.getElementById('hex-board');
    this.modeBtns = document.querySelectorAll('.mode-btn');
    this.aiDifficultySelect = document.getElementById('ai-difficulty');
    this.btnOpenAnalysis = document.getElementById('btn-open-analysis');
    this.btnNewGame = document.getElementById('btn-new-game');

    // Online Room Badge
    this.onlineRoomBadge = document.getElementById('online-room-badge');
    this.activeRoomCodeEl = document.getElementById('active-room-code');
    this.btnCopyCode = document.getElementById('btn-copy-code');

    // HUD Versus
    this.hudVersus = document.getElementById('hud-versus');
    this.p1TimerBox = document.getElementById('p1-timer-box');
    this.p2TimerBox = document.getElementById('p2-timer-box');
    this.p1ClockEl = document.getElementById('p1-clock');
    this.p2ClockEl = document.getElementById('p2-clock');
    this.p1TagEl = document.getElementById('p1-tag');
    this.p2TagEl = document.getElementById('p2-tag');
    this.p1HexCountEl = document.getElementById('p1-hex-count');
    this.p2HexCountEl = document.getElementById('p2-hex-count');
    this.p1PosBarEl = document.getElementById('p1-pos-bar');
    this.p2PosBarEl = document.getElementById('p2-pos-bar');
    this.p1PosPctEl = document.getElementById('p1-pos-pct');
    this.p2PosPctEl = document.getElementById('p2-pos-pct');

    // HUD Daily Challenge
    this.hudDaily = document.getElementById('hud-daily');
    this.dailyHexClaimedEl = document.getElementById('daily-hex-claimed');
    this.dailyScoreEl = document.getElementById('daily-score');
    this.dailyMovesLeftEl = document.getElementById('daily-moves-left');
    this.dailyProgressBarEl = document.getElementById('daily-progress-bar');

    // Bottom Search Bar
    this.selectedHexPill = document.getElementById('selected-hex-pill');
    this.selectedHexTitle = document.getElementById('selected-hex-title');
    this.btnClearHex = document.getElementById('btn-clear-hex');
    this.searchInput = document.getElementById('player-search-input');
    this.moveToast = document.getElementById('move-toast');
    this.autocompleteDropdown = document.getElementById('autocomplete-dropdown');

    // Modal Online
    this.modalOnline = document.getElementById('modal-online');
    this.btnCloseOnline = document.getElementById('btn-close-online');
    this.generatedCodeDisplay = document.getElementById('generated-code-display');
    this.btnCopyLobbyCode = document.getElementById('btn-copy-lobby-code');
    this.btnStartHost = document.getElementById('btn-start-host');
    this.joinCodeInput = document.getElementById('join-code-input');
    this.btnJoinGuest = document.getElementById('btn-join-guest');

    // Modal Game Over & Post-Match Tactical Inspector
    this.modalGameover = document.getElementById('modal-gameover');
    this.gameoverScoreBox = document.getElementById('gameover-score-box');
    this.postmatchMovesList = document.getElementById('postmatch-moves-list');
    this.postmatchBoardInspector = document.getElementById('postmatch-board-inspector');
    this.btnPlayAgain = document.getElementById('btn-play-again');
    this.btnCloseGameover = document.getElementById('btn-close-gameover');
  }

  bindEvents() {
    // Alternância entre as 4 opções de jogo
    this.modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedMode = btn.dataset.mode;
        if (selectedMode === 'online') {
          this.openOnlineLobbyModal();
          return;
        }
        this.switchGameMode(selectedMode);
      });
    });

    this.btnNewGame.addEventListener('click', () => {
      if (this.gameMode === 'online') {
        this.openOnlineLobbyModal();
      } else {
        this.startNewGame();
      }
    });

    this.btnClearHex.addEventListener('click', () => this.clearHexSelection());

    // Busca de jogador
    this.searchInput.addEventListener('input', () => this.handleSearchInput());
    this.searchInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e));

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#search-box-wrapper')) {
        this.autocompleteDropdown.hidden = true;
      }
    });

    // Lobby Online
    this.btnCloseOnline.addEventListener('click', () => {
      this.modalOnline.hidden = true;
    });

    this.btnCopyLobbyCode.addEventListener('click', () => {
      const code = this.generatedCodeDisplay.textContent;
      navigator.clipboard?.writeText(code);
      this.btnCopyLobbyCode.textContent = '✅ Copiado!';
      setTimeout(() => (this.btnCopyLobbyCode.textContent = '📋 Copiar Código'), 1800);
    });

    this.btnCopyCode.addEventListener('click', () => {
      if (!this.roomCode) return;
      navigator.clipboard?.writeText(this.roomCode);
      this.btnCopyCode.textContent = 'Copiado!';
      setTimeout(() => (this.btnCopyCode.textContent = 'Copiar'), 1500);
    });

    this.btnStartHost.addEventListener('click', () => {
      const code = this.generatedCodeDisplay.textContent.trim();
      this.modalOnline.hidden = true;
      this.startOnlineMatch(code, 1);
    });

    this.btnJoinGuest.addEventListener('click', () => {
      const raw = this.joinCodeInput.value.trim().toUpperCase();
      if (!raw) return;
      this.modalOnline.hidden = true;
      this.startOnlineMatch(raw, 2);
    });

    // Game Over & Post-Match Analysis Modal
    this.btnOpenAnalysis?.addEventListener('click', () => {
      this.modalGameover.hidden = false;
    });
    this.btnPlayAgain.addEventListener('click', () => {
      this.modalGameover.hidden = true;
      this.startNewGame();
    });
    this.btnCloseGameover.addEventListener('click', () => {
      this.modalGameover.hidden = true;
    });

    document.querySelectorAll('.pm-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        document.querySelectorAll('.pm-tab').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.pm-pane').forEach((p) => (p.hidden = true));
        tabBtn.classList.add('active');
        const pane = document.getElementById(tabBtn.dataset.pmtab);
        if (pane) pane.hidden = false;
      });
    });
  }

  checkURLRoomCode() {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('sala') || params.get('room');
    if (roomParam) {
      this.startOnlineMatch(roomParam.toUpperCase(), 2);
    }
  }

  switchGameMode(mode) {
    this.gameMode = mode;
    this.modeBtns.forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));

    this.aiDifficultySelect.hidden = mode !== 'ai';
    this.onlineRoomBadge.hidden = mode !== 'online';
    this.hudVersus.hidden = mode === 'daily';
    this.hudDaily.hidden = mode !== 'daily';

    this.startNewGame();
  }

  openOnlineLobbyModal() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.generatedCodeDisplay.textContent = `BR-${randomNum}`;
    this.joinCodeInput.value = '';
    this.modalOnline.hidden = false;
  }

  startOnlineMatch(code, role) {
    this.roomCode = code;
    this.onlineRole = role;
    this.gameMode = 'online';

    this.modeBtns.forEach((b) => b.classList.toggle('active', b.dataset.mode === 'online'));
    this.aiDifficultySelect.hidden = true;
    this.onlineRoomBadge.hidden = false;
    this.activeRoomCodeEl.textContent = code;
    this.hudVersus.hidden = false;
    this.hudDaily.hidden = true;

    this.setupOnlineSync(code);
    this.startNewGame(code);
  }

  setupOnlineSync(code) {
    if (this.onlineChannel) {
      this.onlineChannel.close();
    }
    if ('BroadcastChannel' in window) {
      this.onlineChannel = new BroadcastChannel(`possession_br_${code}`);
      this.onlineChannel.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'MOVE') {
          const player = PLAYERS_DB.find((p) => p.id === data.playerId);
          if (player && !this.usedPlayerIds.has(player.id)) {
            this.applyValidatedMove(data.hexIndex, player, data.turnOwner, false);
          }
        } else if (data.type === 'SYNC_REQUEST' && this.onlineRole === 1) {
          this.onlineChannel.postMessage({
            type: 'SYNC_STATE',
            boardOwners: this.boardState.map((h) => ({
              owner: h.owner,
              claimedByPlayer: h.claimedByPlayer
            })),
            usedIds: Array.from(this.usedPlayerIds),
            currentTurn: this.currentTurn,
            p1Time: this.p1TimeRemaining,
            p2Time: this.p2TimeRemaining
          });
        } else if (data.type === 'SYNC_STATE' && this.onlineRole === 2) {
          data.boardOwners.forEach((item, idx) => {
            if (this.boardState[idx]) {
              this.boardState[idx].owner = item.owner;
              this.boardState[idx].claimedByPlayer = item.claimedByPlayer;
            }
          });
          this.usedPlayerIds = new Set(data.usedIds);
          this.currentTurn = data.currentTurn;
          this.p1TimeRemaining = data.p1Time;
          this.p2TimeRemaining = data.p2Time;
          this.renderBoard();
          this.updateScoreboard();
          this.updateTurnUI();
        }
      };

      if (this.onlineRole === 2) {
        setTimeout(() => {
          this.onlineChannel?.postMessage({ type: 'SYNC_REQUEST' });
        }, 300);
      }
    }
  }

  /**
   * Gerador pseudo-aleatório com semente (PRNG Mulberry32)
   * Permite que o Desafio Diário ou o Código da Sala Online gerem exatamente o mesmo tabuleiro,
   * enquanto partidas normais usam entropia nova para variar a cada partida iniciada.
   */
  createSeededRNG(seedString) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seedString.length; i++) {
      h = Math.imul(h ^ seedString.charCodeAt(i), 16777619);
    }
    let a = h >>> 0;
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  shuffleWithRNG(arr, rngFunc) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rngFunc() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Sorteia 31 categorias variadas para o tabuleiro a cada nova partida
   */
  generateBoardCategories(customSeed = null) {
    let rng = Math.random;
    if (customSeed) {
      rng = this.createSeededRNG(customSeed);
    } else {
      // Garante alta variação a cada partida iniciada misturando timestamp + entropia
      const entropySeed = `${Date.now()}_${Math.random()}_${ performance.now() }`;
      rng = this.createSeededRNG(entropySeed);
    }

    const clubsBR = this.shuffleWithRNG(
      CATEGORIES_POOL.filter((c) => c.group === 'Clube Brasileirão'),
      rng
    );
    const clubsSA = this.shuffleWithRNG(
      CATEGORIES_POOL.filter((c) => c.group === 'Gigante Sul-Americano'),
      rng
    );
    const titles = this.shuffleWithRNG(
      CATEGORIES_POOL.filter((c) => c.group === 'Título / Competição'),
      rng
    );
    const nations = this.shuffleWithRNG(
      CATEGORIES_POOL.filter((c) => c.group === 'País / Região'),
      rng
    );
    const milestones = this.shuffleWithRNG(
      CATEGORIES_POOL.filter((c) => c.group === 'Marco Histórico'),
      rng
    );

    // Varia a proporção de cada grupo entre partidas mantendo sempre 31 hexágonos ricos em combos
    const brCount = 12 + Math.floor(rng() * 3); // 12 a 14 clubes BR
    const saCount = 2 + Math.floor(rng() * 2); // 2 a 3 sul-americanos
    const titleCount = 6 + Math.floor(rng() * 2); // 6 a 7 títulos
    const natCount = 4 + Math.floor(rng() * 2); // 4 a 5 países/regiões
    const mileCount = 31 - (brCount + saCount + titleCount + natCount);

    const picked = [
      ...clubsBR.slice(0, brCount),
      ...clubsSA.slice(0, saCount),
      ...titles.slice(0, titleCount),
      ...nations.slice(0, natCount),
      ...milestones.slice(0, Math.max(2, mileCount))
    ].slice(0, 31);

    const finalLayout = this.shuffleWithRNG(picked, rng);
    this.lastBoardSignature = finalLayout.map((c) => c.id).join(',');
    return finalLayout;
  }

  startNewGame(seedOverride = null) {
    if (this.timerInterval) clearInterval(this.timerInterval);

    let seed = seedOverride;
    if (this.gameMode === 'daily') {
      const today = new Date().toISOString().slice(0, 10);
      // No Desafio Diário, permite variar se o usuário clicar em "Nova Partida" ou usa a data na primeira vez
      seed = this._dailyPlayedOnce ? `${today}_${Date.now()}` : `DAILY_${today}`;
      this._dailyPlayedOnce = true;
    } else if (this.gameMode === 'online' && this.roomCode) {
      seed = `ROOM_${this.roomCode}`;
    }

    const categories = this.generateBoardCategories(seed);
    this.boardState = categories.map((cat, idx) => ({
      index: idx,
      category: cat,
      owner: 0,
      claimedByPlayer: null
    }));

    this.usedPlayerIds.clear();
    this.matchMoveHistory = [];
    if (this.btnOpenAnalysis) this.btnOpenAnalysis.hidden = true;
    this.currentTurn = 1;
    this.selectedHexIndex = null;
    this.isGameOver = false;
    this.aiThinking = false;

    // Relógio de 4:00 (240s) por jogador — sem shotclock de 25/30s derrubando a vez
    this.p1TimeRemaining = 240;
    this.p2TimeRemaining = 240;

    // Reset Desafio Diário
    this.dailyScore = 0;
    this.dailyMovesLeft = 10;

    this.updatePlayerTags();
    this.clearHexSelection();
    this.renderBoard();
    this.updateScoreboard();
    this.updateTurnUI();

    if (this.gameMode !== 'daily') {
      this.startMatchClock();
    }
  }

  updatePlayerTags() {
    if (this.gameMode === 'ai') {
      this.p1TagEl.textContent = 'VOCÊ (AZUL)';
      this.p2TagEl.textContent = 'IA ARGON';
    } else if (this.gameMode === 'local') {
      this.p1TagEl.textContent = 'JOGADOR 1 (AZUL)';
      this.p2TagEl.textContent = 'JOGADOR 2 (VERM)';
    } else if (this.gameMode === 'online') {
      this.p1TagEl.textContent = this.onlineRole === 1 ? 'VOCÊ (P1 AZUL)' : 'P1 (AZUL)';
      this.p2TagEl.textContent = this.onlineRole === 2 ? 'VOCÊ (P2 VERM)' : 'P2 (VERM)';
    }
  }

  renderBoard(animatedIndices = []) {
    this.hexBoardEl.innerHTML = '';
    let globalIdx = 0;

    for (let r = 0; r < BOARD_ROWS_LAYOUT.length; r++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'hex-row';
      const cols = BOARD_ROWS_LAYOUT[r];

      for (let c = 0; c < cols; c++) {
        const hexData = this.boardState[globalIdx];
        const tileEl = document.createElement('div');
        tileEl.className = 'hex-tile';
        tileEl.dataset.index = hexData.index;

        if (hexData.owner === 1) tileEl.classList.add('owner-1');
        if (hexData.owner === 2) tileEl.classList.add('owner-2');
        if (this.selectedHexIndex === hexData.index) tileEl.classList.add('selected');
        if (animatedIndices.includes(hexData.index)) tileEl.classList.add('just-captured');

        const playerTagHTML = hexData.claimedByPlayer
          ? `<div class="hex-player-tag">${this.shortenPlayerName(hexData.claimedByPlayer)}</div>`
          : '';

        tileEl.innerHTML = `
          <div class="hex-inner">
            <div class="hex-icon">${hexData.category.svg}</div>
            <div class="hex-label">${hexData.category.label}</div>
            ${playerTagHTML}
          </div>
        `;

        tileEl.addEventListener('click', () => this.onHexClick(hexData.index));
        rowEl.appendChild(tileEl);
        globalIdx++;
      }

      this.hexBoardEl.appendChild(rowEl);
    }

    this.highlightNeighborHexes(this.selectedHexIndex);
  }

  shortenPlayerName(fullName) {
    return fullName.replace(/\s*\(.*?\)\s*/g, '');
  }

  onHexClick(hexIndex) {
    if (this.isGameOver) {
      this.modalGameover.hidden = false;
      return;
    }
    if (this.aiThinking) return;

    // No modo online, verifica se é o turno deste jogador (ou permite jogar na mesma máquina para testar)
    const hexData = this.boardState[hexIndex];
    if (hexData.owner !== 0) {
      this.showToast('Hexágono já conquistado!', false);
      return;
    }

    this.selectedHexIndex = hexIndex;
    this.selectedHexPill.hidden = false;
    this.selectedHexTitle.textContent = hexData.category.label;

    this.searchInput.disabled = false;
    this.searchInput.value = '';
    this.searchInput.placeholder = `Digite um jogador para ${hexData.category.label}...`;
    this.searchInput.focus();

    document.querySelectorAll('.hex-tile').forEach((el) => {
      const idx = Number(el.dataset.index);
      el.classList.toggle('selected', idx === hexIndex);
    });

    this.highlightNeighborHexes(hexIndex);
    this.handleSearchInput();
  }

  highlightNeighborHexes(centerHexIndex) {
    document.querySelectorAll('.hex-tile').forEach((el) => el.classList.remove('neighbor-highlight'));
    if (centerHexIndex === null) return;

    const neighbors = this.ai.adjacencyMap[centerHexIndex] || [];
    for (const nIdx of neighbors) {
      const neighborEl = this.hexBoardEl.querySelector(`.hex-tile[data-index="${nIdx}"]`);
      if (neighborEl) neighborEl.classList.add('neighbor-highlight');
    }
  }

  clearHexSelection() {
    this.selectedHexIndex = null;
    this.selectedHexPill.hidden = true;
    this.searchInput.value = '';
    this.searchInput.disabled = true;
    this.searchInput.placeholder = 'Select A Hex To Start Your Move...';
    this.autocompleteDropdown.hidden = true;

    document.querySelectorAll('.hex-tile').forEach((el) => {
      el.classList.remove('selected', 'neighbor-highlight');
    });
  }

  handleSearchInput() {
    if (this.selectedHexIndex === null) return;
    const query = this.normalizeText(this.searchInput.value);

    const available = PLAYERS_DB.filter((p) => !this.usedPlayerIds.has(p.id));
    this.currentFilteredPlayers = available
      .filter((p) => {
        if (!query) return true;
        const haystack = this.normalizeText(`${p.name} ${p.nationality} ${p.clubs.join(' ')}`);
        return haystack.includes(query);
      })
      .slice(0, 10);

    this.autocompleteIndex = this.currentFilteredPlayers.length > 0 ? 0 : -1;
    this.renderAutocomplete();
  }

  handleSearchKeydown(e) {
    if (this.autocompleteDropdown.hidden || this.currentFilteredPlayers.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.autocompleteIndex = (this.autocompleteIndex + 1) % this.currentFilteredPlayers.length;
      this.renderAutocomplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.autocompleteIndex =
        (this.autocompleteIndex - 1 + this.currentFilteredPlayers.length) %
        this.currentFilteredPlayers.length;
      this.renderAutocomplete();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.autocompleteIndex >= 0) {
        const chosenPlayer = this.currentFilteredPlayers[this.autocompleteIndex];
        this.submitMove(this.selectedHexIndex, chosenPlayer);
      }
    } else if (e.key === 'Escape') {
      this.clearHexSelection();
    }
  }

  renderAutocomplete() {
    if (this.currentFilteredPlayers.length === 0) {
      this.autocompleteDropdown.innerHTML = `
        <div class="ac-item">
          <span class="ac-player-meta">Nenhum jogador encontrado.</span>
        </div>
      `;
      this.autocompleteDropdown.hidden = false;
      return;
    }

    this.autocompleteDropdown.innerHTML = this.currentFilteredPlayers
      .map((p, idx) => {
        const activeClass = idx === this.autocompleteIndex ? 'ac-active' : '';
        return `
          <div class="ac-item ${activeClass}" data-player-id="${p.id}">
            <div>
              <div class="ac-player-name">${p.name}</div>
              <div class="ac-player-meta">${p.position} • ${p.nationality} (${p.birthYear})</div>
            </div>
          </div>
        `;
      })
      .join('');

    this.autocompleteDropdown.querySelectorAll('.ac-item').forEach((itemEl) => {
      itemEl.addEventListener('click', () => {
        const pid = itemEl.dataset.playerId;
        const player = PLAYERS_DB.find((p) => p.id === pid);
        if (player) {
          this.submitMove(this.selectedHexIndex, player);
        }
      });
    });

    this.autocompleteDropdown.hidden = false;
  }

  showToast(message, isSuccess = true) {
    this.moveToast.textContent = message;
    this.moveToast.className = `move-toast ${isSuccess ? 'toast-ok' : ''}`;
    this.moveToast.hidden = false;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.moveToast.hidden = true;
    }, 2200);
  }

  submitMove(hexIndex, player) {
    if (this.isGameOver || hexIndex === null || !player) return;

    // Calcula qual seria o melhor combo da IA neste estado antes da jogada para o relatório pós-partida
    const allBefore = this.ai.generateAllValidMoves(this.boardState, this.usedPlayerIds, this.currentTurn);
    const bestPossible = allBefore.length > 0 ? allBefore[0] : null;

    const sim = this.ai.simulateMove(this.boardState, hexIndex, player, this.currentTurn);
    if (!sim.valid) {
      this.matchMoveHistory.push({
        turnNumber: this.matchMoveHistory.length + 1,
        owner: this.currentTurn,
        valid: false,
        playerName: this.shortenPlayerName(player.name),
        targetLabel: this.boardState[hexIndex].category.label,
        capturedLabels: [],
        stolenCount: 0,
        bestPossible: bestPossible
          ? {
              playerName: this.shortenPlayerName(bestPossible.player.name),
              targetLabel: this.boardState[bestPossible.targetHexIndex].category.label,
              totalCount: bestPossible.totalCapturedCount,
              stolenCount: bestPossible.stolenFromOpponent.length
            }
          : null
      });

      this.showToast(`❌ ${this.shortenPlayerName(player.name)} não cumpre este hex!`, false);
      this.clearHexSelection();
      if (this.gameMode === 'daily') {
        this.dailyMovesLeft = Math.max(0, this.dailyMovesLeft - 1);
        this.updateScoreboard();
        if (this.dailyMovesLeft === 0) {
          this.endGame('Suas 10 jogadas do Desafio Diário terminaram!');
        }
      } else {
        this.advanceTurn();
      }
      return;
    }

    this.applyValidatedMove(hexIndex, player, this.currentTurn, true, bestPossible);
  }

  applyValidatedMove(hexIndex, player, turnOwner, broadcastOnline = true, bestPossiblePrecomputed = null) {
    const sim = this.ai.simulateMove(this.boardState, hexIndex, player, turnOwner);
    if (!sim.valid) return;

    const bestPossible =
      bestPossiblePrecomputed ||
      (this.ai.generateAllValidMoves(this.boardState, this.usedPlayerIds, turnOwner)[0] ?? null);

    this.usedPlayerIds.add(player.id);
    const affectedIndices = [...sim.claimedNeutral, ...sim.stolenFromOpponent];

    this.matchMoveHistory.push({
      turnNumber: this.matchMoveHistory.length + 1,
      owner: turnOwner,
      valid: true,
      playerName: this.shortenPlayerName(player.name),
      targetLabel: this.boardState[hexIndex].category.label,
      capturedLabels: affectedIndices.map((i) => this.boardState[i].category.label),
      totalCount: affectedIndices.length,
      stolenCount: sim.stolenFromOpponent.length,
      bestPossible: bestPossible
        ? {
            playerName: this.shortenPlayerName(bestPossible.player.name),
            targetLabel: this.boardState[bestPossible.targetHexIndex].category.label,
            totalCount: bestPossible.totalCapturedCount,
            stolenCount: bestPossible.stolenFromOpponent.length
          }
        : null
    });

    for (const idx of affectedIndices) {
      this.boardState[idx].owner = turnOwner;
      this.boardState[idx].claimedByPlayer = player.name;
    }

    // Cálculo de pontuação do Desafio Diário (Combos multiplicam os pontos!)
    if (this.gameMode === 'daily') {
      const count = affectedIndices.length;
      // 1 hex = 100 pts, 2 hexes = 300 pts, 3 hexes = 600 pts, 4 hexes = 1000 pts, 5+ = 1500+ pts
      const comboPoints = count * 100 + (count > 1 ? (count - 1) * count * 50 : 0);
      this.dailyScore += comboPoints;
      this.dailyMovesLeft = Math.max(0, this.dailyMovesLeft - 1);
      this.showToast(`+${comboPoints} PTS (${count} hexes!)`, true);
    } else if (affectedIndices.length > 1) {
      this.showToast(`🔥 Combo ${affectedIndices.length} hexes!`, true);
    }

    if (broadcastOnline && this.gameMode === 'online' && this.onlineChannel) {
      this.onlineChannel.postMessage({
        type: 'MOVE',
        hexIndex,
        playerId: player.id,
        turnOwner
      });
    }

    this.clearHexSelection();
    this.renderBoard(affectedIndices);
    this.updateScoreboard();

    const remainingNeutral = this.boardState.filter((h) => h.owner === 0).length;
    if (remainingNeutral === 0) {
      if (this.gameMode === 'daily') {
        this.dailyScore += this.dailyMovesLeft * 250; // Bônus por completar antes!
        this.updateScoreboard();
      }
      this.endGame('Todos os 31 hexágonos foram dominados!');
      return;
    }

    if (this.gameMode === 'daily') {
      if (this.dailyMovesLeft === 0) {
        this.endGame('Desafio Diário concluído!');
      }
      return;
    }

    this.advanceTurn();
  }

  advanceTurn() {
    if (this.isGameOver) return;
    this.currentTurn = this.currentTurn === 1 ? 2 : 1;
    this.updateTurnUI();

    if (this.gameMode === 'ai' && this.currentTurn === 2) {
      this.executeAITurn(this.aiDifficultySelect.value);
    }
  }

  executeAITurn(difficulty) {
    this.aiThinking = true;
    this.searchInput.placeholder = 'IA Argon está jogando...';

    setTimeout(() => {
      if (this.isGameOver) return;
      const decision = this.ai.chooseMove(this.boardState, this.usedPlayerIds, difficulty, 2);
      this.aiThinking = false;
      this.searchInput.placeholder = 'Select A Hex To Start Your Move...';

      if (!decision || !decision.chosen) {
        this.advanceTurn();
        return;
      }

      this.submitMove(decision.chosen.targetHexIndex, decision.chosen.player);
    }, 850);
  }

  updateScoreboard() {
    const p1Count = this.boardState.filter((h) => h.owner === 1).length;
    const p2Count = this.boardState.filter((h) => h.owner === 2).length;
    const totalClaimed = p1Count + p2Count;

    if (this.gameMode === 'daily') {
      this.dailyHexClaimedEl.textContent = p1Count;
      this.dailyScoreEl.textContent = this.dailyScore;
      this.dailyMovesLeftEl.textContent = this.dailyMovesLeft;
      const pct = Math.round((p1Count / 31) * 100);
      this.dailyProgressBarEl.style.width = `${pct}%`;
      return;
    }

    this.p1HexCountEl.textContent = p1Count;
    this.p2HexCountEl.textContent = p2Count;

    let p1Pct = 50;
    let p2Pct = 50;
    if (totalClaimed > 0) {
      p1Pct = Math.round((p1Count / totalClaimed) * 100);
      p2Pct = 100 - p1Pct;
    }

    this.p1PosBarEl.style.width = `${p1Pct}%`;
    this.p2PosBarEl.style.width = `${p2Pct}%`;
    this.p1PosPctEl.textContent = `${p1Pct}%`;
    this.p2PosPctEl.textContent = `${p2Pct}%`;
  }

  updateTurnUI() {
    const isP1 = this.currentTurn === 1;
    this.p1TimerBox.classList.toggle('active-turn', isP1);
    this.p2TimerBox.classList.toggle('active-turn', !isP1);
  }

  /**
   * Relógio principal de partida: conta apenas o tempo de quem está na vez (4:00 = 240s),
   * sem derrubar o turno a cada 25/30 segundos!
   */
  startMatchClock() {
    this.updateClockDisplays();
    this.timerInterval = setInterval(() => {
      if (this.isGameOver) return;

      if (this.currentTurn === 1) {
        this.p1TimeRemaining = Math.max(0, this.p1TimeRemaining - 1);
        if (this.p1TimeRemaining === 0) {
          this.endGame('Tempo esgotado para o Jogador Azul!');
          return;
        }
      } else {
        this.p2TimeRemaining = Math.max(0, this.p2TimeRemaining - 1);
        if (this.p2TimeRemaining === 0) {
          this.endGame('Tempo esgotado para o Jogador Vermelho!');
          return;
        }
      }

      this.updateClockDisplays();
    }, 1000);
  }

  updateClockDisplays() {
    this.p1ClockEl.textContent = this.formatSeconds(this.p1TimeRemaining);
    this.p2ClockEl.textContent = this.formatSeconds(this.p2TimeRemaining);
  }

  formatSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  endGame(reasonText) {
    this.isGameOver = true;
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.btnOpenAnalysis) this.btnOpenAnalysis.hidden = false;

    this.renderPostMatchAnalysis();

    const p1Count = this.boardState.filter((h) => h.owner === 1).length;
    const p2Count = this.boardState.filter((h) => h.owner === 2).length;
    const titleEl = document.getElementById('gameover-title');
    const badgeEl = document.getElementById('gameover-badge');
    const subEl = document.getElementById('gameover-subtitle');

    if (this.gameMode === 'daily') {
      badgeEl.textContent = '🌟';
      titleEl.textContent = `${this.dailyScore} Pontos!`;
      subEl.textContent = `Você dominou ${p1Count} de 31 hexágonos no Desafio Diário.`;
      document.getElementById('go-p1-label').textContent = 'HEXÁGONOS';
      document.getElementById('go-p1-score').textContent = `${p1Count}/31`;
      document.getElementById('go-p1-pct').textContent = `${Math.round((p1Count / 31) * 100)}% do Mapa`;
      document.getElementById('go-p2-label').textContent = 'PONTUAÇÃO';
      document.getElementById('go-p2-score').textContent = this.dailyScore;
      document.getElementById('go-p2-pct').textContent = 'Desafio Diário';
      this.modalGameover.hidden = false;
      return;
    }

    const total = Math.max(1, p1Count + p2Count);
    const p1Pct = Math.round((p1Count / total) * 100);
    const p2Pct = 100 - p1Pct;

    document.getElementById('go-p1-label').textContent = 'AZUL';
    document.getElementById('go-p2-label').textContent = 'VERMELHO';
    document.getElementById('go-p1-score').textContent = p1Count;
    document.getElementById('go-p2-score').textContent = p2Count;
    document.getElementById('go-p1-pct').textContent = `${p1Pct}%`;
    document.getElementById('go-p2-pct').textContent = `${p2Pct}%`;

    if (p1Count > p2Count) {
      titleEl.textContent = 'Vitória Azul!';
      badgeEl.textContent = '🏆';
    } else if (p2Count > p1Count) {
      titleEl.textContent = 'Vitória Vermelha!';
      badgeEl.textContent = '🔥';
    } else {
      titleEl.textContent = 'Empate!';
      badgeEl.textContent = '🤝';
    }

    subEl.textContent = reasonText;
    this.modalGameover.hidden = false;
  }

  /**
   * Gera o Inspetor Tático Pós-Partida:
   * 1. Compara cada jogada realizada com a melhor jogada/combo que o Motor de IA faria naquele turno
   * 2. Inspeciona todos os 31 hexágonos do tabuleiro final e exemplos de jogadores que cumpriam cada um
   */
  renderPostMatchAnalysis() {
    if (!this.postmatchMovesList || !this.postmatchBoardInspector) return;

    if (this.matchMoveHistory.length === 0) {
      this.postmatchMovesList.innerHTML = `<div class="pm-move-card">Nenhuma jogada registrada nesta partida.</div>`;
    } else {
      this.postmatchMovesList.innerHTML = this.matchMoveHistory
        .map((m) => {
          const ownerTag = m.owner === 1 ? '🔵 AZUL' : '🔴 VERMELHO';
          const cardClass = m.owner === 2 ? 'pm-move-card pm-owner-2' : 'pm-move-card';

          const actualDesc = m.valid
            ? `Escalou <strong>${m.playerName}</strong> em <em>${m.targetLabel}</em> → Conquistou <strong>${m.totalCount} hex(es)</strong> (${m.capturedLabels.join(', ')})${
                m.stolenCount > 0 ? ` | ⚔️ Roubou ${m.stolenCount}` : ''
              }`
            : `❌ Tentou <strong>${m.playerName}</strong> em <em>${m.targetLabel}</em> (Não cumpria o requisito)`;

          let optimalDesc = '';
          if (m.bestPossible) {
            const isAlreadyOptimal =
              m.valid && m.totalCount >= m.bestPossible.totalCount && m.stolenCount >= m.bestPossible.stolenCount;
            optimalDesc = isAlreadyOptimal
              ? `<div class="pm-move-optimal">✅ Jogada Ótima! Máximo combo disponível na rodada alcançado.</div>`
              : `<div class="pm-move-optimal">💡 <strong>Melhor Combo IA na rodada:</strong> ${m.bestPossible.playerName} em <em>${m.bestPossible.targetLabel}</em> (${m.bestPossible.totalCount} hexes${
                  m.bestPossible.stolenCount > 0 ? `, roubando ${m.bestPossible.stolenCount}` : ''
                })</div>`;
          }

          return `
            <div class="${cardClass}">
              <div class="pm-move-header">
                <span>Turno #${m.turnNumber}</span>
                <span>${ownerTag}</span>
              </div>
              <div class="pm-move-actual">${actualDesc}</div>
              ${optimalDesc}
            </div>
          `;
        })
        .join('');
    }

    this.postmatchBoardInspector.innerHTML = this.boardState
      .map((hex) => {
        const statusBadge =
          hex.owner === 1
            ? `🔵 Conquistado por ${this.shortenPlayerName(hex.claimedByPlayer || 'Azul')}`
            : hex.owner === 2
            ? `🔴 Conquistado por ${this.shortenPlayerName(hex.claimedByPlayer || 'Vermelho')}`
            : `⚪ Ficou Neutro`;

        const samplePlayers = PLAYERS_DB.filter((p) => hex.category.check(p))
          .slice(0, 6)
          .map((p) => this.shortenPlayerName(p.name))
          .join(', ');

        return `
          <div class="pm-move-card ${hex.owner === 2 ? 'pm-owner-2' : ''}">
            <div class="pm-move-header">
              <span>Hex #${hex.index + 1}: ${hex.category.label}</span>
              <span>${statusBadge}</span>
            </div>
            <div class="pm-move-actual"><strong>Exemplos que cumpriam:</strong> ${samplePlayers}</div>
          </div>
        `;
      })
      .join('');
  }

  normalizeText(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new PossessionGameApp();
});
