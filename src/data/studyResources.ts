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
  // LINGUA PORTUGUESA - COMPREENSAO E INTERPRETACAO DE TEXTOS
  'lp-comp-01': {
    tecQuery: 'Texto, contexto e interlocução',
    videos: [
      {
        title: 'CNU | Compreensao de Textos',
        channel: 'Professor Noslen',
        youtubeId: 'IYlsViWKZAA'
      },
      {
        title: 'COMO FAZER A INTERPRETACAO DE UM TEXTO? (Interpretacao para Concursos)',
        channel: 'Professora Pamba',
        youtubeId: '6mSmMK6Ksk8'
      }
    ]
  },
  'lp-comp-02': {
    tecQuery: 'Coesão e Coerência textual',
    videos: [
      {
        title: 'Coesao e Coerencia [Prof. Noslen]',
        channel: 'Professor Noslen',
        youtubeId: 'IIU6i3UXyi0'
      },
      {
        title: 'COESAO E COERENCIA: APRENDA AGORA - Aula 15 - Profa. Pamba',
        channel: 'Professora Pamba',
        youtubeId: 'voO8FT-9q6Y'
      }
    ]
  },
  'lp-comp-03': {
    tecQuery: 'Gêneros e tipos textuais',
    videos: [
      {
        title: 'Generos Textuais [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: 'Ucjv4LT8CSg'
      },
      {
        title: 'GENEROS TEXTUAIS x TIPOS TEXTUAIS: QUAL A DIFERENCA? - Profa. Pamba',
        channel: 'Professora Pamba',
        youtubeId: 'J-MOSikttwo'
      }
    ]
  },
  'lp-comp-04': {
    tecQuery: 'Sinonímia, antonímia, ambiguidade, polissemia',
    videos: [
      {
        title: 'Semantica [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: 'dfkvdIGqZvs'
      },
      {
        title: 'POLISSEMIA E AMBIGUIDADE: DIFERENCAS - Profa. Pamba - Semantica',
        channel: 'Professora Pamba',
        youtubeId: 'OkiVG0_-Fn8'
      }
    ]
  },
  'lp-comp-05': {
    tecQuery: 'Figuras de linguagem conotação e denotação',
    videos: [
      {
        title: 'Figuras de Linguagem - Aula 01 [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: 'n0e75nRstcU'
      },
      {
        title: 'SENTIDO DENOTATIVO X CONOTATIVO (FIGURADO x REAL) - Profa. Pamba',
        channel: 'Professora Pamba',
        youtubeId: 'tFmSm1Gulig'
      }
    ]
  },

  // LINGUA PORTUGUESA - TOPICOS LINGUISTICOS
  'lp-ling-01': {
    tecQuery: 'Variação linguística e norma culta',
    videos: [
      {
        title: 'Variacao Linguistica - AULA GRATUITA [Prof. Noslen]',
        channel: 'Professor Noslen',
        youtubeId: 'G3F7sRfK9FE'
      },
      {
        title: 'Variacao Linguistica [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: '6fBOVygtNoU'
      }
    ]
  },
  'lp-ling-02': {
    tecQuery: 'Estrutura e formação das palavras',
    videos: [
      {
        title: 'Formacao de Palavras por Composicao [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: 'U_nRXQh5L40'
      },
      {
        title: 'Formacao de Palavras por Derivacao [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: '98qXxXx51T0'
      }
    ]
  },
  'lp-ling-03': {
    tecQuery: 'Classes de palavras morfologia termos da oração',
    videos: [
      {
        title: 'Classe de Palavras [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: 's8a6eXncWY8'
      },
      {
        title: 'O que e SUBSTANTIVO? Aprenda os TIPOS e CLASSIFICACOES de forma FACIL!',
        channel: 'Portugues com Leticia',
        youtubeId: 'BSGIAhRJGxw'
      }
    ]
  },
  'lp-ling-04': {
    tecQuery: 'Orações coordenadas e subordinadas conectivos',
    videos: [
      {
        title: 'O QUE sao ORACOES COORDENADAS SINDETICAS? | Professor Noslen',
        channel: 'Professor Noslen',
        youtubeId: 'VkQXlNXg2P0'
      },
      {
        title: 'Oracoes Subordinadas Substantivas [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: '_kzTFOzf-_w'
      }
    ]
  },
  'lp-ling-05': {
    tecQuery: 'Pontuação vírgula',
    videos: [
      {
        title: 'Pontuacao - virgula, ponto e virgula e dois pontos [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: '9tdpcfdr244'
      },
      {
        title: 'VIRGULA - Casos OBRIGATORIOS | Aprenda de verdade e nao erre nunca mais!',
        channel: 'Portugues com Leticia',
        youtubeId: 'zONGXynBdaY'
      }
    ]
  },
  'lp-ling-06': {
    tecQuery: 'Concordância regência verbal nominal',
    videos: [
      {
        title: 'Concordancia Verbal - Aula 01 [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: '4ZJnTqTk4_Y'
      },
      {
        title: 'Concordancia Verbal - Revisao Enem com Prof. Noslen',
        channel: 'Professor Noslen',
        youtubeId: 'hGwai_dUosA'
      }
    ]
  },
  'lp-ling-07': {
    tecQuery: 'Novo acordo ortográfico hifen acentuação',
    videos: [
      {
        title: 'Novo Acordo Ortografico | Parte 1 [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: 'LhW_Ee3Wkms'
      },
      {
        title: 'Novo Acordo Ortografico - Parte 2 [Prof Noslen]',
        channel: 'Professor Noslen',
        youtubeId: '2Ou4ApRLj88'
      }
    ]
  },

  // MATEMATICA
  'mat-01': {
    tecQuery: 'Operações básicas problemas adição subtração multiplicação divisão',
    videos: [
      {
        title: 'COMO RESOLVER PROBLEMAS ENVOLVENDO AS QUATRO OPERACOES',
        channel: 'Professor Ferretto',
        youtubeId: '4PqECm1OA7U'
      },
      {
        title: 'AULA: AS QUATRO OPERACOES FUNDAMENTAIS DA MATEMATICA',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'ohiYUg6Gcfk'
      }
    ]
  },
  'mat-02': {
    tecQuery: 'Frações operações problemas',
    videos: [
      {
        title: 'EXERCICIOS DE FRACAO - MATEMATICA BASICA',
        channel: 'Gis com Giz Matematica',
        youtubeId: '9DpDTkRxcCs'
      },
      {
        title: 'FRACOES (Parte 2): Operacoes Basicas | Matematica Basica - Aula 5',
        channel: 'Professor Ferretto',
        youtubeId: 'SgJpB78R7x0'
      }
    ]
  },
  'mat-03': {
    tecQuery: 'Números decimais operações problemas',
    videos: [
      {
        title: 'Matematica Basica - Aula 14 - Numeros decimais (parte 1)',
        channel: 'Professor Ferretto',
        youtubeId: 'lA1lVOBTSlQ'
      },
      {
        title: 'ADICAO COM NUMEROS DECIMAIS | NUMEROS DECIMAIS',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'cgHJZsVNqOI'
      }
    ]
  },
  'mat-04': {
    tecQuery: 'Potenciação propriedades expoente',
    videos: [
      {
        title: 'POTENCIACAO: Definicao e Propriedades | Matematica Basica - Aula 6',
        channel: 'Professor Ferretto',
        youtubeId: '4Vfw1XiHTpM'
      },
      {
        title: 'POTENCIAS e PROPRIEDADES das potencias | Matematica Basica',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'dGOhsZqCJKc'
      }
    ]
  },
  'mat-05': {
    tecQuery: 'Raiz quadrada radiciação aproximação',
    videos: [
      {
        title: 'RADICIACAO: Definicao e Propriedades | Matematica Basica - Aula 7',
        channel: 'Professor Ferretto',
        youtubeId: 'QmIjZgKhAEo'
      },
      {
        title: 'RAIZ QUADRADA APROXIMADA | RAIZ QUADRADA NAO EXATA',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'S96R5Sm4clE'
      }
    ]
  },
  'mat-06': {
    tecQuery: 'Expressões numéricas números reais',
    videos: [
      {
        title: 'EXPRESSOES NUMERICAS: Ordem nas Operacoes | Matematica Basica - Aula 3',
        channel: 'Professor Ferretto',
        youtubeId: 'BhDm2qGy780'
      },
      {
        title: 'EXPRESSOES NUMERICAS | MATEMATICA BASICA',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'fG3tzCME95Y'
      }
    ]
  },
  'mat-07': {
    tecQuery: 'Sistemas de medidas comprimento superficie volume capacidade',
    videos: [
      {
        title: 'MEDIDAS DE COMPRIMENTO - CONVERSAO DE UNIDADES DE MEDIDA #01',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'dHr5phd_qL8'
      },
      {
        title: 'MEDIDAS DE AREA - CONVERSAO DE UNIDADES DE MEDIDA DE AREA #02',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'LWH7LNhbxPM'
      }
    ]
  },
  'mat-08': {
    tecQuery: 'Razão e proporção problemas',
    videos: [
      {
        title: 'RAZAO E PROPORCAO (Parte 1): Propriedades e Conceitos | Matematica Basica - Aula 24',
        channel: 'Professor Ferretto',
        youtubeId: 'uIulBEk8gcM'
      },
      {
        title: 'RAZAO E PROPORCAO - Prof. Gis #01',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'Kf_YzZ0CnIs'
      }
    ]
  },
  'mat-09': {
    tecQuery: 'Divisão proporcional direta inversa',
    videos: [
      {
        title: 'RAZAO E PROPORCAO (Parte 2): Divisoes Proporcionais | Matematica Basica - Aula 25',
        channel: 'Professor Ferretto',
        youtubeId: '6Dsta1eZ1BA'
      },
      {
        title: 'DIVISAO PROPORCIONAL - Partes Diretamente e Inversamente Proporcionais | MAB #59',
        channel: 'Matematica Rio',
        youtubeId: 'IJ8gGFGtSYU'
      }
    ]
  },
  'mat-10': {
    tecQuery: 'Regra de três simples composta',
    videos: [
      {
        title: 'REGRA DE TRES SIMPLES: Grandezas Proporcionais | Matematica Basica - Aula 26',
        channel: 'Professor Ferretto',
        youtubeId: 'alLifth7gxE'
      },
      {
        title: 'REGRA DE TRES SIMPLES - Prof. Gis / Matematica',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'mnle8NcUYkQ'
      }
    ]
  },
  'mat-11': {
    tecQuery: 'Porcentagem problemas',
    videos: [
      {
        title: 'PORCENTAGEM: Teoria e Exemplos | Matematica Basica - Aula 29',
        channel: 'Professor Ferretto',
        youtubeId: 'CERiIwParX4'
      },
      {
        title: 'Questao de CONCURSO | Problema de PORCENTAGEM | Explicacao detalhada',
        channel: 'Gis com Giz Matematica',
        youtubeId: '4G4fxYdgsqY'
      }
    ]
  },
  'mat-12': {
    tecQuery: 'Média aritmética ponderada estatistica',
    videos: [
      {
        title: 'MEDIA ARITMETICA SIMPLES | MEDIANA E MODA',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'wMjNqebDLu4'
      },
      {
        title: 'MEDIA PONDERADA',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'JQ91E7UeQ3g'
      }
    ]
  },
  'mat-13': {
    tecQuery: 'Polinômios valor numerico operações',
    videos: [
      {
        title: 'Polinomios | Grau | Valor Numerico | Raiz',
        channel: 'Professor Ferretto',
        youtubeId: 'DUk6IShk-Hc'
      },
      {
        title: 'VALOR NUMERICO DA EXPRESSAO ALGEBRICA',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'LY37iyVRLhU'
      }
    ]
  },
  'mat-14': {
    tecQuery: 'Produtos notáveis',
    videos: [
      {
        title: 'PRODUTOS NOTAVEIS: Principais Casos | Matematica Basica - Aula 9',
        channel: 'Professor Ferretto',
        youtubeId: '_3YQvVKbqn0'
      },
      {
        title: 'PRODUTOS NOTAVEIS. QUADRADO DA SOMA DE DOIS TERMOS #01',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'fk8CmDJxWC0'
      }
    ]
  },
  'mat-15': {
    tecQuery: 'Fatoração algébrica',
    videos: [
      {
        title: 'Matematica Basica - Aula 21 - Fatoracao de expressoes algebricas (parte 1)',
        channel: 'Professor Ferretto',
        youtubeId: 'gpLUtjncoSo'
      },
      {
        title: 'FATORACAO de EXPRESSOES ALGEBRICAS | FATOR COMUM em EVIDENCIA | Aula 1',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'bHIP8Ei5PFA'
      }
    ]
  },
  'mat-16': {
    tecQuery: 'Radiciação simplificação propriedades',
    videos: [
      {
        title: 'RADICIACAO: Definicao e Propriedades | Matematica Basica - Aula 7',
        channel: 'Professor Ferretto',
        youtubeId: 'QmIjZgKhAEo'
      },
      {
        title: 'PROPRIEDADES DOS RADICAIS | RADICIACAO',
        channel: 'Gis com Giz Matematica',
        youtubeId: '494171csjuw'
      }
    ]
  },
  'mat-17': {
    tecQuery: 'Equação de 1 grau e 2 grau Bhaskara',
    videos: [
      {
        title: 'EQUACAO DO 2o GRAU (Parte 1): Bhaskara e Soma e Produto | Matematica Basica - Aula 16',
        channel: 'Professor Ferretto',
        youtubeId: 'toAaUBwitFE'
      },
      {
        title: 'FORMULA DE BHASKARA | COMO FAZER EQUACAO DO 2o GRAU',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'LNLvMo1PWok'
      }
    ]
  },
  'mat-18': {
    tecQuery: 'Sistemas de equações primeiro grau substituição adição',
    videos: [
      {
        title: 'Sistema de equacoes do 1o GRAU',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'OTfI_h9ONUo'
      },
      {
        title: 'SISTEMA DE EQUACOES do 1o grau Metodo da ADICAO | Matematica Basica',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'Wk2ofyakSTs'
      }
    ]
  },
  'mat-19': {
    tecQuery: 'Sistemas de equações segundo grau',
    videos: [
      {
        title: 'SISTEMA DE EQUACOES do 2o grau SUBSTITUICAO | 9o ano',
        channel: 'Gis com Giz Matematica',
        youtubeId: '7CvjlSivFlQ'
      },
      {
        title: 'Equacao do 2o Grau - Questao 1',
        channel: 'Professor Ferretto',
        youtubeId: 'Uehm1AR8qiM'
      }
    ]
  },
  'mat-20': {
    tecQuery: 'Angulos classificacao conceitos geometria',
    videos: [
      {
        title: 'Geometria Plana: Introducao - Angulos (Aula 1)',
        channel: 'Professor Ferretto',
        youtubeId: '0CnUdzmpO8E'
      },
      {
        title: 'ANGULOS - DEFINICAO E TIPOS DE ANGULOS | RETO, NULO, AGUDO, OBTUSO',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'nAvqZSglTmA'
      }
    ]
  },
  'mat-21': {
    tecQuery: 'Ângulos problemas geometria',
    videos: [
      {
        title: 'ANGULOS CORRESPONDENTES | RETAS PARALELAS CORTADAS POR UMA TRANSVERSAL',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'GT0vBg9h20M'
      },
      {
        title: 'ANGULOS FORMADOS POR RETAS PARALELAS CORTADAS POR UMA TRANSVERSAL - EXERCICIOS',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'P4-NL2FBtK0'
      }
    ]
  },
  'mat-22': {
    tecQuery: 'Polígonos angulos diagonais geometria plana',
    videos: [
      {
        title: 'ANGULO INTERNO de um POLIGONO | Prof. Gis #08',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'M-fKfmH1aL8'
      },
      {
        title: 'SOMA DOS ANGULOS EXTERNOS DE UM POLIGONO CONVEXO | Prof. Gis #10',
        channel: 'Gis com Giz Matematica',
        youtubeId: '7pADvVbNcsg'
      }
    ]
  },
  'mat-23': {
    tecQuery: 'Triangulos classificação ângulos internos Tales',
    videos: [
      {
        title: 'Geometria Plana: Classificacao dos Triangulos (Aula 6)',
        channel: 'Professor Ferretto',
        youtubeId: '3x920GHyF4g'
      },
      {
        title: 'Triangulos #03 - Lei angular de Tales e Teorema do angulo externo',
        channel: 'Professor Ferretto',
        youtubeId: '7wfEaCR5bO4'
      }
    ]
  },
  'mat-24': {
    tecQuery: 'Semelhança de triângulos pontos notaveis mediatriz mediana bissetriz',
    videos: [
      {
        title: 'SEMELHANCA DE TRIANGULOS | RAZAO DE SEMELHANCA | TEOREMA DE TALES | 9o ano',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'TeKvhnJgNYU'
      },
      {
        title: 'BISSETRIZ | Prof. Gis',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'rDDC98e0ujw'
      }
    ]
  },
  'mat-25': {
    tecQuery: 'Relações métricas triângulo retângulo teorema de Pitágoras',
    videos: [
      {
        title: 'Geometria Plana: Triangulo Retangulo - Relacoes Metricas (Aula 10)',
        channel: 'Professor Ferretto',
        youtubeId: 'f4JBVvr72MQ'
      },
      {
        title: 'RELACOES METRICAS NO TRIANGULO RETANGULO | Prof. Gis',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'mFszQZAke7o'
      }
    ]
  },
  'mat-26': {
    tecQuery: 'Relações trigonométricas no triângulo retângulo seno cosseno tangente',
    videos: [
      {
        title: 'SENO, COSSENO E TANGENTE - TRIGONOMETRIA NO TRIANGULO RETANGULO | Prof. Gis',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'D-E_A04ReTE'
      },
      {
        title: 'Razoes trigonometricas no triangulo retangulo',
        channel: 'Professor Ferretto',
        youtubeId: 'UWt_mc84t38'
      }
    ]
  },
  'mat-27': {
    tecQuery: 'Lei dos senos lei dos cossenos triângulo qualquer',
    videos: [
      {
        title: 'Lei dos Senos - GEOMETRIA PLANA (Aula 14)',
        channel: 'Professor Ferretto',
        youtubeId: 't6zTP7fU8lA'
      },
      {
        title: 'AULAO: TRIGONOMETRIA - LEI DOS SENOS E LEI DOS COSSENOS - ENEM 2020',
        channel: 'Professor Ferretto',
        youtubeId: 'qZtwJEhjg_4'
      }
    ]
  },
  'mat-28': {
    tecQuery: 'Poligonos regulares inscritos lado apotema perimetro',
    videos: [
      {
        title: 'POLIGONOS REGULARES | GEOMETRIA PLANA | Prof. Gis #05',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'B-1xL2ym7SQ'
      },
      {
        title: 'EXERCICIOS RESOLVIDOS SOBRE LADO E APOTEMA DE POLIGONOS REGULARES',
        channel: 'Gis com Giz Matematica',
        youtubeId: '4ckpjxBHN1o'
      }
    ]
  },
  'mat-29': {
    tecQuery: 'Área das figuras planas quadrado triangulo circulo losango trapezio',
    videos: [
      {
        title: 'AREA DO TRIANGULO | AREA DE FIGURAS PLANAS | Prof. Gis',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'UXoBHQBT5OE'
      },
      {
        title: 'AREA DO RETANGULO | AREA DE FIGURAS PLANAS | MATEMATICA | Prof. Gis',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'aIKxhaxynJ8'
      }
    ]
  },
  'mat-30': {
    tecQuery: 'Circunferência círculo arcos angulos inscritos',
    videos: [
      {
        title: 'Geometria Plana: Angulos na Circunferencia - Parte 1 (Aula 23)',
        channel: 'Professor Ferretto',
        youtubeId: 'NKEPE99XOkQ'
      },
      {
        title: 'ANGULO CENTRAL E INSCRITO | ANGULOS NA CIRCUNFERENCIA',
        channel: 'Gis com Giz Matematica',
        youtubeId: 'H06B-VG2i3g'
      }
    ]
  }
};
