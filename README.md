---

```markdown
# Voice RAG Customer-Care Assistant

A **voice-enabled customer care assistant** that uses **Retrieval-Augmented Generation (RAG)** to answer FAQs and a **mock API** for order status queries. Supports both **browser-based voice interaction** (Web Speech API) and **phone-based interaction** (Twilio), with **barge-in functionality** to allow users to interrupt ongoing responses.

---

## 🔗 Live Demos

- **🌐 Browser Demo:** [https://voice-customer-care-assistance.vercel.app](https://voice-customer-care-assistance.vercel.app)  
- **📞 Phone Demo:** Call **+1 325-425-4029** (Twilio-powered)

---

## ✨ Features

### ✅ Browser Voice Demo
- Uses Web Speech API for **Speech-to-Text (STT)** and **Text-to-Speech (TTS)**
- Click **"Start Listening"** to ask questions like:
  - “How do I return an item?”
  - “What’s the status of order 12345?”
- **Barge-in supported** — speak while it’s responding to interrupt

### ✅ Phone Voice Demo (Twilio)
- Call the Twilio number and interact via phone
- **Twilio STT/TTS** powers phone responses
- **Barge-in supported** with `<Gather>` TwiML

### ✅ RAG Pipeline
- Uses **FAISS** with **OpenAI Embeddings** to search across 10+ FAQ documents
- Sources include `.md` and `.json` files in `server/docs/`
- FAQ answers include citations (e.g., `from returns-policy.md`)

### ✅ Intents
- RAG-based responses for **returns**, **refunds**, **shipping**
- **Mock API** handles **order status** lookups (e.g., "Where is order 12345?")

---

## 🗂️ Project Structure

```

voice-customer-care-assistance/
├── client/                  # Frontend (HTML, Tailwind, JS)
├── server/                  # Backend (Express, LangChain, Twilio)
│   ├── docs/                # FAQ files (Markdown/JSON)
│   ├── index.js             # Main server (Express + WebSocket)
│   ├── rag.js               # RAG pipeline with FAISS & OpenAI
│   ├── intents.js           # Handles order and FAQ intents
├── vercel.json              # Vercel config
└── README.md                # You're here

````

---

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/danish1112/voice-customer-care-assistance.git
cd voice-customer-care-assistance
````

### 2. Setup Server

```bash
cd server
npm install
```

### 3. Environment Variables

Create a `.env` file in `server/`:

```
OPENAI_API_KEY=your_openai_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+13254254029
```

### 4. Ensure FAQ Documents Exist

Ensure `server/docs/` contains 10+ documents like:

* `returns-policy.md`
* `order-faq.json`
* `shipping.md`
* `payment-options.json`

### 5. Run Server

```bash
npm start
```

* Server runs at `http://localhost:3000`
* You should see:

  ```
  Docs ingested successfully
  Server running on port 3000
  ```

---

## 🧪 Running the Demos

### 🌐 Browser Demo

1. Open [http://localhost:3000](http://localhost:3000) in **Google Chrome**
2. Click **"Start Listening"**
3. Say something like:

   * "How do I return an item?"
   * "Where is order 12345?"
4. Watch barge-in work by speaking during a response

---

### 📞 Phone Demo

1. In Twilio Console, set webhook:

   * **Voice & Fax > Webhook:** `https://your-vercel-url/voice`
   * **Method:** HTTP POST

2. Call the number: `+1 325-425-4029`

3. Test queries (returns, order status) and interrupt mid-response

---

## 🌍 Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Vercel

* Login to [vercel.com](https://vercel.com)
* Import the GitHub repo
* Root directory: *(leave blank, `vercel.json` handles it)*
* Set environment variables in Vercel dashboard:

  * `OPENAI_API_KEY`
  * `TWILIO_ACCOUNT_SID`
  * `TWILIO_AUTH_TOKEN`
  * `TWILIO_PHONE_NUMBER`

### 3. Update Twilio Webhook

* Use your deployed URL: `https://your-vercel-url/voice`

---

## 🎥 Demo Video

📺 [Insert YouTube or Loom Video Link Here]
*Demonstrates both browser and phone demos, barge-in functionality, and logs.*

---

## 🛠️ Troubleshooting

| Issue                          | Fix                                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| **OpenAI 429 Error**           | Check usage at [platform.openai.com/billing](https://platform.openai.com/billing)              |
| **FAISS index error**          | Ensure `server/docs/` has 10+ valid `.md` or `.json` files. Delete `faiss-index/` and restart. |
| **Twilio webhook not working** | Ensure webhook URL is HTTPS and public. Use [ngrok](https://ngrok.com/) for local dev.         |
| **Mic not working (browser)**  | Use **Chrome** and allow microphone permissions                                                |
| **Permission errors**          | Run `chmod -R 755 server/` on macOS/Linux                                                      |

---

## 🧱 Technologies Used

* **Backend:** Node.js, Express, Socket.io, Twilio, LangChain, FAISS, OpenAI
* **Frontend:** HTML, Tailwind CSS, JavaScript, Web Speech API
* **Deployment:** Vercel (Free Tier)

---

## ⚠️ Notes

* Twilio may charge after free credit expires. Monitor usage.
* OpenAI API usage is billable — check your usage and quotas.
* Barge-in is supported in both browser and phone modes.
* Project is deployed using Vercel’s free tier — great for demos!

---

## 📄 License

MIT License

---

```
```
