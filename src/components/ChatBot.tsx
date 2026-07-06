import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Section from "./layout/Section";
import ChatWindow from "./chat/ChatWindow";
import { streamChatCompletion } from "./chat/streamChatCompletion";
import { assistantSystemMessage } from "@/data/assistant-context";

interface Message {
    role: string;
    content: string;
}

const CHAT_MODEL =
    import.meta.env.VITE_OPENROUTER_MODEL ?? "liquid/lfm-2.5-1.2b-instruct:free";

export default function ChatBot() {
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
                messages: [assistantSystemMessage, ...updatedMessages],
                model: CHAT_MODEL,
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
                signal: abortController.signal,
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
        <Section id="chatbot">
            <div className="mx-auto max-w-5xl">
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
        </Section>
    );
}
