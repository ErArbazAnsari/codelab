import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hello! I'm your AI coding assistant. I can help you understand this problem, provide hints, debug your code, or explain different approaches. What would you like to know about this problem?"}]}
    ]);

    const { register, handleSubmit, reset,formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'user', parts:[{text: data.message}] }]);
        reset();

        try {
            const updatedMessages = [...messages, { role: 'user', parts:[{text: data.message}] }];
            const response = await axiosClient.post("/ai/chat", {
                messages: updatedMessages,
                title:problem.title,
                description:problem.description,
                testCases: problem.visibleTestCases,
                startCode:problem.startCode
            });

            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Sorry, I encountered an error. Please try again."}]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-header">
                            {msg.role === "user" ? "You" : "AI Assistant"}
                        </div>
                        <div className="chat-bubble bg-base-200 text-base-content">
                            <div className="whitespace-pre-wrap">{msg.parts[0].text}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat chat-start">
                        <div className="chat-header">AI Assistant</div>
                        <div className="chat-bubble bg-base-200 text-base-content">
                            <span className="loading loading-dots loading-sm"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask me anything" 
                        className="input input-bordered flex-1" 
                        {...register("message", { required: true, minLength: 2 })}
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-ghost ml-2"
                        disabled={errors.message || isLoading}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;
