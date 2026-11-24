

process.on("uncaughtException", (err) => {
  console.log("ERROR:", err);
});

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

const User = require("./models/User");
const requireFirebase = require("./middleware/requireFirebase");

app.use(cors());
app.use(express.json({ limit: "64kb" }));

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

// SAVE USER ROUTE
app.post("/api/save-user", requireFirebase, async (req, res) => {
  try {
    const { name, photo, onboardingCompleted, preferences } = req.body;
    const email = req.identity.email;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and email are required" });
    }

    let user = await User.findOne({ email });

    if (user) {
      let updated = false;
      if (onboardingCompleted !== undefined) {
        user.onboardingCompleted = onboardingCompleted;
        updated = true;
      }
      if (preferences !== undefined) {
        user.preferences = preferences;
        updated = true;
      }
      if (photo && photo !== user.photo) {
        user.photo = photo;
        updated = true;
      }
      
      if (updated) {
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: "User already exists",
        user
      });
    }

    user = new User({
      name,
      email,
      photo,
      role: "student",
      onboardingCompleted: onboardingCompleted || false,
      preferences: preferences || {}
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User saved successfully",
      user
    });
  } catch (error) {
    console.error("Save User Error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to save profile"
    });
  }
});

// RAZORPAY: Create Order
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Amount must be at least 100 paise (₹1)" });
    }
    const options = {
      amount: Math.floor(amount), // amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    if (err.statusCode === 401) {
      return res.status(401).json({ error: "Razorpay authentication failed" });
    }
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ error: "Failed to create order", details: err.error || err.message });
  }
});

// RAZORPAY: Verify Payment Signature
app.post("/api/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");
  if (generatedSignature === razorpay_signature) {
    return res.json({ success: true, message: "Payment verified" });
  } else {
    return res.status(400).json({ success: false, error: "Signature mismatch" });
  }
});

// MAIN CHAT ROUTE
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body?.messages?.[0]?.content;
    if (typeof userMessage !== "string" || !userMessage.trim() || userMessage.length > 8000) {
      return res.status(400).json({ error: "A message of 1–8000 characters is required" });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: "AI service is not configured" });
    }
    const userProfile = req.body?.userProfile || {};

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-6",
        max_tokens: 250,
        messages: [
          {
            role: "user",
            content: `
User Profile:
Name: ${userProfile.name}
Field: ${userProfile.field}
Career: ${userProfile.career}

User Question:
${userMessage}
`
          }
        ]
      },
      {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        }
      }
    );

    res.json({
      reply: response.data.content.find(item => item.type === "text")?.text || "No text response received. Please try again."
    });

  } catch (err) {
    console.error("AI request failed", { status: err.response?.status, code: err.code });
    res.status(err.code === "ECONNABORTED" ? 504 : 502).json({
      error: "AI service temporarily unavailable. Please try again."
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});