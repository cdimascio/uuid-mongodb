# uuid-mongodb

Generates and parses [BSON UUIDs](https://docs.mongodb.com/manual/reference/method/UUID/) for use with MongoDB. BSON UUIDs provide better performance than their string counterparts.

Inspired by [@srcagency's](https://github.com/srcagency) [mongo-uuid](https://github.com/srcagency/mongo-uuid)

## Install

```shell
npm install uuid-mongodb
```

## Usage

```javascript
# Create a v1 binary UUID
const mUUID1 = MUUID.v1();

# Create a v4 binary UUID
const mUUID4 = MUUID.v4();

# Print a string representation of a binary UUID
mUUID1.toString()

# Create a binary UUID from a valid uuid string
const mUUID2 = MUUID.from('393967e0-8de1-11e8-9eb6-529269fb1459')
const mUUID2 = MUUID.from(/** MongoDb Binary of SUBTYPE_UUID */)
```

## Notes

Currently supports UUID v1 and v4

## License

[MIT](./LICENSE)
