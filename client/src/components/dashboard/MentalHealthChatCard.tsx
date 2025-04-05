import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
};

// Function to create a WebSocket connection
const createWebSocketConnection = (): WebSocket | null => {
  try {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    return new WebSocket(wsUrl);
  } catch (error) {
    console.error("WebSocket connection error:", error);
    return null;
  }
};

const MentalHealthChatCard = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I'm your mental health assistant powered by Gemini AI. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Function to navigate to the full mental health page
  const navigateToMentalHealthPage = () => {
    navigate('/mental-health');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize WebSocket connection
  useEffect(() => {
    // Create WebSocket connection
    const socket = createWebSocketConnection();
    webSocketRef.current = socket;
    
    if (socket) {
      // Connection opened
      socket.addEventListener('open', () => {
        console.log('WebSocket connection established');
        setWsConnected(true);
        
        // Uncomment to notify user that the chat is ready
        /* toast({
          title: "Mental Health Support",
          description: "Connected to AI support assistant",
        }); */
      });
      
      // Listen for messages
      socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'chat_response') {
            const botMessage: Message = {
              id: Date.now().toString(),
              sender: 'bot',
              text: data.message,
              timestamp: new Date(data.timestamp)
            };
            
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
          }
        } catch (error) {
          console.error('Error processing message:', error);
          setIsTyping(false);
        }
      });
      
      // Connection closed or error
      socket.addEventListener('close', () => {
        console.log('WebSocket connection closed');
        setWsConnected(false);
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          webSocketRef.current = createWebSocketConnection();
        }, 3000);
      });
      
      socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
      });
    }
    
    // Clean up on unmount
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Compile chat history for context
  const getMessageHistory = (): string => {
    return messages
      .slice(-5) // Only use the last 5 messages for context
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');
  };

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

    // Send message via WebSocket if connected
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      const messagePayload = {
        type: 'chat_message',
        content: inputValue,
        history: getMessageHistory(),
        timestamp: new Date()
      };
      
      webSocketRef.current.send(JSON.stringify(messagePayload));
    } else {
      // Fallback if WebSocket is not connected
      setTimeout(() => {
        const fallbackMessage: Message = {
          id: Date.now().toString(),
          sender: 'bot',
          text: "I'm having trouble connecting to the AI service. Please try again in a moment or refresh the page.",
          timestamp: new Date()
        };
        
        setMessages((prev) => [...prev, fallbackMessage]);
        setIsTyping(false);
        
        // Try to reconnect
        if (!webSocketRef.current || webSocketRef.current.readyState !== WebSocket.OPEN) {
          webSocketRef.current = createWebSocketConnection();
        }
      }, 1500);
    }
  };

  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4 cursor-pointer" onClick={navigateToMentalHealthPage}>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Mental Health Support</h3>
            <p className="text-neutral-600 text-sm">
              24/7 AI chatbot and guided meditation resources
              {wsConnected && (
                <span className="inline-flex items-center ml-2 text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  <span className="text-xs">AI Connected</span>
                </span>
              )}
            </p>
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
            onClick={() => {
              navigateToMentalHealthPage();
              // For a real implementation, we would also set an active tab
            }}
          >
            <span className="material-icons text-sm mr-1">self_improvement</span>
            Meditation
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors rounded"
            onClick={() => {
              navigateToMentalHealthPage();
              // For a real implementation, we would also set an active tab
            }}
          >
            <span className="material-icons text-sm mr-1">video_library</span>
            Therapy Videos
          </Button>
        </div>
        <div className="mt-4 flex justify-end">
          <Button 
            variant="ghost" 
            className="text-primary text-sm flex items-center"
            onClick={navigateToMentalHealthPage}
          >
            View All Resources
            <span className="material-icons text-sm ml-1">arrow_forward</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MentalHealthChatCard;
