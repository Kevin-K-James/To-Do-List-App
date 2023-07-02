const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const userRouter = require('./routes/users');
const app = express();
const port = 3001;

mongoose.connect('mongodb://localhost/todo-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(cors());
app.use(express.json());
app.use('/tasks', tasksRouter);
app.use('/users', userRouter); 

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
