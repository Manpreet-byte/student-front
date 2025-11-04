import React, { useEffect, useState } from 'react'
import './styles.css'

const API_URL = '/api/feedback'

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`inline-block ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    )
  }
  return stars
}

const FeedbackCard = ({ item }) => (
  <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-md">
    <div className="flex items-center justify-between mb-2">
      <div className="text-lg font-semibold text-indigo-600">{item.studentName || 'Anonymous'}</div>
      <div>{renderStars(item.rating)}</div>
    </div>
    <p className="text-sm text-gray-500 mb-3">{new Date(item.timestamp).toLocaleString()}</p>
    <p className="text-gray-700">{item.comment || <span className="italic text-gray-400">No comment provided.</span>}</p>
  </div>
)

export default function FeedbackPage(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true)
      try{
        const res = await fetch(API_URL)
        if(!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setItems(data)
      }catch(err){
        setError(err.message)
      }finally{
        setLoading(false)
      }
    }
    load()
  },[])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">All Feedback (Atlas)</h1>

        {loading && <div className="p-6 bg-gray-100 rounded">Loading...</div>}
        {error && <div className="p-6 bg-red-100 text-red-700 rounded">{error}</div>}

        <div className="grid grid-cols-1 gap-4">
          {items.map(it => (
            <FeedbackCard key={it._id} item={it} />
          ))}
        </div>
      </div>
    </div>
  )
}
