import { useState } from 'react'

const SpeechToText = () => {
  const [audioFile, setAudioFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [transcript, setTranscript] = useState('')

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!audioFile) return
    
    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('language', 'en-IN') // Adjust language as needed

      const options = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer xyz' // Replace with your actual API key
        },
        body: formData
      };

      const response = await fetch('https://api.sarvam.ai/speech-to-text', options)
      const data = await response.json()
      
      // Assuming the API returns the transcript in a 'text' field
      // Adjust based on actual API response
      if (data.text) {
        setTranscript(data.text)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to convert speech to text')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="audio" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Audio File
          </label>
          <input
            id="audio"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !audioFile}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Converting...' : 'Convert to Text'}
        </button>
      </form>
      
      {transcript && (
        <div className="mt-4">
          <h2 className="text-sm font-medium text-gray-700 mb-1">Transcript</h2>
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="whitespace-pre-wrap">{transcript}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpeechToText