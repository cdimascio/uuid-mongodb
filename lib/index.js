/*
 * MIT License
 * Copyright (c) 2018-2020 Carmine M DiMascio
 */
const { Binary } = require('mongodb');
const { v1: uuidv1 } = require('uuid');
const { v4: uuidv4 } = require('uuid');

const Err = {
  InvalidUUID: new Error('Invalid UUID.'),
  UnexpectedUUIDType: new Error(
    'Unexpected UUID type. UUID must be a string or a MongoDB Binary (SUBTYPE_UUID).'
  ),
  UnsupportedUUIDVersion: new Error('Unsupported uuid version.'),
  InvalidHexString: new Error('Invalid hex string.'),
  InvalidMode: new Error("Invalid Mode. Expected 'canonical' or 'relaxed'."),
};
let mode = 'canonical';
module.exports = {
  mode(m) {
    if (!['canonical', 'relaxed'].includes(m)) throw Err.InvalidMode;
    mode = m;
    return this;
  },
  v1() {
    return generateUUID(null, 1);
  },

  v4() {
    return generateUUID(null, 4);
  },

  from(uuid) {
    if (typeof uuid === 'string') {
      return generateUUID(uuid);
    } else if (
      (uuid instanceof Binary || uuid._bsontype === 'Binary') &&
      uuid.sub_type === Binary.SUBTYPE_UUID
    ) {
      if (uuid.length() !== 16) throw Err.InvalidUUID;
      return apply(
        new Binary(uuid.read(0, uuid.length()), Binary.SUBTYPE_UUID)
      );
    } else {
      throw Err.UnexpectedUUIDType;
    }
  },
};

function generateUUID(uuid, v = 1) {
  if (v <= 0 || v > 4 || v === 2 || v === 3) throw Err.UnsupportedUUIDVersion;

  let uuidv = uuidv1;
  if (v === 4) uuidv = uuidv4;

  if (uuid) {
    if (!validateUuid(uuid)) throw Err.InvalidUUID;
    const normalized = normalize(uuid);
    if (!normalized) throw Err.InvalidHexString;
    return apply(
      new Binary(Buffer.from(normalized, 'hex'), Binary.SUBTYPE_UUID)
    );
  } else {
    const uuid = uuidv(null, Buffer.alloc(16));
    return apply(new Binary(uuid, Binary.SUBTYPE_UUID));
  }
}

function validateUuid(string) {
  return !!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.exec(
    string
  );
}

function normalize(string) {
  if (typeof string !== 'string') return false;

  const stripped = string.replace(/-/g, '').toLowerCase();

  if (!stripped.match(/^[a-f0-9]{32}$/)) return false;
  return stripped;
}

function stringify(buffer, delimiter) {
  return [
    buffer.toString('hex', 0, 4),
    buffer.toString('hex', 4, 6),
    buffer.toString('hex', 6, 8),
    buffer.toString('hex', 8, 10),
    buffer.toString('hex', 10, 16),
  ].join(delimiter);
}

function apply(mu) {
  // add to string method
  // formatting parameter (optional) follows the behavior of Microsoft's UUID string function: https://docs.microsoft.com/en-us/dotnet/api/system.guid.tostring
  mu.toString = function (format) {
    let delimiter = '-';
    let prefix = '';
    let suffix = '';
    if (format === 'N') delimiter = '';
    if (format === 'B') {
      prefix = '{';
      suffix = '}';
    }
    if (format === 'P') {
      prefix = '(';
      suffix = ')';
    }

    return prefix + stringify(this.buffer, delimiter) + suffix;
  }.bind(mu);

  if (mode === 'relaxed') {
    mu.toJSON = mu.toString;
  }
  return mu;
}
