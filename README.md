# uuid-mongodb

![](https://img.shields.io/badge/status-stable-green.svg) ![](https://img.shields.io/badge/tests-passing-green.svg) ![](https://img.shields.io/badge/license-MIT-blue.svg)

Generates and parses [BSON UUIDs](https://docs.mongodb.com/manual/reference/method/UUID/) for use with MongoDB. BSON UUIDs provide better performance than their string counterparts.

<p align="center">
  <img src="https://raw.githubusercontent.com/cdimascio/uuid-mongodb/master/assets/uuid-mongodb.png?raw=truef"/>
</p>

Inspired by [@srcagency's](https://github.com/srcagency) [mongo-uuid](https://github.com/srcagency/mongo-uuid)

## Install

```shell
npm install uuid-mongodb
```

## Usage

```javascript
const MUUID = require('uuid-mongodb');

# Create a v1 binary UUID
const mUUID1 = MUUID.v1();

# Create a v4 binary UUID
const mUUID4 = MUUID.v4();

# Print a string representation of a binary UUID
mUUID1.toString()

# Create a binary UUID from a valid uuid string
const mUUID2 = MUUID.from('393967e0-8de1-11e8-9eb6-529269fb1459')

# Create a binary UUID from a MongoDb Binary
# This is useful to get MUUIDs helpful toString() method
const mUUID3 = MUUID.from(/** MongoDb Binary of SUBTYPE_UUID */)
```

## Examples

**Query using binary UUIDs**

```javascript
const uuid = MUUID.from('393967e0-8de1-11e8-9eb6-529269fb1459');
return collection.then(c =>
  c.findOne({
    _id: uuid,
  })
);
```

**Work with binary UUIDs returned in query results**

```javascript
return collection
  .then(c => c.findOne({ _id: uuid }))
  .then(doc => {
    const uuid = MUUID.from(doc._id).toString();
    // do stuff
  });
```

## Notes

Currently supports UUID v1 and v4

## License

[MIT](./LICENSE)
