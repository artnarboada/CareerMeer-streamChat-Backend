const { StreamChat } = require('stream-chat');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize the Stream Chat server client
const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

module.exports = async (req, res) => {
    // Middleware to parse JSON bodies
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
};
