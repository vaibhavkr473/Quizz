import React, { useState, useRef, useEffect } from 'react';
import { 
  Paper, IconButton, TextField, Typography, Avatar, Box, 
  Chip, CircularProgress, Tooltip, Badge, Divider 
} from '@mui/material';
import { 
  Send, Close, SmartToy, Person, Google, AutoAwesome,
  LocationOn, AccessTime, School, MenuBook, Info
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import styles from '../styles/components/Chatbot.module.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm QuizMaster AI. How can I help you today?", 
      sender: 'bot',
      model: 'system' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const messagesEndRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize AI models
  const gemini = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  // const openai = new OpenAI(import.meta.env.VITE_OPENAI_API_KEY);
  // const mistral = new MistralClient(import.meta.env.VITE_MISTRAL_API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (!isOpen && messages.length > 1) {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const quickActions = [
    { icon: <School />, text: "Study Tips" },
    { icon: <AccessTime />, text: "Time Management" },
    { icon: <MenuBook />, text: "Course Help" },
    { icon: <Info />, text: "Quiz Rules" }
  ];

  const suggestionChips = [
    "How to start a quiz?",
    "View my results",
    "Payment issues",
    "Technical support"
  ];

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const getAIResponse = async (input) => {
    try {
      switch (selectedModel) {
        case 'gemini':
          const genAI = gemini.getGenerativeModel({ model: "gemini-pro" });
          const result = await genAI.generateContent(input);
          return result.response.text();

        case 'gpt':
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: input }],
          });
          return completion.choices[0].message.content;

        case 'mistral':
          const mistralResponse = await mistral.chat({
            messages: [{ role: "user", content: input }],
          });
          return mistralResponse.choices[0].message.content;

        default:
          return "Please select an AI model.";
      }
    } catch (error) {
      console.error('AI Response Error:', error);
      return "Sorry, I encountered an error. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      id: messages.length + 1, 
      text: input, 
      sender: 'user' 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(input);
      const botMessage = { 
        id: messages.length + 2, 
        text: aiResponse, 
        sender: 'bot',
        model: selectedModel 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {isOpen && (
        <div className={styles.chatWindow}>
          <Paper elevation={3} className={styles.chatContainer}>
            {/* Header */}
            <Box className={styles.chatHeader}>
              <Box className={styles.headerContent}>
                <Avatar className={styles.botAvatar}>
                </Avatar>
                <Typography variant="h6">QuizMaster AI</Typography>
              </Box>
              <IconButton onClick={() => setIsOpen(false)} size="small">
                <Close />
              </IconButton>
            </Box>

            {/* Model Selection */}
            <Box className={styles.modelSelector}>
              <Tooltip title="Google Gemini">
                <Chip
                  icon={<Google />}
                  label="Gemini"
                  onClick={() => handleModelSelect('gemini')}
                  color={selectedModel === 'gemini' ? 'primary' : 'default'}
                  className={styles.modelChip}
                />
              </Tooltip>
              <Tooltip title="OpenAI GPT">
                <Chip
                  icon={<AutoAwesome />}
                  label="GPT"
                  onClick={() => handleModelSelect('gpt')}
                  color={selectedModel === 'gpt' ? 'primary' : 'default'}
                  className={styles.modelChip}
                />
              </Tooltip>
              <Tooltip title="Mistral AI">
                <Chip
                  icon={<SmartToy />}
                  label="Mistral"
                  onClick={() => handleModelSelect('mistral')}
                  color={selectedModel === 'mistral' ? 'primary' : 'default'}
                  className={styles.modelChip}
                />
              </Tooltip>
            </Box>

            {/* Quick Actions */}
            <Box className={styles.quickActions}>
              {quickActions.map((action, index) => (
                <Tooltip key={index} title={action.text}>
                  <IconButton 
                    onClick={() => setInput(action.text)}
                    className={styles.quickActionButton}
                  >
                    {action.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>

            {/* Messages */}
            <Box className={styles.messageContainer}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${styles.message} ${
                    message.sender === 'bot' ? styles.botMessage : styles.userMessage
                  }`}
                >
                  <Avatar className={styles.messageAvatar}>
                    {message.sender === 'bot' ? <SmartToy sx={{ fontSize: 40 }} /> : <Person />}
                  </Avatar>
                  <Paper className={styles.messageBubble}>
                    <Typography>{message.text}</Typography>
                    {message.model && (
                      <Typography variant="caption" className={styles.modelTag}>
                        via {message.model}
                      </Typography>
                    )}
                  </Paper>
                </motion.div>
              ))}
              {isTyping && (
                <Box className={`${styles.message} ${styles.botMessage}`}>
                  <Avatar className={styles.messageAvatar}>
                    <SmartToy />
                  </Avatar>
                  <Paper className={styles.messageBubble}>
                    <CircularProgress size={20} />
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Suggestions */}
            <Box className={styles.suggestionsContainer}>
              {suggestionChips.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  onClick={() => setInput(suggestion)}
                  className={styles.suggestionChip}
                />
              ))}
            </Box>

            {/* Input */}
            <Box className={styles.inputContainer}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                multiline
                maxRows={3}
              />
              <IconButton 
                onClick={handleSend}
                color="primary"
                disabled={!input.trim()}
              >
                <Send />
              </IconButton>
            </Box>
          </Paper>
        </div>
      )}

      <Badge badgeContent={unreadCount} color="error">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={styles.chatbotIcon}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Avatar className={styles.mainBotAvatar}>
            <SmartToy fontSize="large" />
          </Avatar>
        </motion.div>
      </Badge>
    </>
  );
};

export default Chatbot;
