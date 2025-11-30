import { useState } from 'react'
import { askChat } from '../api'
import './ChatScreen.css'

export default function ChatScreen({ lastDisease }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm LeafSense AI. Ask me anything about leaf diseases, treatments, or prevention tips."
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await askChat(lastDisease || 'unknown', input)
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: response.answer
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error('Chat error:', err)
      const errorMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: 'Sorry, I encountered an error. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-screen">
      <h1>Ask LeafSense AI</h1>

      <div className="messages-container">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.type}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="message ai">
            <div className="bubble">LeafSense is thinking...</div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about diseases, treatments, or prevention..."
          className="chat-input"
        />
        <button onClick={handleSend} disabled={loading || !input.trim()} className="send-btn">
          Send
        </button>
      </div>
    </div>
  )
}
