import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

// Simple markdown renderer for basic formatting
const renderMarkdown = (text) => {
  if (!text) return '';

  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/\n/g, '<br />') // Line breaks
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>'); // Code
};

// Mock UI components
const Button = ({ children, onClick, disabled, size, className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors";
  const sizeClasses = { icon: "h-9 w-9", default: "h-9 px-4 py-2" };
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 cursor-pointer";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size || 'default']} bg-blue-600 text-white ${disabledClasses} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className || ''}`}>{children}</div>
);
const CardHeader = ({ children, className }) => (
  <div className={`px-6 py-4 ${className || ''}`}>{children}</div>
);
const CardTitle = ({ children, className }) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className || ''}`}>{children}</h3>
);
const CardContent = ({ children, className }) => (
  <div className={`px-6 pb-6 ${className || ''}`}>{children}</div>
);
const Input = ({ value, onChange, onKeyPress, placeholder, disabled, className, ...props }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
    placeholder={placeholder}
    disabled={disabled}
    className={`flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    {...props}
  />
);

export default function ChatbotWidget({ messagesData, onSendPrompt, onUpdateMessagesData }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesData && messagesData.length > 0) {
      setMessages(messagesData);
    } else {
      // Default welcome message if none provided
      setMessages([
        {
          id: '1',
          type: 'bot',
          content: 'Hello! I can help you analyze your data. What would you like to know?',
          timestamp: new Date()
        }
      ]);
    }
  }, [messagesData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      onUpdateMessagesData?.(updated);
      return updated;
    });

    const currentPrompt = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      let botResponse = '';

      if (onSendPrompt) {
        botResponse = await onSendPrompt(currentPrompt);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        botResponse = `**Analysis Results:** I received your question about "${currentPrompt}".\n\n**Key Insights:**\n- This is a **mock response** with formatting\n- The system is working **correctly**\n- Your data analysis would appear here\n\n**Next Steps:** Please upload your data file for actual analysis.`;
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => {
        const updated = [...prev, botMessage];
        onUpdateMessagesData?.(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error in chat processing:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '**Error:** Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => {
        const updated = [...prev, errorMessage];
        onUpdateMessagesData?.(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="w-full h-96 flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-blue-600" />
            Data Analysis Assistant
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.type === 'bot' ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                    />
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <span
                    className={`text-xs mt-1 block ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2 justify-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your data..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
