"""
Coletor Oficial de Dados Abertos (Wikidata API + SPARQL) — Possession Play: Brasileirão
1. Resolve automaticamente o QID exato de cada clube pela Wikipedia em Português (100% preciso)
2. Coleta todos os jogadores históricos e atuais de cada clube da Série A + Gigantes Sul-Americanos
3. Cruza convocações para a Seleção Brasileira
4. Grava tudo localmente em js/players_wikidata.js e js/players_wikidata.json para rodar 100% local e offline!
"""

import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)

WIKIDATA_SPARQL = "https://query.wikidata.org/sparql"
WIKIDATA_API = "https://www.wikidata.org/w/api.php"
USER_AGENT = "PossessionPlayBrasileiraoBot/1.2 (Local Football Game Dataset; Python)"

# Título exato na Wikipédia em Português -> Nome padronizado no jogo
PTWIKI_CLUBS = {
    "Clube de Regatas do Flamengo": "Flamengo",
    "Sociedade Esportiva Palmeiras": "Palmeiras",
    "Sport Club Corinthians Paulista": "Corinthians",
    "São Paulo Futebol Clube": "São Paulo",
    "Santos Futebol Clube": "Santos",
    "Club de Regatas Vasco da Gama": "Vasco",
    "Fluminense Football Club": "Fluminense",
    "Botafogo de Futebol e Regatas": "Botafogo",
    "Grêmio Foot-Ball Porto Alegrense": "Grêmio",
    "Sport Club Internacional": "Internacional",
    "Clube Atlético Mineiro": "Atlético-MG",
    "Cruzeiro Esporte Clube": "Cruzeiro",
    "Esporte Clube Bahia": "Bahia",
    "Fortaleza Esporte Clube": "Fortaleza",
    "Club Athletico Paranaense": "Athletico-PR",
    "Esporte Clube Vitória": "Vitória",
    "Red Bull Bragantino": "Bragantino",
    "Coritiba Foot Ball Club": "Coritiba",
    "Ceará Sporting Club": "Ceará",
    "Sport Club do Recife": "Sport",
    "Esporte Clube Juventude": "Juventude",
    "Goiás Esporte Clube": "Goiás",
    # Gigantes Sul-Americanos
    "Club Atlético River Plate": "River Plate",
    "Club Atlético Boca Juniors": "Boca Juniors",
    "Club Atlético Peñarol": "Peñarol",
    "Club Nacional de Football": "Nacional-URU",
    "Racing Club": "Racing",
    "Club Atlético Independiente": "Independiente",
    "Club Atlético San Lorenzo de Almagro": "San Lorenzo",
    "Club Atlético Vélez Sarsfield": "Vélez Sarsfield",
}

BR_CLUBS_SET = {
    "Flamengo", "Palmeiras", "Corinthians", "São Paulo", "Santos",
    "Vasco", "Fluminense", "Botafogo", "Grêmio", "Internacional",
    "Atlético-MG", "Cruzeiro", "Bahia", "Fortaleza", "Athletico-PR",
    "Vitória", "Bragantino", "Coritiba", "Ceará", "Sport", "Juventude", "Goiás"
}

COUNTRY_MAP = {
    "Brasil": "Brasil", "Brazil": "Brasil",
    "Argentina": "Argentina",
    "Uruguai": "Uruguai", "Uruguay": "Uruguai",
    "Colômbia": "Colômbia", "Colombia": "Colômbia",
    "Paraguai": "Paraguai", "Paraguay": "Paraguai",
    "Chile": "Chile",
    "Equador": "Equador", "Ecuador": "Equador",
    "Peru": "Peru",
    "Venezuela": "Venezuela",
    "Bolívia": "Bolívia",
    "Portugal": "Portugal",
    "Espanha": "Espanha",
}


def resolve_ptwiki_qids(titles_dict: dict) -> dict:
    """Resolve títulos da Wikipédia PT para QIDs oficiais da Wikidata em 1 chamada rápida."""
    resolved = {}
    titles_list = list(titles_dict.keys())
    for i in range(0, len(titles_list), 20):
        chunk = titles_list[i : i + 20]
        params = urllib.parse.urlencode({
            "action": "wbgetentities",
            "sites": "ptwiki",
            "titles": "|".join(chunk),
            "props": "sitelinks",
            "format": "json",
        })
        req = urllib.request.Request(f"{WIKIDATA_API}?{params}", headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            for qid, entity in data.get("entities", {}).items():
                if qid.startswith("-"):
                    continue
                pt_title = entity.get("sitelinks", {}).get("ptwiki", {}).get("title")
                if pt_title in titles_dict:
                    resolved[qid] = titles_dict[pt_title]
    return resolved


def run_sparql(query: str) -> list:
    data_bytes = urllib.parse.urlencode({"query": query, "format": "json"}).encode("utf-8")
    req = urllib.request.Request(
        WIKIDATA_SPARQL,
        data=data_bytes,
        headers={
            "Accept": "application/sparql-results+json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            "User-Agent": USER_AGENT,
        },
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                payload = json.loads(resp.read().decode("utf-8"))
                return payload.get("results", {}).get("bindings", [])
        except Exception as exc:
            print(f"  [Tentativa {attempt + 1}] {exc}")
            time.sleep(2)
    return []


def map_position(pos_label: str) -> str:
    p = (pos_label or "").lower()
    if "goleiro" in p or "guarda-redes" in p or "goalkeeper" in p:
        return "GOL"
    if "lateral" in p or "wing-back" in p or "full-back" in p:
        return "LAT"
    if "zagueiro" in p or "defensor" in p or "defesa" in p or "defender" in p:
        return "ZAG"
    if "atacante" in p or "avançado" in p or "ponta" in p or "forward" in p or "striker" in p:
        return "ATA"
    return "MEI"


def fetch_single_club(club_qid: str) -> list:
    query = f"""
    SELECT ?player ?playerLabel ?birthYear ?countryLabel ?posLabel ?sitelinks WHERE {{
      ?player wdt:P54 wd:{club_qid} ;
              wdt:P31 wd:Q5 ;
              wdt:P106 wd:Q937857 ;
              wdt:P569 ?dob ;
              wikibase:sitelinks ?sitelinks .
      FILTER(YEAR(?dob) >= 1966 && ?sitelinks >= 4)
      BIND(YEAR(?dob) AS ?birthYear)
      OPTIONAL {{ ?player wdt:P27 ?country . }}
      OPTIONAL {{ ?player wdt:P413 ?pos . }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "pt,pt-br,es,en". }}
    }}
    """
    return run_sparql(query)


def fetch_selecao_br() -> set:
    selecao_qids = resolve_ptwiki_qids({"Seleção Brasileira de Futebol": "CBF"})
    cbf_qid = next(iter(selecao_qids.keys()), "Q83459")
    query = f"""
    SELECT DISTINCT ?player WHERE {{
      ?player wdt:P54 wd:{cbf_qid} ;
              wdt:P31 wd:Q5 ;
              wdt:P569 ?dob .
      FILTER(YEAR(?dob) >= 1966)
    }}
    """
    rows = run_sparql(query)
    return {r["player"]["value"].rsplit("/", 1)[-1] for r in rows}


def main():
    print("-> Resolvendo QIDs exatos dos 30 clubes via Wikipédia PT...")
    club_qid_map = resolve_ptwiki_qids(PTWIKI_CLUBS)
    print(f"   {len(club_qid_map)} clubes resolvidos com sucesso!")

    players = {}
    for qid, club_name in club_qid_map.items():
        print(f"-> Coletando elenco histórico: {club_name} ({qid})...")
        rows = fetch_single_club(qid)
        print(f"   +{len(rows)} registros.")

        for r in rows:
            pqid = r["player"]["value"].rsplit("/", 1)[-1]
            name = r.get("playerLabel", {}).get("value", "")
            if not name or (name.startswith("Q") and name[1:].isdigit()):
                continue

            byear = int(r["birthYear"]["value"])
            sitelinks = int(r.get("sitelinks", {}).get("value", "4"))
            country_raw = r.get("countryLabel", {}).get("value", "Brasil")
            pos_raw = r.get("posLabel", {}).get("value", "")

            if pqid not in players:
                nat = COUNTRY_MAP.get(country_raw, country_raw)
                players[pqid] = {
                    "qid": pqid,
                    "id": f"wd_{pqid.lower()}",
                    "name": name,
                    "nationality": nat,
                    "region": "Sudeste" if nat == "Brasil" else "Exterior",
                    "birthYear": byear,
                    "position": map_position(pos_raw),
                    "clubs": {club_name},
                    "titles": set(),
                    "tags": set(),
                    "sitelinks": sitelinks,
                }
            else:
                players[pqid]["clubs"].add(club_name)
                if sitelinks > players[pqid]["sitelinks"]:
                    players[pqid]["sitelinks"] = sitelinks

        time.sleep(0.2)

    br_players = {pqid: p for pqid, p in players.items() if p["clubs"] & BR_CLUBS_SET}
    print(f"\nTotal de jogadores únicos da Série A encontrados: {len(br_players)}")

    print("-> Cruzando histórico na Seleção Brasileira...")
    selecao_qids = fetch_selecao_br()
    for pqid in br_players:
        if pqid in selecao_qids:
            br_players[pqid]["tags"].add("Seleção Brasileira")

    sorted_list = sorted(br_players.values(), key=lambda x: x["sitelinks"], reverse=True)[:3500]

    final_output = [
        {
            "id": p["id"],
            "name": p["name"],
            "nationality": p["nationality"],
            "region": p["region"],
            "birthYear": p["birthYear"],
            "position": p["position"],
            "clubs": sorted(p["clubs"]),
            "titles": sorted(p["titles"]),
            "tags": sorted(p["tags"]),
        }
        for p in sorted_list
    ]

    out_dir = Path(__file__).resolve().parent.parent / "js"
    js_path = out_dir / "players_wikidata.js"
    json_path = out_dir / "players_wikidata.json"

    json_path.write_text(json.dumps(final_output, ensure_ascii=False, indent=2), encoding="utf-8")
    js_path.write_text(
        "// Base local expandida gerada automaticamente via Wikidata\n"
        f"window.WIKIDATA_PLAYERS = {json.dumps(final_output, ensure_ascii=False)};\n",
        encoding="utf-8",
    )
    print(f"\nSUCESSO! {len(final_output)} jogadores gravados localmente em {js_path}")


if __name__ == "__main__":
    main()
