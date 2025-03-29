const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for all origins

app.use(bodyParser.json());

const PORT = 3000;

// Fetch User ID from username
app.get("/getUserId", async (req, res) => {
    const { name, token } = req.query;

    if (!name || !token) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        const response = await axios.get(`https://api3.origin.com/atom/users?eaId=${name}`, {
            headers: {
                authtoken: token
            }
        });

        if (!response.data.userId) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ userId: response.data.userId });
    } catch (error) {
        console.error("Error fetching user ID:", error.response?.data || error.message);
        res.status(500).json({ error: "Error fetching user ID" });
    }
});

// Fetch Username from User ID
app.get("/getUsername", async (req, res) => {
    const { id, token } = req.query;

    if (!id || !token) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        const response = await axios.get(`https://api3.origin.com/atom/users?userIds=${id}`, {
            headers: {
                authtoken: token
            }
        });

        if (!response.data.users || response.data.users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ eaId: response.data.users[0].eaId });
    } catch (error) {
        console.error("Error fetching username:", error.response?.data || error.message);
        res.status(500).json({ error: "Error fetching username" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
