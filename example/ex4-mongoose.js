const mongoose = require('mongoose');
const MUUID = require('../lib');

// Setup and connect
mongoose.connect('mongodb://localhost/my_mongoose', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Monitor connection
const db = mongoose.connection
  .on('error', () => console.error('connection error:'))
  .once('open', () => {});

// Main program
async function main() {
  // Create mongoose schema
  const dataSchema = new mongoose.Schema({
    uuid: {
      type: 'object',
      value: { type: 'Buffer' },
      default: () => MUUID.v4(),

      required: true,
      unique: true,
      index: true,
    },
  });
  // Create the model
  const Data = mongoose.model('Data', dataSchema);

  // Create a record and fetch it by its uuid
  try {
    // create a v4 uuid (this simply wraps the fantastic uuid library)
    const uuid = MUUID.v4();

    // save record and wait for it to commit
    await new Data({ uuid }).save();

    // retrieve the record
    const result = await Data.findOne({ uuid });

    // output the result
    console.log(result);
  } catch (e) {
    console.error(e);
  } finally {
    db.close();
  }
}

main();
