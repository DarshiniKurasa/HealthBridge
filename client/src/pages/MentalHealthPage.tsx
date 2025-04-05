import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const MentalHealthPage = () => {
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
  const [activeTab, setActiveTab] = useState('chat');

  const meditationSessions = [
    {
      id: 1,
      title: "Stress Relief Meditation",
      duration: "10 min",
      level: "Beginner",
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "Deep Sleep Meditation",
      duration: "15 min",
      level: "Intermediate",
      imageUrl: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Anxiety Reduction",
      duration: "12 min",
      level: "All Levels",
      imageUrl: "https://images.unsplash.com/photo-1474418397713-1e1d406a8435?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  const therapyVideos = [
    {
      id: 1,
      title: "Understanding Depression",
      duration: "22 min",
      presenter: "Dr. Lisa Chen",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "Coping with Anxiety",
      duration: "18 min",
      presenter: "Dr. Michael Williams",
      imageUrl: "https://images.unsplash.com/photo-1541199249251-f713e6145474?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Building Emotional Resilience",
      duration: "25 min",
      presenter: "Dr. Sarah Johnson",
      imageUrl: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <span className="text-primary flex items-center cursor-pointer mb-4">
            <span className="material-icons mr-1">arrow_back</span>
            Back to Dashboard
          </span>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Mental Health Support</h1>
        <p className="text-neutral-500">AI-assisted therapy, meditation, and resources</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-white rounded-xl shadow-md overflow-hidden">
          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="chat" className="flex items-center">
                <span className="material-icons mr-2 text-sm">chat</span>
                AI Chat Support
              </TabsTrigger>
              <TabsTrigger value="meditation" className="flex items-center">
                <span className="material-icons mr-2 text-sm">self_improvement</span>
                Meditation
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center">
                <span className="material-icons mr-2 text-sm">video_library</span>
                Therapy Videos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="outline-none">
              <div className="bg-neutral-100 rounded-lg p-4 mb-4 h-[400px] overflow-y-auto">
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
              
              {wsConnected && (
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  <span>Connected to AI Assistant</span>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500">
                  <strong>Note:</strong> While our AI assistant can provide support and guidance, it is not a substitute for professional mental health care. If you're experiencing severe symptoms or having thoughts of self-harm, please contact a mental health professional or emergency services immediately.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="meditation" className="outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meditationSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-lg overflow-hidden shadow border hover:shadow-md transition-shadow">
                    <div className="h-40 overflow-hidden">
                      <img src={session.imageUrl} alt={session.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{session.title}</h3>
                      <div className="flex items-center justify-between mt-2 text-sm text-neutral-500">
                        <span>{session.duration}</span>
                        <span>{session.level}</span>
                      </div>
                      <Button className="w-full mt-3 bg-primary">
                        <span className="material-icons text-sm mr-2">play_circle</span>
                        Start Session
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Popular Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['Stress Relief', 'Sleep', 'Anxiety', 'Depression', 'Focus', 'Self-Esteem', 'Grief', 'Gratitude'].map((category) => (
                    <Button key={category} variant="outline" className="rounded-full">
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {therapyVideos.map((video) => (
                  <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow border hover:shadow-md transition-shadow">
                    <div className="h-40 overflow-hidden relative">
                      <img src={video.imageUrl} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="material-icons text-white text-5xl">play_circle</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{video.title}</h3>
                      <div className="flex items-center justify-between mt-2 text-sm text-neutral-500">
                        <span>{video.presenter}</span>
                        <span>{video.duration}</span>
                      </div>
                      <Button className="w-full mt-3 bg-primary">
                        <span className="material-icons text-sm mr-2">play_circle</span>
                        Watch Video
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['Depression', 'Anxiety', 'PTSD', 'Addiction', 'Stress Management', 'Mindfulness', 'Relationships', 'Trauma'].map((topic) => (
                    <Button key={topic} variant="outline" className="rounded-full">
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="space-y-6">
          <Card className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Crisis Resources</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium flex items-center text-red-700">
                  <span className="material-icons mr-2">emergency</span>
                  Emergency Hotlines
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">National Suicide Prevention Lifeline</span>
                    <Button variant="link" className="text-red-700 p-0 h-auto">988</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Crisis Text Line</span>
                    <Button variant="link" className="text-red-700 p-0 h-auto">Text HOME to 741741</Button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium flex items-center">
                  <span className="material-icons mr-2">support_agent</span>
                  Professional Support
                </h3>
                <p className="text-sm text-neutral-600 mt-1">Connect with licensed therapists and counselors in your area or online.</p>
                <Button className="w-full mt-3">Find a Therapist</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium flex items-center">
                  <span className="material-icons mr-2">groups</span>
                  Support Groups
                </h3>
                <p className="text-sm text-neutral-600 mt-1">Join communities of people going through similar experiences.</p>
                <Button className="w-full mt-3">Browse Groups</Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Mental Health Assessment</h2>
            <p className="text-neutral-600 text-sm mb-4">Take a brief assessment to better understand your mental health and get personalized recommendations.</p>
            <Button className="w-full bg-secondary">
              <span className="material-icons text-sm mr-2">quiz</span>
              Start Assessment
            </Button>
          </Card>
          
          <Card className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Daily Wellness Tip</h2>
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-neutral-700 italic">
                "Practice gratitude daily. Take a moment each day to write down three things you're thankful for. This simple practice can shift your focus and improve your mental well-being."
              </p>
              <Button variant="ghost" className="mt-2 w-full">
                <span className="material-icons text-sm mr-2">refresh</span>
                New Tip
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthPage;