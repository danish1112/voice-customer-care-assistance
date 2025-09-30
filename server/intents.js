const { queryRAG } = require('./rag');

// Mock order status API
function mockOrderStatus(orderId) {
  return `Order ${orderId} is shipped. Expected delivery: Oct 5.`;
}

function mockDelayOrder(orderId){
    return `Contact support if delivery exceeds the estimated date for Order ${orderId}`;
}

async function handleIntent(userInput) {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes('return') || lowerInput.includes('refund')) {
    const orderIdMatch = lowerInput.match(/\d+/);
    const orderId = orderIdMatch ? orderIdMatch[0] : '12345';
    return mockDelayOrder(orderId)
  } else if (lowerInput.includes('order status') || lowerInput.includes('track order')) {
    const orderIdMatch = lowerInput.match(/\d+/);
    const orderId = orderIdMatch ? orderIdMatch[0] : '12345';
    return mockOrderStatus(orderId);
  } else {
    return await queryRAG(userInput); // Fallback to general RAG
  }
}

module.exports = { handleIntent };