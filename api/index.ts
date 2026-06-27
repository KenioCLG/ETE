export const maxDuration = 60;
import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import { getFallbackQuestions, getFallbackSimulado, getRandomEditalTopics } from "../serverFallback.js";
import {
  isTecConfigured,
  buscarQuestoesPorAssunto,
  buscarQuestoesSimulado,
  listarMaterias,
  listarAssuntos,
} from "../tecConcursos.js";

// ─── Fallback local para /api/explain ────────────────────────────────────────

function getFallbackExplanation(topic: string, subject: string): string {
  return `### 📚 Guia de Estudos: ${topic} (${subject})

> *Nota: O serviço de IA está com alta demanda. Veja um guia pedagógico do nosso banco local!*

---

#### 1. O que é / Conceito Principal
O assunto **${topic}** é de extrema relevância no edital oficial da **ETE PE**.
- **Incidência**: Frequentemente cobrado em provas da banca oficial (IAUPE).

---

#### 2. Como cai na prova / Regra Prática
A banca ETE PE costuma formular enunciados que exigem:
1. **Identificação Rápida** da regra ou propriedade que se aplica.
2. **Aplicação Direta**: cálculo ou análise objetiva do enunciado.

*Regra de Ouro*: Leia o comando final da questão antes de resolver para evitar distratores.

---

#### 3. Dica de Ouro para a Prova
* **Tempo**: 20 questões em 60 minutos (3 min/questão). Não trave em uma questão!
* **Estudo Ativo**: Resolva provas anteriores para fixar o padrão da banca.`;
}

// ─── Gemini AI Client ─────────────────────────────────────────────────────────

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return aiClient;
}

function isAiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return !!(key && key !== "MY_GEMINI_API_KEY");
}

// ─── Express App ──────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());

// ── POST /api/explain ─────────────────────────────────────────────────────────
app.post("/api/explain", async (req, res) => {
  const { topic, subject } = req.body;
  if (!topic || !subject) {
    return res.status(400).json({ error: "Faltando parâmetros: 'topic' e 'subject'." });
  }

  if (!isAiConfigured()) {
    return res.json({ explanation: getFallbackExplanation(topic, subject) });
  }

  try {
    const response = await getAiClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Você é um professor altamente didático e especialista em exames e processos seletivos do IFPE e ETE PE.
Explique o assunto "${topic}" de ${subject} de forma concisa, focada em questões de prova para nível ETE Subsequente.

Siga a estrutura:
1. **O que é / Conceito Principal**
2. **Como cai na prova / Regra Prática**
3. **Exemplos Comentados** (2 ou 3 exemplos práticos resolvidos)
4. **Dica de Ouro para a Prova**

Formate em Markdown limpo.`,
    });
    return res.json({ explanation: response.text || "Não foi possível gerar a explicação." });
  } catch (error: any) {
    console.warn("/api/explain fallback:", error.message);
    return res.json({ explanation: getFallbackExplanation(topic, subject) });
  }
});

// ── POST /api/chat ────────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { history } = req.body;
  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: "Faltando parâmetro: 'history'." });
  }

  if (!isAiConfigured()) {
    return res.json({
      reply: `Olá! Sou o seu **Tutor ETE local**.\n\nA chave Gemini não está configurada. Use a aba **Edital & Progresso** para estudar ou faça um **Simulado ETE**!`,
    });
  }

  try {
    const contents = history.map((msg: { role: string; text: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const response = await getAiClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: `Você é o "Tutor ETE", especializado em ajudar candidatos aprovados na prova subsequente da ETE PE.
Tom: motivador, amigável, pedagógico.
- Explique conceitos de forma fatiada e visual.
- Demonstre fórmulas com exemplos práticos passo a passo.
- Lembre: 20 questões (10 Port + 10 Mat), 60 min, mínimo 20% sem zerar nenhuma matéria.
- Responda em português com Markdown limpo.`,
      },
    });
    return res.json({ reply: response.text || "Não consegui processar sua resposta." });
  } catch (error: any) {
    console.warn("/api/chat fallback:", error.message);
    return res.json({
      reply: `O assistente está temporariamente indisponível. Continue estudando pela aba **Edital & Progresso** ou faça um **Simulado ETE**!`,
    });
  }
});

// ── POST /api/generate-quiz ───────────────────────────────────────────────────
app.post("/api/generate-quiz", async (req, res) => {
  const { topic, subject } = req.body;
  if (!topic || !subject) {
    return res.status(400).json({ error: "Faltando parâmetros: 'topic' e 'subject'." });
  }

  if (!isAiConfigured()) {
    return res.json({ questions: getFallbackQuestions(topic, subject), isFallback: true });
  }

  try {
    const response = await getAiClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere exatamente 3 questões de múltipla escolha sobre "${topic}" (${subject}) para a prova ETE PE subsequente.
Cada questão: enunciado claro e 5 alternativas (A-E), apenas 1 correta. Inclua explicação detalhada.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
            required: ["question", "options", "answerIndex", "explanation"],
          },
        },
      },
    });

    if (!response.text) throw new Error("Resposta vazia.");
    return res.json({ questions: JSON.parse(response.text.trim()) });
  } catch (error: any) {
    console.warn("/api/generate-quiz fallback:", error.message);
    return res.json({ questions: getFallbackQuestions(topic, subject), isFallback: true });
  }
});

// ── GET /api/generate-simulado ────────────────────────────────────────────────
app.get("/api/generate-simulado", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (!isAiConfigured()) {
    return res.json({ questions: getFallbackSimulado(), isFallback: true });
  }

  try {
    const { port: editalPort, mat: editalMat } = getRandomEditalTopics(5);

    // Schema de 10 questões (sem o campo subject — adicionamos no código).
    const schema10 = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          answerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ["question", "options", "answerIndex", "explanation"],
      },
    };

    // Gera 10 questões de uma disciplina, focadas em 5 temas sorteados do edital.
    const genSubject = async (subject: string, topics: string) => {
      const seed = Math.floor(Math.random() * 1000000);
      const resp = await getAiClient().models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere EXATAMENTE 10 questões inéditas de múltipla escolha de "${subject}" para a prova ETE PE (subsequente).
Seed de Variância: ${seed} (use para garantir que as questões sejam 100% INÉDITAS e diferentes de simulados anteriores).
Crie 2 questões para CADA um destes 5 temas sorteados do edital (total 10):
${topics}
Cada questão deve ter enunciado claro (com texto-base curto inédito quando fizer sentido), 5 alternativas (A-E), apenas 1 correta e explicação detalhada. Use sempre cenários, nomes e valores novos.`,
        config: { temperature: 0.95, responseMimeType: "application/json", responseSchema: schema10 },
      });
      if (!resp.text) throw new Error(`Resposta vazia (${subject}).`);
      return (JSON.parse(resp.text.trim()) as any[]).slice(0, 10).map((q) => ({ ...q, subject }));
    };

    // As duas disciplinas rodam EM PARALELO — metade do tempo de uma chamada única de 20.
    const work = Promise.all([
      genSubject("Língua Portuguesa", editalPort),
      genSubject("Matemática", editalMat),
    ]);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("AI_TIMEOUT")), 50000)
    );
    const [port, mat] = (await Promise.race([work, timeoutPromise])) as any[];

    const questions = [...port, ...mat].map((q: any, i: number) => ({
      ...q,
      id: `${q.subject === "Matemática" ? "mat" : "port"}-${i}-${Math.random().toString(36).slice(2)}`,
    }));
    if (questions.length < 20) throw new Error(`IA retornou ${questions.length} questões (esperado 20).`);
    return res.json({ questions });
  } catch (error: any) {
    console.warn("/api/generate-simulado fallback:", error.message);
    return res.json({ questions: getFallbackSimulado(), isFallback: true });
  }
});

// ── POST /api/evaluate-simulado ───────────────────────────────────────────────
app.post("/api/evaluate-simulado", async (req, res) => {
  const { results, userNote } = req.body;
  if (!isAiConfigured()) {
    return res.json({ feedback: "Chave de API não configurada. Configure para receber feedback automático." });
  }

  try {
    const prompt = `Você é um Tutor da ETE PE. Analise o simulado do aluno:
Placar: Português (${results.scorePort}/${results.totalPort}), Matemática (${results.scoreMat}/${results.totalMat}).
Observação do aluno: "${userNote || 'Nenhuma'}"

Aqui estão as questões que o aluno errou (se houver):
${results.wrongQuestions && results.wrongQuestions.length > 0 
  ? results.wrongQuestions.map((q: any) => `- [${q.subject}] ${q.question}`).join('\n')
  : "Nenhuma, o aluno gabaritou!"}

Por favor, dê um feedback pedagógico e conselhos sobre quais tópicos ele deve focar mais, com base nos erros e na observação. Seja direto, encorajador e use formatação Markdown.`;

    const response = await getAiClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return res.json({ feedback: response.text || "Feedback indisponível no momento." });
  } catch (error: any) {
    console.warn("/api/evaluate-simulado error:", error.message);
    return res.status(500).json({ error: "Falha ao gerar feedback." });
  }
});

// ── GET /api/tec/status ───────────────────────────────────────────────────────
app.get("/api/tec/status", (_req, res) => {
  return res.json({ configured: isTecConfigured() });
});

// ── GET /api/tec/materias ─────────────────────────────────────────────────────
app.get("/api/tec/materias", async (_req, res) => {
  if (!isTecConfigured()) {
    return res.status(400).json({ error: "TEC_SESSION_COOKIE nao configurado." });
  }
  try {
    return res.json({ materias: await listarMaterias() });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ── GET /api/tec/assuntos/:materiaId ─────────────────────────────────────────
app.get("/api/tec/assuntos/:materiaId", async (req, res) => {
  if (!isTecConfigured()) {
    return res.status(400).json({ error: "TEC_SESSION_COOKIE nao configurado." });
  }
  const materiaId = parseInt(req.params.materiaId, 10);
  if (isNaN(materiaId)) {
    return res.status(400).json({ error: "Parâmetro 'materiaId' inválido." });
  }
  try {
    return res.json({ assuntos: await listarAssuntos(materiaId) });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ── POST /api/tec/questoes ────────────────────────────────────────────────────
app.post("/api/tec/questoes", async (req, res) => {
  if (!isTecConfigured()) {
    return res.status(400).json({ error: "TEC_SESSION_COOKIE nao configurado.", notConfigured: true });
  }
  const { tecQuery, subject, quantidade } = req.body;
  if (!tecQuery || !subject) {
    return res.status(400).json({ error: "Faltando parametros: 'tecQuery' e 'subject'." });
  }
  try {
    return res.json(await buscarQuestoesPorAssunto(tecQuery, subject, quantidade || 3));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ── GET /api/tec/simulado ─────────────────────────────────────────────────────
app.get("/api/tec/simulado", async (_req, res) => {
  if (!isTecConfigured()) {
    return res.status(400).json({ error: "TEC_SESSION_COOKIE nao configurado.", notConfigured: true });
  }
  try {
    return res.json(await buscarQuestoesSimulado());
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ── POST /api/tec/explicar-gabarito ──────────────────────────────────────────
app.post("/api/tec/explicar-gabarito", async (req, res) => {
  const { enunciado, alternativas, gabaritoIndex, subject } = req.body;
  if (!enunciado || !alternativas) {
    return res.status(400).json({ error: "Faltando parametros." });
  }

  const letras = ["A", "B", "C", "D", "E"];

  if (!isAiConfigured()) {
    return res.json({
      explanation: `Gabarito: Alternativa ${letras[gabaritoIndex] || "?"}. Configure GEMINI_API_KEY para explicações detalhadas.`,
    });
  }

  try {
    const alternativasTexto = (alternativas as string[])
      .map((a, i) => `${letras[i]}) ${a}`)
      .join("\n");

    const response = await getAiClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Você é professor especialista em ${subject || "concursos"}.
Explique por que a alternativa ${letras[gabaritoIndex]} está correta e as demais erradas.

QUESTÃO: ${enunciado}
ALTERNATIVAS:\n${alternativasTexto}
RESPOSTA: ${letras[gabaritoIndex]}) ${alternativas[gabaritoIndex]}

Seja conciso mas completo.`,
    });

    return res.json({ explanation: response.text || `Gabarito: ${letras[gabaritoIndex]}.` });
  } catch (error: any) {
    console.warn("/api/tec/explicar-gabarito fallback:", error.message);
    return res.json({
      explanation: `Gabarito: Alternativa ${letras[gabaritoIndex] || "?"}. Explicação indisponível.`,
    });
  }
});

// ─── Export Express app as Vercel Serverless Function ─────────────────────────
export default app;
