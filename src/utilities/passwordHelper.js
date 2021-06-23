import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Hashing password.
 *
 * @param {string} userPassword - Password from user.
 * @returns {string} - Hashed password.
 */
export function hashThisPassword (userPassword) {
  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  const hash = bcrypt.hashSync(userPassword, salt)
  return hash
}

/**
 * Compare passwords.
 *
 * @param {string} password - Password from user.
 * @param {string} passwordHash - Hashed password.
 * @returns {boolean} - Boolean.
 */
export function checkUserPassword (password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash)
}
