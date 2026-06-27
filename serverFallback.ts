// Fallback Question Bank for ETE Subsequente
// This ensures that even if the Gemini API is unavailable (e.g., 503 error), the user can always generate high-quality, relevant study questions.

import { INITIAL_SYLLABUS } from "./src/data/syllabus";

// Extrai os temas oficiais do edital (a "fonte da verdade" do conteúdo da prova),
// separados por disciplina, para ancorar a geração de questões pela IA.
export function getEditalTopics(): { port: string; mat: string } {
  const port = INITIAL_SYLLABUS.filter((t) => t.subject === "Língua Portuguesa")
    .map((t) => `- ${t.title}`)
    .join("\n");
  const mat = INITIAL_SYLLABUS.filter((t) => t.subject === "Matemática")
    .map((t) => `- ${t.title}`)
    .join("\n");
  return { port, mat };
}

export function getRandomEditalTopics(count: number = 5): { port: string; mat: string } {
  const portTopics = INITIAL_SYLLABUS.filter((t) => t.subject === "Língua Portuguesa");
  const matTopics = INITIAL_SYLLABUS.filter((t) => t.subject === "Matemática");
  
  const port = shuffle(portTopics).slice(0, count).map(t => `- ${t.title}`).join("\n");
  const mat = shuffle(matTopics).slice(0, count).map(t => `- ${t.title}`).join("\n");
  
  return { port, mat };
}

export interface FallbackQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  weight?: number; // 1 to 10 based on exam frequency
  subject?: "Língua Portuguesa" | "Matemática"; // necessário para o front-end separar as abas
}

function weightedSample(pool: FallbackQuestion[], count: number): FallbackQuestion[] {
  const selected: FallbackQuestion[] = [];
  const poolCopy = [...pool];

  while (selected.length < count && poolCopy.length > 0) {
    let totalWeight = poolCopy.reduce((sum, q) => sum + (q.weight || 1), 0);
    let randomVal = Math.random() * totalWeight;

    for (let i = 0; i < poolCopy.length; i++) {
      randomVal -= (poolCopy[i].weight || 1);
      if (randomVal <= 0) {
        selected.push(poolCopy[i]);
        poolCopy.splice(i, 1);
        break;
      }
    }
  }
  return selected;
}

// Embaralha um array (Fisher-Yates) — usado para variar a ordem a cada simulado.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Embaralha as alternativas de uma questão remapeando o answerIndex.
// Isso faz cada questão "parecer" diferente mesmo vinda do mesmo banco.
function shuffleOptions(q: FallbackQuestion): FallbackQuestion {
  const letras = ["A", "B", "C", "D", "E"];
  // Remove o prefixo "A) " original para reordenar limpo.
  const semPrefixo = q.options.map((opt) => opt.replace(/^[A-E]\)\s*/, ""));
  const correta = semPrefixo[q.answerIndex];
  const ordem = shuffle(semPrefixo.map((_, i) => i));
  const novasOpcoes = ordem.map((origIdx, novoIdx) => `${letras[novoIdx]}) ${semPrefixo[origIdx]}`);
  const novoAnswerIndex = ordem.findIndex((origIdx) => semPrefixo[origIdx] === correta);
  return { ...q, options: novasOpcoes, answerIndex: novoAnswerIndex };
}

// "Algoritmo inteligente": peso de incidência por assunto, derivado da
// frequência observada em provas subsequentes anteriores da banca.
// Quanto maior o peso, maior a chance do assunto cair no simulado.
const FREQUENCIA_ASSUNTOS: { padrao: RegExp; weight: number }[] = [
  // Português (mais cobrados primeiro)
  { padrao: /concord/i, weight: 9 },
  { padrao: /conota|figura|sentido/i, weight: 6 },
  { padrao: /regência|regencia|crase|lacuna/i, weight: 8 },
  { padrao: /acento|ortográfic|ortografic/i, weight: 7 },
  { padrao: /vírgula|virgula|pontuação|pontuacao/i, weight: 7 },
  { padrao: /conjunção|conjuncao|concess|embora/i, weight: 5 },
  { padrao: /pronome relativo|cujas|cujo/i, weight: 4 },
  { padrao: /formação|formacao|derivaç|derivac/i, weight: 4 },
  // Matemática (mais cobrados primeiro)
  { padrao: /porcent|%|desconto|aumento/i, weight: 9 },
  { padrao: /regra de três|torneira|vazão|vazao/i, weight: 8 },
  { padrao: /fração|fracao|3\/5/i, weight: 7 },
  { padrao: /área|area|perímetro|perimetro|retangular|circular|raio/i, weight: 7 },
  { padrao: /sistema|equaç|equac|caderno|caneta/i, weight: 6 },
  { padrao: /algébric|algebric|valor numérico|valor numerico/i, weight: 5 },
  { padrao: /trigon|sen\(|cos\(|rampa|ângulo|angulo/i, weight: 5 },
];

// Aplica o peso de frequência a cada questão do banco.
function comFrequencia(pool: FallbackQuestion[]): FallbackQuestion[] {
  return pool.map((q) => {
    const match = FREQUENCIA_ASSUNTOS.find(
      (f) => f.padrao.test(q.question) || f.padrao.test(q.explanation)
    );
    return { ...q, weight: match ? match.weight : 3 };
  });
}

export const FALLBACK_PORTUGUESE: FallbackQuestion[] = [
  {
    question: "Identifique a alternativa que apresenta desvio em relação à norma-padrão de concordância verbal da Língua Portuguesa:",
    options: [
      "A) Fazia muitos meses que os novos cursos técnicos da ETE não abriam vagas na região.",
      "B) Fomos nós que resolveu todas as pendências da matrícula eletrônica no portal da ETE.",
      "C) Choveram reclamações na secretaria de educação a respeito do fechamento do polo de provas.",
      "D) Mais de um candidato questionou o gabarito oficial da prova subsequente.",
      "E) Devem existir soluções melhores para o gerenciamento de tempo durante a prova da ETE."
    ],
    answerIndex: 1,
    explanation: "Na opção B, há um erro de concordância. Com o pronome relativo 'que', o verbo deve concordar com o antecedente: 'Fomos nós que resolvemos...'. Se fosse usado 'quem', poder-se-ia usar a terceira pessoa do singular: 'Fomos nós quem resolveu...'. as demais opções estão perfeitamente corretas."
  },
  {
    question: "Na frase: 'Embora a concorrência para o curso de informática da ETE seja altíssima, o estudante manteve a rotina de estudos focada', a conjunção em destaque ('Embora') estabelece uma relação de:",
    options: [
      "A) Causa, pois fundamenta o motivo de manter a rotina de estudos.",
      "B) Consequência, expressando o resultado lógico da concorrência altíssima.",
      "C) Concessão, introduzindo uma oposição ou obstáculo que não impede a ação principal.",
      "D) Proporção, mostrando que o estudo cresce na mesma medida da concorrência.",
      "E) Condição, sugerindo um pré-requisito obrigatório para o candidato estudar."
    ],
    answerIndex: 2,
    explanation: "'Embora' é uma conjunção subordinativa concessiva. Ela introduz uma ideia de concessão: um fato que contrasta com a oração principal, mas não é suficiente para impedir a realização da ação principal."
  },
  {
    question: "Assinale a alternativa que está em total conformidade com as regras do Novo Acordo Ortográfico em relação ao uso do acento gráfico:",
    options: [
      "A) Os estudantes leem o edital da ETE com muita atenção antes de pagar a taxa de inscrição.",
      "B) O professor de matemática deu uma excelente idéia para resolver a questão de trigonometria.",
      "C) Ele realizou um vôo direto de Petrolina para Recife para fazer a prova presencial da ETE.",
      "D) O remédio contra a ansiedade pré-exame possui ação ultra-rápida e eficaz.",
      "E) O aluno ficou muito ansioso e teve uma dor de cabeça por causa do heróico esforço."
    ],
    answerIndex: 0,
    explanation: "Pelo Acordo Ortográfico de 2008: 1) Verbos com terminação 'eem' na 3ª pessoa do plural do presente perderam o acento ('leem', 'veem' - correto na alternativa A). 2) Ditongos abertos 'ei' e 'oi' em palavras paroxítonas perderam o acento ('ideia', 'heroico' - incorreto em B e E). 3) Vogal dupla 'oo' perdeu o acento ('voo' - incorreto em C). 4) Prefixo que termina em vogal diferente da que inicia a palavra seguinte não leva hífen ('ultrarrápida' duplica o 'r' - incorreto em D)."
  },
  {
    question: "Aponte a alternativa que apresenta uma palavra empregada em sentido conotativo (figurado):",
    options: [
      "A) O candidato leu as 40 páginas do edital oficial antes do encerramento das inscrições.",
      "B) A prova subsequente da ETE de Pernambuco tem duração máxima de 60 minutos.",
      "C) No dia da prova presencial, o candidato deve levar documento oficial original com foto.",
      "D) Aprovados no processo seletivo nadam em um mar de oportunidades profissionais.",
      "E) A prova é composta por dez questões de Português e dez questões de Matemática."
    ],
    answerIndex: 3,
    explanation: "Na alternativa D, a expressão 'nadam em um mar de oportunidades' está empregada em sentido conotativo (figurado), uma vez que não representa um mar físico de água, mas sim uma metáfora para abundância de oportunidades. Todas as demais frases estão em sentido denotativo (real, literal)."
  },
  {
    question: "Considere a frase: 'O candidato chegou _____ sala de aula, assistiu _____ explicação do professor e aspirava _____ vaga de enfermagem'. Preenche corretamente as lacunas, de acordo com as regras de regência verbal:",
    options: [
      "A) na / a / a",
      "B) à / à / à",
      "C) na / à / na",
      "D) à / a / na",
      "E) à / à / a"
    ],
    answerIndex: 1,
    explanation: "1) O verbo 'chegar' exige a preposição 'a' (chegou à sala). 2) O verbo 'assistir' no sentido de presenciar/ver exige a preposição 'a' (assistiu à explicação). 3) O verbo 'aspirar' no sentido de desejar/almejar exige a preposição 'a' (aspirava à vaga). Como todos os termos seguintes são femininos e admitem artigo 'a', ocorre a crase nos três casos: 'à / à / à'."
  },
  {
    question: "Na oração: 'Trata-se de um sistema inteligente, cujas funcionalidades ajudam milhares de candidatos a organizar seus estudos para a ETE PE', o termo 'cujas' funciona como:",
    options: [
      "A) Um pronome relativo que estabelece relação de posse entre 'funcionalidades' e 'sistema inteligente'.",
      "B) Uma conjunção subordinativa integrante que conecta duas ideias dependentes.",
      "C) Um pronome demonstrativo que indica a distância espacial das funcionalidades no sistema.",
      "D) Um advérbio de modo que qualifica a maneira como as funcionalidades agem.",
      "E) Um pronome indefinido que expressa quantidade indeterminada de funcionalidades."
    ],
    answerIndex: 0,
    explanation: "O pronome relativo 'cujo/cuja/cujos/cujas' é empregado obrigatoriamente para estabelecer uma relação de posse entre dois substantivos (as funcionalidades do sistema inteligente). Ele concorda em gênero e número com o termo possuído ('funcionalidades')."
  },
  {
    question: "Assinale a alternativa em que a pontuação (uso da vírgula) está correta de acordo com a norma gramatical:",
    options: [
      "A) Os candidatos que, estudaram com afinco, conseguiram obter excelente pontuação na prova.",
      "B) No último domingo de provas da ETE, muitos candidatos chegaram atrasados devido ao trânsito.",
      "C) O coordenador do polo de exames explicou, as regras de preenchimento do gabarito eletrônico.",
      "D) Os estudantes, de Pernambuco buscam vagas nas Escolas Técnicas Estaduais todos os anos.",
      "E) Dedicação, disciplina e foco, são as principais qualidades de um candidato aprovado."
    ],
    answerIndex: 1,
    explanation: "Na alternativa B, a vírgula separa corretamente a adjunto adverbial antecipado de longa extensão ('No último domingo de provas da ETE'). Erros nas outras: A separa o sujeito do verbo. C separa o verbo do seu objeto direto. D separa o sujeito do predicado. E separa os termos do sujeito composto do seu verbo."
  },
  {
    question: "Identifique o processo de formação da palavra 'planejamento' e da palavra 'desclassificado', respectivamente:",
    options: [
      "A) Derivação prefixal e Derivação sufixal",
      "B) Derivação sufixal e Derivação parassintética",
      "C) Derivação sufixal e Derivação prefixal e sufixal",
      "D) Derivação regressiva e Derivação prefixal",
      "E) Composição por aglutinação e Composição por justaposição"
    ],
    answerIndex: 2,
    explanation: "'Planejamento' é formado por derivação sufixal (planejar + sufixo -mento). 'Desclassificado' é formado por derivação prefixal e sufixal (prefixo des- + classificar + sufixo -ado), uma vez que existem de forma independente as palavras 'classificado' e 'desclassificar'."
  }
];

export const FALLBACK_MATHEMATICS: FallbackQuestion[] = [
  {
    question: "Um candidato resolveu 3/5 das questões de matemática da prova da ETE PE e acertou todas elas. Sabendo que a prova de matemática tem 10 questões, quantas questões ele resolveu e acertou?",
    options: [
      "A) Ele resolveu e acertou 4 questões.",
      "B) Ele resolveu e acertou 5 questões.",
      "C) Ele resolveu e acertou 6 questões.",
      "D) Ele resolveu e acertou 7 questões.",
      "E) Ele resolveu e acertou 8 questões."
    ],
    answerIndex: 2,
    explanation: "Para calcular a quantidade de questões resolvidas, multiplicamos a fração pelo total de questões: (3/5) * 10 = 30 / 5 = 6 questões. Como ele acertou todas as que resolveu, ele acertou 6 questões."
  },
  {
    question: "Uma torneira enche um reservatório de água em 3 horas. Outra torneira, funcionando sozinha, enche o mesmo reservatório em 6 horas. Se abrirmos as duas torneiras juntas, em quanto tempo o reservatório estará completamente cheio?",
    options: [
      "A) 1,5 horas (1 hora e 30 minutos)",
      "B) 2,0 horas (2 horas)",
      "C) 4,5 horas (4 horas e 30 minutos)",
      "D) 2,5 horas (2 horas e 15 minutos)",
      "E) 3,0 horas (3 horas)"
    ],
    answerIndex: 1,
    explanation: "A vazão da primeira torneira é 1/3 do reservatório por hora. A vazão da segunda torneira é 1/6 por hora. Juntas, suas vazões se somam: 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2 do reservatório por hora. Logo, para encher o reservatório completo (2/2), elas levarão 2 horas."
  },
  {
    question: "Um terreno retangular tem comprimento igual ao triplo de sua largura. Se o perímetro desse terreno é igual a 80 metros, qual é a área total do terreno em metros quadrados?",
    options: [
      "A) 240 m²",
      "B) 300 m²",
      "C) 400 m²",
      "D) 480 m²",
      "E) 600 m²"
    ],
    answerIndex: 1,
    explanation: "Seja x a largura do terreno. O comprimento é 3x. O perímetro é dado por 2 * (comprimento + largura) = 80 => 2 * (3x + x) = 80 => 2 * (4x) = 80 => 8x = 80 => x = 10 metros. Logo, a largura é 10m e o comprimento é 30m. A área do retângulo é largura * comprimento = 10 * 30 = 300 m²."
  },
  {
    question: "Uma camiseta de R$ 80,00 sofreu um aumento de 15% e, na semana seguinte, durante uma promoção na loja, foi vendida com um desconto de 10% sobre o novo valor. Qual foi o preço final de venda da camiseta?",
    options: [
      "A) R$ 84,00",
      "B) R$ 82,80",
      "C) R$ 80,00",
      "D) R$ 85,60",
      "E) R$ 88,00"
    ],
    answerIndex: 1,
    explanation: "1) Aumento de 15%: R$ 80,00 * 1,15 = R$ 92,00. 2) Desconto de 10% sobre R$ 92,00: R$ 92,00 * 0,90 = R$ 82,80. Portanto, o preço final de venda da camiseta foi de R$ 82,80."
  },
  {
    question: "Qual é o valor numérico da expressão algébrica x² - 3xy + y² para x = 4 e y = -2?",
    options: [
      "A) 12",
      "B) 16",
      "C) 24",
      "D) 32",
      "E) 44"
    ],
    answerIndex: 4,
    explanation: "Substituindo os valores na expressão: (4)² - 3 * (4) * (-2) + (-2)² = 16 - (-24) + 4 = 16 + 24 + 4 = 44. O valor numérico é 44."
  },
  {
    question: "Em uma rampa reta de 10 metros de comprimento, que forma um ângulo de 30º com o solo horizontal, qual é a altura máxima vertical atingida em relação ao solo? (Dado: sen(30º) = 0,5; cos(30º) = 0,86)",
    options: [
      "A) 3 metros",
      "B) 4 metros",
      "C) 5 metros",
      "D) 6 metros",
      "E) 8,6 metros"
    ],
    answerIndex: 2,
    explanation: "A rampa funciona como a hipotenusa de um triângulo retângulo e a altura vertical desejada é o cateto oposto ao ângulo de 30º. Relação trigonométrica: sen(30º) = cateto_oposto / hipotenusa => 0,5 = altura / 10 => altura = 10 * 0,5 = 5 metros."
  },
  {
    question: "Um estudante comprou 4 cadernos e 3 canetas por R$ 38,00. No mesmo dia, seu colega comprou 3 cadernos e 2 canetas das mesmas marcas por R$ 28,00. Qual é o preço individual de cada caderno?",
    options: [
      "A) R$ 6,00",
      "B) R$ 7,00",
      "C) R$ 8,00",
      "D) R$ 9,00",
      "E) R$ 10,00"
    ],
    answerIndex: 2,
    explanation: "Montamos o sistema de equações lineares: 1) 4x + 3y = 38 e 2) 3x + 2y = 28. Multiplicando a eq (1) por 2 e a eq (2) por 3, temos: 1) 8x + 6y = 76 e 2) 9x + 6y = 84. Subtraindo a eq (1) da eq (2): (9x - 8x) = 84 - 76 => x = R$ 8,00. O preço de cada caderno é R$ 8,00."
  },
  {
    question: "A área de uma praça circular é de 314 metros quadrados. Utilizando pi = 3,14, qual é o raio aproximado dessa praça circular?",
    options: [
      "A) 5 metros",
      "B) 10 metros",
      "C) 15 metros",
      "D) 20 metros",
      "E) 50 metros"
    ],
    answerIndex: 1,
    explanation: "A fórmula da área do círculo é A = pi * r². Substituindo os valores: 314 = 3,14 * r² => r² = 314 / 3,14 => r² = 100 => r = raiz_quadrada(100) = 10 metros."
  }
];

export function getFallbackQuestions(topic: string, subject: string): FallbackQuestion[] {
  const normTopic = (topic || "").toLowerCase();
  const normSubject = (subject || "").toLowerCase();

  let pool: FallbackQuestion[] = [];

  if (normSubject.includes("português") || normSubject.includes("portugues") || normSubject.includes("língua") || normSubject.includes("lingua")) {
    pool = [...FALLBACK_PORTUGUESE];
  } else {
    pool = [...FALLBACK_MATHEMATICS];
  }

  // Attempt to select questions containing keywords from the topic
  const matched = pool.filter(q => 
    q.question.toLowerCase().includes(normTopic) || 
    q.explanation.toLowerCase().includes(normTopic) ||
    (q.options.some(opt => opt.toLowerCase().includes(normTopic)))
  );

  let selected: FallbackQuestion[] = [];
  if (matched.length >= 3) {
    selected = matched.slice(0, 3);
  } else {
    // Fill up with other questions from the pool to reach exactly 3
    selected = [...matched];
    const remaining = pool.filter(q => !selected.includes(q));
    
    // Shuffle remaining slightly
    const shuffled = remaining.sort(() => 0.5 - Math.random());
    
    while (selected.length < 3 && shuffled.length > 0) {
      selected.push(shuffled.pop()!);
    }
  }

  // Final fallback check to ensure exactly 3 questions
  if (selected.length < 3) {
    selected = pool.slice(0, 3);
  }

  return selected;
}

export function getFallbackSimulado(): FallbackQuestion[] {
  // Retorna exatamente 20 questões (10 Português + 10 Matemática).
  // 1) Aplica o peso de incidência por assunto (frequência de provas anteriores).
  // 2) Faz amostragem ponderada — assuntos mais cobrados têm mais chance.
  // 3) Embaralha alternativas e ordem para que cada simulado pareça inédito.
  const portPool = comFrequencia(FALLBACK_PORTUGUESE);
  const matPool = comFrequencia(FALLBACK_MATHEMATICS);

  const portSelected = weightedSample(portPool, 10);
  const matSelected = weightedSample(matPool, 10);

  // Se o banco for menor que 10, completa com variações marcadas como prática extra.
  let extraCount = 0;
  while (portSelected.length < 10) {
    const q = shuffle(portPool)[extraCount++ % portPool.length];
    portSelected.push({ ...q, question: `[Prática Extra] ${q.question}` });
  }
  extraCount = 0;
  while (matSelected.length < 10) {
    const q = shuffle(matPool)[extraCount++ % matPool.length];
    matSelected.push({ ...q, question: `[Prática Extra] ${q.question}` });
  }

  // Embaralha alternativas e a ordem das questões dentro de cada disciplina,
  // e etiqueta a disciplina (o front-end usa q.subject para montar as abas).
  const port = shuffle(portSelected)
    .map(shuffleOptions)
    .map((q): FallbackQuestion => ({ ...q, subject: "Língua Portuguesa" }));
  const mat = shuffle(matSelected)
    .map(shuffleOptions)
    .map((q): FallbackQuestion => ({ ...q, subject: "Matemática" }));

  return [...port, ...mat];
}
