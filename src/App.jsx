import { useState } from 'react'
import TextToSpeech from './components/TextToSpeech'
import SpeechToText from './components/SpeechToText'

function App() {
  const [activeTab, setActiveTab] = useState('tts')

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">Sarvam AI Demo</h1>
          
          <div className="flex border-b mb-4">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'tts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('tts')}
            >
              Text to Speech
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'stt' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('stt')}
            >
              Speech to Text
            </button>
          </div>
          
          {activeTab === 'tts' ? <TextToSpeech /> : <SpeechToText />}
        </div>
      </div>
    </div>
  )
}

export default App