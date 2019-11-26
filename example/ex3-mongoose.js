const mongoose = require('mongoose');
const MUUID = require('../lib');

const log = (...a) => console.log(...a);
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

// no need for auto getter for _id will add a virtual later
kittySchema.set('id', false);

// virtual getter for custom _id
kittySchema
  .virtual('id')
  .get(function() {
    return MUUID.from(this._id).toString();
  })
  .set(function(val) {
    this._id = MUUID.from(val);
  });

const Kitten = mongoose.model('Kitten', kittySchema);

// 2. Create new kitten
var silence = new Kitten({
  title: 'Silence',
});

// 3. Save the new kitten to the database
silence
  .save()
  .then(kitten => {
    log('inserted kitten with id', kitten.id);
    return kitten._id;
  })
  .then(_id => Kitten.findOne({ _id }))
  .then(kitten => log('found kitten with id', kitten.id))
  .catch(e => log(e))
  .finally(() => db.close());
