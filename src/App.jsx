import { useState } from 'react'
import TextToSpeech from './components/TextToSpeechConverter'

function App() {
  const [activeTab, setActiveTab] = useState('tts')

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <TextToSpeech/>
    </div>
  )
}

export default App