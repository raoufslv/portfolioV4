import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeader from "./common/SectionHeader";

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

If the user asks something unrelated to Raouf's professional profile, respond with:
"I'm here to answer questions about Raouf's developer profile — feel free to ask about his skills, experience, or projects!"
`,
};

interface Message {
    role: string;
    content: string;
}

export default function AboutChatBot() {
    const { t, i18n } = useTranslation();
    useEffect(() => {
        setMessages((prev) => {
            const first = prev[0];
            if (first?.role === "assistant") {
                const updated = {
                    ...first,
                    content: t('about.description2'),
                };
                return [updated, ...prev.slice(1)];
            }
            return prev;
        });
    }, [i18n.language]);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: t('about.description2'),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                },
                body: JSON.stringify({
                    model: import.meta.env.VITE_OPENROUTER_MODEL ?? "google/gemma-4-31b-it:free",
                    messages: [systemMessage, ...updatedMessages],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message ?? "OpenRouter API error");
            }

            const botMessage = data.choices?.[0]?.message;
            if (!botMessage) {
                throw new Error("Invalid response from OpenRouter");
            }

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I'm having trouble responding right now. Please try again in a moment or contact Raouf directly at devcode.raouf@gmail.com.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="about" className="py-20 ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title={t('about.title')} subtitle={t('about.subtitle')} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-dark-600 p-6 max-w-4xl mx-auto"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        <h2 className="text-2xl font-bold text-dark-600 dark:text-light-300">
                            {t('about.description1')}
                        </h2>
                    </div>

                    <div
                        ref={containerRef}
                        className="h-[350px] overflow-y-auto pr-2 space-y-3 bg-light-100 dark:bg-dark-500 p-4 rounded-lg border"
                    >
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 max-w-[85%] rounded-2xl text-sm ${msg.role === "user"
                                    ? "bg-primary-100 text-right ml-auto dark:bg-primary-600 dark:text-white w-fit"
                                    : "bg-gray-200 dark:bg-gray-700 text-left w-fit"
                                    }`}
                            >
                                <span className="block whitespace-pre-wrap text-dark-600 dark:text-light-300">{msg.content}</span>
                            </motion.div>
                        ))}
                        {loading && <div className="text-sm text-gray-500">Thinking...</div>}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 p-3 rounded-lg bg-light-50 dark:bg-dark-400 text-dark-700 dark:text-light-100 border focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder={t('about.chatPlaceholder')
                            }
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
                        >
                            {t('about.sendButton')}
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}