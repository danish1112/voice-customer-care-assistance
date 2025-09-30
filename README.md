# voice-customer-care-assistance
Voice RAG Customer-Care Assistant
A voice-enabled customer care assistant that uses Retrieval-Augmented Generation (RAG) to answer FAQs and a mock API for order status queries. Supports both browser-based voice interaction (Web Speech API) and phone-based interaction (Twilio), with barge-in functionality for interrupting responses.
Live Demo

Browser Demo: https://voice-customer-care-assistance.vercel.app (Replace with your Vercel URL after deployment)
Phone Demo: Call +1 325-425-4029 (Twilio-powered, located in Roby, TX, US)

Features

Browser Voice Demo: Uses Web Speech API for speech-to-text (STT) and text-to-speech (TTS). Users can click "Start Listening" to speak queries like "How do I return an item?" or "What’s the status of order 12345?". Supports barge-in by speaking during responses.
Phone Voice Demo: Uses Twilio for STT and TTS over phone calls. Call the Twilio number to interact, with barge-in support for interrupting responses.
RAG Pipeline: Processes FAQ queries using 10+ documents in server/docs/ (Markdown/JSON), stored in a FAISS vector store with OpenAI embeddings. Responses include citations (e.g., "from returns-policy.md").
Intents: Handles "returns/refunds" via RAG and "order status" via a mock API.
UI: Modern, responsive frontend with Tailwind CSS, featuring a listening button and Twilio phone number details.

Project Structure

server/: Node.js backend (Express, Socket.io, Twilio, LangChain).
index.js: Main server with WebSocket and Twilio webhook (/voice).
rag.js: RAG pipeline with FAISS and OpenAI embeddings.
intents.js: Intent handling for returns (RAG) and order status (mock).
docs/: 10+ FAQ files (e.g., returns-policy.md, order-faq.json).


client/: Frontend with Tailwind CSS UI.
index.html: Main page with browser and phone demo sections.
script.js: Handles Web Speech API and Socket.io for browser demo.


vercel.json: Configures Vercel deployment for server/ and client/.

Setup

Clone the Repository:git clone https://github.com/danish1112/voice-customer-care-assistance.git


Navigate to Server Directory:cd server


Install Dependencies:npm install


Set Up Environment Variables:
Create server/.env with:OPENAI_API_KEY=your_openai_api_key_here
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+13254254029


Get OPENAI_API_KEY from platform.openai.com.
Get Twilio credentials from twilio.com (Console > Dashboard).


Ensure FAQ Documents:
Verify server/docs/ contains 10-15 files (e.g., returns-policy.md, order-faq.json, shipping.md, etc.).
Example files:
returns-policy.md: Details return process.
order-faq.json: Order-related FAQs.
payment-options.json: Payment method FAQs.




Run the Server:npm start


Server runs on http://localhost:3000.
Logs should show "Docs ingested successfully" and "Server running...".



Running the Browser Demo

Open http://localhost:3000 (or Vercel URL) in Chrome.
Click Start Listening (turns green when active).
Speak queries like:
"How do I return an item?" (RAG response with citation).
"What’s the status of order 12345?" (Mock API response).


Barge-in: Speak during a response to interrupt and trigger a new query.
View transcript in the UI (updates with user input and bot responses).

Running the Phone Demo (Twilio)

Set Up Twilio:
In Twilio Console, configure your number (+1 325-425-4029):
Voice & Fax > Webhook: https://your-vercel-url/voice (or ngrok URL for local testing, e.g., https://unhammered-nonmanual-kennedi.ngrok-free.dev/voice).
Method: HTTP POST.




Test Call:
Call +1 325-425-4029 from a verified phone (Twilio Console > Phone Numbers > Verified Numbers).
Hear: "Hello! How can I help you today?..."
Speak queries (same as browser demo).
Barge-in: Speak during a response to interrupt.


Logs: Check server/Vercel logs for /voice POST requests and intent processing.

Deployment (Vercel Free Tier)

Push to GitHub:
Ensure repo (github.com/danish1112/voice-customer-care-assistance) has all files.
Exclude server/.env and server/faiss-index/ (in .gitignore).

git add .
git commit -m "Ready for Vercel deployment"
git push origin main


Deploy to Vercel:
Log in to vercel.com.
Create project, import repo.
Set Root Directory: (leave blank, vercel.json handles it).
Add environment variables in Vercel Settings:OPENAI_API_KEY=your_openai_api_key_here
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+13254254029


Deploy. Note the URL (e.g., https://voice-customer-care-assistance.vercel.app).


Update Twilio Webhook:
In Twilio Console, set webhook to https://your-vercel-url/voice (HTTP POST).


Update WebSocket:
Ensure client/script.js uses const socket = io(); (dynamically uses Vercel URL).


Test:
Browser: Open Vercel URL, test browser demo.
Phone: Call +1 325-425-4029, test phone demo.



Demo Video
[Link to YouTube/Loom video showing browser and phone demos] (Replace with your video link)

Content:
Browser demo: Show UI, test queries ("How do I return an item?", "What’s the status of order 12345?"), demonstrate barge-in.
Phone demo: Call +1 325-425-4029, test same queries, show barge-in.
Logs: Briefly show server/Vercel logs (ingestion success, /voice requests).



Troubleshooting

OpenAI 429 Quota Error:
Check platform.openai.com/billing.
Upgrade plan, use a new API key, or switch to Hugging Face embeddings (see code in project history).


FAISS Index Error:
Verify server/docs/ has 10-15 valid .md or .json files.
Delete server/faiss-index/: rm -rf server/faiss-index/.
Restart server or run node server/ingest.js to debug ingestion:const { ingestDocs } = require('./rag');
ingestDocs().then(() => console.log('Done')).catch(err => console.error(err));




Twilio Webhook Issues:
Ensure webhook URL is HTTPS and public.
Test https://your-vercel-url/voice in a browser (should return TwiML XML).
Check Twilio Debugger (Console > Monitor > Logs).


Browser Demo Issues:
Use Chrome, allow microphone access.
Check browser console for Web Speech API or Socket.io errors.


Permission Issues:
Run chmod -R 755 server/ on macOS/Linux.


Vercel Deployment:
Verify vercel.json is in root.
Check Vercel logs for env var or dependency errors.
Ensure server/index.js serves client/ files.



Technologies

Backend: Node.js, Express, Socket.io, Twilio, LangChain, FAISS, OpenAI.
Frontend: HTML, Tailwind CSS, JavaScript, Web Speech API.
Deployment: Vercel (free tier).
Docs: 10+ FAQ files in server/docs/ (Markdown/JSON).

Notes

Twilio calls may incur charges after free trial credit ($15). Monitor usage in Twilio Console.
OpenAI embeddings require a valid API key with sufficient quota.
Barge-in is supported in both demos (browser via synth.cancel(), phone via Twilio <Gather>).
Deployed on Vercel’s free tier, suitable for demo purposes.

