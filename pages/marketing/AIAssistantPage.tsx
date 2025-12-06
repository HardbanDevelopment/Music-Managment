import React, { useState, useRef, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { getAIAssistantResponse } from '../../services/api';
import { User } from '../../types';
import { AuthContext } from '../../context/AuthContext';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AIAssistantPage: React.FC = () => {
    const { user } = React.useContext(AuthContext);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! I'm your AI Marketing Assistant. How can I help you strategize today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponseText = await getAIAssistantResponse(input);
        const aiMessage: Message = { sender: 'ai', text: aiResponseText };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    return (
        <Card className="flex flex-col h-[calc(100vh-120px)]">
            <div className="p-4 border-b border-dark-border">
                <h2 className="text-xl font-bold text-white">AI Marketing Assistant</h2>
                <p className="text-sm text-gray-400">Your strategic partner for marketing decisions.</p>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <img 
                            src={msg.sender === 'user' ? user?.avatar : 'https://picsum.photos/seed/ai/100/100'} 
                            alt={`${msg.sender} avatar`} 
                            className="w-8 h-8 rounded-full"
                        />
                        <div className={`max-w-lg p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-primary-blue text-white rounded-br-none' : 'bg-dark-card text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-3">
                        <img src="https://picsum.photos/seed/ai/100/100" alt="ai avatar" className="w-8 h-8 rounded-full"/>
                        <div className="max-w-lg p-4 rounded-2xl bg-dark-card text-gray-200 rounded-bl-none">
                            <div className="flex items-center space-x-2">
                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-dark-border">
                <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a marketing strategy..."
                        className="flex-1 bg-dark-bg border border-dark-border rounded-lg p-3 text-sm focus:ring-primary-purple focus:border-primary-purple"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-primary-purple hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50">
                        Send
                    </button>
                </form>
            </div>
        </Card>
    );
};

export default AIAssistantPage;
