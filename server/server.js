const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "University Financial Portal Backend is running!"
    });
});


// Test API
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working successfully!"
    });
});



// Start server
app.listen(PORT, () => {
    console.log(`University server running on http://localhost:${PORT}`);
});