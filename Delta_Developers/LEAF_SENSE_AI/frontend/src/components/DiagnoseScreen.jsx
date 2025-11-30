import { useState } from 'react'
import { predictDisease } from '../api'
import './DiagnoseScreen.css'

export default function DiagnoseScreen({ onDiseaseDetected }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target.result)
      }
      reader.readAsDataURL(selectedFile)
      setError(null)
    }
  }

  const handlePredict = async () => {
    if (!file) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await predictDisease(file)
      setPrediction(result)
      onDiseaseDetected(result.predicted_class)
    } catch (err) {
      setError('Failed to analyze image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setPrediction(null)
    setError(null)
  }

  return (
    <div className="diagnose-screen">
      <h1>Diagnose Leaf Disease</h1>
      <p className="subtitle">Capture or upload a leaf photo to analyze with LeafSense AI</p>

      {!preview ? (
        <div className="upload-section">
          <div className="upload-area">
            <span className="upload-icon">📤</span>
            <p>Click to select a leaf image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
        </div>
      ) : (
        <div className="preview-section">
          <img src={preview} alt="Selected leaf" className="preview-image" />
          <div className="button-group">
            {!loading && !prediction && (
              <>
                <button className="btn-primary" onClick={handlePredict}>
                  🔍 Predict Disease
                </button>
                <button className="btn-secondary" onClick={handleReset}>
                  Change Image
                </button>
              </>
            )}
          </div>

          {loading && (
            <div className="loading">
              <p>Analyzing your leaf...</p>
              <div className="spinner"></div>
            </div>
          )}

          {prediction && (
            <div className="prediction-result">
              <div className="result-card">
                <h2>{prediction.predicted_class.replace('_', ' ').toUpperCase()}</h2>
                <div className="confidence">
                  Confidence: <strong>{prediction.confidence}%</strong>
                </div>
              </div>
              <button className="btn-secondary" onClick={handleReset}>
                Scan Another Leaf
              </button>
            </div>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  )
}
