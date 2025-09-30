const { OpenAIEmbeddings } = require('@langchain/openai');
const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { TextLoader } = require('langchain/document_loaders/fs/text');
const { JSONLoader } = require('langchain/document_loaders/fs/json');
const { ChatOpenAI } = require('@langchain/openai');
const { createStuffDocumentsChain } = require('langchain/chains/combine_documents');
const { createRetrievalChain } = require('langchain/chains/retrieval');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const fs = require('fs');
const path = require('path');

async function ingestDocs() {
  const docsDir = path.join(__dirname, 'docs');
  console.log('Reading docs from:', docsDir);
  let files;
  try {
    files = fs.readdirSync(docsDir);
    console.log('Found files:', files);
  } catch (err) {
    console.error('Error reading docs directory:', err);
    return null;
  }

  if (files.length === 0) {
    console.error('No files found in docs directory');
    return null;
  }

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  const allDocs = [];

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    console.log('Processing file:', filePath);
    let loader;
    if (file.endsWith('.json')) {
      loader = new JSONLoader(filePath);
    } else {
      loader = new TextLoader(filePath);
    }
    try {
      const loadedDocs = await loader.load();
      const splitDocs = await splitter.splitDocuments(loadedDocs);
      splitDocs.forEach(doc => {
        doc.metadata = { source: file };
      });
      allDocs.push(...splitDocs);
    } catch (err) {
      console.error(`Error loading file ${file}:`, err);
    }
  }

  if (allDocs.length === 0) {
    console.error('No documents were loaded');
    return null;
  }

  console.log('Total documents loaded:', allDocs.length);
  try {
    const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
    const vectorStore = await FaissStore.fromDocuments(allDocs, embeddings);
    const indexPath = path.join(__dirname, 'faiss-index');
    await vectorStore.save(indexPath);
    console.log('FAISS index saved successfully at:', indexPath);
    return vectorStore;
  } catch (err) {
    console.error('Error creating FAISS index:', err);
    return null;
  }
}

async function getRAGChain() {
  const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
  const indexPath = path.join(__dirname, 'faiss-index');
  let vectorStore;

  try {
    vectorStore = await FaissStore.load(indexPath, embeddings);
    console.log('FAISS index loaded successfully');
  } catch (err) {
    console.error('Failed to load FAISS index:', err);
    console.log('Attempting to re-ingest documents...');
    vectorStore = await ingestDocs();
    if (!vectorStore) {
      throw new Error('Could not initialize vector store');
    }
  }

  const retriever = vectorStore.asRetriever({ k: 3 });
  const llm = new ChatOpenAI({ model: 'gpt-3.5-turbo', apiKey: process.env.OPENAI_API_KEY });

  const prompt = ChatPromptTemplate.fromTemplate(`
    Answer the question based on the context. Include a short citation from the source doc at the end.
    Question: {question}
    Context: {context}
  `);

  const ragChain = await createRetrievalChain({
    combineDocsChain: await createStuffDocumentsChain({ llm, prompt }),
    retriever,
  });

  return ragChain;
}

async function queryRAG(question) {
  try {
    const chain = await getRAGChain();
    const result = await chain.invoke({ question });
    const citation = result.context[0]?.metadata?.source || 'Unknown';
    return `${result.answer} (from ${citation})`;
  } catch (err) {
    console.error('RAG query error:', err);
    return 'Sorry, I couldn’t process your request due to a missing or corrupted index. (from System)';
  }
}

module.exports = { ingestDocs, queryRAG };