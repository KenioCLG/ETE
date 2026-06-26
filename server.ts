import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint: Explain a specific syllabus topic
  app.post("/api/explain", async (req, res) => {
    try {
      const { topic, subject } = req.body;
      if (!topic || !subject) {
        return res.status(400).json({ error: "Faltando parâmetros: 'topic' e 'subject'." });
      }

      const client = getAiClient();
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        return res.status(500).json({
          error: "O recurso de Inteligência Artificial requer uma chave de API válida (GEMINI_API_KEY) configurada nas configurações do aplicativo."
        });
      }

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
      console.error("Erro no endpoint /api/explain:", error);
      res.status(500).json({ error: `Falha ao gerar explicação por IA: ${error.message || error}` });
    }
  });

  // API endpoint: Study Chat Assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { history } = req.body; // Array of { role: 'user' | 'model', text: string }
      if (!history || !Array.isArray(history)) {
        return res.status(400).json({ error: "Faltando parâmetro: 'history' (array de mensagens)." });
      }

      const client = getAiClient();
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        return res.status(500).json({
          error: "O recurso de Inteligência Artificial requer uma chave de API válida (GEMINI_API_KEY) configurada nas configurações do aplicativo."
        });
      }

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
      console.error("Erro no endpoint /api/chat:", error);
      res.status(500).json({ error: `Falha na conversa com IA: ${error.message || error}` });
    }
  });

  // API endpoint: Generate 3 custom quiz questions for a syllabus topic
  app.post("/api/generate-quiz", async (req, res) => {
    try {
      const { topic, subject } = req.body;
      if (!topic || !subject) {
        return res.status(400).json({ error: "Faltando parâmetros: 'topic' e 'subject'." });
      }

      const client = getAiClient();
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        return res.status(500).json({
          error: "O recurso de Inteligência Artificial requer uma chave de API válida (GEMINI_API_KEY) configurada nas configurações do aplicativo."
        });
      }

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
      console.error("Erro no endpoint /api/generate-quiz:", error);
      res.status(500).json({ error: `Falha ao gerar questões por IA: ${error.message || error}` });
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
