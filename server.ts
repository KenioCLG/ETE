import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { getFallbackQuestions, getFallbackSimulado } from "./serverFallback";

dotenv.config();

// Lazy initialize Gemini client to avoid crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("⚠️ GEMINI_API_KEY environment variable is not configured properly.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

function getFallbackExplanation(topic: string, subject: string): string {
  return `### 📚 Guia de Estudos: ${topic} (${subject})

> *Nota: O serviço de IA está com alta demanda no momento. Apresentamos um guia de estudos estruturado do nosso banco pedagógico local para garantir que seus estudos continuem sem interrupção!*

---

#### 1. O que é / Conceito Principal
O assunto **${topic}** é de extrema relevância no edital oficial da **ETE PE**. Compreender sua fundamentação teórica é crucial para resolver tanto questões diretas quanto problemas aplicados.

- **Conceito Chave**: Trata-se da compreensão estrutural do tópico dentro da disciplina de ${subject}.
- **Incidência**: Frequentemente cobrado em provas subsequentes da banca oficial (IAUPE).

---

#### 2. Como cai na prova / Regra Prática
A banca ETE PE costuma formular enunciados que exigem:
1. **Identificação Rápida**: Saber qual regra, propriedade ou definição conceitual se aplica.
2. **Cálculo ou Análise Direta**: Aplicação prática da fórmula ou análise do texto de forma objetiva.

*Regra de Ouro*: Ao ler o problema, faça anotações nas margens destacando as variáveis numéricas (em Matemática) ou os termos relacionais (em Português). Isso evita confusões com as alternativas distratoras.

---

#### 3. Exemplos Comentados
*Estude atentamente a aplicação abaixo:*

**Problema Prático Exemplo:**
Como estruturar a resolução de um item sobre **${topic}**?
* **Passo 1**: Leia o comando final da questão para entender exatamente o que é pedido.
* **Passo 2**: Recupere a regra geral ou fórmula de **${topic}**.
* **Passo 3**: Elimine as alternativas absurdas para aumentar suas chances de acerto caso precise estimar.

---

#### 4. Dica de Ouro para a Prova
* **Gerenciamento de Tempo**: A prova possui 20 questões para 60 minutos (média de 3 minutos por questão). Não se prenda a questões excessivamente longas!
* **Estudo Ativo**: Resolva exercícios deste tópico de provas anteriores para fixar o padrão de cobrança.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint: Explain a specific syllabus topic
  app.post("/api/explain", async (req, res) => {
    const { topic, subject } = req.body;
    try {
      if (!topic || !subject) {
        return res.status(400).json({ error: "Faltando parâmetros: 'topic' e 'subject'." });
      }

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        console.warn("Chave de API não configurada. Fornecendo explicação pedagógica local.");
        return res.json({ explanation: getFallbackExplanation(topic, subject) });
      }

      const client = getAiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Você é um professor altamente didático e especialista em exames e processos seletivos do IFPE e ETE PE (Escolas Técnicas Estaduais de Pernambuco).
Explique o assunto do edital "${topic}" de ${subject} de forma concisa, direta e focada em questões de prova para nível ETE Subsequente (ensino médio completo).

Siga rigorosamente a estrutura abaixo:
1. **O que é / Conceito Principal** (em linguagem simples e direta)
2. **Como cai na prova / Regra Prática** (explicação fatiada do que mais cobram)
3. **Exemplos Comentados** (forneça exatamente 2 ou 3 exemplos práticos resolvidos passo a passo)
4. **Dica de Ouro para a Prova** (uma dica rápida para não cair em pegadinhas)

Formate a resposta inteira em Markdown limpo e amigável.`,
      });

      const text = response.text || "Não foi possível gerar a explicação. Tente novamente.";
      res.json({ explanation: text });
    } catch (error: any) {
      console.warn("Erro ao chamar IA no endpoint /api/explain. Usando fallback local:", error.message || error);
      res.json({ explanation: getFallbackExplanation(topic, subject) });
    }
  });

  // API endpoint: Study Chat Assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { history } = req.body; // Array of { role: 'user' | 'model', text: string }
      if (!history || !Array.isArray(history)) {
        return res.status(400).json({ error: "Faltando parâmetro: 'history' (array de mensagens)." });
      }

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        return res.json({
          reply: `Olá! Sou o seu **Tutor ETE local**. 

No momento, o serviço da API Gemini está sem chave configurada. Mas você ainda pode usar todo o potencial do aplicativo:
1. Na aba **Edital & Progresso**, clique em qualquer assunto para ler resumos estruturados e gerar exercícios de treino reais.
2. Na aba **Simulado ETE**, teste seu ritmo respondendo a provas completas de 20 questões sob pressão do cronômetro.

Como posso ajudar você com o seu plano de estudos hoje?`
        });
      }

      const client = getAiClient();
      // Map our simplified history to Gemini API format
      const contents = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: `Você é o "Tutor ETE", um assistente de inteligência artificial de alta performance especializado em ajudar candidatos a serem aprovados na prova subsequente da Escola Técnica Estadual (ETE) de Pernambuco.
Seu tom é motivador, amigável, direto e altamente pedagógico.

Suas diretrizes de resposta são:
1. Explique regras matemáticas e conceitos gramaticais de forma fatiada, visual e fácil de entender.
2. Sempre que ensinar uma fórmula ou regra, demonstre com um exemplo prático resolvido passo a passo.
3. Se o usuário perguntar sobre o edital, lembre-o de que a prova possui 20 questões eletrônicas presenciais (10 de Português, 10 de Matemática), dura 60 minutos e requer pelo menos 20% de acertos sem zerar nenhuma matéria.
4. Responda em português brasileiro e use formatação Markdown limpa e estruturada.`
        }
      });

      const text = response.text || "Desculpe, não consegui processar sua resposta no momento.";
      res.json({ reply: text });
    } catch (error: any) {
      console.warn("Erro ao chamar IA no endpoint /api/chat. Usando resposta amigável de fallback:", error.message || error);
      res.json({
        reply: `Olá! O assistente de IA está sob alta demanda ou temporariamente indisponível no momento (Código 503). 

Mas não se preocupe, nosso banco local está 100% ativo! Você pode continuar estudando de forma extremamente produtiva:
- Acesse a aba **Edital & Progresso** para ver resumos completos de cada tópico do edital e gerar questões práticas de fixação.
- Faça um **Simulado ETE** completo para treinar sua velocidade sob o cronômetro oficial de 60 minutos.

Tente enviar sua pergunta novamente em alguns instantes.`
      });
    }
  });

  // API endpoint: Generate 3 custom quiz questions for a syllabus topic
  app.post("/api/generate-quiz", async (req, res) => {
    const { topic, subject } = req.body;
    try {
      if (!topic || !subject) {
        return res.status(400).json({ error: "Faltando parâmetros: 'topic' e 'subject'." });
      }

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        console.warn("Sem chave de API. Utilizando banco de questões fallback local.");
        const fallback = getFallbackQuestions(topic, subject);
        return res.json({ questions: fallback, isFallback: true });
      }

      const client = getAiClient();
      const prompt = `Gere exatamente 3 questões inéditas de múltipla escolha com alto padrão de qualidade sobre o assunto "${topic}" (${subject}), sob medida para a prova de seleção subsequente da Escola Técnica Estadual (ETE) de Pernambuco.
As questões devem refletir fielmente o formato da ETE: cada questão deve ter um enunciado claro e exatamente 5 alternativas (A, B, C, D, E), com apenas uma alternativa correta.
Forneça também uma explicação detalhada da resposta correta para cada questão.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "Lista de 3 questões de múltipla escolha baseadas no tópico.",
            items: {
              type: Type.OBJECT,
              properties: {
                question: {
                  type: Type.STRING,
                  description: "Enunciado completo da questão em português."
                },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exatamente 5 alternativas de resposta (A, B, C, D, E)."
                },
                answerIndex: {
                  type: Type.INTEGER,
                  description: "Índice de 0 a 4 correspondente à opção correta (0 = A, 1 = B, 2 = C, 3 = D, 4 = E)."
                },
                explanation: {
                  type: Type.STRING,
                  description: "Explicação detalhada e passo a passo de por que essa opção está correta."
                }
              },
              required: ["question", "options", "answerIndex", "explanation"]
            }
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Resposta vazia da IA.");
      }

      const quizData = JSON.parse(responseText.trim());
      res.json({ questions: quizData });
    } catch (error: any) {
      console.warn("Erro ao chamar IA para gerar questões. Usando fallback local:", error.message || error);
      try {
        const fallback = getFallbackQuestions(topic, subject);
        res.json({ questions: fallback, isFallback: true });
      } catch (innerError) {
        console.error("Erro gravíssimo ao obter fallback:", innerError);
        res.status(500).json({ error: "Falha geral ao gerar questões pedagógicas." });
      }
    }
  });

  // API endpoint: Generate 20 custom exam questions (10 Port, 10 Mat)
  app.get("/api/generate-simulado", (req, res) => {
    try {
      const questions = getFallbackSimulado();
      res.json({ questions });
    } catch (error: any) {
      console.error("Erro ao gerar simulado de fallback:", error);
      res.status(500).json({ error: "Falha ao gerar simulado." });
    }
  });

  // Vite middleware setup for development, serving static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
