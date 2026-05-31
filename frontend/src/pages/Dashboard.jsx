import { useState } from 'react'
import api from '../api/axios'
import Chat from './Chat'

export default function Dashboard({ user, onLogout }) {
  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [activeTab, setActiveTab] = useState('resume')

  const uploadResume = async (file) => {
    if (!file || !file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file'); return
    }
    setLoading(true); setError('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResumeData(res.data.parsed)
    } catch (e) {
      setError(e.response?.data?.detail || 'Upload failed')
    }
    setLoading(false)
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    uploadResume(e.dataTransfer.files[0])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">HireAI</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setActiveTab('resume')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'resume' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:text-gray-700'
              }`}>Resume</button>
            <button onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'chat' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:text-gray-700'
              }`}>AI Chat</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user}</span>
          <button onClick={onLogout}
            className="text-sm text-red-400 hover:text-red-600 transition">Logout</button>
        </div>
      </nav>

      {/* Chat Tab */}
      {activeTab === 'chat' ? (
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col" style={{height:'calc(100vh - 65px)'}}>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">AI Career Coach</h1>
          <p className="text-gray-400 text-sm mb-4">
            {resumeData ? 'Chatting based on your uploaded resume' : 'Upload your resume first for personalized advice'}
          </p>
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
            <Chat resumeData={resumeData} />
          </div>
        </div>
      ) : (
        /* Resume Tab */
        <div className="max-w-4xl mx-auto px-6 py-10">
          {!resumeData ? (
            <>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">Resume Analysis</h1>
              <p className="text-gray-400 text-sm mb-8">Upload your resume and let AI analyze it instantly</p>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-2xl p-16 text-center transition ${
                  dragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'
                }`}
              >
                
                <h3 className="text-gray-700 font-medium mb-2">Drop your resume here</h3>
                <p className="text-gray-400 text-sm mb-6">PDF format supported</p>
                <label className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition">
                  Choose File
                  <input type="file" accept=".pdf" className="hidden"
                    onChange={e => uploadResume(e.target.files[0])} />
                </label>
              </div>

              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
              {loading && (
                <div className="text-center mt-8">
                  
                  <p className="text-gray-500 text-sm">Gemini AI is analyzing your resume...</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">{resumeData.full_name}</h1>
                  <p className="text-gray-400 text-sm">{resumeData.email} · {resumeData.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('chat')}
                    className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition">
                    Chat with AI
                  </button>
                  <button onClick={() => setResumeData(null)}
                    className="text-sm border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition">
                    Upload New
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-medium text-gray-800">ATS Score</h2>
                  <span className={`text-2xl font-bold ${
                    resumeData.ats_score >= 70 ? 'text-emerald-500' :
                    resumeData.ats_score >= 50 ? 'text-yellow-500' : 'text-red-500'
                  }`}>{resumeData.ats_score}/100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${
                    resumeData.ats_score >= 70 ? 'bg-emerald-500' :
                    resumeData.ats_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} style={{ width: `${resumeData.ats_score}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                {Object.entries(resumeData.section_scores || {}).map(([key, val]) => (
                  <div key={key} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <div className="text-xl font-bold text-emerald-500">{val}</div>
                    <div className="text-xs text-gray-400 capitalize mt-1">{key}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <h2 className="font-medium text-gray-800 mb-2">Summary</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{resumeData.summary}</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <h2 className="font-medium text-gray-800 mb-3">Skills Detected</h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills?.map((skill, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {resumeData.experience?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                  <h2 className="font-medium text-gray-800 mb-3">Experience</h2>
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{exp.role}</p>
                        <p className="text-xs text-gray-400">{exp.company} · {exp.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {resumeData.education?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                  <h2 className="font-medium text-gray-800 mb-3">Education</h2>
                  {resumeData.education.map((edu, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                      
                      <div>
                        <p className="text-sm font-medium text-gray-800">{edu.degree}</p>
                        <p className="text-xs text-gray-400">{edu.institution} · {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {resumeData.improvements?.length > 0 && (
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
                  <h2 className="font-medium text-amber-800 mb-3">AI Suggestions</h2>
                  {resumeData.improvements.map((tip, i) => (
                    <div key={i} className="flex gap-2 mb-2 last:mb-0">
                      
                      <p className="text-amber-700 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}