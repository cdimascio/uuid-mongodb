const MongoClient = require('mongodb').MongoClient;
const MUUID = require('../lib');
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
const collectionName = 'mycollection';

// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
  try {
    assert.equal(null, err);

    const db = client.db(dbName);
    const collection = await db.createCollection(collectionName);

    // *****
    // 1. insert a record with a v1 uuid
    const insertResult = await collection.insertOne({
      _id: MUUID.v1(),
      name: 'carmine',
    });

    // retrieve the newly inserted document's UUID
    // and print it as a human readable string
    const insertedId = MUUID.from(insertResult.insertedId).toString();
    console.log(`insertOne with id ${insertedId} succeeded`);

    // *****
    // 2. fetch a document by UUID
    const findResult = await collection.findOne({
      _id: insertResult.insertedId,
    });

    // print the UUID of the document as a human readable string
    const foundId = MUUID.from(findResult._id).toString();
    console.log(`findOne   with id ${foundId} succeeded`);
  } finally {
    client.close();
  }
});
