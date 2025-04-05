import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
};

const MentalHealthChatCard = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I'm your mental health assistant. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate chatbot response
    // In a real implementation, this would use Dialogflow API
    setTimeout(() => {
      const botResponses: string[] = [
        "I understand how you're feeling. Would you like to try a breathing exercise to help with that?",
        "Thank you for sharing. It's normal to feel that way sometimes. Would you prefer to talk more about it or try a guided meditation?",
        "I hear you. Sometimes talking to a professional can be helpful. Would you like me to suggest some resources?",
        "I appreciate you opening up. Let's work through this together. What specific aspect is troubling you the most?"
      ];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Mental Health Support</h3>
            <p className="text-neutral-600 text-sm">24/7 AI chatbot and guided meditation resources</p>
          </div>
          <span className="material-icons text-primary">sentiment_satisfied_alt</span>
        </div>
        <div className="bg-neutral-100 rounded-lg p-4 mb-4 h-60 overflow-y-auto">
          <div className="flex flex-col space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-start ${message.sender === 'user' ? 'justify-end' : ''}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0">
                    <span className="material-icons text-sm">smart_toy</span>
                  </div>
                )}
                <div className={`px-3 py-2 rounded-lg shadow-sm max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-neutral-800'
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0">
                  <span className="material-icons text-sm">smart_toy</span>
                </div>
                <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="flex">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1 rounded-l-lg"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            className="bg-primary text-white rounded-r-lg hover:bg-primary/90 transition-colors"
            onClick={handleSendMessage}
            disabled={isTyping || !inputValue.trim()}
          >
            <span className="material-icons">send</span>
          </Button>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors rounded"
          >
            <span className="material-icons text-sm mr-1">self_improvement</span>
            Meditation
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors rounded"
          >
            <span className="material-icons text-sm mr-1">video_library</span>
            Therapy Videos
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MentalHealthChatCard;
