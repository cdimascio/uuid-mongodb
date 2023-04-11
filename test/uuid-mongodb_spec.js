const assert = require('assert');
const { v1: uuidv1 } = require('uuid');
const { v4: uuidv4 } = require('uuid');
const { Binary } = require('mongodb');
const MUUID = require('../lib');

const hasHexUpperCase = (s) => !!/[A-F]/.exec(s);

// accept and generate uuids according to spec - (see https://www.itu.int/rec/T-REC-X.667-201210-I/en)
describe('MUUID', function () {
  describe('v1()', () => {
    it('should generate a valid v1 uuid', function () {
      const mUUID = MUUID.v1();
      assert.equal(validate(mUUID.toString()), true);
      // ensure generated uuids are always lowercase
      // as per spec - (see https://www.itu.int/rec/T-REC-X.667-201210-I/en)
      assert.equal(hasHexUpperCase(mUUID.toString()), false);
    });
  });

  describe('v4()', () => {
    it('should generate a validate v4 uuid', function () {
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

    it("should accept uuid's with capital letters, but return with lowercase", () => {
      const mUUID = MUUID.from(uuidv4().toUpperCase());
      assert.equal(hasHexUpperCase(mUUID.toString()), false);
      assert.equal(validate(mUUID.toString()), true);
    });

    it('should convert uuid from string', () => {
      const mUUID = MUUID.from(uuidv4());
      assert.equal(validate(mUUID.toString()), true);
    });

    it('should throw when converting an invalid uuid', () => {
      assert.throws(() => MUUID.from('invalid-uuid'), /Invalid UUID\.$/);
      assert.throws(
        () => MUUID.from('802ac0f09b7311e89bb69baebe1aa0bf'),
        /Invalid UUID\.$/
      );
    });

    it('should convert uuid from mongo BSON binary', () => {
      const mUUID = MUUID.from(
        new Binary(uuidv1(null, Buffer.alloc(16)), Binary.SUBTYPE_UUID)
      );
      assert.equal(mUUID instanceof Binary, true);
      assert.equal(validate(mUUID.toString()), true);
    });

    it('should throw when attempting to store 36 byte string representation as UUID', () => {
      const binary = new Binary(Buffer.from(uuidv1()), Binary.SUBTYPE_UUID);
      assert.throws(() => MUUID.from(binary), /Invalid UUID\.$/);
    });

    it('should throw when converting an Binary non SUBTYPE_UUID', () => {
      const binary = new Binary(
        uuidv1(null, Buffer.alloc(16)),
        Binary.SUBTYPE_USER_DEFINED
      );
      assert.throws(
        () => MUUID.from(binary),
        /Unexpected UUID type\. UUID must be a string or a MongoDB Binary \(SUBTYPE_UUID\)\.$/
      );
    });
  });

  describe('formatting', () => {
    it('should format with default (dashes)', function () {
      const mUUID = MUUID.v1();
      assert.equal(validate(mUUID.toString()), true);
      // ensure generated uuids are always lowercase
      // as per spec - (see https://www.itu.int/rec/T-REC-X.667-201210-I/en)
      assert.equal(hasHexUpperCase(mUUID.toString()), false);
    });
    it("should format with format 'D' (dashes)", function () {
      const mUUID = MUUID.v1();
      const uuid = mUUID.toString('D');
      assert.equal(validate(uuid, 'D'), true);
      assert.equal(hasHexUpperCase(mUUID.toString('D')), false);
    });
    it("should format with format 'N' no delimiter", function () {
      const mUUID = MUUID.v1();
      const uuid = mUUID.toString('N');
      assert.equal(validate(uuid, 'N'), true);
      assert.equal(hasHexUpperCase(uuid), false);
    });
    it("should format with format 'B' (curly braces)", function () {
      const mUUID = MUUID.v1();
      const uuid = mUUID.toString('B');
      assert.equal(validate(uuid, 'B'), true);
      assert.equal(hasHexUpperCase(uuid), false);
    });
    it("should format with format 'P' (parens)", function () {
      const mUUID = MUUID.v1();
      const uuid = mUUID.toString('P');
      assert.equal(validate(uuid, 'P'), true);
      assert.equal(hasHexUpperCase(uuid), false);
    });
  });

  describe('modes', () => {
    it('relaxed mode should print friendly uuid in hex', function () {
      const mUUID = MUUID.mode('relaxed').v1();
      assert.equal(isBase64(JSON.stringify(mUUID)), false);
      assert.equal(validate(mUUID.toString()), true);
      assert.equal(hasHexUpperCase(mUUID.toString()), false);
    });
    it('canonical mode should print base64 uuid ', function () {
      const mUUID = MUUID.mode('canonical').v1();
      const c = JSON.parse(JSON.stringify(mUUID));
      assert.equal(isBase64(c), true);
      assert.equal(validate(mUUID.toString()), true);
      assert.equal(hasHexUpperCase(mUUID.toString()), false);
    });
  });
});

function validate(uuid, format) {
  if (format === 'N') {
    return !!/^[0-9a-f]{8}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{12}$/.exec(
      uuid
    );
  } else if (format === 'B') {
    return !!/^\{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}$/.exec(
      uuid
    );
  } else if (format === 'P') {
    return !!/^\([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\)$/.exec(
      uuid
    );
  } else {
    return !!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.exec(
      uuid
    );
  }
}

function isBase64(s) {
  const bc = /[A-Za-z0-9+/=]/.test(s);
  const lc = /.*=$/.test(s); // make sure it ends with '='
  return bc && lc;
}
