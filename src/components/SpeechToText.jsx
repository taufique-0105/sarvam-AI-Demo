import { useState, useRef, useEffect } from 'react';

function SpeechToText() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const API_KEY = 'YOUR_API_KEY';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(URL.createObjectURL(audioBlob));
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const convertToText = async () => {
    if (activeTab === 'upload' && !selectedFile) {
      setError('Please select an audio file first');
      return;
    }
    
    if (activeTab === 'record' && !recordedAudio) {
      setError('Please record audio first');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setTranscript('');
    
    try {
      const formData = new FormData();
      formData.append("with_timestamps", "false");
      formData.append("with_diarization", "false");
      
      if (activeTab === 'upload') {
        formData.append("file", selectedFile);
      } else {
        const blob = await fetch(recordedAudio).then(r => r.blob());
        formData.append("file", blob, "recording.wav");
      }
      
      formData.append("model", "saarika:flash");
      formData.append("language_code", "unknown");
      
      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': API_KEY
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.transcript) {
        setTranscript(data.transcript);
      } else {
        throw new Error('No transcript in response');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
  };

  const resetFileInput = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Audio to Text Converter</h1>
        <p className="text-center text-gray-600 mb-6">
          Upload an audio file or record directly to convert to text using Sarvam AI
        </p>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'upload' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Audio
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'record' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('record')}
          >
            Record Audio
          </button>
        </div>
        
        {/* Upload Tab Content */}
        {activeTab === 'upload' && (
          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="audioFile"
                ref={fileInputRef}
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="audioFile"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded cursor-pointer transition-colors"
              >
                Choose Audio File
              </label>
              <p className="mt-3 text-sm text-gray-500">
                {selectedFile ? `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})` : 'No file selected'}
              </p>
              {selectedFile && (
                <button
                  onClick={resetFileInput}
                  className="mt-2 text-sm text-red-500 hover:text-red-700"
                >
                  Clear selection
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Record Tab Content */}
        {activeTab === 'record' && (
          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className={`py-2 px-4 rounded font-medium ${isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  Start Recording
                </button>
                <button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className={`py-2 px-4 rounded font-medium ${!isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                >
                  Stop Recording
                </button>
              </div>
              <p className={`text-center text-sm ${isRecording ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                {isRecording ? 'Recording...' : recordedAudio ? 'Recording complete' : 'Ready to record'}
              </p>
              {recordedAudio && (
                <div className="mt-4">
                  <audio controls src={recordedAudio} className="w-full" />
                  <button
                    onClick={() => setRecordedAudio(null)}
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                  >
                    Clear recording
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Convert Button */}
        <button
          onClick={convertToText}
          disabled={
            isLoading ||
            (activeTab === 'upload' && !selectedFile) ||
            (activeTab === 'record' && !recordedAudio)
          }
          className={`w-full py-3 rounded font-medium mb-6 ${(activeTab === 'upload' && !selectedFile) || (activeTab === 'record' && !recordedAudio) || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
        >
          {isLoading ? 'Processing...' : 'Convert to Text'}
        </button>
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Processing audio...</p>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Results */}
        {transcript && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Transcription Result:</h2>
            <div className="bg-white p-3 rounded border border-gray-200 min-h-12">
              <p className="whitespace-pre-wrap">{transcript}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpeechToText;