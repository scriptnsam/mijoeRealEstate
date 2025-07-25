const Contact = require("../models/Contact");
const { resSuccess, resError } = require("../utils/response");

exports.submitMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return resError(res, "All fields are required.", 400);
  }

  try {
    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    // Later: Add Nodemailer logic here to send the email

    resSuccess(res, "Message received. We'll get back to you shortly")
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ status: "error", message: "An error occurred. Please try again later." });
    resError(res, err.message);
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }); // Latest first

    if (messages.length === 0) return resError(res, "No message found.", 404);

    resSuccess(res, "Messages fetched", messages);
  } catch (err) {
    resError(res, err.message);
  }
};

