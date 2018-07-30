# uuid-mongodb

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
# Create a v1 binary UUID
const mUUID1 = MUUID.v1();

# Create a v4 binary UUID
const mUUID4 = MUUID.v4();

# Print a string representation of a binary UUID
mUUID1.toString()

# Create a binary UUID from a valid uuid string
const mUUID2 = MUUID.from('393967e0-8de1-11e8-9eb6-529269fb1459')

# Create a binary UUID from a MongoDb Binary (when you want to view it as a string e.g. mUUID3.toString())
const mUUID3 = MUUID.from(/** MongoDb Binary of SUBTYPE_UUID */)
```

## Example

### Query

```javascript
    const uuid = MUUID.from('393967e0-8de1-11e8-9eb6-529269fb1459');
    return collection
      .then(c =>
        c.findOne({
          _id: uuid,
        })
      )
```

## Notes

Currently supports UUID v1 and v4

## License

[MIT](./LICENSE)
