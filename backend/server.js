const mongoose = require('mongoose');
const app = require('./app');
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/eventdb').then(async () => {
  if ((await app.Event.countDocuments()) === 0) {
    await app.Event.insertMany([
      { title: 'Tech Conference 2026', date: '2026-12-05', location: 'Islamabad', description: 'Talks on cloud and DevOps.', seats: 100 },
      { title: 'Startup Meetup', date: '2026-12-12', location: 'Lahore', description: 'Pitch your idea.', seats: 50 },
      { title: 'Music Night', date: '2026-12-20', location: 'Karachi', description: 'Live music evening.', seats: 200 }
    ]);
  }
  app.listen(5000, () => console.log('backend on 5000'));
}).catch(err => { console.error(err.message); process.exit(1); });
