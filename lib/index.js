const { Binary } = require('mongodb');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');

const Err = {
  InvalidUUID: new Error(`Invalid UUID.`),
  UnexpectedUUIDType: new Error(
    'Unexpected UUID type. UUID must be a string or a MongoDB Binary (SUBTYPE_UUID).'
  ),
  UnsupportedUUIDVersion: new Error('Unsupported uuid version.'),
  InvalidHexString: new Error('Invalid hex string.'),
};
module.exports = {
  v1() {
    return generateUUID(null, 1);
  },

  v4() {
    return generateUUID(null, 4);
  },

  from(uuid) {
    if (typeof uuid === 'string') {
      if (!validateUuid(uuid)) throw Err.InvalidUUID;
      return generateUUID(uuid);
    } else if (uuid instanceof Binary) {
      if (uuid.length() !== 36) throw Err.InvalidUUID;
      return stringify(uuid.read(0, uuid.length()));
      throw Err.UnexpectedUUIDType;
    }
  },
};

function generateUUID(uuid = undefined, v = 1) {
  if (v <= 0 || v > 4 || v === 2 || v === 3) throw Err.UnsupportedUUIDVersion;

  let uuidv = uuidv1;
  if (v === 4) uuidv = uuidv4;

  let muuid;
  if (uuid) {
    if (!validateUuid(uuid)) throw Err.InvalidUUID;
    const normalized = normalize(uuid);
    if (normalized === false) throw Err.InvalidHexString;
    muuid = new Binary(Buffer.from(normalized, 'hex'), Binary.SUBTYPE_UUID);
  } else {
    const uuid = uuidv(null, new Buffer(16));
    muuid = Binary(uuid, Binary.SUBTYPE_UUID);
  }

  muuid.toString = function() {
    return stringify(this.buffer);
  }.bind(muuid);

  return muuid;
}

function validateUuid(string) {
  return !!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.exec(
    string
  );
}

function normalize(string) {
  if (typeof string !== 'string') return false;

  const stripped = string.replace(/-/g, '');

  if (stripped.length !== 32 || !stripped.match(/^[a-fA-F0-9]+$/)) return false;

  return stripped;
}

function stringify(buffer) {
  return [
    buffer.toString('hex', 0, 4),
    buffer.toString('hex', 4, 6),
    buffer.toString('hex', 6, 8),
    buffer.toString('hex', 8, 10),
    buffer.toString('hex', 10, 16),
  ].join('-');
}
