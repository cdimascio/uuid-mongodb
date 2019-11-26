# uuid-mongodb
![](https://travis-ci.org/cdimascio/uuid-mongodb.svg?branch=master) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/a42f61ffc97b4bcbbca184ab838092c8)](https://www.codacy.com/app/cdimascio/uuid-mongodb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cdimascio/uuid-mongodb&amp;utm_campaign=Badge_Grade) ![](https://img.shields.io/npm/v/uuid-mongodb.svg) ![](https://img.shields.io/npm/dm/uuid-mongodb.svg) [![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
 ![](https://img.shields.io/badge/license-MIT-blue.svg)

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

## Examples (with source code)

#### Native Node MongoDB Driver example

- [example/ex1-mongodb.js](example/ex1-mongodb.js)

	**snippet:**
	
	```javascript
	const insertResult = await collection.insertOne({
	  _id: MUUID.v1(),
	  name: 'carmine',
	});
	```

#### Mongoose example

- [example/ex2-mongoose.js](example/ex2-mongoose.js)

	**snippet:**
	
	```javascript
	const kittySchema = new mongoose.Schema({
	  _id: {
	    type: 'object',
	    value: { type: 'Buffer' },
	    default: () => MUUID.v1(),
	  },
	  title: String,
	});
	```

- [example/ex3-mongoose.js](example/ex3-mongoose.js)

	**snippet:**
	
	```javascript
	// Define a simple schema
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
	```

## Notes

Currently supports [UUID v1 and v4](https://www.ietf.org/rfc/rfc4122.txt)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
 <tr><td align="center"><a href="https://github.com/cdimascio"><img src="https://avatars1.githubusercontent.com/u/4706618?v=4" width="100px;" alt="Carmine DiMascio"/><br /><sub><b>Carmine DiMascio</b></sub></a><br /><a href="https://github.com/cdimascio/uuid-mongodb/commits?author=Carmine-DiMascio" title="Code">💻</a></td><td align="center"><a href="https://glassechidna.com.au"><img src="https://avatars1.githubusercontent.com/u/482276?v=4" width="100px;" alt="Benjamin Dobell"/><br /><sub><b>Benjamin Dobell</b></sub></a><br /><a href="https://github.com/cdimascio/uuid-mongodb/commits?author=Benjamin-Dobell" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

[MIT](./LICENSE)

<a href="https://www.buymeacoffee.com/m97tA5c" target="_blank"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
