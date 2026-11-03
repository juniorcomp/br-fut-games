/**
 * Base de Dados Oficial: Possession Play — Brasileirão & América do Sul
 * - 56 Categorias variadas (Clubes Série A, Gigantes Sul-Americanos, Competições, Países, Regiões, Marcos)
 * - 140+ Jogadores históricos e atuais do Brasileirão
 */

function renderJerseySVG(pattern, c1, c2, c3 = '#ffffff') {
  const uid = `clip_${pattern}_${c1.replace('#', '')}_${c2.replace('#', '')}_${Math.random().toString(36).slice(2, 6)}`;
  let innerPattern = '';

  if (pattern === 'vstripes') {
    innerPattern = `
      <rect x="18" y="8" width="6" height="48" fill="${c2}" />
      <rect x="29" y="8" width="6" height="48" fill="${c2}" />
      <rect x="40" y="8" width="6" height="48" fill="${c2}" />
    `;
  } else if (pattern === 'hstripes') {
    innerPattern = `
      <rect x="6" y="16" width="52" height="7" fill="${c2}" />
      <rect x="6" y="30" width="52" height="7" fill="${c2}" />
      <rect x="6" y="44" width="52" height="7" fill="${c2}" />
    `;
  } else if (pattern === 'sash') {
    innerPattern = `<polygon points="14,10 24,10 50,54 40,54" fill="${c2}" />`;
  } else if (pattern === 'chestband') {
    innerPattern = `
      <rect x="10" y="23" width="44" height="6" fill="${c2}" />
      <rect x="10" y="29" width="44" height="6" fill="${c3}" />
    `;
  } else if (pattern === 'tricolor_v') {
    innerPattern = `
      <rect x="17" y="8" width="8" height="48" fill="${c2}" />
      <rect x="25" y="8" width="4" height="48" fill="${c3}" />
      <rect x="29" y="8" width="6" height="48" fill="${c1}" />
      <rect x="35" y="8" width="4" height="48" fill="${c3}" />
      <rect x="39" y="8" width="8" height="48" fill="${c2}" />
    `;
  } else if (pattern === 'halves') {
    innerPattern = `<rect x="32" y="8" width="28" height="48" fill="${c2}" />`;
  } else if (pattern === 'sleeves') {
    innerPattern = `
      <rect x="0" y="8" width="16" height="24" fill="${c2}" />
      <rect x="48" y="8" width="16" height="24" fill="${c2}" />
    `;
  }

  const shirtPath = `M20,10 L26,14 L38,14 L44,10 L58,18 L52,29 L45,25 L45,54 L19,54 L19,25 L12,29 L6,18 Z`;

  return `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="${uid}">
          <path d="${shirtPath}" />
        </clipPath>
      </defs>
      <g clip-path="url(#${uid})">
        <rect x="0" y="0" width="64" height="64" fill="${c1}" />
        ${innerPattern}
      </g>
      <path d="${shirtPath}" fill="none" stroke="#1e1b2e" stroke-width="2.6" stroke-linejoin="round" />
      <path d="M25,11 Q32,18 39,11" fill="none" stroke="${c3}" stroke-width="2.2" />
    </svg>
  `;
}

function renderTrophySVG(colorPrimary, colorAccent = '#ffd600', style = 'cup') {
  if (style === 'plate') {
    return `
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="22" fill="${colorPrimary}" stroke="#1e1b2e" stroke-width="2.5"/>
        <circle cx="32" cy="32" r="15" fill="none" stroke="${colorAccent}" stroke-width="2" stroke-dasharray="4 2"/>
        <polygon points="32,20 35,28 43,28 37,33 39,41 32,36 25,41 27,33 21,28 29,28" fill="${colorAccent}"/>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,14 H44 V26 C44,35 38,41 32,42 C26,41 20,35 20,26 Z" fill="${colorPrimary}" stroke="#1e1b2e" stroke-width="2.4"/>
      <path d="M20,18 H13 C13,26 16,30 21,31" fill="none" stroke="${colorPrimary}" stroke-width="3" stroke-linecap="round"/>
      <path d="M44,18 H51 C51,26 48,30 43,31" fill="none" stroke="${colorPrimary}" stroke-width="3" stroke-linecap="round"/>
      <rect x="28" y="42" width="8" height="8" fill="${colorAccent}" stroke="#1e1b2e" stroke-width="2"/>
      <rect x="21" y="50" width="22" height="6" rx="2" fill="#2d2a3e" stroke="#1e1b2e" stroke-width="2"/>
      <circle cx="32" cy="25" r="4" fill="${colorAccent}"/>
    </svg>
  `;
}

function renderFlagSVG(code, c1, c2, c3 = '#ffffff') {
  return `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" fill="${c1}" stroke="#1e1b2e" stroke-width="2.5"/>
      <path d="M12,24 H52 V40 H12 Z" fill="${c2}" />
      <circle cx="32" cy="32" r="7" fill="${c3}"/>
      <circle cx="32" cy="32" r="22" fill="none" stroke="#1e1b2e" stroke-width="2.5"/>
    </svg>
  `;
}

function renderMilestoneSVG(symbol, bg = '#6366f1', fg = '#ffffff') {
  return `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <polygon points="32,8 54,20 54,44 32,56 10,44 10,20" fill="${bg}" stroke="#1e1b2e" stroke-width="2.5"/>
      <text x="32" y="37" text-anchor="middle" fill="${fg}" font-family="Chakra Petch, sans-serif" font-weight="800" font-size="14">${symbol}</text>
    </svg>
  `;
}

const CATEGORIES_POOL = [
  // === CLUBES BRASILEIRÃO SÉRIE A ===
  {
    id: 'club_flamengo',
    label: 'FLAMENGO',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('hstripes', '#d32f2f', '#111111', '#ffffff'),
    check: (p) => p.clubs.includes('Flamengo')
  },
  {
    id: 'club_palmeiras',
    label: 'PALMEIRAS',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('solid', '#006437', '#ffffff', '#ffffff'),
    check: (p) => p.clubs.includes('Palmeiras')
  },
  {
    id: 'club_corinthians',
    label: 'CORINTHIANS',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('sleeves', '#ffffff', '#111111', '#111111'),
    check: (p) => p.clubs.includes('Corinthians')
  },
  {
    id: 'club_saopaulo',
    label: 'SÃO PAULO',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('chestband', '#ffffff', '#d32f2f', '#111111'),
    check: (p) => p.clubs.includes('São Paulo')
  },
  {
    id: 'club_santos',
    label: 'SANTOS',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('vstripes', '#ffffff', '#111111', '#ffd600'),
    check: (p) => p.clubs.includes('Santos')
  },
  {
    id: 'club_vasco',
    label: 'VASCO',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('sash', '#111111', '#ffffff', '#d32f2f'),
    check: (p) => p.clubs.includes('Vasco')
  },
  {
    id: 'club_fluminense',
    label: 'FLUMINENSE',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('tricolor_v', '#7b1fa2', '#00695c', '#ffffff'),
    check: (p) => p.clubs.includes('Fluminense')
  },
  {
    id: 'club_botafogo',
    label: 'BOTAFOGO',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('vstripes', '#111111', '#ffffff', '#ffffff'),
    check: (p) => p.clubs.includes('Botafogo')
  },
  {
    id: 'club_gremio',
    label: 'GRÊMIO',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('tricolor_v', '#0288d1', '#111111', '#ffffff'),
    check: (p) => p.clubs.includes('Grêmio')
  },
  {
    id: 'club_internacional',
    label: 'INTER-RS',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('solid', '#c62828', '#ffffff', '#ffffff'),
    check: (p) => p.clubs.includes('Internacional')
  },
  {
    id: 'club_atleticomg',
    label: 'ATLÉTICO-MG',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('vstripes', '#ffffff', '#111111', '#ffd600'),
    check: (p) => p.clubs.includes('Atlético-MG')
  },
  {
    id: 'club_cruzeiro',
    label: 'CRUZEIRO',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('solid', '#1565c0', '#ffffff', '#ffffff'),
    check: (p) => p.clubs.includes('Cruzeiro')
  },
  {
    id: 'club_bahia',
    label: 'BAHIA',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('tricolor_v', '#1565c0', '#d32f2f', '#ffffff'),
    check: (p) => p.clubs.includes('Bahia')
  },
  {
    id: 'club_fortaleza',
    label: 'FORTALEZA',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('hstripes', '#1565c0', '#d32f2f', '#ffffff'),
    check: (p) => p.clubs.includes('Fortaleza')
  },
  {
    id: 'club_athleticopr',
    label: 'ATHLETICO-PR',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('sash', '#c62828', '#111111', '#ffffff'),
    check: (p) => p.clubs.includes('Athletico-PR')
  },
  {
    id: 'club_vitoria',
    label: 'VITÓRIA',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('hstripes', '#b71c1c', '#111111', '#ffffff'),
    check: (p) => p.clubs.includes('Vitória')
  },
  {
    id: 'club_bragantino',
    label: 'BRAGANTINO',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('chestband', '#ffffff', '#d32f2f', '#d32f2f'),
    check: (p) => p.clubs.includes('Bragantino')
  },
  {
    id: 'club_coritiba',
    label: 'CORITIBA',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('chestband', '#ffffff', '#1b5e20', '#1b5e20'),
    check: (p) => p.clubs.includes('Coritiba')
  },
  {
    id: 'club_ceara_sport',
    label: 'CEARÁ / SPORT',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('vstripes', '#111111', '#d32f2f', '#ffffff'),
    check: (p) => p.clubs.includes('Ceará') || p.clubs.includes('Sport')
  },
  {
    id: 'club_goias_juv',
    label: 'JUVENTUDE / GOIÁS',
    group: 'Clube Brasileirão',
    svg: renderJerseySVG('vstripes', '#2e7d32', '#ffffff', '#2e7d32'),
    check: (p) => p.clubs.includes('Juventude') || p.clubs.includes('Goiás')
  },

  // === GIGANTES SUL-AMERICANOS & CONMEBOL ===
  {
    id: 'club_river',
    label: 'RIVER PLATE',
    group: 'Gigante Sul-Americano',
    svg: renderJerseySVG('sash', '#ffffff', '#d32f2f', '#111111'),
    check: (p) => p.clubs.includes('River Plate')
  },
  {
    id: 'club_boca',
    label: 'BOCA JUNIORS',
    group: 'Gigante Sul-Americano',
    svg: renderJerseySVG('chestband', '#0d47a1', '#ffd600', '#ffd600'),
    check: (p) => p.clubs.includes('Boca Juniors')
  },
  {
    id: 'club_penarol_nac',
    label: 'PEÑAROL / NACIONAL',
    group: 'Gigante Sul-Americano',
    svg: renderJerseySVG('vstripes', '#ffd600', '#111111', '#1565c0'),
    check: (p) => p.clubs.includes('Peñarol') || p.clubs.includes('Nacional-URU')
  },
  {
    id: 'club_indep_racing',
    label: 'RACING / INDEP.',
    group: 'Gigante Sul-Americano',
    svg: renderJerseySVG('vstripes', '#29b6f6', '#ffffff', '#d32f2f'),
    check: (p) =>
      p.clubs.includes('Racing') ||
      p.clubs.includes('Independiente') ||
      p.clubs.includes('San Lorenzo') ||
      p.clubs.includes('Vélez Sarsfield')
  },
  {
    id: 'club_lanus_talleres',
    label: 'LANÚS / VÉLEZ',
    group: 'Gigante Sul-Americano',
    svg: renderJerseySVG('solid', '#6a1b9a', '#ffffff', '#ffffff'),
    check: (p) =>
      p.clubs.includes('Lanús') ||
      p.clubs.includes('Vélez Sarsfield') ||
      p.clubs.includes('Talleres')
  },

  // === COMPETIÇÕES, TÍTULOS E RIVALIDADES ESTADUAIS ===
  {
    id: 'title_brasileirao',
    label: 'CAMPEÃO BRASILEIRO',
    group: 'Título / Competição',
    svg: renderTrophySVG('#ffd600', '#00e676', 'cup'),
    check: (p) => p.titles.includes('Brasileirão')
  },
  {
    id: 'title_copadobrasil',
    label: 'COPA DO BRASIL',
    group: 'Título / Competição',
    svg: renderTrophySVG('#00b0ff', '#ffd600', 'cup'),
    check: (p) => p.titles.includes('Copa do Brasil')
  },
  {
    id: 'title_libertadores',
    label: 'LIBERTADORES',
    group: 'Título / Competição',
    svg: renderTrophySVG('#cfd8dc', '#ffd600', 'cup'),
    check: (p) => p.titles.includes('Libertadores')
  },
  {
    id: 'title_sulamericana',
    label: 'SUL-AMERICANA / RECOPA',
    group: 'Título / Competição',
    svg: renderTrophySVG('#ffab00', '#e0e0e0', 'plate'),
    check: (p) => p.titles.includes('Sul-Americana') || p.titles.includes('Recopa')
  },
  {
    id: 'title_copaamerica',
    label: 'COPA AMÉRICA',
    group: 'Título / Competição',
    svg: renderTrophySVG('#ffd54f', '#ffffff', 'cup'),
    check: (p) => p.titles.includes('Copa América')
  },
  {
    id: 'title_mundial',
    label: 'MUNDIAL / COPA DO MUNDO',
    group: 'Título / Competição',
    svg: renderTrophySVG('#ffca28', '#00e676', 'cup'),
    check: (p) => p.titles.includes('Copa do Mundo') || p.titles.includes('Mundial de Clubes')
  },
  {
    id: 'title_dobradinha_br_lib',
    label: 'BRASILEIRÃO + LIBERTA',
    group: 'Título / Competição',
    svg: renderTrophySVG('#00e676', '#ffd600', 'cup'),
    check: (p) => p.titles.includes('Brasileirão') && p.titles.includes('Libertadores')
  },
  {
    id: 'title_sp_e_rj',
    label: 'JOGOU EM SP E NO RJ',
    group: 'Título / Competição',
    svg: renderTrophySVG('#ab47bc', '#ffd600', 'plate'),
    check: (p) => {
      const sp = ['Corinthians', 'Palmeiras', 'São Paulo', 'Santos', 'Bragantino'];
      const rj = ['Flamengo', 'Fluminense', 'Vasco', 'Botafogo'];
      return p.clubs.some((c) => sp.includes(c)) && p.clubs.some((c) => rj.includes(c));
    }
  },
  {
    id: 'title_mg_e_rs',
    label: 'JOGOU EM MG OU RS',
    group: 'Título / Competição',
    svg: renderTrophySVG('#26a69a', '#ffd600', 'plate'),
    check: (p) => {
      const mgrs = ['Atlético-MG', 'Cruzeiro', 'Grêmio', 'Internacional', 'Juventude'];
      return p.clubs.some((c) => mgrs.includes(c));
    }
  },
  {
    id: 'title_rivais_sp',
    label: '2+ GIGANTES DE SP',
    group: 'Título / Competição',
    svg: renderTrophySVG('#ef5350', '#ffffff', 'plate'),
    check: (p) => {
      const sp = ['Corinthians', 'Palmeiras', 'São Paulo', 'Santos'];
      return p.clubs.filter((c) => sp.includes(c)).length >= 2;
    }
  },
  {
    id: 'title_rivais_rj',
    label: '2+ GIGANTES DO RJ',
    group: 'Título / Competição',
    svg: renderTrophySVG('#42a5f5', '#ffffff', 'plate'),
    check: (p) => {
      const rj = ['Flamengo', 'Fluminense', 'Vasco', 'Botafogo'];
      return p.clubs.filter((c) => rj.includes(c)).length >= 2;
    }
  },

  // === PAÍSES E REGIÕES ===
  {
    id: 'nat_argentina',
    label: 'ARGENTINA',
    group: 'País / Região',
    svg: renderFlagSVG('ARG', '#4fc3f7', '#ffffff', '#ffd600'),
    check: (p) => p.nationality === 'Argentina'
  },
  {
    id: 'nat_uruguai',
    label: 'URUGUAI',
    group: 'País / Região',
    svg: renderFlagSVG('URU', '#1e88e5', '#ffffff', '#ffd600'),
    check: (p) => p.nationality === 'Uruguai'
  },
  {
    id: 'nat_col_par_chi',
    label: 'COL / PAR / EQU / VEN',
    group: 'País / Região',
    svg: renderFlagSVG('CON', '#fdd835', '#1e88e5', '#e53935'),
    check: (p) =>
      ['Colômbia', 'Paraguai', 'Chile', 'Equador', 'Peru', 'Venezuela'].includes(p.nationality)
  },
  {
    id: 'nat_gringo',
    label: 'ESTRANGEIRO NO BR',
    group: 'País / Região',
    svg: renderFlagSVG('INT', '#5c6bc0', '#ffffff', '#ffca28'),
    check: (p) => p.nationality !== 'Brasil'
  },
  {
    id: 'reg_nordeste',
    label: 'NASCIDO NO NORDESTE',
    group: 'País / Região',
    svg: renderFlagSVG('NE', '#ff8f00', '#2e7d32', '#ffffff'),
    check: (p) => p.region === 'Nordeste'
  },
  {
    id: 'reg_sul',
    label: 'NASCIDO NO SUL',
    group: 'País / Região',
    svg: renderFlagSVG('SUL', '#2e7d32', '#d32f2f', '#ffd600'),
    check: (p) => p.region === 'Sul'
  },
  {
    id: 'reg_sudeste',
    label: 'NASCIDO NO SUDESTE',
    group: 'País / Região',
    svg: renderFlagSVG('SE', '#1565c0', '#ffffff', '#d32f2f'),
    check: (p) => p.region === 'Sudeste'
  },
  {
    id: 'reg_norte_co',
    label: 'NORTE / CENTRO-OESTE',
    group: 'País / Região',
    svg: renderFlagSVG('NCO', '#00897b', '#fdd835', '#ffffff'),
    check: (p) => p.region === 'Norte' || p.region === 'Centro-Oeste'
  },

  // === MARCOS, POSIÇÕES E DÉCADAS ===
  {
    id: 'mile_selecao_br',
    label: 'SELEÇÃO BRASILEIRA',
    group: 'Marco Histórico',
    svg: renderMilestoneSVG('CBF', '#009c3b', '#ffdf00'),
    check: (p) => p.tags.includes('Seleção Brasileira')
  },
  {
    id: 'mile_artilheiro_craque',
    label: 'ARTILHEIRO / BOLA DE OURO',
    group: 'Marco Histórico',
    svg: renderMilestoneSVG('CRAQUE', '#f59e0b', '#111111'),
    check: (p) => p.tags.includes('Artilheiro/Craque')
  },
  {
    id: 'mile_born_80s',
    label: 'NASCIDO ANOS 70/80',
    group: 'Marco Histórico',
    svg: renderMilestoneSVG('80s', '#7c3aed', '#ffffff'),
    check: (p) => p.birthYear <= 1989
  },
  {
    id: 'mile_born_90s',
    label: 'NASCIDO ANOS 90',
    group: 'Marco Histórico',
    svg: renderMilestoneSVG('90s', '#0284c7', '#ffffff'),
    check: (p) => p.birthYear >= 1990 && p.birthYear <= 1999
  },
  {
    id: 'mile_born_00s',
    label: 'GERAÇÃO 2000+',
    group: 'Marco Histórico',
    svg: renderMilestoneSVG('2000+', '#10b981', '#111111'),
    check: (p) => p.birthYear >= 2000
  },
  {
    id: 'mile_atacante',
    label: 'ATACANTE / ARTILHEIRO',
    group: 'Marco Histórico',
    svg: renderMilestoneSVG('ATA', '#e53935', '#ffffff'),
    check: (p) => p.position === 'ATA'
  },
  {
    id: 'mile_meia',
    label: 'MEIA / CAMISA 10',
    group: 'Marco Histórico',
    svg: renderMilestoneSVG('MEI', '#1e88e5', '#ffffff'),
    check: (p) => p.position === 'MEI'
  },
  {
    id: 'mile_defensor_goleiro',
    label: 'GOLEIRO / DEFENSOR',
    group: 'Marco Histórico',
    svg: renderMilestoneSVG('DEF', '#43a047', '#ffffff'),
    check: (p) => ['GOL', 'ZAG', 'LAT'].includes(p.position)
  },
  {
    id: 'mile_andarilho',
    label: '3+ CLUBES NO BRASIL',
    group: 'Marco Histórico',
    svg: renderMilestoneSVG('3+ BR', '#fb8c00', '#111111'),
    check: (p) => {
      const brClubs = [
        'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Santos',
        'Vasco', 'Fluminense', 'Botafogo', 'Grêmio', 'Internacional',
        'Atlético-MG', 'Cruzeiro', 'Bahia', 'Fortaleza', 'Athletico-PR',
        'Vitória', 'Bragantino', 'Coritiba', 'Ceará', 'Sport', 'Juventude', 'Goiás'
      ];
      return p.clubs.filter((c) => brClubs.includes(c)).length >= 3;
    }
  }
];

const PLAYERS_DB = [
  {
    id: 'gabigol',
    name: 'Gabigol (Gabriel Barbosa)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1996,
    position: 'ATA',
    clubs: ['Santos', 'Flamengo', 'Cruzeiro', 'Benfica', 'Inter de Milão'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'hulk',
    name: 'Hulk',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1986,
    position: 'ATA',
    clubs: ['Vitória', 'Atlético-MG', 'Porto', 'Zenit'],
    titles: ['Brasileirão', 'Copa do Brasil'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'arrascaeta',
    name: 'Giorgian De Arrascaeta',
    nationality: 'Uruguai',
    region: 'Exterior',
    birthYear: 1994,
    position: 'MEI',
    clubs: ['Cruzeiro', 'Flamengo', 'Defensor'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'everton_ribeiro',
    name: 'Éverton Ribeiro',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1989,
    position: 'MEI',
    clubs: ['Corinthians', 'Coritiba', 'Cruzeiro', 'Flamengo', 'Bahia'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'raphael_veiga',
    name: 'Raphael Veiga',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1995,
    position: 'MEI',
    clubs: ['Coritiba', 'Athletico-PR', 'Palmeiras'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Sul-Americana', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'dudu',
    name: 'Dudu',
    nationality: 'Brasil',
    region: 'Centro-Oeste',
    birthYear: 1992,
    position: 'ATA',
    clubs: ['Cruzeiro', 'Coritiba', 'Grêmio', 'Palmeiras'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'weverton',
    name: 'Weverton',
    nationality: 'Brasil',
    region: 'Norte',
    birthYear: 1987,
    position: 'GOL',
    clubs: ['Corinthians', 'Botafogo', 'Athletico-PR', 'Palmeiras'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'cassio',
    name: 'Cássio',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1987,
    position: 'GOL',
    clubs: ['Grêmio', 'Corinthians', 'Cruzeiro', 'PSV'],
    titles: ['Brasileirão', 'Libertadores', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'fagner',
    name: 'Fagner',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1989,
    position: 'LAT',
    clubs: ['Corinthians', 'Vitória', 'Vasco', 'Cruzeiro', 'PSV'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Copa América'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'renato_augusto',
    name: 'Renato Augusto',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1988,
    position: 'MEI',
    clubs: ['Flamengo', 'Corinthians', 'Fluminense'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'paulinho',
    name: 'Paulinho (Volante)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1988,
    position: 'MEI',
    clubs: ['Bragantino', 'Corinthians', 'Barcelona'],
    titles: ['Brasileirão', 'Libertadores', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'paulinho_galo',
    name: 'Paulinho (Atacante)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 2000,
    position: 'ATA',
    clubs: ['Vasco', 'Atlético-MG', 'Palmeiras'],
    titles: [],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'pedro',
    name: 'Pedro Guilherme',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1997,
    position: 'ATA',
    clubs: ['Fluminense', 'Flamengo'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'bruno_henrique',
    name: 'Bruno Henrique',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1990,
    position: 'ATA',
    clubs: ['Goiás', 'Cruzeiro', 'Santos', 'Flamengo'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'gerson',
    name: 'Gerson (Coringa)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1997,
    position: 'MEI',
    clubs: ['Fluminense', 'Flamengo', 'Roma', 'Olympique de Marseille'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'filipe_luis',
    name: 'Filipe Luís',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1985,
    position: 'LAT',
    clubs: ['Figueirense', 'Flamengo', 'Atlético de Madrid', 'Chelsea'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa', 'Copa América'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'diego_ribas',
    name: 'Diego Ribas',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1985,
    position: 'MEI',
    clubs: ['Santos', 'Flamengo', 'Porto', 'Juventus', 'Atlético de Madrid'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'diego_souza',
    name: 'Diego Souza',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1985,
    position: 'ATA',
    clubs: ['Fluminense', 'Flamengo', 'Grêmio', 'Palmeiras', 'Atlético-MG', 'Vasco', 'Cruzeiro', 'São Paulo', 'Botafogo', 'Sport'],
    titles: ['Brasileirão', 'Copa do Brasil'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'willian_bigode',
    name: 'Willian Bigode',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1986,
    position: 'ATA',
    clubs: ['Corinthians', 'Cruzeiro', 'Palmeiras', 'Fluminense', 'Athletico-PR', 'Santos'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores'],
    tags: []
  },
  {
    id: 'scarpa',
    name: 'Gustavo Scarpa',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1994,
    position: 'MEI',
    clubs: ['Fluminense', 'Palmeiras', 'Atlético-MG'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'rony',
    name: 'Rony (Rústico)',
    nationality: 'Brasil',
    region: 'Norte',
    birthYear: 1995,
    position: 'ATA',
    clubs: ['Cruzeiro', 'Athletico-PR', 'Palmeiras', 'Atlético-MG'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Sul-Americana', 'Recopa'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'gustavo_gomez',
    name: 'Gustavo Gómez',
    nationality: 'Paraguai',
    region: 'Exterior',
    birthYear: 1993,
    position: 'ZAG',
    clubs: ['Lanús', 'Milan', 'Palmeiras'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'endrick',
    name: 'Endrick',
    nationality: 'Brasil',
    region: 'Centro-Oeste',
    birthYear: 2006,
    position: 'ATA',
    clubs: ['Palmeiras', 'Real Madrid'],
    titles: ['Brasileirão'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'estevao',
    name: 'Estêvão Willian',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 2007,
    position: 'ATA',
    clubs: ['Palmeiras', 'Chelsea'],
    titles: ['Brasileirão'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'neymar',
    name: 'Neymar Jr.',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1992,
    position: 'ATA',
    clubs: ['Santos', 'Barcelona', 'PSG'],
    titles: ['Copa do Brasil', 'Libertadores', 'Recopa', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'ganso',
    name: 'Paulo Henrique Ganso',
    nationality: 'Brasil',
    region: 'Norte',
    birthYear: 1989,
    position: 'MEI',
    clubs: ['Santos', 'São Paulo', 'Fluminense', 'Sevilla'],
    titles: ['Copa do Brasil', 'Libertadores', 'Sul-Americana', 'Recopa'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'cano',
    name: 'Germán Cano',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1988,
    position: 'ATA',
    clubs: ['Lanús', 'Vasco', 'Fluminense'],
    titles: ['Libertadores', 'Recopa'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'jhon_arias',
    name: 'Jhon Arias',
    nationality: 'Colômbia',
    region: 'Exterior',
    birthYear: 1997,
    position: 'MEI',
    clubs: ['Fluminense', 'Santa Fe'],
    titles: ['Libertadores', 'Recopa'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'marcelo',
    name: 'Marcelo (Lateral)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1988,
    position: 'LAT',
    clubs: ['Fluminense', 'Real Madrid'],
    titles: ['Libertadores', 'Recopa', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'thiago_silva',
    name: 'Thiago Silva',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1984,
    position: 'ZAG',
    clubs: ['Juventude', 'Fluminense', 'Milan', 'PSG', 'Chelsea'],
    titles: ['Copa do Brasil', 'Copa América', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'fred',
    name: 'Fred (Centroavante)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1983,
    position: 'ATA',
    clubs: ['Cruzeiro', 'Fluminense', 'Atlético-MG', 'Lyon'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'fabio',
    name: 'Fábio (Goleiro)',
    nationality: 'Brasil',
    region: 'Centro-Oeste',
    birthYear: 1980,
    position: 'GOL',
    clubs: ['Athletico-PR', 'Vasco', 'Cruzeiro', 'Fluminense'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa', 'Copa América'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'felipe_melo',
    name: 'Felipe Melo',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1983,
    position: 'ZAG',
    clubs: ['Flamengo', 'Cruzeiro', 'Grêmio', 'Palmeiras', 'Fluminense', 'Juventus', 'Inter de Milão', 'Galatasaray'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'keno',
    name: 'Keno',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1989,
    position: 'ATA',
    clubs: ['Santa Cruz', 'Palmeiras', 'Atlético-MG', 'Fluminense'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: []
  },
  {
    id: 'lima_flu',
    name: 'Lima (Meia)',
    nationality: 'Brasil',
    region: 'Norte',
    birthYear: 1996,
    position: 'MEI',
    clubs: ['Grêmio', 'Ceará', 'Fluminense'],
    titles: ['Libertadores', 'Recopa'],
    tags: []
  },
  {
    id: 'luiz_henrique',
    name: 'Luiz Henrique',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 2001,
    position: 'ATA',
    clubs: ['Fluminense', 'Botafogo', 'Real Betis'],
    titles: ['Brasileirão', 'Libertadores'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'igor_jesus',
    name: 'Igor Jesus',
    nationality: 'Brasil',
    region: 'Centro-Oeste',
    birthYear: 2001,
    position: 'ATA',
    clubs: ['Coritiba', 'Botafogo'],
    titles: ['Brasileirão', 'Libertadores'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'thiago_almada',
    name: 'Thiago Almada',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 2001,
    position: 'MEI',
    clubs: ['Vélez Sarsfield', 'Botafogo'],
    titles: ['Brasileirão', 'Libertadores', 'Copa do Mundo'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'savarino',
    name: 'Jefferson Savarino',
    nationality: 'Venezuela',
    region: 'Exterior',
    birthYear: 1996,
    position: 'ATA',
    clubs: ['Atlético-MG', 'Botafogo'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores'],
    tags: []
  },
  {
    id: 'alex_telles',
    name: 'Alex Telles',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1992,
    position: 'LAT',
    clubs: ['Juventude', 'Grêmio', 'Botafogo', 'Porto', 'Manchester United'],
    titles: ['Brasileirão', 'Libertadores'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'tiquinho_soares',
    name: 'Tiquinho Soares',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1991,
    position: 'ATA',
    clubs: ['Botafogo', 'Santos', 'Porto'],
    titles: ['Brasileirão', 'Libertadores'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'marlon_freitas',
    name: 'Marlon Freitas',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1995,
    position: 'MEI',
    clubs: ['Fluminense', 'Botafogo'],
    titles: ['Brasileirão', 'Libertadores'],
    tags: []
  },
  {
    id: 'junior_santos',
    name: 'Júnior Santos',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1994,
    position: 'ATA',
    clubs: ['Fortaleza', 'Botafogo', 'Atlético-MG'],
    titles: ['Brasileirão', 'Libertadores'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'calleri',
    name: 'Jonathan Calleri',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1993,
    position: 'ATA',
    clubs: ['Boca Juniors', 'São Paulo'],
    titles: ['Copa do Brasil'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'luciano',
    name: 'Luciano',
    nationality: 'Brasil',
    region: 'Centro-Oeste',
    birthYear: 1993,
    position: 'ATA',
    clubs: ['Corinthians', 'Fluminense', 'Grêmio', 'São Paulo'],
    titles: ['Brasileirão', 'Copa do Brasil'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'lucas_moura',
    name: 'Lucas Moura',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1992,
    position: 'MEI',
    clubs: ['São Paulo', 'PSG', 'Tottenham'],
    titles: ['Copa do Brasil', 'Sul-Americana'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'rogerio_ceni',
    name: 'Rogério Ceni',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1973,
    position: 'GOL',
    clubs: ['São Paulo'],
    titles: ['Brasileirão', 'Libertadores', 'Sul-Americana', 'Recopa', 'Copa do Mundo', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'kaka',
    name: 'Kaká',
    nationality: 'Brasil',
    region: 'Centro-Oeste',
    birthYear: 1982,
    position: 'MEI',
    clubs: ['São Paulo', 'Milan', 'Real Madrid'],
    titles: ['Copa do Mundo', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'luis_fabiano',
    name: 'Luís Fabiano',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1980,
    position: 'ATA',
    clubs: ['Ponte Preta', 'São Paulo', 'Vasco', 'Sevilla', 'Porto'],
    titles: ['Sul-Americana', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'hernanes',
    name: 'Hernanes (Profeta)',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1985,
    position: 'MEI',
    clubs: ['São Paulo', 'Sport', 'Lazio', 'Inter de Milão', 'Juventus'],
    titles: ['Brasileirão'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'miranda',
    name: 'Miranda',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1984,
    position: 'ZAG',
    clubs: ['Coritiba', 'São Paulo', 'Atlético de Madrid', 'Inter de Milão'],
    titles: ['Brasileirão', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'alisson_sp',
    name: 'Alisson (Meia/Volante)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1993,
    position: 'MEI',
    clubs: ['Cruzeiro', 'Vasco', 'Grêmio', 'São Paulo'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Recopa'],
    tags: []
  },
  {
    id: 'rafinha',
    name: 'Rafinha (Lateral)',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1985,
    position: 'LAT',
    clubs: ['Coritiba', 'Flamengo', 'Grêmio', 'São Paulo', 'Bayern de Munique'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'ronaldinho',
    name: 'Ronaldinho Gaúcho',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1980,
    position: 'MEI',
    clubs: ['Grêmio', 'Flamengo', 'Atlético-MG', 'Fluminense', 'Barcelona', 'Milan', 'PSG'],
    titles: ['Libertadores', 'Recopa', 'Copa América', 'Copa do Mundo'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'adriano',
    name: 'Adriano Imperador',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1982,
    position: 'ATA',
    clubs: ['Flamengo', 'São Paulo', 'Corinthians', 'Athletico-PR', 'Inter de Milão', 'Roma'],
    titles: ['Brasileirão', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'romario',
    name: 'Romário',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1966,
    position: 'ATA',
    clubs: ['Vasco', 'Flamengo', 'Fluminense', 'PSV', 'Barcelona'],
    titles: ['Brasileirão', 'Copa América', 'Copa do Mundo'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'ronaldo',
    name: 'Ronaldo Fenômeno',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1976,
    position: 'ATA',
    clubs: ['Cruzeiro', 'Corinthians', 'PSV', 'Barcelona', 'Inter de Milão', 'Real Madrid', 'Milan'],
    titles: ['Copa do Brasil', 'Copa América', 'Copa do Mundo', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'roberto_carlos',
    name: 'Roberto Carlos',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1973,
    position: 'LAT',
    clubs: ['Palmeiras', 'Corinthians', 'Inter de Milão', 'Real Madrid'],
    titles: ['Brasileirão', 'Copa América', 'Copa do Mundo', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'rivaldo',
    name: 'Rivaldo',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1972,
    position: 'MEI',
    clubs: ['Corinthians', 'Palmeiras', 'Cruzeiro', 'São Paulo', 'Barcelona', 'Milan'],
    titles: ['Brasileirão', 'Copa América', 'Copa do Mundo'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'edmundo',
    name: 'Edmundo (Animal)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1971,
    position: 'ATA',
    clubs: ['Vasco', 'Palmeiras', 'Flamengo', 'Corinthians', 'Santos', 'Cruzeiro', 'Fluminense'],
    titles: ['Brasileirão', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'alex_10',
    name: 'Alex (Camisa 10)',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1977,
    position: 'MEI',
    clubs: ['Coritiba', 'Palmeiras', 'Flamengo', 'Cruzeiro', 'Fenerbahçe'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'juninho_pernambucano',
    name: 'Juninho Pernambucano',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1975,
    position: 'MEI',
    clubs: ['Sport', 'Vasco', 'Lyon'],
    titles: ['Brasileirão', 'Libertadores'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'ze_roberto',
    name: 'Zé Roberto',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1974,
    position: 'MEI',
    clubs: ['Portuguesa', 'Flamengo', 'Santos', 'Grêmio', 'Palmeiras', 'Real Madrid', 'Bayern de Munique'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'robinho',
    name: 'Robinho',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1984,
    position: 'ATA',
    clubs: ['Santos', 'Atlético-MG', 'Real Madrid', 'Manchester City', 'Milan'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'vagner_love',
    name: 'Vágner Love',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1984,
    position: 'ATA',
    clubs: ['Palmeiras', 'Flamengo', 'Corinthians', 'Sport', 'CSKA Moscou'],
    titles: ['Brasileirão', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'ricardo_oliveira',
    name: 'Ricardo Oliveira',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1980,
    position: 'ATA',
    clubs: ['Portuguesa', 'Santos', 'São Paulo', 'Atlético-MG', 'Coritiba', 'Milan'],
    titles: ['Brasileirão', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'diego_tardelli',
    name: 'Diego Tardelli',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1985,
    position: 'ATA',
    clubs: ['São Paulo', 'Flamengo', 'Atlético-MG', 'Grêmio', 'Santos'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'jo',
    name: 'Jô (Centroavante)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1987,
    position: 'ATA',
    clubs: ['Corinthians', 'Internacional', 'Atlético-MG', 'Ceará'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'emerson_sheik',
    name: 'Emerson Sheik',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1978,
    position: 'ATA',
    clubs: ['São Paulo', 'Flamengo', 'Fluminense', 'Corinthians', 'Botafogo'],
    titles: ['Brasileirão', 'Libertadores', 'Recopa', 'Mundial de Clubes'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'danilo_meia',
    name: 'Danilo (Zidanilo)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1979,
    position: 'MEI',
    clubs: ['Goiás', 'São Paulo', 'Corinthians'],
    titles: ['Brasileirão', 'Libertadores', 'Recopa', 'Mundial de Clubes'],
    tags: []
  },
  {
    id: 'jadson',
    name: 'Jádson',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1983,
    position: 'MEI',
    clubs: ['Athletico-PR', 'São Paulo', 'Corinthians', 'Vitória'],
    titles: ['Brasileirão', 'Sul-Americana'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'ralf',
    name: 'Ralf',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1984,
    position: 'MEI',
    clubs: ['Corinthians'],
    titles: ['Brasileirão', 'Libertadores', 'Recopa', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'gil_zag',
    name: 'Gil (Zagueiro)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1987,
    position: 'ZAG',
    clubs: ['Cruzeiro', 'Corinthians', 'Santos', 'Goiás'],
    titles: ['Brasileirão', 'Recopa'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'dede',
    name: 'Dedé (O Mito)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1988,
    position: 'ZAG',
    clubs: ['Vasco', 'Cruzeiro', 'Athletico-PR'],
    titles: ['Brasileirão', 'Copa do Brasil'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'rever',
    name: 'Réver',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1985,
    position: 'ZAG',
    clubs: ['Grêmio', 'Atlético-MG', 'Internacional', 'Flamengo'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'leonardo_silva',
    name: 'Leonardo Silva',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1979,
    position: 'ZAG',
    clubs: ['Palmeiras', 'Botafogo', 'Vitória', 'Cruzeiro', 'Atlético-MG'],
    titles: ['Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: []
  },
  {
    id: 'victor_gol',
    name: 'Victor (São Victor)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1983,
    position: 'GOL',
    clubs: ['Grêmio', 'Atlético-MG'],
    titles: ['Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'marcos_rocha',
    name: 'Marcos Rocha',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1988,
    position: 'LAT',
    clubs: ['Atlético-MG', 'Palmeiras'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'mayke',
    name: 'Mayke',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1992,
    position: 'LAT',
    clubs: ['Cruzeiro', 'Palmeiras'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'ze_rafael',
    name: 'Zé Rafael',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1993,
    position: 'MEI',
    clubs: ['Coritiba', 'Bahia', 'Palmeiras', 'Santos'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: []
  },
  {
    id: 'cauly',
    name: 'Cauly',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1995,
    position: 'MEI',
    clubs: ['Bahia'],
    titles: [],
    tags: []
  },
  {
    id: 'jean_lucas',
    name: 'Jean Lucas',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1998,
    position: 'MEI',
    clubs: ['Flamengo', 'Santos', 'Bahia', 'Lyon', 'Monaco'],
    titles: [],
    tags: []
  },
  {
    id: 'pikachu',
    name: 'Yago Pikachu',
    nationality: 'Brasil',
    region: 'Norte',
    birthYear: 1992,
    position: 'MEI',
    clubs: ['Paysandu', 'Vasco', 'Fortaleza'],
    titles: [],
    tags: []
  },
  {
    id: 'lucero',
    name: 'Juan Martín Lucero',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1991,
    position: 'ATA',
    clubs: ['Independiente', 'Vélez Sarsfield', 'Fortaleza'],
    titles: [],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'tinga_fort',
    name: 'Tinga (Lateral)',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1993,
    position: 'LAT',
    clubs: ['Grêmio', 'Bahia', 'Fortaleza'],
    titles: [],
    tags: []
  },
  {
    id: 'david_luiz',
    name: 'David Luiz',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1987,
    position: 'ZAG',
    clubs: ['Vitória', 'Flamengo', 'Fortaleza', 'Benfica', 'Chelsea', 'PSG', 'Arsenal'],
    titles: ['Copa do Brasil', 'Libertadores'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'coutinho',
    name: 'Philippe Coutinho',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1992,
    position: 'MEI',
    clubs: ['Vasco', 'Inter de Milão', 'Liverpool', 'Barcelona', 'Bayern de Munique'],
    titles: ['Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'payet',
    name: 'Dimitri Payet',
    nationality: 'França',
    region: 'Exterior',
    birthYear: 1987,
    position: 'MEI',
    clubs: ['Vasco', 'Olympique de Marseille'],
    titles: [],
    tags: []
  },
  {
    id: 'vegetti',
    name: 'Pablo Vegetti',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1988,
    position: 'ATA',
    clubs: ['Vasco', 'Belgrano'],
    titles: [],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'leo_jardim',
    name: 'Léo Jardim',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1995,
    position: 'GOL',
    clubs: ['Grêmio', 'Vasco'],
    titles: ['Libertadores'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'yuri_alberto',
    name: 'Yuri Alberto',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 2001,
    position: 'ATA',
    clubs: ['Santos', 'Internacional', 'Corinthians', 'Zenit'],
    titles: [],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'garro',
    name: 'Rodrigo Garro',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1998,
    position: 'MEI',
    clubs: ['Talleres', 'Corinthians'],
    titles: [],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'memphis',
    name: 'Memphis Depay',
    nationality: 'Holanda',
    region: 'Exterior',
    birthYear: 1994,
    position: 'ATA',
    clubs: ['Corinthians', 'PSV', 'Lyon', 'Barcelona', 'Atlético de Madrid'],
    titles: [],
    tags: []
  },
  {
    id: 'romero',
    name: 'Ángel Romero',
    nationality: 'Paraguai',
    region: 'Exterior',
    birthYear: 1992,
    position: 'ATA',
    clubs: ['Cerro Porteño', 'Corinthians', 'San Lorenzo'],
    titles: ['Brasileirão'],
    tags: []
  },
  {
    id: 'guerrero',
    name: 'Paolo Guerrero',
    nationality: 'Peru',
    region: 'Exterior',
    birthYear: 1984,
    position: 'ATA',
    clubs: ['Corinthians', 'Flamengo', 'Internacional', 'Avaí', 'Racing', 'Bayern de Munique'],
    titles: ['Brasileirão', 'Recopa', 'Mundial de Clubes'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'tevez',
    name: 'Carlos Tévez',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1984,
    position: 'ATA',
    clubs: ['Boca Juniors', 'Corinthians', 'Manchester United', 'Manchester City', 'Juventus'],
    titles: ['Brasileirão', 'Libertadores', 'Mundial de Clubes'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'dalessandro',
    name: 'Andrés D’Alessandro',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1981,
    position: 'MEI',
    clubs: ['River Plate', 'San Lorenzo', 'Internacional', 'Nacional-URU'],
    titles: ['Libertadores', 'Sul-Americana', 'Recopa'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'fernandao',
    name: 'Fernandão',
    nationality: 'Brasil',
    region: 'Centro-Oeste',
    birthYear: 1978,
    position: 'ATA',
    clubs: ['Goiás', 'Internacional', 'São Paulo', 'Olympique de Marseille'],
    titles: ['Libertadores', 'Recopa', 'Mundial de Clubes'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'alan_patrick',
    name: 'Alan Patrick',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1991,
    position: 'MEI',
    clubs: ['Santos', 'Internacional', 'Palmeiras', 'Flamengo'],
    titles: ['Copa do Brasil', 'Libertadores'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'borre',
    name: 'Rafael Santos Borré',
    nationality: 'Colômbia',
    region: 'Exterior',
    birthYear: 1995,
    position: 'ATA',
    clubs: ['River Plate', 'Internacional'],
    titles: ['Libertadores', 'Recopa'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'enner_valencia',
    name: 'Enner Valencia',
    nationality: 'Equador',
    region: 'Exterior',
    birthYear: 1989,
    position: 'ATA',
    clubs: ['Emelec', 'Internacional', 'Fenerbahçe'],
    titles: [],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'rochet',
    name: 'Sergio Rochet',
    nationality: 'Uruguai',
    region: 'Exterior',
    birthYear: 1993,
    position: 'GOL',
    clubs: ['Nacional-URU', 'Internacional'],
    titles: [],
    tags: []
  },
  {
    id: 'suarez',
    name: 'Luis Suárez',
    nationality: 'Uruguai',
    region: 'Exterior',
    birthYear: 1987,
    position: 'ATA',
    clubs: ['Nacional-URU', 'Grêmio', 'Ajax', 'Liverpool', 'Barcelona', 'Atlético de Madrid'],
    titles: ['Copa América', 'Mundial de Clubes'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'geromel',
    name: 'Pedro Geromel',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1985,
    position: 'ZAG',
    clubs: ['Grêmio'],
    titles: ['Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'kannemann',
    name: 'Walter Kannemann',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1991,
    position: 'ZAG',
    clubs: ['San Lorenzo', 'Grêmio'],
    titles: ['Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: []
  },
  {
    id: 'luan_rei',
    name: 'Luan (Rei da América)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1993,
    position: 'ATA',
    clubs: ['Grêmio', 'Corinthians', 'Santos', 'Vitória'],
    titles: ['Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'everton_cebolinha',
    name: 'Everton Cebolinha',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1996,
    position: 'ATA',
    clubs: ['Fortaleza', 'Grêmio', 'Flamengo', 'Benfica'],
    titles: ['Copa do Brasil', 'Libertadores', 'Recopa', 'Copa América'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'soteldo',
    name: 'Yeferson Soteldo',
    nationality: 'Venezuela',
    region: 'Exterior',
    birthYear: 1997,
    position: 'ATA',
    clubs: ['Santos', 'Grêmio', 'Fluminense'],
    titles: [],
    tags: []
  },
  {
    id: 'de_la_cruz',
    name: 'Nicolás De La Cruz',
    nationality: 'Uruguai',
    region: 'Exterior',
    birthYear: 1997,
    position: 'MEI',
    clubs: ['River Plate', 'Flamengo'],
    titles: ['Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: []
  },
  {
    id: 'vina',
    name: 'Matías Viña',
    nationality: 'Uruguai',
    region: 'Exterior',
    birthYear: 1997,
    position: 'LAT',
    clubs: ['Nacional-URU', 'Palmeiras', 'Flamengo', 'Roma'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores'],
    tags: []
  },
  {
    id: 'varela',
    name: 'Guillermo Varela',
    nationality: 'Uruguai',
    region: 'Exterior',
    birthYear: 1993,
    position: 'LAT',
    clubs: ['Peñarol', 'Flamengo'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores'],
    tags: []
  },
  {
    id: 'piquerez',
    name: 'Joaquín Piquerez',
    nationality: 'Uruguai',
    region: 'Exterior',
    birthYear: 1998,
    position: 'LAT',
    clubs: ['Peñarol', 'Palmeiras'],
    titles: ['Brasileirão', 'Libertadores', 'Recopa'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'flaco_lopez',
    name: 'Flaco López',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 2000,
    position: 'ATA',
    clubs: ['Lanús', 'Palmeiras'],
    titles: ['Brasileirão'],
    tags: []
  },
  {
    id: 'anibal_moreno',
    name: 'Aníbal Moreno',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1999,
    position: 'MEI',
    clubs: ['Racing', 'Palmeiras'],
    titles: [],
    tags: []
  },
  {
    id: 'zaracho',
    name: 'Matías Zaracho',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1998,
    position: 'MEI',
    clubs: ['Racing', 'Atlético-MG'],
    titles: ['Brasileirão', 'Copa do Brasil'],
    tags: []
  },
  {
    id: 'nacho_fernandez',
    name: 'Nacho Fernández',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1990,
    position: 'MEI',
    clubs: ['River Plate', 'Atlético-MG'],
    titles: ['Brasileirão', 'Copa do Brasil', 'Libertadores', 'Recopa'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'pratto',
    name: 'Lucas Pratto',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1988,
    position: 'ATA',
    clubs: ['Boca Juniors', 'Vélez Sarsfield', 'Atlético-MG', 'São Paulo', 'River Plate'],
    titles: ['Libertadores', 'Recopa'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'guilherme_arana',
    name: 'Guilherme Arana',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1997,
    position: 'LAT',
    clubs: ['Corinthians', 'Athletico-PR', 'Atlético-MG', 'Sevilla'],
    titles: ['Brasileirão', 'Copa do Brasil'],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'everson',
    name: 'Everson (Goleiro)',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1990,
    position: 'GOL',
    clubs: ['São Paulo', 'Ceará', 'Santos', 'Atlético-MG'],
    titles: ['Brasileirão', 'Copa do Brasil'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'matheus_pereira',
    name: 'Matheus Pereira',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1996,
    position: 'MEI',
    clubs: ['Cruzeiro', 'Sporting'],
    titles: [],
    tags: ['Seleção Brasileira', 'Artilheiro/Craque']
  },
  {
    id: 'fernandinho',
    name: 'Fernandinho',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1985,
    position: 'MEI',
    clubs: ['Athletico-PR', 'Manchester City'],
    titles: ['Copa América'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'thiago_heleno',
    name: 'Thiago Heleno',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1988,
    position: 'ZAG',
    clubs: ['Cruzeiro', 'Corinthians', 'Palmeiras', 'Figueirense', 'Athletico-PR'],
    titles: ['Copa do Brasil', 'Sul-Americana'],
    tags: []
  },
  {
    id: 'nikao',
    name: 'Nikão',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1992,
    position: 'MEI',
    clubs: ['Atlético-MG', 'Vitória', 'Bahia', 'Athletico-PR', 'São Paulo', 'Cruzeiro'],
    titles: ['Copa do Brasil', 'Sul-Americana'],
    tags: []
  },
  {
    id: 'pablo_ath',
    name: 'Pablo (Atacante)',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1992,
    position: 'ATA',
    clubs: ['Athletico-PR', 'São Paulo'],
    titles: ['Sul-Americana'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'eduardo_sasha',
    name: 'Eduardo Sasha',
    nationality: 'Brasil',
    region: 'Sul',
    birthYear: 1992,
    position: 'ATA',
    clubs: ['Internacional', 'Goiás', 'Santos', 'Atlético-MG', 'Bragantino'],
    titles: ['Brasileirão', 'Copa do Brasil'],
    tags: []
  },
  {
    id: 'vitor_roque',
    name: 'Vitor Roque',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 2005,
    position: 'ATA',
    clubs: ['Cruzeiro', 'Athletico-PR', 'Palmeiras', 'Barcelona'],
    titles: [],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'artur_atk',
    name: 'Artur (Ponta)',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1998,
    position: 'ATA',
    clubs: ['Palmeiras', 'Bahia', 'Bragantino', 'Botafogo', 'Zenit'],
    titles: ['Brasileirão'],
    tags: ['Seleção Brasileira']
  },
  {
    id: 'alerrandro',
    name: 'Alerrandro',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 2000,
    position: 'ATA',
    clubs: ['Atlético-MG', 'Bragantino', 'Vitória'],
    titles: [],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'marinho',
    name: 'Marinho',
    nationality: 'Brasil',
    region: 'Nordeste',
    birthYear: 1990,
    position: 'ATA',
    clubs: ['Fluminense', 'Internacional', 'Cruzeiro', 'Vitória', 'Grêmio', 'Santos', 'Flamengo', 'Fortaleza'],
    titles: ['Copa do Brasil', 'Libertadores'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'lugano',
    name: 'Diego Lugano',
    nationality: 'Uruguai',
    region: 'Exterior',
    birthYear: 1980,
    position: 'ZAG',
    clubs: ['Nacional-URU', 'São Paulo', 'PSG', 'Fenerbahçe'],
    titles: ['Brasileirão', 'Libertadores', 'Copa América', 'Mundial de Clubes'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'sorin',
    name: 'Juan Pablo Sorín',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1976,
    position: 'LAT',
    clubs: ['River Plate', 'Cruzeiro', 'Barcelona', 'PSG'],
    titles: ['Copa do Brasil', 'Libertadores'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'conca',
    name: 'Darío Conca',
    nationality: 'Argentina',
    region: 'Exterior',
    birthYear: 1983,
    position: 'MEI',
    clubs: ['River Plate', 'Vasco', 'Fluminense', 'Flamengo'],
    titles: ['Brasileirão'],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'nenê',
    name: 'Nenê',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1981,
    position: 'MEI',
    clubs: ['Palmeiras', 'Santos', 'Vasco', 'São Paulo', 'Fluminense', 'Juventude', 'PSG'],
    titles: [],
    tags: ['Artilheiro/Craque']
  },
  {
    id: 'alan_kardec',
    name: 'Alan Kardec',
    nationality: 'Brasil',
    region: 'Sudeste',
    birthYear: 1989,
    position: 'ATA',
    clubs: ['Vasco', 'Internacional', 'Santos', 'Palmeiras', 'São Paulo', 'Atlético-MG'],
    titles: ['Brasileirão', 'Copa do Brasil'],
    tags: []
  }
];

// Integra automaticamente a base local expandida gerada pelo script da Wikidata (milhares de jogadores)
(function mergeLocalWikidataPlayers() {
  const extra = (typeof window !== 'undefined' && Array.isArray(window.WIKIDATA_PLAYERS))
    ? window.WIKIDATA_PLAYERS
    : [];
  if (!extra.length) return;

  const normalizeName = (s) =>
    (s || '')
      .replace(/\s*\(.*?\)\s*/g, '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const existingByNameYear = new Map();
  for (const p of PLAYERS_DB) {
    existingByNameYear.set(`${normalizeName(p.name)}_${p.birthYear}`, p);
    existingByNameYear.set(normalizeName(p.name), p);
  }

  for (const wp of extra) {
    const keyExact = `${normalizeName(wp.name)}_${wp.birthYear}`;
    const keyName = normalizeName(wp.name);
    const match = existingByNameYear.get(keyExact) || existingByNameYear.get(keyName);

    if (match) {
      // Enriquece clubes e tags da base curada com os registros oficiais da Wikidata
      for (const c of wp.clubs || []) {
        if (!match.clubs.includes(c)) match.clubs.push(c);
      }
      for (const t of wp.tags || []) {
        if (!match.tags.includes(t)) match.tags.push(t);
      }
    } else {
      PLAYERS_DB.push(wp);
      existingByNameYear.set(keyExact, wp);
    }
  }
})();
