// https://github.com/smallcase/Field-Level-Encryption

// ❗️ only works on { type: String } fields right now!!

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
const Crypto = require('crypto')

// Generating AES_KEY
// const passphrase = process.env.AES_PASSPHRASE
// const salt = crypto.randomBytes(32).toString('hex')
// console.log(crypto.scryptSync(passphrase, salt, 32).toString('hex'))

const AES_KEY = process.env.AES_KEY // Must be 256 bits (32 characters)
const AES_IV = Crypto.randomBytes(16) // Must be 16 character for AES-256-CBC

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
function Encrypt (text) {
  if (!text) { return text }
  text = text.toString()
  const iv = Buffer.from(AES_IV, 'hex')
  const cipher = Crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(AES_KEY, 'hex'),
    AES_IV
  )
  const encrypted = Buffer.concat([
    cipher.update(text),
    cipher.final()
  ])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

function Decrypt (text) {
  if (!text) return text
  // Backward compatibilty
  // If a non-encrypted string is being decrypted, function throws an error
  // In that case, we simply want to return the string
  try {
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = Crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(AES_KEY, 'hex'),
      iv
    )
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final()
    ])
    return decrypted.toString()
  } catch (error) {
    return text
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = { Decrypt, Encrypt }
