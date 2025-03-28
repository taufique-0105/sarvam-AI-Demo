import { useState } from 'react';

// Import env and set api keys
const ENV_KEY = import.meta.env.REACT_APP_SARVAM_API_KEY
const DEFAULT_API_KEY = 'b653a142-ba6c-4e47-b6ce-6b04f5acafcd' // please dont use this key get your own
const MY_API_KEY = ENV_KEY > 5 ? ENV_KEY : DEFAULT_API_KEY

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAudioUrl('');
    
    try {
      const requestBody = {
        inputs: [text.replaceAll("\n", ". ")],
        target_language_code: "en-IN",
        speaker: "meera",
        pitch: 0,
        pace: 1,
        loudness: 1,
        speech_sample_rate: 16000,
        enable_preprocessing: true,
        model: "bulbul:v1"
      };

      const requestBodyv2 = {
        inputs: [text.replaceAll("\n", ". ")],
        target_language_code: "en-IN",
        model: "bulbul:v1"
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Try different authentication methods
          'Authorization': `Bearer ${MY_API_KEY}`, // Replace with your actual key
          'x-api-key': MY_API_KEY, // Some APIs use this
          'api-key': MY_API_KEY, // Alternative header name
          'api-subscription-key': MY_API_KEY // Sarvam ai specific header
        },
        body: JSON.stringify(requestBodyv2) // switch to v2 default value = better output
      };

      const response = await fetch('https://api.sarvam.ai/text-to-speech', options);
      
      // First check if we got a 403 error
      if (response.status === 403) {
        const errorData = await response.json();
        console.error("Authentication failed:", errorData);
        throw new Error(
          errorData.message || 
          errorData.error || 
          "Authentication failed. Please check your API key."
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to convert text to speech');
      }

      // Handle successful response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.audios) {
          const audioBlob = base64ToBlob(data.audios[0], 'audio/mpeg');
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        } else if (data.audio_data) {
          const audioBlob = base64ToBlob(data.audio_data, 'audio/mpeg');
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        }
      } else if (contentType && contentType.includes('audio/')) {
        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(
        typeof error.message === 'string' 
          ? error.message 
          : 'Failed to convert text to speech'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Text
          </label>
          <textarea
            id="text"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Converting...' : 'Convert to Speech'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Please ensure:
            <ul className="list-disc pl-5">
              <li>Your API key is correct</li>
              <li>Your account is active</li>
              <li>You have proper permissions</li>
            </ul>
          </p>
        </div>
      )}
      
      {audioUrl && (
        <div className="mt-4">
          <h2 className="text-sm font-medium text-gray-700 mb-1">Generated Audio</h2>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;