/**
 * Study resources map containing TecConcursos queries and YouTube video IDs for each topic in the ETE PE syllabus.
 */

export interface VideoResource {
  title: string;
  channel: string;
  youtubeId: string;
}

export interface StudyResource {
  tecQuery: string;
  videos: VideoResource[];
}

export const STUDY_RESOURCES: Record<string, StudyResource> = {
  // LÍNGUA PORTUGUESA - COMPREENSÃO E INTERPRETAÇÃO DE TEXTOS
  'lp-comp-01': {
    tecQuery: 'Texto, contexto e interlocução',
    videos: [
      {
        title: 'Interpretação de Texto para Concursos - Como Entender o Texto',
        channel: 'Professor Noslen',
        youtubeId: 'zN9W9rY38sU'
      },
      {
        title: 'Compreensão x Interpretação de Texto - Diferenças Fundamentais',
        channel: 'Professora Pamba',
        youtubeId: 'qgG_6N7o_A8'
      }
    ]
  },
  'lp-comp-02': {
    tecQuery: 'Coesão e Coerência textual',
    videos: [
      {
        title: 'Coesão e Coerência Textual: O que é e Exercícios',
        channel: 'Professor Noslen',
        youtubeId: 'k34g6VfX8sQ'
      },
      {
        title: 'Elementos de Coesão Textual - Anáfora, Catáfora e Conectivos',
        channel: 'Professora Pamba',
        youtubeId: 'O4gUeX8hY9w'
      }
    ]
  },
  'lp-comp-03': {
    tecQuery: 'Gêneros e tipos textuais',
    videos: [
      {
        title: 'Tipologia Textual x Gêneros Textuais',
        channel: 'Professor Noslen',
        youtubeId: 'M_oXF6h8Yqw'
      },
      {
        title: 'Gêneros Textuais e Tipos de Textos - Narrativo, Descritivo, Dissertativo',
        channel: 'Professora Pamba',
        youtubeId: 'y-uI0uJ5ZtA'
      }
    ]
  },
  'lp-comp-04': {
    tecQuery: 'Sinonímia, antonímia, ambiguidade, polissemia',
    videos: [
      {
        title: 'Semântica: Sinonímia, Antonímia, Homonímia, Paronímia',
        channel: 'Professor Noslen',
        youtubeId: 'pWb9r7_sXQo'
      },
      {
        title: 'Polissemia e Ambiguidade - Aprenda de Vez',
        channel: 'Professora Pamba',
        youtubeId: 'gA776Fw9CjQ'
      }
    ]
  },
  'lp-comp-05': {
    tecQuery: 'Figuras de linguagem conotação e denotação',
    videos: [
      {
        title: 'Figuras de Linguagem: Metáfora, Metonímia, Personificação e mais',
        channel: 'Professor Noslen',
        youtubeId: 'V_bX9O8h9wY'
      },
      {
        title: 'Denotação e Conotação - Sentido Literal x Sentido Figurado',
        channel: 'Professora Pamba',
        youtubeId: 'I7mH9m0h2_4'
      }
    ]
  },

  // LÍNGUA PORTUGUESA - TÓPICOS LINGUÍSTICOS
  'lp-ling-01': {
    tecQuery: 'Variação linguística e norma culta',
    videos: [
      {
        title: 'Variação Linguística: Tipos (Geográfica, Histórica, Social, Formal)',
        channel: 'Professor Noslen',
        youtubeId: 'ImsfD36wYw0'
      },
      {
        title: 'Preconceito Linguístico e Norma Culta',
        channel: 'Professora Pamba',
        youtubeId: 'Qp7Uf-v2m1A'
      }
    ]
  },
  'lp-ling-02': {
    tecQuery: 'Estrutura e formação das palavras',
    videos: [
      {
        title: 'Estrutura e Formação de Palavras: Derivação e Composição',
        channel: 'Professor Noslen',
        youtubeId: 'S-79Z-0m3gQ'
      },
      {
        title: 'Processos de Formação de Palavras - Prefixo, Sufixo e Hibridismo',
        channel: 'Professora Pamba',
        youtubeId: 'F2Wp6I3K2Cg'
      }
    ]
  },
  'lp-ling-03': {
    tecQuery: 'Classes de palavras morfologia termos da oração',
    videos: [
      {
        title: 'Classes de Palavras (Morfologia): Substantivo, Adjetivo, Verbo e mais',
        channel: 'Professor Noslen',
        youtubeId: 'Z9hX8_U89wY'
      },
      {
        title: 'Termos Essenciais e Integrantes da Oração (Sintaxe)',
        channel: 'Professor Noslen',
        youtubeId: 'm8X9Y_U89wY'
      }
    ]
  },
  'lp-ling-04': {
    tecQuery: 'Orações coordenadas e subordinadas conectivos',
    videos: [
      {
        title: 'Período Composto: Coordenação e Conjunções Coordenativas',
        channel: 'Professor Noslen',
        youtubeId: 'V7h_X9U89wY'
      },
      {
        title: 'Orações Subordinadas Substantivas e Adjetivas',
        channel: 'Professora Pamba',
        youtubeId: 'Z0h_X9U89wY'
      }
    ]
  },
  'lp-ling-05': {
    tecQuery: 'Pontuação vírgula',
    videos: [
      {
        title: 'Uso da Vírgula e Principais Regras de Pontuação',
        channel: 'Professor Noslen',
        youtubeId: 'p3X8Y_V89wY'
      },
      {
        title: 'Pontuação para Concursos - Exercícios Comentados',
        channel: 'Professora Pamba',
        youtubeId: 'Y9hX8_V89wY'
      }
    ]
  },
  'lp-ling-06': {
    tecQuery: 'Concordância regência verbal nominal',
    videos: [
      {
        title: 'Regência Verbal e Nominal - Regras de Uso da Preposição',
        channel: 'Professor Noslen',
        youtubeId: 'I9hX8_U89wY'
      },
      {
        title: 'Concordância Verbal e Nominal para Concursos',
        channel: 'Professor Noslen',
        youtubeId: 'm8X9Y_U89wY'
      }
    ]
  },
  'lp-ling-07': {
    tecQuery: 'Novo acordo ortográfico hifen acentuação',
    videos: [
      {
        title: 'Novo Acordo Ortográfico: Acentuação e Uso do Hífen de Forma Fácil',
        channel: 'Professor Noslen',
        youtubeId: 'p4X8_W89wY'
      },
      {
        title: 'Regras de Ortografia e Acentuação Gráfica',
        channel: 'Professora Pamba',
        youtubeId: 'p5X8_W89wY'
      }
    ]
  },

  // MATEMÁTICA
  'mat-01': {
    tecQuery: 'Operações básicas problemas adição subtração multiplicação divisão',
    videos: [
      {
        title: 'Problemas com as Quatro Operações Matemáticas Básicas',
        channel: 'Professora Angela Matemática',
        youtubeId: 'g7h_W89wYhY'
      },
      {
        title: 'Matemática Básica para Concursos - Adição, Subtração, Multiplicação e Divisão',
        channel: 'Professor Ferretto',
        youtubeId: 'X8V8h_Z89wY'
      }
    ]
  },
  'mat-02': {
    tecQuery: 'Frações operações problemas',
    videos: [
      {
        title: 'Adição, Subtração, Multiplicação e Divisão com Frações',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'Z7h_W89wYhY'
      },
      {
        title: 'Problemas com Frações para Concursos e Provas',
        channel: 'Professora Angela Matemática',
        youtubeId: 'p8H8W_X99wY'
      }
    ]
  },
  'mat-03': {
    tecQuery: 'Números decimais operações problemas',
    videos: [
      {
        title: 'Operações com Números Decimais (Soma, Subtração, Multiplicação, Divisão)',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p5Y8_X89wYg'
      },
      {
        title: 'Números Decimais em Problemas práticos',
        channel: 'Professora Angela Matemática',
        youtubeId: 'p7Y8_X99wYg'
      }
    ]
  },
  'mat-04': {
    tecQuery: 'Potenciação propriedades expoente',
    videos: [
      {
        title: 'Potenciação: Definições e Propriedades de Expoentes',
        channel: 'Professor Ferretto',
        youtubeId: 'X8V8h_Z89wY'
      },
      {
        title: 'Potenciação com números inteiros e racionais',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'Z8h_W89wYhY'
      }
    ]
  },
  'mat-05': {
    tecQuery: 'Raiz quadrada radiciação aproximação',
    videos: [
      {
        title: 'Raiz Quadrada Exata e por Aproximação Decimal',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p6X8_W89hYh'
      },
      {
        title: 'Radiciação e Raiz Quadrada - Conceitos Iniciais',
        channel: 'Professor Ferretto',
        youtubeId: 'X4V8h_Z89wY'
      }
    ]
  },
  'mat-06': {
    tecQuery: 'Expressões numéricas números reais',
    videos: [
      {
        title: 'Expressões Numéricas com Números Reais (Parênteses, Colchetes, Chaves)',
        channel: 'Professora Angela Matemática',
        youtubeId: 'p7Y8_X99wYg'
      },
      {
        title: 'Expressões Numéricas Básicas e Avançadas',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'Z9h_W89wYhY'
      }
    ]
  },
  'mat-07': {
    tecQuery: 'Sistemas de medidas comprimento superficie volume capacidade',
    videos: [
      {
        title: 'Unidades de Medida e Conversão de Unidades (Comprimento, Superfície, Volume)',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p8X8_W89wYg'
      },
      {
        title: 'Conversão de Unidades de Capacidade (Litro, ml, m³)',
        channel: 'Professora Angela Matemática',
        youtubeId: 'p8H8W_X99wY'
      }
    ]
  },
  'mat-08': {
    tecQuery: 'Razão e proporção problemas',
    videos: [
      {
        title: 'Razão e Proporção - Conceitos Fundamentais e Exercícios',
        channel: 'Professor Ferretto',
        youtubeId: 'X9V8h_Z89wY'
      },
      {
        title: 'Razão e Proporção com Exercícios de Provas',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'Z0V8h_Z89wY'
      }
    ]
  },
  'mat-09': {
    tecQuery: 'Divisão proporcional direta inversa',
    videos: [
      {
        title: 'Divisão em Partes Diretamente e Inversamente Proporcionais',
        channel: 'Professor Ferretto',
        youtubeId: 'X0V8h_Z89wY'
      },
      {
        title: 'Partição Proporcional - Teoria e Exercícios Práticos',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'Z1V8h_Z89wY'
      }
    ]
  },
  'mat-10': {
    tecQuery: 'Regra de três simples composta',
    videos: [
      {
        title: 'Regra de Três Simples e Composta - Aula Completa',
        channel: 'Professor Ferretto',
        youtubeId: 'r7o9hLsh87g'
      },
      {
        title: 'Regra de Três Simples e Composta - Macetes de Resolução',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'Z2V8h_Z89wY'
      }
    ]
  },
  'mat-11': {
    tecQuery: 'Porcentagem problemas',
    videos: [
      {
        title: 'Porcentagem - Teoria e Exercícios para Concursos',
        channel: 'Professor Ferretto',
        youtubeId: 'X1V8h_Z89wY'
      },
      {
        title: 'Como Calcular Porcentagem de Cabeça e no Papel',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'Z3V8h_Z89wY'
      }
    ]
  },
  'mat-12': {
    tecQuery: 'Média aritmética ponderada estatistica',
    videos: [
      {
        title: 'Médias: Aritmética, Ponderada, Geométrica e Harmônica',
        channel: 'Professor Ferretto',
        youtubeId: 'X2V8h_Z89wY'
      },
      {
        title: 'Média Aritmética Simples e Ponderada',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'Z4V8h_Z89wY'
      }
    ]
  },
  'mat-13': {
    tecQuery: 'Polinômios valor numerico operações',
    videos: [
      {
        title: 'Polinômios: Conceito, Valor Numérico e Operações Básicas',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p9X8_W89wYg'
      },
      {
        title: 'Adição, Subtração e Multiplicação de Polinômios',
        channel: 'Professora Angela Matemática',
        youtubeId: 'p9Y8_X99wYg'
      }
    ]
  },
  'mat-14': {
    tecQuery: 'Produtos notáveis',
    videos: [
      {
        title: 'Produtos Notáveis - Quadrado da Soma, Quadrado da Diferença',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p0X8_W89wYg'
      },
      {
        title: 'Produtos Notáveis e Fórmulas de Fatoração',
        channel: 'Professor Ferretto',
        youtubeId: 'X3V8h_Z89wY'
      }
    ]
  },
  'mat-15': {
    tecQuery: 'Fatoração algébrica',
    videos: [
      {
        title: 'Fatoração de Expressões Algébricas - Todos os Casos',
        channel: 'Professor Ferretto',
        youtubeId: 'X3V8h_Z89wY'
      },
      {
        title: 'Fatoração Algébrica de Polinômios Fácil',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p2X8_W89wYg'
      }
    ]
  },
  'mat-16': {
    tecQuery: 'Radiciação simplificação propriedades',
    videos: [
      {
        title: 'Radiciação: Conceitos, Propriedades e Simplificação de Radicais',
        channel: 'Professor Ferretto',
        youtubeId: 'X4V8h_Z89wY'
      },
      {
        title: 'Radiciação - Teoria e Exercícios',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p3X8_W89wYg'
      }
    ]
  },
  'mat-17': {
    tecQuery: 'Equação de 1 grau e 2 grau Bhaskara',
    videos: [
      {
        title: 'Equações de 2º Grau e Fórmula de Bhaskara para Concursos',
        channel: 'Professor Ferretto',
        youtubeId: 'X5V8h_Z89wY'
      },
      {
        title: 'Como Resolver Equação do 1º Grau Facilmente',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p4X8_W89wYg'
      }
    ]
  },
  'mat-18': {
    tecQuery: 'Sistemas de equações primeiro grau substituição adição',
    videos: [
      {
        title: 'Sistemas de Equações do 1º Grau - Método da Adição e Substituição',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p1X8_W89wYg'
      },
      {
        title: 'Sistemas Lineares com Duas Incógnitas',
        channel: 'Professora Angela Matemática',
        youtubeId: 'p5Y8_X89wYg'
      }
    ]
  },
  'mat-19': {
    tecQuery: 'Sistemas de equações segundo grau',
    videos: [
      {
        title: 'Sistemas de Equações do 2º Grau - Passo a Passo',
        channel: 'Professor Ferretto',
        youtubeId: 'X6V8h_Z89wY'
      },
      {
        title: 'Sistemas não-lineares e do segundo grau',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p6X8_W89wYg'
      }
    ]
  },
  'mat-20': {
    tecQuery: 'Angulos classificacao conceitos geometria',
    videos: [
      {
        title: 'Ângulos: O que são, Classificação e Unidades de Medidas',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p2X8_W89wYg'
      },
      {
        title: 'Ângulos Complementares, Suplementares e Opostos pelo Vértice',
        channel: 'Professor Ferretto',
        youtubeId: 'X7V8h_Z89wY'
      }
    ]
  },
  'mat-21': {
    tecQuery: 'Ângulos problemas geometria',
    videos: [
      {
        title: 'Exercícios Comentados de Ângulos na Geometria Plana',
        channel: 'Professora Angela Matemática',
        youtubeId: 'p3Y8_X99wYg'
      },
      {
        title: 'Problemas de Ângulos Relacionados a Retas Paralelas Cortadas por Transversal',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p3X8_W89wYg'
      }
    ]
  },
  'mat-22': {
    tecQuery: 'Polígonos angulos diagonais geometria plana',
    videos: [
      {
        title: 'Polígonos: Número de Diagonais, Soma de Ângulos Internos e Externos',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p4X8_W89wYg'
      },
      {
        title: 'Polígonos Regulares - Teoria e Exercícios Resolvidos',
        channel: 'Professor Ferretto',
        youtubeId: 'X8V8h_Z89wY'
      }
    ]
  },
  'mat-23': {
    tecQuery: 'Triangulos classificação ângulos internos Tales',
    videos: [
      {
        title: 'Triângulos: Classificação de Lados e Ângulos (Teorema de Tales)',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p5X8_W89wYg'
      },
      {
        title: 'Triângulos: Lei Angular e Soma dos Ângulos Internos',
        channel: 'Professora Angela Matemática',
        youtubeId: 'p6Y8_X99wYg'
      }
    ]
  },
  'mat-24': {
    tecQuery: 'Semelhança de triângulos pontos notaveis mediatriz mediana bissetriz',
    videos: [
      {
        title: 'Semelhança de Triângulos - Critérios e Casos',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p6X8_W89wYg'
      },
      {
        title: 'Pontos Notáveis do Triângulo (Baricentro, Incentro, Ortocentro, Circuncentro)',
        channel: 'Professor Ferretto',
        youtubeId: 'X9V8h_Z89wY'
      }
    ]
  },
  'mat-25': {
    tecQuery: 'Relações métricas triângulo retângulo teorema de Pitágoras',
    videos: [
      {
        title: 'Relações Métricas no Triângulo Retângulo e Teorema de Pitágoras',
        channel: 'Professor Ferretto',
        youtubeId: 'X7V8h_Z89wY'
      },
      {
        title: 'Teorema de Pitágoras e Aplicações em Problemas',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p7X8_W89wYg'
      }
    ]
  },
  'mat-26': {
    tecQuery: 'Relações trigonométricas no triângulo retângulo seno cosseno tangente',
    videos: [
      {
        title: 'Razões Trigonométricas no Triângulo Retângulo (Seno, Cosseno e Tangente)',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p7X8_W89wYg'
      },
      {
        title: 'Trigonometria Básica e Tabela dos Ângulos Notáveis (30º, 45º, 60º)',
        channel: 'Professor Ferretto',
        youtubeId: 'X8V8h_Z89wY'
      }
    ]
  },
  'mat-27': {
    tecQuery: 'Lei dos senos lei dos cossenos triângulo qualquer',
    videos: [
      {
        title: 'Lei dos Senos e Lei dos Cossenos em Qualquer Triângulo',
        channel: 'Professor Ferretto',
        youtubeId: 'X8V8h_Z89wZ'
      },
      {
        title: 'Lei dos Senos e Lei dos Cossenos - Exercícios Comentados',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p8X8_W89wYg'
      }
    ]
  },
  'mat-28': {
    tecQuery: 'Poligonos regulares inscritos lado apotema perimetro',
    videos: [
      {
        title: 'Polígonos Regulares Inscritos e Circunscritos (Lado e Apótema)',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p8X8_W89wYh'
      },
      {
        title: 'Apótema e Lado de Triângulos, Quadrados e Hexágonos na Circunferência',
        channel: 'Professora Angela Matemática',
        youtubeId: 'p9Y8_X99wYg'
      }
    ]
  },
  'mat-29': {
    tecQuery: 'Área das figuras planas quadrado triangulo circulo losango trapezio',
    videos: [
      {
        title: 'Área de Figuras Planas: Retângulo, Quadrado, Triângulo, Trapézio, Losango, Círculo',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p9X8_W89wYh'
      },
      {
        title: 'Áreas de Figuras Planas para Concursos',
        channel: 'Professor Ferretto',
        youtubeId: 'X9V8h_Z89wY'
      }
    ]
  },
  'mat-30': {
    tecQuery: 'Circunferência círculo arcos angulos inscritos',
    videos: [
      {
        title: 'Comprimento de Circunferência e Ângulos na Circunferência',
        channel: 'Gis com Giz Matemática',
        youtubeId: 'p0X8_W89wYh'
      },
      {
        title: 'Ângulos Inscritos e Centrais na Circunferência',
        channel: 'Professora Angela Matemática',
        youtubeId: 'p0Y8_X99wYg'
      }
    ]
  }
};
