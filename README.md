# Possession Play: Brasileirão & América do Sul ⚽🇧🇷

Adaptação brasileira do jogo tático de domínio de território **Possession Play**, focado nos clubes da Série A do Brasileirão, gigantes sul-americanos, títulos continentais/nacionais, regiões/países e marcos históricos — equipado com o motor de Inteligência Artificial **Argon (Minimax + Grafo de Adjacência)** e uma base local com **3.542 jogadores**.

## 🎮 Modos de Jogo

1. **🤖 vs IA**: Enfrente o motor **Argon AI** em 3 níveis de dificuldade (*Fácil*, *Médio* e *Difícil / Minimax 2-Ply*).
2. **👥 Mesma Tela**: Partida local para 2 jogadores alternando turnos sem limite curto por jogada (relógio principal de `4:00` para cada lado).
3. **🌟 Desafio Diário**: Modo solo estratégico em que você tem 10 jogadas para dominar o máximo dos 31 hexágonos multiplicando sua pontuação através de *Hex Chaining* (combos de adjacência).
4. **🌐 Jogar Online**: Gere um código único de sala (ex: `BR-7492`) para sincronizar o mesmo tabuleiro e jogar com amigos.

## 📊 Pós-Jogo: Inspetor Tático & Análise da IA

Ao término de cada partida, o modal de encerramento libera:
- **Análise das Jogadas**: Compara cada lance realizado na partida com o melhor combo possível calculado pela IA naquela rodada.
- **Inspetor do Tabuleiro Final**: Lista todos os 31 hexágonos sorteados e exemplos de atletas compatíveis.

## 🚀 Como Rodar Localmente

Basta abrir o arquivo `index.html` diretamente no navegador ou subir um servidor estático simples:

```bash
python -m http.server 8080
```
E acessar `http://localhost:8080`.

## 🔄 Atualizando a Base de Jogadores (Wikidata SPARQL)

O projeto já inclui a base completa offline em `js/players_wikidata.js` (`3.542` atletas). Caso deseje reexecutar a coleta oficial na Wikidata + Wikipédia em Português:

```bash
python scripts/fetch_brasileirao_wikidata.py
```
