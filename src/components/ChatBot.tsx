import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! 👋 I'm here to help you with any questions about ELEVANA's services. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);

  const botResponses = [
    "Thanks for your question! Our team specializes in Instagram optimization, local SEO, and business automation. Would you like to know more about any specific service?",
    "That's a great question! We typically see results within 30 days for most of our clients. Would you like to schedule a free consultation to discuss your specific needs?",
    "Our pricing varies based on your specific needs and business size. I'd recommend booking a free audit call to get a personalized quote. Would you like me to help you schedule that?",
    "We work with businesses of all sizes, from local cafes to larger retail chains. Our solutions are customized for each client's unique needs and goals.",
    "Absolutely! We provide ongoing support and can scale our services as your business grows. Would you like to learn more about our growth packages?",
    "That's exactly what we help with! Many of our clients had similar challenges before working with us. I'd suggest speaking with our team about a customized solution. Shall I help you get in touch?",
    "Great question! We use proven strategies including content optimization, hashtag research, engagement tactics, and automation tools. Would you like to see some case studies?",
    "We typically start seeing engagement improvements within the first week, with more substantial growth by week 3-4. Every business is different though. Want to discuss your specific situation?"
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow hover:shadow-primary hover-lift z-50"
          variant="gradient"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-elegant z-50 flex flex-col max-w-[calc(100vw-3rem)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-primary" />
              ELEVANA Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${
                      msg.isBot ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {msg.isBot && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-lg text-sm ${
                        msg.isBot
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground ml-auto'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {!msg.isBot && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  variant="gradient"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                For complex questions, our team will get back to you!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatBot;