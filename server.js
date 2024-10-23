const express = require('express');
const { StreamChat } = require('stream-chat');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize the Stream Chat server client
const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to generate a token
app.post('/', (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        // Generate a token for the user
        const token = serverClient.createToken(userId);
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error generating token:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//Endpoint to save loginUser to streamchat
// Endpoint to upsert a user into Stream Chat
app.post('/upsert-user', (req, res) => {
    const { userId, userName } = req.body;

    if (!userId || !userName) {
        return res.status(400).json({ error: 'userId and userName are required' });
    }

    try {
        // Upsert the user to Stream Chat
        const user = { id: userId, name: userName };
        serverClient.upsertUser(user);

        return res.status(200).json({ message: 'User upserted successfully' });
    } catch (error) {
        console.error('Error upserting user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});




app.get('/', (req, res) => {
    res.send('Server is up and running!');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
