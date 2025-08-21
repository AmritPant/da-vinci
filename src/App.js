import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ModelPanel from './components/ModelPanel';
import MessageInput from './components/MessageInput';
import ChatHistory from './components/ChatHistory';
import { FiPlus, FiClock } from 'react-icons/fi';
import { chatHistoryService } from './lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const MODELS = [
  { id: 'openai/gpt-4o', name: 'ChatGPT 5', provider: 'openai', enabled: true },
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'anthropic', enabled: false },
  { id: 'anthropic/claude-opus-4.1', name: 'Claude Opus 4.1', provider: 'anthropic', enabled: false },
  { id: 'deepseek/deepseek-r1', name: 'Deepseek R1', provider: 'deepseek', enabled: false },
  { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'google', enabled: false },
  { id: 'x-ai/grok-4', name: 'Grok 4', provider: 'xai', enabled: false }
];

function App() {
  const [models, setModels] = useState(MODELS);
  const [conversations, setConversations] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  useEffect(() => {
    // Initialize user
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      let storedUserId = localStorage.getItem('davinci_user_id');
      if (!storedUserId) {
        storedUserId = uuidv4();
        localStorage.setItem('davinci_user_id', storedUserId);
      }
      setUserId(storedUserId);
      await chatHistoryService.getOrCreateUser(storedUserId);
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  };

  const toggleModel = (modelId) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, enabled: !model.enabled } : model
    ));
  };

  const sendMessage = async (message, image = null) => {
    console.log('sendMessage called with:', { message, hasImage: !!image, imageName: image?.name });
    if (!message.trim() && !image) return;
    
    if (!apiKey) {
      console.error('API key not found. Please check your .env file.');
      return;
    }

    const enabledModels = models.filter(model => model.enabled);
    if (enabledModels.length === 0) return;
    
    console.log('Sending message to models:', enabledModels.map(m => m.name));
    console.log('API Key present:', !!apiKey);

    // Create new conversation if none exists
    let conversationId = currentConversationId;
    if (!conversationId && userId) {
      try {
        const conversation = await chatHistoryService.createConversation(
          userId,
          message.slice(0, 50) + (message.length > 50 ? '...' : '')
        );
        conversationId = conversation.id;
        setCurrentConversationId(conversationId);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }

    // Convert image to base64 if provided
    let imageBase64 = null;
    if (image) {
      console.log('Converting image to base64:', image.name);
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log('Image converted to base64, length:', e.target.result.length);
          resolve(e.target.result);
        };
        reader.readAsDataURL(image);
      });
    }

    // Add user message to all enabled models
    const userMessage = { 
      role: 'user', 
      content: message || 'What do you see in this image?', 
      timestamp: Date.now(),
      image: imageBase64
    };
    const newConversations = { ...conversations };
    
    enabledModels.forEach(model => {
      if (!newConversations[model.id]) {
        newConversations[model.id] = [];
      }
      newConversations[model.id].push(userMessage);
    });
    
    setConversations(newConversations);

    // Save user message to database
    if (conversationId && userId) {
      try {
        await chatHistoryService.saveMessage(
          conversationId,
          'user',
          'user',
          message,
          Date.now()
        );
        await chatHistoryService.updateConversation(conversationId);
      } catch (error) {
        console.error('Error saving user message:', error);
      }
    }
    setIsLoading(prev => {
      const loading = {};
      enabledModels.forEach(model => loading[model.id] = true);
      return loading;
    });

    // Send requests to all enabled models simultaneously
    const promises = enabledModels.map(async (model) => {
      try {
        // Prepare messages for API call
        const apiMessages = newConversations[model.id].map(msg => {
          if (msg.image) {
            console.log('Formatting message with image for API:', msg.content);
            // For vision models, format message with image
            return {
              role: msg.role,
              content: [
                {
                  type: "text",
                  text: msg.content
                },
                {
                  type: "image_url",
                  image_url: {
                    url: msg.image
                  }
                }
              ]
            };
          } else {
            // Regular text message
            return {
              role: msg.role,
              content: msg.content
            };
          }
        });
        
        console.log('API messages for', model.name, ':', apiMessages);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'DaVinci Multi-Model Chat'
          },
          body: JSON.stringify({
            model: model.id,
            messages: apiMessages,
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: Date.now()
        };

        setConversations(prev => ({
          ...prev,
          [model.id]: [...prev[model.id], assistantMessage]
        }));

        // Save assistant message to database
        if (conversationId && userId) {
          try {
            await chatHistoryService.saveMessage(
              conversationId,
              model.id,
              'assistant',
              data.choices[0].message.content,
              Date.now()
            );
          } catch (error) {
            console.error('Error saving assistant message:', error);
          }
        }
      } catch (error) {
        console.error(`Error with ${model.name}:`, error);
        const errorMessage = {
          role: 'assistant',
          content: `Error: ${error.message}`,
          timestamp: Date.now(),
          isError: true
        };
        
        setConversations(prev => ({
          ...prev,
          [model.id]: [...prev[model.id], errorMessage]
        }));

        // Save error message to database
        if (conversationId && userId) {
          try {
            await chatHistoryService.saveMessage(
              conversationId,
              model.id,
              'assistant',
              `Error: ${error.message}`,
              Date.now()
            );
          } catch (error) {
            console.error('Error saving error message:', error);
          }
        }
      } finally {
        setIsLoading(prev => ({ ...prev, [model.id]: false }));
      }
    });

    await Promise.all(promises);
  };

  const clearConversations = () => {
    setConversations({});
    setCurrentConversationId(null);
  };

  const loadConversation = async (conversation) => {
    try {
      const messages = await chatHistoryService.getConversationMessages(conversation.id);
      
      // Group messages by model, including user messages for all models
      const groupedMessages = {};
      const enabledModelIds = models.filter(m => m.enabled).map(m => m.id);
      
      messages.forEach(msg => {
        if (msg.role === 'user') {
          // Add user messages to all currently enabled models
          enabledModelIds.forEach(modelId => {
            if (!groupedMessages[modelId]) {
              groupedMessages[modelId] = [];
            }
            groupedMessages[modelId].push({
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp,
              isError: false
            });
          });
        } else {
          // Add assistant messages to their specific model
          if (!groupedMessages[msg.model_id]) {
            groupedMessages[msg.model_id] = [];
          }
          groupedMessages[msg.model_id].push({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
            isError: msg.content.startsWith('Error:')
          });
        }
      });
      
      // Sort messages by timestamp for each model
      Object.keys(groupedMessages).forEach(modelId => {
        groupedMessages[modelId].sort((a, b) => a.timestamp - b.timestamp);
      });
      
      setConversations(groupedMessages);
      setCurrentConversationId(conversation.id);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const enabledModels = models.filter(model => model.enabled);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">
            <span className="title-icon">⚡</span>
            DaVinci
          </h1>
        </div>
        
        <div className="model-toggles">
          {models.map(model => (
            <div key={model.id} className="model-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={model.enabled}
                  onChange={() => toggleModel(model.id)}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
                <span className="model-name">{model.name}</span>
              </label>
            </div>
          ))}
        </div>

        <div className="header-right">
          <button 
            className="header-btn"
            onClick={() => setShowHistory(true)}
            title="Chat History"
          >
            <FiClock />
          </button>
          <button 
            className="header-btn"
            onClick={clearConversations}
            title="New Chat"
          >
            <FiPlus />
          </button>
        </div>
      </header>


      <main className="app-main">
        <div className="models-grid">
          {enabledModels.map(model => (
            <ModelPanel
              key={model.id}
              model={model}
              messages={conversations[model.id] || []}
              isLoading={isLoading[model.id] || false}
            />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </main>

      <MessageInput onSendMessage={sendMessage} disabled={enabledModels.length === 0} />
      
      <footer className="app-footer">
        <p>Built with ❤️ by Amrit Pant, in Kathmandu</p>
      </footer>
      
      <ChatHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        userId={userId}
        onLoadConversation={loadConversation}
        currentConversationId={currentConversationId}
      />
    </div>
  );
}

export default App;
