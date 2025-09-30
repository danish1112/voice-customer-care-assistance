require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { ingestDocs } = require('./rag');
const { handleIntent } = require('./intents');
const path = require('path');
const twilio = require('twilio'); // New: Twilio SDK
const VoiceResponse = twilio.twiml.VoiceResponse; // For generating TwiML

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware for Twilio (parse form data)
app.use(express.urlencoded({ extended: false }));

// Serve the client files (browser demo)
app.use(express.static(path.join(__dirname, '../client')));

// Global flag to track ingestion status
let ingestionComplete = false;

// Ingest docs on startup
ingestDocs()
  .then(() => {
    console.log('Docs ingested successfully');
    ingestionComplete = true;
  })
  .catch(err => {
    console.error('Error ingesting docs:', err);
    ingestionComplete = false;
  });

// New: Twilio Voice Webhook Endpoint
app.post('/voice', async (req, res) => {
  const twiml = new VoiceResponse();
  const userInput = req.body.SpeechResult; // Transcribed speech from <Gather>

  if (userInput) {
    // Process with your existing intent handler (RAG or mock API)
    let response;
    if (!ingestionComplete) {
      response = 'Please wait, initializing knowledge base...';
    } else {
      try {
        response = await handleIntent(userInput);
      } catch (err) {
        console.error('Error handling intent:', err);
        response = 'Sorry, an error occurred. Please try again.';
      }
    }
    twiml.say({ voice: 'Polly.Joanna-Neural' }, response); // TTS with natural voice
  } else {
    // Initial greeting or no input
    twiml.say({ voice: 'Polly.Joanna-Neural' }, 'Hello! How can I help you today? Say something about returns, order status, or anything else.');
  }

  // Always end with <Gather> to collect next input (loops conversation)
  const gather = twiml.gather({
    input: 'speech', // STT mode
    action: '/voice', // POST back to this endpoint
    method: 'POST',
    speechTimeout: 'auto', // Handles pauses in speech
    timeout: 10, // Wait 10s for input after prompt
    language: 'en-US',
    speechModel: 'default' // Or 'phone_call' for better phone accuracy
  });
  // Optional: Add hints for better STT accuracy (e.g., common intents)
  gather.say({ voice: 'Polly.Joanna-Neural' }, 'Go ahead, I\'m listening...');

  // If no input, redirect to loop (prevents hangup)
  twiml.redirect('/voice');

  res.type('text/xml'); // TwiML response
  res.send(twiml.toString());
});

// Browser WebSocket (unchanged)
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('userMessage', async (message) => {
    try {
      if (!ingestionComplete) {
        socket.emit('botResponse', 'Please wait, initializing knowledge base...');
        return;
      }
      const response = await handleIntent(message);
      socket.emit('botResponse', response);
    } catch (err) {
      console.error('Error handling intent:', err);
      socket.emit('botResponse', 'Sorry, an error occurred. Please try again.');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));