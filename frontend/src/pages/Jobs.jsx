import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Jobs({ resumeData }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    type: 'all',
    remote: 'all',
    minMatch: 0,
    datePosted: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [customQuery, setCustomQuery] = useState('')

  useEffect(() => {
    if (resumeData?.skills?.length > 0) fetchJobs()
  }, [resumeData])

  const fetchJobs = async (overrideQuery = '') => {
    setLoading(true); setError('')
    try {
      const res = await api.post('/jobs/search', {
        skills: resumeData?.skills || [],
        experience_years: resumeData?.experience_years || 0,
        education: resumeData?.education?.[0]?.degree || '',
        custom_query: overrideQuery || customQuery,
        location: filters.location,
        date_posted: filters.datePosted
      })
      setJobs(res.data.jobs)
      setQuery(res.data.query)
    } catch (e) {
      setError('Failed to fetch jobs. Please try again.')
    }
    setLoading(false)
  }

  const filteredJobs = jobs.filter(job => {
    if (filters.type !== 'all' && job.type !== filters.type) return false
    if (filters.remote === 'yes' && !job.remote) return false
    if (filters.remote === 'no' && job.remote) return false
    if (job.match < filters.minMatch) return false
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    return true
  })

  const matchColor = (score) => {
    if (score >= 70) return 'text-emerald-600 bg-emerald-50'
    if (score >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-500 bg-red-50'
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Job Matches</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`text-sm px-4 py-2 rounded-xl border transition ${
              showFilters ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
             Filters {Object.values(filters).some(v => v !== 'all' && v !== '' && v !== 0) ? '●' : ''}
          </button>
          <button onClick={() => fetchJobs()}
            className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition">
            Refresh
          </button>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        {query ? `Matching: "${query}"` : 'Upload your resume to see matched jobs'}
        {filteredJobs.length > 0 && ` · ${filteredJobs.length} jobs found`}
      </p>

      {/* Custom search */}
      <div className="flex gap-2 mb-4">
        <input
          value={customQuery}
          onChange={e => setCustomQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchJobs()}
          placeholder="Search specific role e.g. 'Machine Learning Engineer India'"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition"
        />
        <button onClick={() => fetchJobs()}
          className="bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-emerald-600 transition">
          Search
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
          <h3 className="font-medium text-gray-800 mb-4 text-sm">Filter Jobs</h3>
          <div className="grid grid-cols-2 gap-4">

            <div>
  <label className="text-xs text-gray-400 mb-1 block">Location</label>
  <input
    value={filters.location}
    onChange={e => setFilters({...filters, location: e.target.value})}
    onKeyDown={e => e.key === 'Enter' && fetchJobs()}
    placeholder="e.g. India, London, Singapore"
    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400"
  />
</div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Job Type</label>
              <select value={filters.type}
                onChange={e => setFilters({...filters, type: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400">
                <option value="all">All Types</option>
                <option value="FULLTIME">Full-time</option>
                <option value="PARTTIME">Part-time</option>
                <option value="CONTRACTOR">Contract</option>
                <option value="INTERN">Internship</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Remote</label>
              <select value={filters.remote}
                onChange={e => setFilters({...filters, remote: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400">
                <option value="all">All</option>
                <option value="yes">Remote Only</option>
                <option value="no">On-site Only</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Date Posted</label>
              <select value={filters.datePosted}
                onChange={e => setFilters({...filters, datePosted: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400">
                <option value="all">Any time</option>
                <option value="today">Today</option>
                <option value="3days">Last 3 days</option>
                <option value="week">Last week</option>
                <option value="month">Last month</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Min Match Score: {filters.minMatch}%</label>
              <input type="range" min="0" max="90" step="10"
                value={filters.minMatch}
                onChange={e => setFilters({...filters, minMatch: Number(e.target.value)})}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="flex items-end">
              <button onClick={() => setFilters({ location:'', type:'all', remote:'all', minMatch:0, datePosted:'all' })}
                className="w-full border border-gray-200 text-gray-500 px-3 py-2 rounded-xl text-sm hover:bg-gray-50 transition">
                Clear Filters
              </button>
            </div>

            <div className="col-span-2 flex justify-end mt-2">
  <button onClick={() => fetchJobs()}
    className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 transition">
    Apply Filters & Search
  </button>
</div>
          </div>
        </div>
      )}

      {!resumeData && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center">
          
          <p className="text-amber-700 font-medium">Upload your resume first</p>
          <p className="text-amber-500 text-sm mt-1">Go to the Resume tab to upload your PDF</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          
          <p className="text-gray-500">Finding best job matches for your skills...</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      {/* Job cards */}
      <div className="flex flex-col gap-4">
        {filteredJobs.map((job, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 text-base">{job.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{job.company} · {job.location}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${matchColor(job.match)}`}>
                {job.match}% match
              </span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-4">{job.description}</p>

            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{job.type}</span>
              {job.remote && <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full"> Remote</span>}
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"> {job.salary}</span>
              {job.posted && <span className="text-xs text-gray-400">Posted: {job.posted}</span>}
            </div>

            <a href={job.apply_link} target="_blank" rel="noreferrer"
              className="inline-block text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl transition">
              Apply Now →
            </a>
          </div>
        ))}

        {filteredJobs.length === 0 && !loading && jobs.length > 0 && (
          <div className="text-center py-10 text-gray-400">
            <div className="text-3xl mb-2">🔍</div>
            No jobs match your current filters. Try adjusting them.
          </div>
        )}
      </div>
    </div>
  )
}