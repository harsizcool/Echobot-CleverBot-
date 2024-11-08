const API_URL = 'https://sheetdb.io/api/v1/pllqafkqez65v';
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Function to add message to chat
function addMessage(text, isUser = true) {
    const message = document.createElement('div');
    message.classList.add('message');
    message.classList.add(isUser ? 'user-message' : 'bot-message');
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to fetch data from the database
async function fetchData(userMessage) {
    try {
        const response = await fetch(`${API_URL}?user_input=${encodeURIComponent(userMessage)}`);
        const data = await response.json();

        if (data.length > 0) {
            return data[0].bot_response;
        } else {
            return "I don't know that yet. Let me remember this!";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return "There was an error. Please try again later.";
    }
}

// Function to store user input and bot response in the database
async function storeData(userMessage, botResponse) {
    try {
        const body = {
            data: [{
                user_input: userMessage,
                bot_response: botResponse
            }]
        };

        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        console.log("Data stored successfully!");
    } catch (error) {
        console.error("Error storing data:", error);
    }
}

// Main function to handle user input and bot response
async function handleMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage === "") return;

    addMessage(userMessage, true);
    userInput.value = "";

    const botResponse = await fetchData(userMessage);

    if (botResponse === "I don't know that yet. Let me remember this!") {
        addMessage("I'm not sure how to respond yet. Please ask something else!", false);
    } else {
        addMessage(botResponse, false);
    }
}

// Event listeners for sending messages
sendButton.addEventListener('click', handleMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleMessage();
    }
});