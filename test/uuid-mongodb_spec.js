const assert = require('assert');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const { Binary } = require('mongodb');
const MUUID = require('../lib');

describe('MUUID', function() {
  describe('v1()', () => {
    it('should generate a valid v1 uuid', function() {
      const mUUID1 = MUUID.v1();
      assert.equal(validate(mUUID1.toString()), true);
    });
  });

  describe('v4()', () => {
    it('should generate a validate v4 uuid', function() {
      const mUUID1 = MUUID.v4();
      assert.equal(validate(mUUID1.toString()), true);
    });
  });

  describe('from(uuid)', () => {
    it('should convert uuid from string', () => {
      const mUUID = MUUID.from(uuidv4());
      assert.equal(validate(mUUID.toString()), true);
    });

    it('should throw when converting an invalid uuid', () => {
      assert.throws(() => MUUID.from('invalid-uuid'), 'Invalid uuid');
    });

    it('should convert uuid from mongo BSON binary', () => {
      const mUUID = MUUID.from(Binary(uuidv1(), Binary.SUBTYPE_UUID));
      assert.equal(validate(mUUID.toString()), true);
    });

    it('should throw when converting an Binary non SUBTYPE_UUID', () => {
      const binary = Binary('tests', Binary.SUBTYPE_USER_DEFINED);
      assert.throws(() => MUUID.from(binary), 'Invalid uuid');
    });
  });
});

function validate(uuid) {
  return !!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.exec(
    uuid
  );
}
