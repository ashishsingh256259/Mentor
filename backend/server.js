

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
const ProOrder = require("./models/ProOrder");
const AIUsage = require("./models/AIUsage");
const { PRO_PRICE, DAY, validSignature, validPayment, dailyLimit, dayKey } = require("./billing");

app.use(cors());
app.use(express.json({ limit: "64kb" }));

// Initialize Razorpay instance
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
}) : null;

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

// Pro access is derived only from captured, verified orders belonging to this Firebase UID.
async function proActive(uid) {
  return !!await ProOrder.exists({ uid, expiresAt: { $gt: new Date() }, paymentId: { $exists: true } });
}
app.get("/api/plan", requireFirebase, async (req, res) => {
  res.json({ plan: await proActive(req.identity.uid) ? "pro" : "free" });
});
// Mentor catalogue is currently a demo, so never collect money for unverified sessions.
app.post(["/api/create-order", "/api/verify-payment", "/api/payment/create-order", "/api/payment/verify"], (req, res) => res.status(503).json({ error: "Mentor booking payments are not available in this demo" }));
app.post("/api/pro/order", requireFirebase, async (req, res) => {
  if (process.env.ENABLE_PRO_CHECKOUT !== "true" || !razorpay) return res.status(503).json({ error: "Pro checkout is not enabled" });
  if (await proActive(req.identity.uid)) return res.status(409).json({ error: "Your Pro access is already active" });
  const order = await razorpay.orders.create({ amount: PRO_PRICE, currency: "INR", receipt: crypto.randomUUID() });
  await ProOrder.create({ orderId: order.id, uid: req.identity.uid, amount: PRO_PRICE });
  res.json({ id: order.id, amount: PRO_PRICE, currency: "INR", key: process.env.RAZORPAY_KEY_ID });
});
app.post("/api/pro/verify", requireFirebase, async (req, res) => {
  if (!razorpay) return res.status(503).json({ error: "Payment verification unavailable" });
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {};
  if (!validSignature(orderId, paymentId, signature, process.env.RAZORPAY_KEY_SECRET)) return res.status(400).json({ error: "Invalid payment signature" });
  const order = await ProOrder.findOne({ orderId, uid: req.identity.uid });
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.paymentId) return res.status(order.paymentId === paymentId ? 200 : 409).json({ success: order.paymentId === paymentId, plan: await proActive(req.identity.uid) ? "pro" : "free" });
  const payment = await razorpay.payments.fetch(paymentId);
  if (!validPayment(payment, order)) return res.status(409).json({ error: "Payment is not captured for the required amount" });
  const paidAt = Number(payment.created_at) * 1000;
  if (!Number.isFinite(paidAt) || paidAt <= 0 || paidAt > Date.now()) return res.status(409).json({ error: "Invalid payment date" });
  const expiresAt = new Date(paidAt + 30 * DAY);
  await ProOrder.updateOne({ _id: order._id, paymentId: { $exists: false } }, { $set: { paymentId, expiresAt } });
  res.json({ success: true, plan: await proActive(req.identity.uid) ? "pro" : "free" });
});

// MAIN CHAT ROUTE
app.post("/api/chat", requireFirebase, async (req, res) => {
  try {
    const userMessage = Array.isArray(req.body?.messages) ? req.body.messages.at(-1)?.content : null;
    if (typeof userMessage !== "string" || !userMessage.trim() || userMessage.length > 8000) {
      return res.status(400).json({ error: "A message of 1–8000 characters is required" });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: "AI service is not configured" });
    }
    const uid = req.identity.uid;
    const limit = dailyLimit(await proActive(uid));
    const key = dayKey(uid);
    await AIUsage.updateOne({ _id: key }, { $setOnInsert: { count: 0, expiresAt: new Date(Date.now() + 2 * DAY) } }, { upsert: true });
    const reserved = await AIUsage.updateOne({ _id: key, count: { $lt: limit } }, { $inc: { count: 1 } });
    if (!reserved.modifiedCount) return res.status(429).json({ error: "Daily AI limit reached. Try again tomorrow (UTC)." });
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
app.use((err, req, res, next) => {
  console.error("Request failed", { code: err.code, status: err.status });
  if (res.headersSent) return next(err);
  res.status(err.status === 413 ? 413 : err.status === 400 ? 400 : 503).json({ error: "Request could not be completed" });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});