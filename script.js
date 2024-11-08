// Add event listener to the submit button
document.getElementById("submitBtn").addEventListener("click", function() {
  // Get user input from the text box
  let userMessage = document.getElementById("userMessage").value;

  // If the input is empty, do nothing
  if (userMessage.trim() === "") {
    return;
  }

  // Display user message in the chatbox
  let chatBox = document.getElementById("chatbox");
  chatBox.innerHTML += `<div class="userMessage">${userMessage}</div>`;

  // Clear the input box
  document.getElementById("userMessage").value = "";

  // Query the SheetDB API to get all data from the Google Sheets
  fetch("https://sheetdb.io/api/v1/pllqafkqez65v")
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      console.log("Fetched data:", data); // Check the fetched data in the console

      // Create a Fuse.js instance for fuzzy matching
      const options = {
        includeScore: true,   // Include the score to see how close the match is
        threshold: 0.3,       // Allow slight tolerance for fuzziness (lower means stricter)
        keys: ['user_input']  // Search only the 'user_input' column
      };
      const fuse = new Fuse(data, options);

      // Search for the best match based on user input
      const result = fuse.search(userMessage);

      // Check if a result exists
      if (result.length > 0) {
        // Get the best match
        let bestMatch = result[0].item.bot_response;

        // If the result is the same as the last response, don't repeat it
        let lastBotMessage = chatBox.querySelector('.botMessage:last-child');
        if (lastBotMessage && lastBotMessage.innerText === bestMatch) {
          chatBox.innerHTML += `<div class="botMessage">Sorry, I don't understand.</div>`;
        } else {
          // If the response is different, show the bot response
          chatBox.innerHTML += `<div class="botMessage">${bestMatch}</div>`;
        }
      } else {
        // If no match is found, show a default response
        chatBox.innerHTML += `<div class="botMessage">Sorry, I don't understand.</div>`;
      }

      // Scroll to the bottom of the chatbox to show the new message
      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      // Show a fallback message in case of error
      chatBox.innerHTML += `<div class="botMessage">Sorry, there was an error processing your message.</div>`;
    });
});