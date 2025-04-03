import { useState } from 'react'
import TextToSpeech from './components/TextToSpeechConverter'
import SpeechToText from './components/SpeechToText'

function App() {
  const [activeTab, setActiveTab] = useState('tts') // 'tts' or 'stt'

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with toggle */}
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-2xl font-bold text-center">Speech Tools</h1>
        </div>
        
        {/* Toggle buttons */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'tts' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setActiveTab('tts')}
          >
            Text to Speech
          </button>
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'stt' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setActiveTab('stt')}
          >
            Speech to Text
          </button>
        </div>
        
        {/* Content area */}
        <div className="p-6">
          {activeTab === 'tts' ? <TextToSpeech /> : <SpeechToText />}
        </div>
      </div>
    </div>
  )
}

export default App