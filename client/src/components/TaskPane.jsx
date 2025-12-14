import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Bot, User, Sparkles } from 'lucide-react';
import NaturalLanguageService from '../services/NaturalLanguageService';

const TaskPane = () => {
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I am connected to Gemini AI (Server). I can generate data, formulas, charts, and more. What do you need?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setInputValue(prev => {
                        const newValue = prev ? `${prev} ${finalTranscript}` : finalTranscript;
                        return newValue;
                    });
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue;
        setInputValue('');

        // Stop listening when sending message
        if (isListening) {
            recognitionRef.current?.stop();
        }

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: userText }]);
        setIsProcessing(true);

        // Process command (No key needed, handled by server)
        const result = await NaturalLanguageService.processCommand(userText);

        // Add bot response
        setMessages(prev => [...prev, { type: 'bot', text: result }]);
        setIsProcessing(false);
    };

    return (
        <div className="w-full h-screen bg-black text-white flex flex-col font-['Outfit'] overflow-hidden relative">

            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/50 backdrop-blur-md z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <h1 className="text-sm font-medium tracking-wide">SheetSense AI</h1>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-white/10' : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                            }`}>
                            {msg.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${msg.type === 'user'
                            ? 'bg-white/10 rounded-tr-sm'
                            : 'bg-white/5 border border-white/10 rounded-tl-sm'
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-cyan-500 to-blue-500">
                            <Sparkles size={14} className="animate-spin-slow" />
                        </div>
                        <div className="p-3 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 flex gap-1 items-center">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Ask Gemini to edit..."}
                        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-gray-500 ${isListening ? 'border-cyan-500/50 ring-1 ring-cyan-500/20' : ''}`}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isProcessing}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg text-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </form>
                <div className="flex justify-center mt-2">
                    <button
                        onClick={toggleListening}
                        className={`flex items-center gap-1.5 text-[10px] transition-all duration-300 ${isListening ? 'text-cyan-400 scale-110' : 'text-gray-500 hover:text-cyan-400'
                            }`}
                    >
                        <Mic size={12} className={isListening ? 'animate-pulse' : ''} />
                        {isListening ? 'Listening...' : 'Tap to speak'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskPane;
