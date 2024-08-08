const serverUrl = "https://jsonplaceholder.typicode.com/posts";

let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to post a quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1,
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to post quote to server:", error);
  }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();

    return serverQuotes.map(quote => ({ text: quote.title, category: quote.body }));
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
    return [];
  }
}

// Function to sync local quotes with server quotes
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  const newQuotes = serverQuotes.filter(serverQuote => {
    return !localQuotes.some(localQuote => 
      localQuote.text === serverQuote.text && localQuote.category === serverQuote.category);
  });

  const mergedQuotes = [...localQuotes, ...newQuotes];

  localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;

  if (newQuotes.length > 0) {
    notifyUser(`New quotes from the server have been added.`);
    filterQuotes();
  }
}

// Function to start periodic syncing
function startPeriodicSync() {
  setInterval(async () => {
    await syncQuotes();
  }, 5000);
}

// Function to notify user of updates
function notifyUser(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Other functions for managing quotes...

startPeriodicSync();  // Start the syncing process
