document.addEventListener('DOMContentLoaded', () => {
    // Load queues when the page loads
    loadQueues();

    // Handle click on the "Go" button
    document.getElementById('go-btn').addEventListener('click', async () => {
        const selectedQueue = document.getElementById('queue-selector').value;
        if (selectedQueue) {
            await retrieveMessage(selectedQueue);
        } else {
            alert('Please select a queue');
        }
    });

    // Handle click on the "Post" button for adding a message
    document.getElementById('post-btn').addEventListener('click', async () => {
        const selectedQueue = document.getElementById('queue-selector').value;
        const messageInput = document.getElementById('message-input').value;
        if (selectedQueue && messageInput) {
            await addMessageToQueue(selectedQueue, messageInput);
        } else {
            alert('Please select a queue and enter a message');
        }
    });
});

// Function to load the queues (same as before)
async function loadQueues() {
    try {
        // Placeholder queues - Replace this with an actual API call
        const queues = ['queue1', 'queue2', 'queue3'];

        // Populate the queue selector
        const queueSelector = document.getElementById('queue-selector');
        queues.forEach(queue => {
            const option = document.createElement('option');
            option.value = queue;
            option.textContent = queue;
            queueSelector.appendChild(option);
        });

        // Populate the queue list
        const queueList = document.getElementById('queue-list');
        queues.forEach(queue => {
            const div = document.createElement('div');
            div.className = 'queue-item';
            div.textContent = `Queue: ${queue} (Messages: Loading...)`;
            queueList.appendChild(div);
        });

    } catch (error) {
        console.error('Error loading queues:', error);
    }
}

// Function to retrieve a message from a queue (same as before)
async function retrieveMessage(queue) {
    try {
        const response = await fetch(`/api/${queue}?timeout=10000`);
        if (response.status === 200) {
            const data = await response.json();
            displayMessage(data.message["message"]);
        } else if (response.status === 204) {
            displayMessage('No messages in the queue.');
        } else {
            throw new Error('Failed to retrieve message');
        }
    } catch (error) {
        console.error('Error retrieving message:', error);
    }
}

// Function to display the message
function displayMessage(message) {
    const messageDisplay = document.getElementById('message-display');
    messageDisplay.textContent = message;
}

// Function to add a message to the queue via POST request
async function addMessageToQueue(queue, message) {
    try {
        const response = await fetch(`/api/${queue}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })  // The message being sent to the queue
        });

        if (response.status === 201) {
            alert('Message added successfully!');
        } else {
            throw new Error('Failed to add message');
        }
    } catch (error) {
        console.error('Error adding message:', error);
        alert('Error adding message');
    }
}
