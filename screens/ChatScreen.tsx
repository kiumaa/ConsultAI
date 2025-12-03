import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality } from '@google/genai';
import { Screen, Consultant, Message } from '../types';
import { createBlob, decode, decodeAudioData } from '../services/audioUtils';
// FIX: Import MicIcon to resolve reference error.
import { SettingsIcon, MenuIcon, MicIcon } from '../components/Icons';

interface ChatScreenProps {
  consultant: Consultant;
  onNavigate: (screen: Screen) => void;
}

type AIState = 'idle' | 'listening' | 'thinking' | 'speaking';

const ChatScreen: React.FC<ChatScreenProps> = ({ consultant, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial', text: `Hello! I'm your ${consultant.name}. How can I help you with your business today?`, sender: 'ai' },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [aiState, setAiState] = useState<AIState>('idle');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  
  const userTranscriptionRef = useRef('');
  const aiTranscriptionRef = useRef('');
  const [tempUserMessage, setTempUserMessage] = useState<string | null>(null);
  const [tempAiMessage, setTempAiMessage] = useState<string | null>(null);
  
  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const stopRecording = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        inputAudioContextRef.current.close();
    }
    setIsRecording(false);
    setAiState('idle');
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    setIsRecording(true);
    setAiState('listening');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: consultant.systemInstruction,
        },
        callbacks: {
          onopen: () => {
            if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed') {
              inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            }
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                setAiState('speaking');
                const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
                const audioContext = outputAudioContextRef.current;
                if (audioContext) {
                    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContext.currentTime);
                    const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputNode);
                    source.addEventListener('ended', () => {
                        audioSourcesRef.current.delete(source);
                        if(audioSourcesRef.current.size === 0) {
                            setAiState(isRecording ? 'listening' : 'idle');
                        }
                    });
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    audioSourcesRef.current.add(source);
                }
             }
             
             if (message.serverContent?.interrupted) {
                for(const source of audioSourcesRef.current.values()){
                    source.stop();
                    audioSourcesRef.current.delete(source);
                }
                nextStartTimeRef.current = 0;
             }

             if (message.serverContent?.inputTranscription) {
                userTranscriptionRef.current += message.serverContent.inputTranscription.text;
                setTempUserMessage(userTranscriptionRef.current);
             }
             if (message.serverContent?.outputTranscription) {
                aiTranscriptionRef.current += message.serverContent.outputTranscription.text;
                setTempAiMessage(aiTranscriptionRef.current);
             }
             if(message.serverContent?.turnComplete) {
                const userMsg = userTranscriptionRef.current.trim();
                const aiMsg = aiTranscriptionRef.current.trim();
                const newMessages: Message[] = [];
                if (userMsg) newMessages.push({ id: `${Date.now()}-user`, text: userMsg, sender: 'user' });
                if (aiMsg) newMessages.push({ id: `${Date.now()}-ai`, text: aiMsg, sender: 'ai' });
                
                if(newMessages.length > 0) {
                    setMessages(prev => [...prev, ...newMessages]);
                }

                userTranscriptionRef.current = '';
                aiTranscriptionRef.current = '';
                setTempUserMessage(null);
                setTempAiMessage(null);
             }
          },
          onerror: (e) => { console.error('Error:', e); stopRecording(); },
          onclose: () => { console.log('Session closed.'); },
        }
      });
    } catch (error) {
      console.error('Failed to get user media', error);
      setIsRecording(false);
      setAiState('idle');
    }
  }, [isRecording, consultant.systemInstruction, stopRecording]);
  
  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    return () => { // Cleanup on unmount
      stopRecording();
    };
  }, [stopRecording]);

  const Pulse = () => {
    return (
        <div className="relative w-48 h-48 flex items-center justify-center transition-all duration-500">
            {aiState === 'listening' && <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-listening"></div>}
            {aiState === 'speaking' && <>
                <div className="speaking-wave" style={{ animationDelay: '0s' }}></div>
                <div className="speaking-wave" style={{ animationDelay: '0.5s' }}></div>
            </>}
            {aiState === 'thinking' && <>
                <div className="thinking-dot" style={{ animationDelay: '0s' }}></div>
                <div className="thinking-dot" style={{ animationDelay: '0.5s' }}></div>
                <div className="thinking-dot" style={{ animationDelay: '1s' }}></div>
            </>}
            <div className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 ${
                aiState === 'listening' ? 'bg-cyan-600' : 'bg-cyan-800'
            }`}>
                 <div className={`w-32 h-32 rounded-full transition-all duration-300 ${
                    aiState === 'listening' ? 'bg-cyan-500' : 'bg-cyan-700'
                }`}></div>
            </div>
        </div>
    );
  };
  
  const getAiStateText = () => {
    switch(aiState) {
        case 'listening': return 'Listening...';
        case 'thinking': return 'Thinking...';
        case 'speaking': return 'Speaking...';
        default: return 'Tap to start';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
        {isMenuOpen && (
            <div className="absolute inset-0 bg-black/60 z-20" onClick={() => setIsMenuOpen(false)}>
                <div className="absolute top-0 left-0 h-full w-2/3 max-w-xs bg-slate-800 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                   <h2 className="text-xl font-bold mb-8 text-white">ConsultAI</h2>
                   <nav className="flex flex-col space-y-4">
                       <button onClick={() => { onNavigate(Screen.Journal); setIsMenuOpen(false); }} className="text-left text-gray-300 hover:text-white text-lg">Business Journal</button>
                       <button onClick={() => { onNavigate(Screen.ActionItems); setIsMenuOpen(false); }} className="text-left text-gray-300 hover:text-white text-lg">Action Items</button>
                   </nav>
                </div>
            </div>
        )}

      <header className="flex justify-between items-center p-4">
        <button onClick={() => setIsMenuOpen(true)} className="p-2 text-gray-300"><MenuIcon /></button>
        <h1 className="text-xl font-bold text-white">ConsultAI</h1>
        <button onClick={() => onNavigate(Screen.Settings)} className="p-2 text-gray-300"><SettingsIcon /></button>
      </header>

      <main className="flex-grow flex flex-col justify-end p-4 space-y-4 overflow-y-auto">
        <div className="flex-grow flex flex-col items-center justify-center">
            <Pulse />
            <p className="mt-4 text-cyan-300">{getAiStateText()}</p>
        </div>
        
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                 {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex-shrink-0"></div>}
                 <div className={`max-w-xs md:max-w-md p-4 rounded-3xl ${msg.sender === 'user' ? 'bg-cyan-800 rounded-br-lg' : 'bg-slate-700 rounded-bl-lg'}`}>
                    <p className="text-white">{msg.text}</p>
                 </div>
                 {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center font-bold">U</div>}
            </div>
        ))}
         {tempUserMessage && <div className="flex justify-end items-end gap-2 opacity-60"><div className="max-w-xs md:max-w-md p-4 rounded-3xl bg-cyan-800 rounded-br-lg"><p className="text-white">{tempUserMessage}</p></div><div className="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center font-bold">U</div></div>}
         {tempAiMessage && <div className="flex justify-start items-end gap-2 opacity-60"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex-shrink-0"></div><div className="max-w-xs md:max-w-md p-4 rounded-3xl bg-slate-700 rounded-bl-lg"><p className="text-white">{tempAiMessage}</p></div></div>}
      </main>
      
      <footer className="p-4 flex justify-center items-center">
        <button onClick={handleMicClick} className="w-20 h-20 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 transform transition-transform active:scale-90">
            <MicIcon className="w-10 h-10" />
        </button>
      </footer>
    </div>
  );
};

export default ChatScreen;