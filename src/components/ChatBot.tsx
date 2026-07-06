import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import SectionHeader from "./common/SectionHeader";
import ChatWindow from "./chat/ChatWindow";
import { streamChatCompletion } from "./chat/streamChatCompletion";

const systemMessage = {
    role: "system",
    content: `You are a helpful assistant that answers questions about Raouf Abdallah (Abderraouf Abdallah), a fullstack software engineer based in Paris, France.

Here is his profile:

👨‍💻 **Summary**:
Fullstack software engineer at Rakoono (Station F, Paris), focused on shipping production features end-to-end: React, Next.js, TypeScript, APIs, data and AI integrations. Open to opportunities across France.

💼 **Work Experience**:
- **Fullstack Software Engineer — AI & Product**, Rakoono, Paris (Jul 2025 – Present):
  Builds fullstack web apps with Next.js, TypeScript, React and Tailwind. Designs multi-agent AI workflows (Vercel AI SDK, OpenAI/Google). Owns features end-to-end: data, REST APIs, UI, tests (Vitest/Playwright), CI/CD. Stack: Supabase/Neon, Clerk, JWT.
- **Full-Stack Developer**, Ronin Tek, Algeria (Mar – Sep 2024):
  React, Node.js/Express, JWT/OAuth, MongoDB, Redis. VPS deployment with Docker and GitHub Actions CI/CD.
- **AI & Software Engineering Intern**, Sonatrach, Algeria (Jan – Jun 2024):
  Optimized YOLOv5 for fire detection. Built a Python video monitoring system for real-time analysis.
- **Web Development Intern**, USTHB, Algeria (Jan – Jun 2022):
  Housing platform with listings, search and real-time messaging (PHP, MySQL, WebSockets).

🎓 **Education**:
- Master's in Safe Software Engineering, UPEC, Paris (2025 – Present)
- Master's in Web Engineering (IWOCS), Université Le Havre Normandie (2024 – 2025)
- Master's in Visual Computing, USTHB, Algeria (2022 – 2024)
- Bachelor's in Computer Science, USTHB, Algeria (2019 – 2022)

🚀 **Key Projects**:
- **Rakoono** (2025 – Present): AI-powered EdTech SaaS — Next.js, TypeScript, multi-agent AI, Supabase, Clerk
- **TixNova** (2025): React Native + blockchain e-ticketing (Solidity, Hardhat, Web3.js)
- **CGVortex** (2024): MERN marketplace for 3D add-ons
- **MC Got Visuals** (2023): Next.js hackathon showcase site
- **Ekri-Echri** (2022): Housing rental platform (PHP, MySQL, WebSockets)
- **Bastion App** (2023): Flutter AR monuments app

🛠 **Technical Skills**:
Languages: TypeScript, JavaScript, Python, Java, PHP, SQL
Frontend: React, Next.js, Tailwind CSS, React Native
Backend: Node.js, Express.js, REST APIs, JWT/OAuth
Data & Auth: PostgreSQL (Supabase, Neon), MongoDB, MySQL, Redis, Clerk
AI: Vercel AI SDK, OpenAI API, Google AI, multi-agent architectures, PyTorch, OpenCV
DevOps & Quality: Docker, Git, GitHub Actions, Linux, Vitest, Playwright, Jest

🌍 **Languages**: French, English, Arabic
📍 **Location**: Paris, France | Mobility: anywhere in France
📧 **Contact**: devcode.raouf@gmail.com | 📞 +33 7 69 35 31 22
🔗 **Links**: https://raoufabdallah.me | GitHub: raoufslv | LinkedIn: raoufslv

Answer in the same language the user writes in (French or English).
Use Markdown formatting (bold, bullet lists, links) for clear, structured answers.

If the user asks something unrelated to Raouf's professional profile, respond with:
"I'm here to answer questions about Raouf's developer profile — feel free to ask about his skills, experience, or projects!"
`,
};

interface Message {
    role: string;
    content: string;
}

const CHAT_MODEL =
    import.meta.env.VITE_OPENROUTER_MODEL ?? "liquid/lfm-2.5-1.2b-instruct:free";

export default function AboutChatBot() {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: t("about.description2") },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        setMessages((prev) => {
            const first = prev[0];
            if (first?.role === "assistant") {
                return [{ ...first, content: t("about.description2") }, ...prev.slice(1)];
            }
            return prev;
        });
    }, [i18n.language, t]);

    const scrollToBottom = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, scrollToBottom]);

    const sendMessage = async (text?: string) => {
        const messageText = (text ?? input).trim();
        if (!messageText || loading) return;

        const userMessage = { role: "user", content: messageText };
        const updatedMessages = [...messages, userMessage];
        setMessages([...updatedMessages, { role: "assistant", content: "" }]);
        setInput("");
        setLoading(true);

        abortRef.current?.abort();
        const abortController = new AbortController();
        abortRef.current = abortController;

        try {
            await streamChatCompletion({
                messages: [systemMessage, ...updatedMessages],
                model: CHAT_MODEL,
                apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
                signal: abortController.signal,
                onChunk: (chunk) => {
                    setMessages((prev) => {
                        const next = [...prev];
                        const last = next[next.length - 1];
                        if (last?.role === "assistant") {
                            next[next.length - 1] = {
                                ...last,
                                content: last.content + chunk,
                            };
                        }
                        return next;
                    });
                },
            });

            setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && !last.content.trim()) {
                    return [
                        ...prev.slice(0, -1),
                        { role: "assistant", content: t("about.errorMessage") },
                    ];
                }
                return prev;
            });
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;

            console.error("Error fetching response:", error);
            setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.content === "") {
                    return [
                        ...prev.slice(0, -1),
                        { role: "assistant", content: t("about.errorMessage") },
                    ];
                }
                return [...prev, { role: "assistant", content: t("about.errorMessage") }];
            });
        } finally {
            if (abortRef.current === abortController) {
                abortRef.current = null;
            }
            setLoading(false);
        }
    };

    const showSuggestedPrompts = messages.length === 1 && messages[0]?.role === "assistant";

    return (
        <section id="about" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title={t("about.title")} subtitle={t("about.subtitle")} />
                <ChatWindow
                    messages={messages}
                    input={input}
                    loading={loading}
                    containerRef={containerRef}
                    onInputChange={setInput}
                    onSend={() => sendMessage()}
                    onPromptSelect={(prompt) => {
                        setInput(prompt);
                        sendMessage(prompt);
                    }}
                    showSuggestedPrompts={showSuggestedPrompts}
                />
            </div>
        </section>
    );
}
