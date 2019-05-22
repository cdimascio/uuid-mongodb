const assert = require('assert');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const { Binary } = require('mongodb');
const MUUID = require('../lib');

const hasHexUpperCase = s => !!/[A-F]/.exec(s);

describe('MUUID (accept and generate uuids according to spec - (see https://www.itu.int/rec/T-REC-X.667-201210-I/en)', function() {
  describe('v1()', () => {
    it('should generate a valid v1 uuid', function() {
      const mUUID = MUUID.v1();
      assert.equal(validate(mUUID.toString()), true);
      // ensure generated uuids are always lowercase
      // as per spec - (see https://www.itu.int/rec/T-REC-X.667-201210-I/en)
      assert.equal(hasHexUpperCase(mUUID.toString()), false);
    });
  });

  describe('v4()', () => {
    it('should generate a validate v4 uuid', function() {
      const mUUID = MUUID.v4();
      assert.equal(validate(mUUID.toString()), true);
      // ensure generated uuids are always lowercase
      // as per spec - (see https://www.itu.int/rec/T-REC-X.667-201210-I/en)
      assert.equal(hasHexUpperCase(mUUID.toString()), false);
    });
  });

  describe('from(uuid)', () => {
    it('should convert uuid from string', () => {
      const mUUID = MUUID.from(uuidv4());
      assert.equal(validate(mUUID.toString()), true);
    });

    it('should accept uuid\'s with capital letters, but return with lowercase', () => {
      const mUUID = MUUID.from(uuidv4().toUpperCase());
      assert.equal(hasHexUpperCase(mUUID.toString()), false);
      assert.equal(validate(mUUID.toString()), true);
    });

    it('should convert uuid from string', () => {
      const mUUID = MUUID.from(uuidv4());
      assert.equal(validate(mUUID.toString()), true);
    });

    it('should throw when converting an invalid uuid', () => {
      assert.throws(() => MUUID.from('invalid-uuid'), 'Invalid uuid');
      assert.throws(() => MUUID.from('802ac0f09b7311e89bb69baebe1aa0bf'), 'Invalid uuid');
    });

    it('should convert uuid from mongo BSON binary', () => {
      const mUUID = MUUID.from(Binary(uuidv1(), Binary.SUBTYPE_UUID));
      assert.equal(mUUID instanceof Binary, true);
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
