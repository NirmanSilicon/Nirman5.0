import React, { useState, useEffect } from "react";
import axios from "axios";

const Chatbot = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    
    useEffect(() => {
        if (user) fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        const res = await axios.get(`http://localhost:8080/api/chat/history/${user.id}`);
        setMessages(res.data);
    };

    
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages(prev => [...prev, userMessage]);

        
        const aiRes = await axios.post("http://localhost:9000/chat", { message: input });
        const botReply = { sender: "bot", text: aiRes.data.response };

        setMessages(prev => [...prev, botReply]);

        
        await axios.post("http://localhost:8080/api/chat/save", {
            userId: user.id,
            question: input,
            answer: aiRes.data.response
        });

        setInput("");
    };

    return (
        <div className="w-full max-w-md mx-auto p-5 bg-slate-900 text-white rounded-xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center">💬 Travira AI Assistant</h2>

            <div className="h-96 overflow-y-auto space-y-2 p-3 bg-slate-800 rounded-lg">
                {messages.map((m, i) => (
                    <div key={i} className={`p-2 rounded-lg w-fit max-w-[80%] ${
                        m.sender === "user" ? "ml-auto bg-blue-600" : "bg-purple-600"
                    }`}>
                        {m.text}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-3">
                <input
                    className="flex-1 p-2 bg-slate-700 rounded outline-none"
                    placeholder="Ask something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={sendMessage} className="bg-blue-500 px-4 rounded-lg">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
