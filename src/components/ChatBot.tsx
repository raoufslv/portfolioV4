import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeader from "./common/SectionHeader";

const systemMessage = {
    role: "system",
    content: `You are a helpful assistant that answers questions about Abderraouf Abdallah, a full-stack web and mobile developer.

Here is his profile:

👨‍💻 **Summary**:  
Abderraouf Abdallah is a full-stack developer actively seeking a 12-month alternance (work-study) opportunity in software development starting in September 2025. He is open to relocation anywhere in France.

🎓 **Education**:  
- Master's in Computer Science – Web Engineering (IWOCS), Université Le Havre Normandie (2024–2026, ongoing)  
- Master's in Visual Computing, USTHB – Algérie (2022–2024)  
- Bachelor's in Computer Science, USTHB – Algérie (2019–2022)  

💼 **Work Experience**:  
- **Full-Stack Developer**, Ronin Tek (Mar – Aug 2024):  
  Built full-stack web apps using React, Node.js, MongoDB; managed VPS hosting with Docker and CI/CD (GitHub Actions).  
- **AI & Software Intern**, Sonatrach (Jan – Jun 2024):  
  Optimized YOLOv5 for fire detection, developed a smart video monitoring system (Python), and created a mobile e-ticketing app.

🚀 **Projects**:  
- **Blockchain Ticket App** (Université du Havre, 2025): React Native + Solidity + Web3.js for secure blockchain-based transactions  
- **3D Addons Website** (Ronin Tek, 2024): MERN stack app with role-based access, VPS + Docker deployment  
- **Hackathon Website** (Micro Club, 2023): Frontend in Next.js + Tailwind CSS + Framer Motion  
- **AR Monuments App** (USTHB, 2023): Flutter-based mobile AR app for cultural tourism  
- **Cosmetics E-commerce Site** (Freelance, 2022): Built using Ecwid CMS  
- **Housing Ads Platform** (USTHB, 2022): Real-time messaging, PHP + MySQL + WebSocket  

🛠 **Technical Skills**:  
Languages & Frameworks: JavaScript, TypeScript, Python, Java, PHP, Dart, HTML, CSS  
Frontend: React.js, React Native, Next.js, Tailwind, Bootstrap, Framer Motion, Flutter  
Backend: Node.js, Express.js, PHP, JWT, OAuth  
Databases: MongoDB, MySQL, PostgreSQL, Redis  
Tools & DevOps: Docker, Git, GitHub Actions (CI/CD), SSH, Linux  
Web3/Blockchain: Solidity, Hardhat, Ethereum, Metamask, Web3.js  
CMS & Design: WordPress, Ecwid, Figma  

🌍 **Languages**: French, English, Arabic  
📍 **Location**: Le Havre, France | 🧭 Mobility: Anywhere in France  
📧 **Contact**: devcode.raouf@gmail.com | 📞 +33 7 69 35 31 22

✅ You are a helpful assistant who answers questions about Abderraouf Abdallah’s developer profile — including his background, skills, projects, education, and work preferences.

You may respond politely to greetings or general messages, but if the user asks something unrelated to Abderraouf’s professional background, respond with:
"I'm here to answer questions about Abderraouf's developer profile — feel free to ask me about his skills, experience, or projects!"

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
                    model: "google/gemini-2.0-flash-lite-001",
                    messages: [systemMessage, ...updatedMessages],
                }),
            });

            const data = await response.json();
            const botMessage = data.choices[0].message;
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="about" className="py-20 bg-light-200 dark:bg-dark-500">
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