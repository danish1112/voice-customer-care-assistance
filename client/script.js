const socket = io('https://voice-customer-care-assistance.vercel.app/'); // Update to Vercel URL after deployment

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

const synth = window.speechSynthesis;
let currentUtterance = null;

document.getElementById('startBtn').addEventListener('click', () => {
  recognition.start();
});

recognition.onstart = () => {
  document.getElementById('startBtn').textContent = 'Listening...';
  document.getElementById('startBtn').classList.add('bg-green-500');
  document.getElementById('startBtn').classList.remove('bg-blue-500');
};

recognition.onend = () => {
  document.getElementById('startBtn').textContent = 'Start Listening';
  document.getElementById('startBtn').classList.add('bg-blue-500');
  document.getElementById('startBtn').classList.remove('bg-green-500');
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  document.getElementById('transcript').textContent = `You: ${transcript}`;
  socket.emit('userMessage', transcript);
};

recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
  document.getElementById('transcript').textContent = 'Error recognizing speech. Try again.';
};

socket.on('botResponse', (response) => {
  if (currentUtterance) {
    synth.cancel(); // Barge-in
  }
  currentUtterance = new SpeechSynthesisUtterance(response);
  currentUtterance.onend = () => {
    currentUtterance = null;
  };
  synth.speak(currentUtterance);
  document.getElementById('transcript').textContent += `\nBot: ${response}`;
});