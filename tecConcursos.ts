/**
 * Tec Concursos - Server-side proxy module
 *
 * Faz chamadas para a API do Tec Concursos usando cookie de sessao
 * configurado no .env (TEC_SESSION_COOKIE).
 *
 * Free tier: enunciado + alternativas + gabarito (sem explicacao detalhada)
 * Explicacoes sao geradas pelo Gemini quando disponivel.
 */

const TEC_BASE_URL = 'https://www.tecconcursos.com.br/api';

export interface TecQuestao {
  id: number;
  enunciado: string;
  alternativas: string[];
  gabaritoIndex: number;
  banca?: string;
  ano?: number;
  orgao?: string;
  materia?: string;
  assunto?: string;
}

export interface TecMateria {
  id: number;
  nome: string;
}

export interface TecAssunto {
  id: number;
  nome: string;
  materiaId?: number;
}

// Cache de materias/assuntos para evitar chamadas repetidas
let materiasCache: TecMateria[] | null = null;
let assuntosCache: Map<number, TecAssunto[]> = new Map();

function getCookie(): string | null {
  const cookie = process.env.TEC_SESSION_COOKIE;
  if (!cookie || cookie === 'YOUR_COOKIE_HERE') return null;
  return cookie;
}

export function isTecConfigured(): boolean {
  return getCookie() !== null;
}

async function tecGet(path: string, params: Record<string, any> = {}): Promise<any> {
  const cookie = getCookie();
  if (!cookie) throw new Error('TEC_SESSION_COOKIE nao configurado');

  const url = new URL(TEC_BASE_URL + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, String(v));
  });

  const resp = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!resp.ok) {
    throw new Error(`TecConcursos GET ${path} -> HTTP ${resp.status}`);
  }
  return resp.json();
}

async function tecPost(path: string, body: any = {}): Promise<any> {
  const cookie = getCookie();
  if (!cookie) throw new Error('TEC_SESSION_COOKIE nao configurado');

  const resp = await fetch(TEC_BASE_URL + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    throw new Error(`TecConcursos POST ${path} -> HTTP ${resp.status}`);
  }
  const text = await resp.text();
  return text ? JSON.parse(text) : null;
}

// ─── Listar materias disponiveis ───
export async function listarMaterias(): Promise<TecMateria[]> {
  if (materiasCache) return materiasCache;
  const data = await tecGet('/materias', { universo: '', formato: 'OBJETIVA' });
  materiasCache = Array.isArray(data) ? data : [];
  return materiasCache!;
}

// ─── Listar assuntos de uma materia ───
export async function listarAssuntos(materiaId: number): Promise<TecAssunto[]> {
  if (assuntosCache.has(materiaId)) return assuntosCache.get(materiaId)!;
  const data = await tecGet('/assuntos', {
    universo: '',
    formato: 'OBJETIVA',
    materia: materiaId,
    hierarquico: true
  });
  const assuntos = Array.isArray(data) ? data : [];
  assuntosCache.set(materiaId, assuntos);
  return assuntos;
}

// ─── Buscar materia por nome (fuzzy match) ───
export async function buscarMateriaPorNome(nome: string): Promise<TecMateria | null> {
  const materias = await listarMaterias();
  const lower = nome.toLowerCase();

  // Busca exata primeiro
  let found = materias.find(m => m.nome.toLowerCase() === lower);
  if (found) return found;

  // Busca parcial
  found = materias.find(m => m.nome.toLowerCase().includes(lower) || lower.includes(m.nome.toLowerCase()));
  if (found) return found;

  // Mapeamento manual para os assuntos do ETE
  const mapeamento: Record<string, string[]> = {
    'portugues': ['português', 'língua portuguesa', 'lingua portuguesa'],
    'matematica': ['matemática', 'matematica']
  };

  for (const [key, aliases] of Object.entries(mapeamento)) {
    if (aliases.some(a => lower.includes(a) || a.includes(lower))) {
      found = materias.find(m => m.nome.toLowerCase().includes(key));
      if (found) return found;
    }
  }

  return null;
}

// ─── Buscar assunto por texto (fuzzy match dentro de uma materia) ───
export async function buscarAssuntoPorTexto(materiaId: number, texto: string): Promise<TecAssunto | null> {
  const assuntos = await listarAssuntos(materiaId);
  const lower = texto.toLowerCase();
  const palavras = lower.split(/\s+/).filter(p => p.length > 3);

  // Score cada assunto pela quantidade de palavras-chave que aparecem
  let melhor: { assunto: TecAssunto; score: number } | null = null;

  for (const assunto of assuntos) {
    const nomeAssunto = assunto.nome.toLowerCase();
    let score = 0;

    for (const palavra of palavras) {
      if (nomeAssunto.includes(palavra)) score++;
    }

    // Match exato do nome
    if (nomeAssunto === lower) score += 100;
    if (nomeAssunto.includes(lower)) score += 10;
    if (lower.includes(nomeAssunto)) score += 5;

    if (score > 0 && (!melhor || score > melhor.score)) {
      melhor = { assunto, score };
    }
  }

  return melhor?.assunto || null;
}

// ─── Contar questoes com filtros ───
export async function contarQuestoes(filtros: any): Promise<number> {
  const result = await tecPost('/questoes/contagem/filtros', {
    filtros,
    formato: 'OBJETIVA',
    universo: ''
  });
  return result?.int || 0;
}

// ─── Buscar questoes paginadas ───
export async function buscarQuestoesPaginado(
  filtros: any,
  pagina: number = 1,
  porPagina: number = 5
): Promise<any> {
  return tecPost('/questoes/filtros/paginacao', {
    filtros,
    formato: 'OBJETIVA',
    universo: '',
    pagina,
    porPagina
  });
}

// ─── Buscar questoes por IDs ───
export async function buscarQuestoesPorIds(filtros: any): Promise<number[]> {
  const result = await tecPost('/questoes/filtros', {
    filtros,
    formato: 'OBJETIVA',
    universo: ''
  });
  return result?.questoes || [];
}

/**
 * Busca questoes do Tec Concursos filtradas por assunto do edital ETE.
 *
 * @param tecQuery - Texto de busca do assunto (de studyResources.ts)
 * @param subject - 'Lingua Portuguesa' ou 'Matematica'
 * @param quantidade - Numero de questoes desejadas (default: 3 para quiz, 10 para simulado)
 */
export async function buscarQuestoesPorAssunto(
  tecQuery: string,
  subject: string,
  quantidade: number = 3
): Promise<any> {
  // 1. Descobrir materia ID
  const materiaAlvo = subject.includes('Portugu') ? 'português' : 'matemática';
  const materia = await buscarMateriaPorNome(materiaAlvo);

  if (!materia) {
    throw new Error(`Materia "${materiaAlvo}" nao encontrada no Tec Concursos`);
  }

  // 2. Tentar encontrar assunto especifico
  const assunto = await buscarAssuntoPorTexto(materia.id, tecQuery);

  // 3. Montar filtros
  const filtros: any = {
    MATERIA: {
      [materia.id]: {
        id: materia.id,
        nome: materia.nome,
        tipo: 'MATERIA',
        selecionarTudo: !assunto // se achou assunto, nao seleciona tudo
      }
    }
  };

  // Se encontrou assunto especifico, adicionar ao filtro
  if (assunto) {
    filtros.ASSUNTO = {
      [assunto.id]: {
        id: assunto.id,
        nome: assunto.nome,
        tipo: 'ASSUNTO',
        selecionarTudo: true
      }
    };
  }

  // 4. Buscar questoes paginadas
  // Pegar pagina aleatoria para variar as questoes
  const contagem = await contarQuestoes(filtros);

  if (contagem === 0) {
    throw new Error(`Nenhuma questao encontrada para "${tecQuery}"`);
  }

  // Calcular pagina aleatoria
  const totalPaginas = Math.ceil(contagem / quantidade);
  const paginaAleatoria = Math.floor(Math.random() * Math.min(totalPaginas, 20)) + 1;

  const resultado = await buscarQuestoesPaginado(filtros, paginaAleatoria, quantidade);

  return {
    questoes: resultado,
    total: contagem,
    materia: materia.nome,
    assunto: assunto?.nome || tecQuery,
    pagina: paginaAleatoria
  };
}

/**
 * Busca questoes para o simulado completo (10 Port + 10 Mat)
 */
export async function buscarQuestoesSimulado(): Promise<any> {
  const portMateria = await buscarMateriaPorNome('português');
  const matMateria = await buscarMateriaPorNome('matemática');

  if (!portMateria || !matMateria) {
    throw new Error('Materias de Portugues e/ou Matematica nao encontradas');
  }

  const buscarPorMateria = async (materia: TecMateria, qtd: number) => {
    const filtros = {
      MATERIA: {
        [materia.id]: {
          id: materia.id,
          nome: materia.nome,
          tipo: 'MATERIA',
          selecionarTudo: true
        }
      }
    };

    const contagem = await contarQuestoes(filtros);
    const totalPaginas = Math.ceil(contagem / qtd);
    const paginaAleatoria = Math.floor(Math.random() * Math.min(totalPaginas, 50)) + 1;

    return buscarQuestoesPaginado(filtros, paginaAleatoria, qtd);
  };

  const [portQuestoes, matQuestoes] = await Promise.all([
    buscarPorMateria(portMateria, 10),
    buscarPorMateria(matMateria, 10)
  ]);

  return { portQuestoes, matQuestoes };
}
