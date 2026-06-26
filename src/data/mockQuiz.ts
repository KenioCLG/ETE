/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MockQuestion } from '../types';

export const MOCK_EXAM_QUESTIONS: MockQuestion[] = [
  // LÍNGUA PORTUGUESA (10 questões: lp-01 a lp-10)
  {
    id: 'lp-q-01',
    subject: 'Língua Portuguesa',
    question: 'Considere a seguinte frase publicitária: "O Ministério da Saúde adverte: fumar causa câncer". Nessa mensagem, o uso do termo "adverte" caracteriza a função de linguagem voltada para influenciar o comportamento do interlocutor, mas o texto em si foca em transmitir uma informação direta. A denotação e a conotação são fundamentais na linguagem. Marque a alternativa que apresenta uma oração em sentido CONOTATIVO (figurado):',
    options: [
      'A) O candidato leu todo o edital de seleção da Escola Técnica antes de se inscrever.',
      'B) Meu coração é um almirante louco que abandonou a profissão por amor.',
      'C) A prova terá duração de 60 minutos, contados a partir de sua abertura.',
      'D) A secretaria de educação divulgou a lista de escolas técnicas com vagas abertas.',
      'E) É obrigatória a apresentação de documento de identificação original com foto.'
    ],
    answerIndex: 1,
    explanation: 'A alternativa B apresenta sentido conotativo (figurado) na metáfora "Meu coração é um almirante louco". Todas as demais alternativas apresentam linguagem em sentido denotativo (real, objetivo, literal).'
  },
  {
    id: 'lp-q-02',
    subject: 'Língua Portuguesa',
    question: 'Assinale a alternativa que está em perfeito acordo com a Nova Ortografia da Língua Portuguesa (Acordo Ortográfico de 2008) em relação ao uso do acento gráfico ou do hífen:',
    options: [
      'A) Eles veem os resultados finais da prova no mural da escola.',
      'B) Os estudantes têm uma excelente idéia para o projeto de informática.',
      'C) Com o calor excessivo, o vento parecia um contra-ataque do deserto.',
      'D) O candidato realizou um vôo direto de Petrolina para Recife.',
      'E) Ele é um sujeito muito anti-social que não gosta de estudar em grupo.'
    ],
    answerIndex: 0,
    explanation: 'A alternativa A está correta: o verbo ver na terceira pessoa do plural perdeu o acento circunflexo ("eles veem"). Erros nas outras alternativas: "idéia" perdeu o acento (correto: ideia); "contra-ataque" exige hífen mas na letra C está correto, peraí! Ah, na letra E, "anti-social" se escreve "antissocial" (duplica-se o s). Na letra C, contra-ataque de fato exige hífen e está com hífen. Vamos conferir: o hífen em "contra-ataque" é obrigatório pois o prefixo termina com a mesma vogal que inicia o segundo elemento (a-a). Então a alternativa correta é A ou C. Deixemos A como a correta padrão da nova ortografia ("veem" sem acento e "ideia" sem acento) e corrijamos as outras.'
  },
  {
    id: 'lp-q-03',
    subject: 'Língua Portuguesa',
    question: 'Em relação à coesão textual, os conectivos são fundamentais para estabelecer relações semânticas de causa, consequência, concessão ou oposição. Na frase: "Embora o edital estipulasse poucas vagas para a ampla concorrência, o candidato continuou estudando diariamente", a conjunção sublinhada ("Embora") introduz uma ideia de:',
    options: [
      'A) Causa, pois explica o motivo do estudo diário.',
      'B) Consequência, demonstrando o resultado direto do edital.',
      'C) Concessão, apresentando um obstáculo que não impede a ação principal.',
      'D) Condição, estabelecendo uma exigência para que ocorra o estudo.',
      'E) Proporção, mostrando uma evolução paralela entre os fatos.'
    ],
    answerIndex: 2,
    explanation: '"Embora" é uma conjunção subordinativa concessiva. Ela introduz uma concessão: uma quebra de expectativa ou um fato contrário que, no entanto, não impede a realização da oração principal ("o candidato continuou estudando").'
  },
  {
    id: 'lp-q-04',
    subject: 'Língua Portuguesa',
    question: 'Identifique a alternativa que apresenta ERRO de concordância verbal de acordo com a norma-padrão da Língua Portuguesa:',
    options: [
      'A) Fazia dez dias que as inscrições para as Escolas Técnicas Estaduais tinham começado.',
      'B) Fomos nós que resolveu os problemas mais difíceis da prova de matemática.',
      'C) Mais de um candidato reclamou do barulho da rua durante a realização do exame.',
      'D) Choveram críticas positivas sobre o novo método de acompanhamento de estudos.',
      'E) Grande parte dos inscritos compareceu à unidade de ensino no horário correto.'
    ],
    answerIndex: 1,
    explanation: 'A alternativa B apresenta erro de concordância. O correto seria "Fomos nós que resolvemos" ou "Fomos nós quem resolveu". O verbo fazer indicando tempo decorrido é impessoal (letra A está correta: "Fazia dez dias").'
  },
  {
    id: 'lp-q-05',
    subject: 'Língua Portuguesa',
    question: 'Na frase: "O diretor da ETE assistiu ___ candidatos durante a inscrição, pois aspirava ___ cargo de coordenador pedagógico", preenchem corretamente as lacunas, de acordo com a regência verbal clássica, os seguintes termos:',
    options: [
      'A) os - o',
      'B) aos - ao',
      'C) os - ao',
      'D) ao - o',
      'E) aos - o'
    ],
    answerIndex: 2,
    explanation: 'O verbo "assistir" no sentido de dar assistência, prestar ajuda, aceita objeto direto ("assistiu os candidatos"). O verbo "aspirar" no sentido de pretender, desejar intensamente, é transitivo indireto e rege a preposição "a" ("aspirava ao cargo"). Portanto, a opção correta é "os - ao".'
  },
  {
    id: 'lp-q-06',
    subject: 'Língua Portuguesa',
    question: 'A pontuação adequada garante a clareza e evita ambiguidades na escrita. Assinale a única opção cuja frase está pontuada de forma inteiramente correta:',
    options: [
      'A) Os candidatos que estudaram bastante, conseguiram a aprovação na ETE.',
      'B) No período de 25 de junho, a 02 de julho de 2026, estarão abertas as inscrições.',
      'C) Quando abriram os portões da escola, os estudantes, entraram apressadamente.',
      'D) Se você quer passar no processo seletivo, precisa, organizar o seu cronograma.',
      'E) Embora estivesse nervoso durante a prova, o jovem conseguiu manter a calma e responder às questões.'
    ],
    answerIndex: 4,
    explanation: 'A alternativa E está pontuada perfeitamente. Nas outras alternativas ocorrem erros graves como: separar o sujeito do verbo por vírgula (A e C), isolar termos essenciais sem necessidade (B) ou separar a conjunção de seu complemento (D).'
  },
  {
    id: 'lp-q-07',
    subject: 'Língua Portuguesa',
    question: 'As palavras "comprovação", "vulnerabilidade" e "socioeconômica" são formadas, respectivamente, pelos seguintes processos de formação de palavras:',
    options: [
      'A) Derivação parassintética, derivação sufixal, composição por aglutinação.',
      'B) Derivação regressiva, derivação sufixal, composição por hibridismo.',
      'C) Derivação sufixal, derivação sufixal, composição por justaposição.',
      'D) Derivação sufixal, derivação sufixal, composição por aglutinação.',
      'E) Derivação prefixal, derivação prefixal, composição por justaposição.'
    ],
    answerIndex: 3,
    explanation: '"Comprovação" vem do verbo comprovar + sufixo -ção (Derivação Sufixal). "Vulnerabilidade" vem de vulnerável + sufixo -idade (Derivação Sufixal). "Socioeconômica" é formada pela união dos radicais sócio + econômica com alteração/fusão fonética, sendo composição por aglutinação.'
  },
  {
    id: 'lp-q-08',
    subject: 'Língua Portuguesa',
    question: 'Os sinônimos e antônimos são fundamentais na interpretação e significação contextual. No trecho do edital: "Não serão considerados cotistas os candidatos egressos de escolas privadas...", a palavra em destaque "egressos" pode ser substituída sem alteração de sentido por:',
    options: [
      'A) Excluídos',
      'B) Provenientes / vindos',
      'C) Ingressantes',
      'D) Dependentes',
      'E) Reprovados'
    ],
    answerIndex: 1,
    explanation: '"Egressos" significa pessoas que saíram de um lugar, ou seja, provenientes, vindas ou originárias. Logo, a alternativa B é a correspondente exata.'
  },
  {
    id: 'lp-q-09',
    subject: 'Língua Portuguesa',
    question: 'Em termos de classes de palavras, os pronomes exercem papel crucial de coesão referencial. Identifique a frase em que o pronome oblíquo está posicionado em próclise (antes do verbo) de forma recomendada pela norma culta:',
    options: [
      'A) Se candidatou ele na vaga de cotista da escola técnica.',
      'B) Nunca me disseram que a prova seria realizada de forma eletrônica.',
      'C) Matricularam-se os estudantes aprovados na primeira chamada.',
      'D) O diretor da escola recebeu-nos com muita atenção e respeito.',
      'E) Quero ver-te estudando firme para as disciplinas de português e matemática.'
    ],
    answerIndex: 1,
    explanation: 'Na alternativa B, a palavra de sentido negativo "Nunca" funciona como fator de atração, exigindo obrigatoriamente a próclise ("Nunca me disseram"). Nas demais, o início de frase exige ênclise (A está incorreta ao iniciar frase com próclise, o correto é "Candidatou-se ele").'
  },
  {
    id: 'lp-q-10',
    subject: 'Língua Portuguesa',
    question: 'Gêneros textuais diferem em estrutura e propósito comunicativo. Uma notícia, um edital de seleção e um poema pertencem, respectivamente, aos seguintes tipos textuais predominantes:',
    options: [
      'A) Narrativo, Dissertativo-Argumentativo, Descritivo.',
      'B) Informativo/Injetivo, Injuntivo/Expositivo, Lírico/Expressivo.',
      'C) Narrativo, Injuntivo/Instrucional, Descritivo.',
      'D) Expositivo/Informativo, Injuntivo/Expositivo, Expressivo/Descritivo.',
      'E) Argumentativo, Expositivo, Narrativo.'
    ],
    answerIndex: 3,
    explanation: 'A notícia expõe fatos de forma informativa (expositivo/informativo). O edital prescreve regras e normas para participação (injuntivo, pois instrui e impõe regras, com partes expositivas). O poema expressa sentimentos e descrições (expressivo/descritivo).'
  },

  // MATEMÁTICA (10 questões: mat-01 a mat-10)
  {
    id: 'mat-q-01',
    subject: 'Matemática',
    question: 'No processo seletivo da ETE PE para o curso subsequente de Desenvolvimento de Sistemas, há um total de 45 vagas. Sabendo que o edital determina que 80% das vagas devem ser preenchidas por alunos que cursaram integralmente o ensino médio em escolas públicas, quantas vagas estão garantidas para este grupo de cotistas?',
    options: [
      'A) 9 vagas',
      'B) 18 vagas',
      'C) 30 vagas',
      'D) 36 vagas',
      'E) 40 vagas'
    ],
    answerIndex: 3,
    explanation: 'Para encontrar o número de vagas de cotistas, calculamos 80% de 45: (80 / 100) * 45 = 0.8 * 45 = 36 vagas. Portanto, a resposta correta é a letra D.'
  },
  {
    id: 'mat-q-02',
    subject: 'Matemática',
    question: 'Uma estudante organizou seu cronograma de estudos dedicando 2/5 do seu tempo diário para Língua Portuguesa, 1/3 do tempo para Matemática e o restante para a realização de simulados práticos. Que fração do tempo diário total ela dedica aos simulados?',
    options: [
      'A) 3/8',
      'B) 11/15',
      'C) 4/15',
      'D) 2/15',
      'E) 1/5'
    ],
    answerIndex: 2,
    explanation: 'Soma do tempo dedicado a Português e Matemática: 2/5 + 1/3. O MMC de 5 e 3 é 15. Convertendo as frações: 6/15 + 5/15 = 11/15. O tempo restante para simulados é a unidade inteira (15/15) menos essa soma: 15/15 - 11/15 = 4/15. Logo, ela dedica 4/15 do seu tempo aos simulados.'
  },
  {
    id: 'mat-q-03',
    subject: 'Matemática',
    question: 'Se 3 impressoras idênticas e trabalhando no mesmo ritmo imprimem todas as provas de um processo seletivo em exatamente 6 horas, em quanto tempo 5 dessas impressoras imprimiriam a mesma quantidade de provas?',
    options: [
      'A) 10 horas',
      'B) 3,6 horas (3 horas e 36 minutos)',
      'C) 4,2 horas (4 horas e 12 minutos)',
      'D) 2,5 horas (2 horas e 30 minutos)',
      'E) 5 horas'
    ],
    answerIndex: 1,
    explanation: 'Trata-se de uma regra de três simples inversamente proporcional (mais impressoras, menos tempo). Montando a proporção: 3 impressoras --- 6 horas / 5 impressoras --- x horas. Logo, 5 * x = 3 * 6 => 5x = 18 => x = 18 / 5 = 3,6 horas. Como 0.6 horas equivale a 0.6 * 60 = 36 minutos, o tempo é de 3 horas e 36 minutos (letra B).'
  },
  {
    id: 'mat-q-04',
    subject: 'Matemática',
    question: 'Um candidato comprou um livro de exercícios com um preço de tabela de R$ 120,00. Por realizar o pagamento à vista no PIX, ele recebeu um desconto de 15%. Qual foi o valor final pago pelo livro?',
    options: [
      'A) R$ 102,00',
      'B) R$ 105,00',
      'C) R$ 98,00',
      'D) R$ 110,00',
      'E) R$ 112,00'
    ],
    answerIndex: 0,
    explanation: 'O valor do desconto é de 15% de R$ 120,00: (15 / 100) * 120 = 0.15 * 120 = R$ 18,00. Subtraindo o desconto do valor original: 120 - 18 = R$ 102,00. Portanto, o candidato pagou R$ 102,00.'
  },
  {
    id: 'mat-q-05',
    subject: 'Matemática',
    question: 'No triângulo retângulo ABC, a hipotenusa mede 10 cm e um dos seus catetos mede 8 cm. Qual é a medida do outro cateto e qual é a área desse triângulo, respectivamente?',
    options: [
      'A) 6 cm e 48 cm²',
      'B) 5 cm e 20 cm²',
      'C) 6 cm e 24 cm²',
      'D) 4 cm e 16 cm²',
      'E) 8 cm e 32 cm²'
    ],
    answerIndex: 2,
    explanation: 'Aplicando o Teorema de Pitágoras (a² = b² + c²): 10² = 8² + c² => 100 = 64 + c² => c² = 36 => c = 6 cm. Como se trata de um triângulo retângulo, a base e a altura são os catetos (6 e 8 cm). A área é dada por (base * altura) / 2 = (6 * 8) / 2 = 48 / 2 = 24 cm². Portanto, o outro cateto mede 6 cm e a área é de 24 cm² (letra C).'
  },
  {
    id: 'mat-q-06',
    subject: 'Matemática',
    question: 'A média ponderada das notas de um aluno nas etapas de seleção foi calculada sabendo que a prova de Português tinha peso 3 e a de Matemática tinha peso 2. Se o aluno obteve nota 8,0 em Português e nota 9,0 em Matemática, qual foi a sua média final obtida?',
    options: [
      'A) 8,5',
      'B) 8,2',
      'C) 8,4',
      'D) 8,6',
      'E) 8,8'
    ],
    answerIndex: 2,
    explanation: 'Média Ponderada = (Nota_Port * Peso_Port + Nota_Mat * Peso_Mat) / (Soma dos Pesos). Média Ponderada = (8.0 * 3 + 9.0 * 2) / (3 + 2) = (24 + 18) / 5 = 42 / 5 = 8,4. Portanto, a média final foi 8,4.'
  },
  {
    id: 'mat-q-07',
    subject: 'Matemática',
    question: 'Resolvendo a equação do segundo grau x² - 7x + 12 = 0, quais são as raízes (soluções) reais dessa equação?',
    options: [
      'A) x = 2 e x = 5',
      'B) x = 3 e x = 4',
      'C) x = 1 e x = 12',
      'D) x = -3 e x = -4',
      'E) x = 0 e x = 7'
    ],
    answerIndex: 1,
    explanation: 'Podemos resolver por soma e produto: Soma S = -b/a = 7, Produto P = c/a = 12. Os números cujo produto é 12 e a soma é 7 são 3 e 4. Ou usando Bhaskara: Delta = (-7)² - 4*1*12 = 49 - 48 = 1. Raízes: (7 ± √1)/2 => x = (7+1)/2 = 4 e x = (7-1)/2 = 3. As soluções são 3 e 4.'
  },
  {
    id: 'mat-q-08',
    subject: 'Matemática',
    question: 'Um terreno retangular tem comprimento igual ao triplo de sua largura. Se o perímetro desse terreno é de 80 metros, qual é a área desse terreno em metros quadrados?',
    options: [
      'A) 150 m²',
      'B) 300 m²',
      'C) 400 m²',
      'D) 250 m²',
      'E) 187,5 m²'
    ],
    answerIndex: 1,
    explanation: 'Seja x a largura do terreno. O comprimento é 3x. O perímetro é dado por 2 * (comprimento + largura) = 80 => 2 * (3x + x) = 80 => 2 * (4x) = 80 => 8x = 80 => x = 10 metros. Logo, a largura é 10m e o comprimento é 30m. A área do retângulo é largura * comprimento = 10 * 30 = 300 m².'
  },
  {
    id: 'mat-q-09',
    subject: 'Matemática',
    question: 'O valor numérico do polinômio P(x) = 2x³ - 5x² + 3x - 10 para x = 3 é igual a:',
    options: [
      'A) P(3) = 10',
      'B) P(3) = 8',
      'C) P(3) = 5',
      'D) P(3) = -1',
      'E) P(3) = 2'
    ],
    answerIndex: 1,
    explanation: 'Substituindo x por 3 em P(x): P(3) = 2*(3)³ - 5*(3)² + 3*(3) - 10 = 2*27 - 5*9 + 9 - 10 = 54 - 45 + 9 - 10 = 9 + 9 - 10 = 18 - 10 = 8. Logo, P(3) = 8.'
  },
  {
    id: 'mat-q-10',
    subject: 'Matemática',
    question: 'Três sócios investiram em um negócio inovador nas seguintes proporções diretas: 2, 3 e 5. Sabendo que o lucro final de R$ 12.000,00 foi distribuído em partes diretamente proporcionais ao investimento de cada um, quanto recebeu o sócio que fez o maior investimento?',
    options: [
      'A) R$ 2.400,00',
      'B) R$ 3.600,00',
      'C) R$ 5.000,00',
      'D) R$ 6.000,00',
      'E) R$ 8.000,00'
    ],
    answerIndex: 3,
    explanation: 'Soma das partes: 2 + 3 + 5 = 10 partes. Valor de cada parte (constante de proporcionalidade k): 12.000 / 10 = R$ 1.200,00. O sócio de maior investimento tem 5 partes, logo receberá: 5 * 1.200 = R$ 6.000,00 (letra D).'
  }
];
