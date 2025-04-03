import React, { useState } from 'react';

function TextToSpeechConverter() {
  const [inputText, setInputText] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [status, setStatus] = useState({ message: '', color: 'black' });
  const [isProcessing, setIsProcessing] = useState(false);

  const convertToSpeech = async () => {
    const text = inputText.trim();

    if (!text) {
      setStatus({ message: 'Please enter some text first', color: 'red' });
      return;
    }

    setStatus({ message: 'Processing...', color: 'black' });
    setAudioSrc('');
    setIsProcessing(true);

    const options = {
      method: 'POST',
      headers: {
        'api-subscription-key': 'YOUR_API_SUBSCRIPTION_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        speaker: "meera",
        pitch: 0,
        pace: 1,
        loudness: 1,
        speech_sample_rate: 22050,
        enable_preprocessing: false,
        target_language_code: "od-IN",
        inputs: [text],
        model: "bulbul:v1"
      })
    };

    try {
      const response = await fetch('https://api.sarvam.ai/text-to-speech', options);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.audios && data.audios.length > 0) {
        setAudioSrc(`data:audio/wav;base64,${data.audios[0]}`);
        setStatus({ message: 'Conversion successful! Click play to listen.', color: 'green' });
      } else {
        throw new Error('No audio data found in response');
      }
    } catch (err) {
      console.error('Error:', err);
      setStatus({ message: `Error: ${err.message}`, color: 'red' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='text-center flex justify-center'>
      <div className='w-md shadow shadow-gray-400 p-8 flex flex-col items-center rounded-2xl'>
        <h1 className='text-2xl text-blue-500 py-5'>Text to Speech Converter</h1>
        <p>Enter your text below and click "Convert to Speech"</p>

        <textarea className='border p-2 rounded-2xl bg-gray-400 my-3'
          id="inputText"
          rows="5"
          cols="50"
          placeholder="Enter text to convert to speech"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <br />
        <button
          id="convertBtn"
          onClick={convertToSpeech}
          disabled={isProcessing}
          style={{ padding: '8px 16px', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
        >
          {isProcessing ? 'Processing...' : 'Convert to Speech'}
        </button>

        <div id="result" style={{ marginTop: '20px' }}>
          <h2>Result</h2>
          {audioSrc && (
            <audio id="audioPlayer" controls style={{ display: 'block', width: '100%' }}>
              <source src={audioSrc} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          )}
          <div id="status" style={{ color: status.color, marginTop: '10px' }}>
            {status.message}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextToSpeechConverter;