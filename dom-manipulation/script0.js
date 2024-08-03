// Array to store quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Wisdom" }
  ];
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
  
    // Check if both the quote text and category are not empty
    if (newQuoteText !== '' && newQuoteCategory !== '') {
      // Create a new quote object
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
  
      // Add the new quote to the quotes array
      quotes.push(newQuote);
  
      // Clear the input fields
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
  
      // Optionally, notify the user that the quote was added
      alert('Quote added successfully!');
    } 
    else
     {
      // Notify the user to fill in both fields
      alert('Please enter both a quote and a category.');
    }
  }
  
  // Function to display a random quote
  function showRandomQuote() 
  {
    if (quotes.length > 0) {
      // Get a random index
      const randomIndex = Math.floor(Math.random() * quotes.length);
  
      // Get the random quote
      const randomQuote = quotes[randomIndex];
  
      // Display the random quote
      const quoteDisplay = document.getElementById('randomQuoteDisplay');
      quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
    } 
    else 
    {
      // Notify if there are no quotes available
      alert('No quotes available.');
    }
  }
  