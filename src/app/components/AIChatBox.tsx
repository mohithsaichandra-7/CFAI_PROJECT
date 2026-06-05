import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2 } from 'lucide-react';
import { InventoryItem, RestockOrder } from '../types/inventory';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

type InventoryItemWithLounge = InventoryItem & { lounge: string };

interface AIChatBoxProps {
  inventory: InventoryItemWithLounge[];
  orders: RestockOrder[];
}

export function AIChatBox({ inventory, orders }: AIChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant for inventory management. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Critical stock queries
    if (lowerMessage.includes('critical') || lowerMessage.includes('low stock') || lowerMessage.includes('running out')) {
      const criticalItems = inventory.filter(item => {
        const percentage = (item.currentStock / item.maxCapacity) * 100;
        return percentage <= 20;
      });
      if (criticalItems.length === 0) {
        return 'Good news! No items are currently at critical levels. All inventory is well-stocked.';
      }
      const itemList = criticalItems.map(item => `${item.name} at ${item.lounge} (${item.currentStock}/${item.maxCapacity} ${item.unit})`).join(', ');
      return `⚠️ Alert: ${criticalItems.length} item(s) at critical levels: ${itemList}. Recommend immediate restocking.`;
    }

    // Specific lounge queries
    if (lowerMessage.includes('terminal a') || lowerMessage.includes('lounge a')) {
      const loungeItems = inventory.filter(item => item.lounge.toLowerCase().includes('terminal a'));
      const critical = loungeItems.filter(item => (item.currentStock / item.maxCapacity) * 100 <= 20).length;
      return `Terminal A Lounge has ${loungeItems.length} items tracked. ${critical > 0 ? `${critical} items need attention.` : 'All items are well-stocked.'}`;
    }
    if (lowerMessage.includes('terminal b') || lowerMessage.includes('lounge b')) {
      const loungeItems = inventory.filter(item => item.lounge.toLowerCase().includes('terminal b'));
      const critical = loungeItems.filter(item => (item.currentStock / item.maxCapacity) * 100 <= 20).length;
      return `Terminal B Lounge has ${loungeItems.length} items tracked. ${critical > 0 ? `${critical} items need attention.` : 'All items are well-stocked.'}`;
    }
    if (lowerMessage.includes('terminal c') || lowerMessage.includes('lounge c')) {
      const loungeItems = inventory.filter(item => item.lounge.toLowerCase().includes('terminal c'));
      const critical = loungeItems.filter(item => (item.currentStock / item.maxCapacity) * 100 <= 20).length;
      return `Terminal C Lounge has ${loungeItems.length} items tracked. ${critical > 0 ? `${critical} items need attention.` : 'All items are well-stocked.'}`;
    }

    // Orders queries
    if (lowerMessage.includes('order') && (lowerMessage.includes('pending') || lowerMessage.includes('status'))) {
      const pendingOrders = orders.filter(order => order.status === 'pending');
      if (pendingOrders.length === 0) {
        return 'No pending orders at the moment. All orders are either completed or in transit.';
      }
      return `You have ${pendingOrders.length} pending order(s). Latest orders are being processed for ${pendingOrders.slice(0, 3).map(o => o.loungeName).join(', ')}.`;
    }

    // Specific item queries
    const itemKeywords = ['whisky', 'vodka', 'wine', 'champagne', 'beer', 'gin', 'rum', 'sandwich', 'salad', 'wrap', 'chips', 'nuts'];
    for (const keyword of itemKeywords) {
      if (lowerMessage.includes(keyword)) {
        const matchingItems = inventory.filter(item => item.name.toLowerCase().includes(keyword));
        if (matchingItems.length > 0) {
          const item = matchingItems[0];
          const percentage = ((item.currentStock / item.maxCapacity) * 100).toFixed(0);
          return `${item.name} at ${item.lounge}: ${item.currentStock}/${item.maxCapacity} ${item.unit} (${percentage}% capacity). Consumption rate: ${item.consumptionRate} ${item.unit}/hr.`;
        }
      }
    }

    // Peak flight queries
    if (lowerMessage.includes('peak') || lowerMessage.includes('busy') || lowerMessage.includes('rush hour')) {
      return 'Peak flight hours are typically 6-9 AM and 5-8 PM. During these times, consumption rates increase by 2-3x. I recommend checking critical stock levels before peak hours.';
    }

    // Restock recommendations
    if (lowerMessage.includes('restock') || lowerMessage.includes('order now') || lowerMessage.includes('what should i order')) {
      const needsRestock = inventory.filter(item => item.currentStock <= item.reorderThreshold);
      if (needsRestock.length === 0) {
        return 'No items currently need restocking. All inventory levels are above reorder thresholds.';
      }
      const itemList = needsRestock.slice(0, 5).map(item => `${item.name} (${item.currentStock} ${item.unit} remaining)`).join(', ');
      return `${needsRestock.length} item(s) need restocking: ${itemList}. ${needsRestock.length > 5 ? 'And more...' : ''}`;
    }

    // Help queries
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return 'I can help you with:\n• Check critical/low stock items\n• Monitor specific lounges (Terminal A, B, C)\n• Track order status\n• Get item-specific inventory info\n• Restock recommendations\n• Peak hour insights\n\nTry asking "What items are critical?" or "Show Terminal A status"';
    }

    // Default response
    return 'I understand you\'re asking about inventory management. Could you be more specific? Try asking about critical stock, specific lounges, orders, or type "help" for more options.';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      if (isSpeaking) {
        speakText(aiResponse);
      }
    }, 500);

    setInputValue('');
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeaker = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all z-50 hover:scale-110"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-semibold">AI Inventory Assistant</h3>
              </div>
              <button
                onClick={toggleSpeaker}
                className={`p-1 rounded hover:bg-blue-800 transition-colors ${isSpeaking ? 'bg-blue-800' : ''}`}
                title={isSpeaking ? 'Voice responses ON' : 'Voice responses OFF'}
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-green-300' : 'text-white/70'}`} />
              </button>
            </div>
            <p className="text-xs text-blue-100 mt-1">Ask about inventory, orders, or stock levels</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={toggleVoiceInput}
                className={`p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isListening ? 'Listening...' : 'Voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {isListening && (
              <p className="text-xs text-red-600 mt-2 animate-pulse">🎤 Listening...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
