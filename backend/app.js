const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const Event = mongoose.models.Event || mongoose.model('Event', new mongoose.Schema({ title: String, date: String, location: String, description: String, seats: Number }));
const Registration = mongoose.models.Registration || mongoose.model('Registration', new mongoose.Schema({ eventId: String, name: String, email: String, createdAt: { type: Date, default: Date.now } }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/events', async (req, res) => res.json(await Event.find().sort({ date: 1 })));
app.get('/api/events/:id', async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ error: 'not found' });
    res.json(e);
  } catch (err) { res.status(400).json({ error: 'bad id' }); }
});
app.post('/api/register', async (req, res) => {
  const { eventId, name, email } = req.body;
  if (!eventId || !name || !email) return res.status(400).json({ error: 'all fields required' });
  res.status(201).json(await Registration.create({ eventId, name, email }));
});
app.get('/api/registrations', async (req, res) => res.json(await Registration.find().sort({ createdAt: -1 })));
module.exports = app;
module.exports.Event = Event;
