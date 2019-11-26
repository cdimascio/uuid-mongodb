const mongoose = require('mongoose');
const MUUID = require('../lib');

// Setup and connect
mongoose.connect('mongodb://localhost/my_mongoose', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection
  .on('error', () => console.error('connection error:'))
  .once('open', () => {});

// 1. Define a simple schema
const kittySchema = new mongoose.Schema({
  _id: {
    type: 'object',
    value: { type: 'Buffer' },
    default: () => MUUID.v1(),
  },
  title: String,
});

const Kitten = mongoose.model('Kitten', kittySchema);

// 2. Create new kitten with UUID _id
var silence = new Kitten({
  // _id: MUUID.v1(),
  title: 'Silence',
});

// 3. Save the new kitten to the database
silence
  .save()
  .then(kitten => {
    console.log('inserted kitten with id', MUUID.from(kitten._id).toString());
    return kitten;
  })
  .then(kitten => {
    // 4. Fetch the new kitten from the database
    Kitten.findOne({ _id: kitten._id }, function(err, kitten) {
      if (err) return console.error(err);
      console.log('found kitten    with id', MUUID.from(kitten._id).toString());
      db.close();
    });
  });
