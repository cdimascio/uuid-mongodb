const { Binary } = require('mongodb');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');

module.exports = {
  v1() {
    return generateUUID(null, 1);
  },

  v4() {
    return generateUUID(null, 4);
  },

  from(uuid) {
    return generateUUID(uuid);
  },
};

function generateUUID(uuid = undefined, v = 1) {
  if (v <= 0 || v > 4 || v === 2 || v === 3)
    throw Error('unsupported uuid version');

  let uuidv = uuidv1;
  if (v === 4) uuidv = uuidv4;

  let muuid;
  if (uuid) {
    const normalized = normalize(uuid);
    if (normalized === false) throw new Error('Invalid hex string');
    muuid = new Binary(Buffer.from(normalized, 'hex'), Binary.SUBTYPE_UUID);
  } else {
    const uuid = uuidv(null, new Buffer(16));
    muuid = Binary(uuid, Binary.SUBTYPE_UUID);
  }

  muuid.toString = function() {
    const buffer = this.buffer;

    return [
      buffer.toString('hex', 0, 4),
      buffer.toString('hex', 4, 6),
      buffer.toString('hex', 6, 8),
      buffer.toString('hex', 8, 10),
      buffer.toString('hex', 10, 16),
    ].join('-');
  }.bind(muuid);

  return muuid;
}

function normalize(string) {
  if (typeof string !== 'string') return false;

  const stripped = string.replace(/-/g, '');

  if (stripped.length !== 32 || !stripped.match(/^[a-fA-F0-9]+$/)) return false;

  return stripped;
}
