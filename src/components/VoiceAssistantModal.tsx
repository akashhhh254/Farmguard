import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  X, 
  Sparkles, 
  Sprout, 
  HeartPulse, 
  RefreshCw, 
  HelpCircle 
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { processVoiceQuery } from '../services/api';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language];
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते किसान साथी! मैं फार्मगार्ड एआई सहायक हूँ। आप अपनी फसल या पशु स्वास्थ्य के बारे में बोलकर या लिखकर पूछ सकते हैं।'
          : language === 'mr'
          ? 'नमस्कार शेतकरी मित्र! मी फार्मगार्ड एआय साहाय्यक आहे. आपण आपल्या पिकांच्या किंवा जनावरांच्या आरोग्याबद्दल विचारू शकता.'
          : 'Hello Farmer! I am your FarmGuard AI Voice Assistant. Ask me anything about crop diseases or livestock health care.',
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleSendQuery(text);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type your query below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendQuery = async (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setTranscript('');
    setIsLoading(true);

    try {
      const result = await processVoiceQuery(text, language);
      setMessages((prev) => [...prev, { sender: 'assistant', text: result.response }]);
      speakReply(result.response);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I am temporarily unable to reach the agronomy assistant. Please check your network or try one of the offline guides.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakReply = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  const quickQuestions =
    language === 'hi'
      ? [
          'कपास की पत्तियों पर भूरे धब्बे हैं, क्या उपाय करें?',
          'टमाटर में अगेती झुलसा रोग के लक्षण क्या हैं?',
          'गाय चारा नहीं खा रही है, प्राथमिक उपचार क्या है?',
        ]
      : language === 'mr'
      ? [
          'कापसाच्या पानांवर तपकिरी ठिपके दिसत आहेत, काय करावे?',
          'टोमॅटोवरील अर्ली ब्लाइट रोगाची लक्षणे कोणती?',
          'गाय चारा खात नाहीये, प्राथमिक उपाय काय करावा?',
        ]
      : [
          'My cotton leaves have brown spots, what should I do?',
          'How to identify tomato early blight disease?',
          'What should I do if my cow is not eating fodder?',
        ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
      <div className="bg-white rounded-2xl max-w-lg w-full h-[600px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <span>{t.voiceAssistant}</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-semibold uppercase">
                  {language.toUpperCase()}
                </span>
              </h3>
              <p className="text-[11px] text-emerald-100">Speak or type in your native farming language</p>
            </div>
          </div>

          <button onClick={onClose} className="text-white/80 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sprout className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => speakReply(msg.text)}
                    className="mt-2 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen Again</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Analyzing agronomy knowledge...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(q)}
              className="shrink-0 text-[11px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          {/* Mic Button */}
          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl cursor-pointer transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md'
                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
            }`}
            title="Toggle Microphone"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(transcript)}
            placeholder={isListening ? 'Listening to voice...' : 'Type your question or speak...'}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendQuery(transcript)}
            disabled={!transcript.trim() || isLoading}
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
