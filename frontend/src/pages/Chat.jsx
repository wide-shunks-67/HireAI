import { useState, useRef, useEffect } from 'react'
import api from '../api/axios'

export default function Chat({ resumeData }) {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: resumeData
        ? `Hi! I've analyzed your resume. You have strong skills in ${resumeData.skills?.slice(0,3).join(', ')} and your ATS score is ${resumeData.ats_score}/100. What would you like to know?`
        : "Hi! I'm HireAI, your career coach. Upload your resume first for personalized advice, or ask me anything about careers!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const suggestions = [
  "What specific jobs suit my skills?",
  "Which companies should I apply to?",
  "What skills should I learn next?",
  "Write a cover letter for ML Engineer role",
  "How do I crack a data science interview?",
  "How can I improve my ATS score?"
]

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg) return

    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/chat/message', {
        message: msg,
        resume_data: resumeData || {},
        chat_history: newMessages.slice(-6).map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          content: m.content
        }))
      })
      setMessages(prev => [...prev, { role: 'model', content: res.data.reply }])
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'model',
        content: 'Sorry, something went wrong. Please try again.'
      }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
              msg.role === 'model' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {msg.role === 'model' ? 'AI' : 'You'}
            </div>
            <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-emerald-500 text-white rounded-tr-sm'
                : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm">AI</div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-3 flex gap-2 flex-wrap">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-full hover:border-emerald-400 hover:text-emerald-600 transition">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask anything about your resume or career..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
        />
        <button onClick={() => send()}
          disabled={loading || !input.trim()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-medium transition disabled:opacity-50">
          Send
        </button>
      </div>
    </div>
  )
}