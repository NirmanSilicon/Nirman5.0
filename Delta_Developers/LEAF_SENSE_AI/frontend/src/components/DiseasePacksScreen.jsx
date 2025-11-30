import { useState, useEffect } from 'react'
import { fetchDiseasePacks } from '../api'
import './DiseasePacksScreen.css'

export default function DiseasePacksScreen() {
  const [packs, setPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCrop, setExpandedCrop] = useState(null)

  useEffect(() => {
    loadPacks()
  }, [])

  const loadPacks = async () => {
    setLoading(true)
    try {
      const data = await fetchDiseasePacks()
      setPacks(data.packs || [])
    } catch (err) {
      console.error('Failed to load disease packs:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="disease-packs-screen">
        <h1>Disease Packs</h1>
        <div className="loading"><p>Loading disease information...</p></div>
      </div>
    )
  }

  return (
    <div className="disease-packs-screen">
      <h1>Disease Packs</h1>
      <p className="subtitle">Browse disease information for common crops</p>

      <div className="packs-list">
        {packs.map((pack, cropIndex) => (
          <div key={cropIndex} className="crop-section">
            <button
              className={`crop-header ${expandedCrop === cropIndex ? 'expanded' : ''}`}
              onClick={() => setExpandedCrop(expandedCrop === cropIndex ? null : cropIndex)}
            >
              <span>{pack.crop}</span>
              <span className="toggle">▼</span>
            </button>

            {expandedCrop === cropIndex && (
              <div className="crop-diseases">
                {pack.diseases.map((disease, diseaseIndex) => (
                  <div key={diseaseIndex} className="disease-card">
                    <h3>{disease.name}</h3>
                    <div className="disease-info">
                      <div className="info-item">
                        <strong>Symptoms:</strong>
                        <p>{disease.symptoms}</p>
                      </div>
                      <div className="info-item">
                        <strong>Treatment:</strong>
                        <p>{disease.treatment}</p>
                      </div>
                      <div className="info-item">
                        <strong>Prevention:</strong>
                        <p>{disease.prevention}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
