import { useState } from 'react'
import api from '../api/axios'

export default function Tools({ resumeData }) {
  const [activeTab, setActiveTab] = useState('cover')

  // Cover Letter State
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [coverLoading, setCoverLoading] = useState(false)

  // Interview State
  const [interviewRole, setInterviewRole] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [questions, setQuestions] = useState([])
  const [interviewLoading, setInterviewLoading] = useState(false)
  const [expandedQ, setExpandedQ] = useState(null)

  const generateCoverLetter = async () => {
    if (!resumeData) { alert('Please upload your resume first!'); return }
    if (!jobTitle || !company) { alert('Please enter job title and company name'); return }
    setCoverLoading(true)
    try {
      const res = await api.post('/tools/cover-letter', {
        resume_data: resumeData,
        job_title: jobTitle,
        company_name: company,
        job_description: jobDesc
      })
      setCoverLetter(res.data.cover_letter)
    } catch (e) {
      alert('Failed to generate cover letter')
    }
    setCoverLoading(false)
  }

  const generateInterview = async () => {
    if (!resumeData) { alert('Please upload your resume first!'); return }
    if (!interviewRole) { alert('Please enter the job role'); return }
    setInterviewLoading(true)
    try {
      const res = await api.post('/tools/interview-prep', {
        resume_data: resumeData,
        job_title: interviewRole,
        difficulty
      })
      setQuestions(res.data.questions)
    } catch (e) {
      alert('Failed to generate questions')
    }
    setInterviewLoading(false)
  }

  const categoryColor = (cat) => {
    if (cat?.toLowerCase().includes('technical')) return 'bg-blue-50 text-blue-600'
    if (cat?.toLowerCase().includes('behavioral')) return 'bg-purple-50 text-purple-600'
    if (cat?.toLowerCase().includes('hr')) return 'bg-emerald-50 text-emerald-600'
    return 'bg-amber-50 text-amber-600'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">AI Career Tools</h1>
      <p className="text-gray-400 text-sm mb-6">Generate cover letters and prepare for interviews</p>

      {!resumeData && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center mb-6">
          <div className="text-3xl mb-2"></div>
          <p className="text-amber-700 font-medium text-sm">Upload your resume first from the Resume tab</p>
        </div>
      )}

      {/* Tool Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('cover')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
            activeTab === 'cover'
              ? 'bg-emerald-500 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>
          Cover Letter
        </button>
        <button onClick={() => setActiveTab('interview')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
            activeTab === 'interview'
              ? 'bg-emerald-500 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>
          Interview Prep
        </button>
      </div>

      {/* Cover Letter Tab */}
      {activeTab === 'cover' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Generate Cover Letter</h2>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Job Title *</label>
                  <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. Machine Learning Engineer"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Company Name *</label>
                  <input value={company} onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Infosys"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Job Description (optional but recommended)</label>
                <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)}
                  placeholder="Paste the job description here for a more tailored cover letter..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition resize-none"
                />
              </div>
              <button onClick={generateCoverLetter} disabled={coverLoading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition disabled:opacity-60 self-start">
                {coverLoading ? 'Writing your cover letter...' : 'Generate Cover Letter'}
              </button>
            </div>
          </div>

          {coverLetter && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Your Cover Letter</h2>
                <div className="flex gap-2">
                  <button onClick={() => {
                    navigator.clipboard.writeText(coverLetter)
                    alert('Copied to clipboard!')
                  }}
                    className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                    Copy
                  </button>
                  <button onClick={() => {
                    const blob = new Blob([coverLetter], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `cover-letter-${company}.txt`
                    a.click()
                  }}
                    className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition">
                    ⬇️ Download
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                {coverLetter}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interview Prep Tab */}
      {activeTab === 'interview' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Interview Preparation</h2>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Job Role *</label>
                  <input value={interviewRole} onChange={e => setInterviewRole(e.target.value)}
                    placeholder="e.g. Data Scientist, SDE, ML Engineer"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Difficulty Level</label>
                  <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition">
                    <option value="easy">🟢 Easy (Freshers)</option>
                    <option value="medium">🟡 Medium (1-2 years)</option>
                    <option value="hard">🔴 Hard (Senior level)</option>
                  </select>
                </div>
              </div>
              <button onClick={generateInterview} disabled={interviewLoading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition disabled:opacity-60 self-start">
                {interviewLoading ? 'Generating questions...' : 'Generate Interview Questions'}
              </button>
            </div>
          </div>

          {questions.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-500 font-medium">
                {questions.length} questions generated for <span className="text-emerald-600">{interviewRole}</span>
              </p>
              {questions.map((q, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full mb-2 inline-block ${categoryColor(q.category)}`}>
                          {q.category}
                        </span>
                        <p className="text-sm font-medium text-gray-800">{q.question}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-lg flex-shrink-0">
                      {expandedQ === i ? '↑' : '↓'}
                    </span>
                  </button>

                  {expandedQ === i && (
                    <div className="px-5 pb-5 border-t border-gray-50">
                      <div className="bg-emerald-50 rounded-xl p-4 mt-4 mb-3">
                        <p className="text-xs font-semibold text-emerald-700 mb-2">Model Answer</p>
                        <p className="text-sm text-emerald-800 leading-relaxed">{q.model_answer}</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-amber-700 mb-1">Tip</p>
                        <p className="text-xs text-amber-700">{q.tip}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}