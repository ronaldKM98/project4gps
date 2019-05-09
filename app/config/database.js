/**
 * This is the MongoDB configuration with mongoose, its a module thats lets us access the database.
 */
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://mongo-server/project1GPS', {
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err));
