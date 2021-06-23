/**
 * Module for the Session Controller.
 *
 * @author Kaj Berg
 * @version 1.0.0
 */
import { UserModel } from '../models/userModel.js'
import { checkUserPassword } from '../utilities/passwordHelper.js'

const baseURL = process.env.BASE_URL || '/'

/**
 *
 */
export class SessionController {
/**
 * Render LoginForm.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async loginGet (req, res, next) {
    res.render('session/login')
  }

  /**
   * Post LoginForm.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async loginPost (req, res, next) {
    try {
      const username = req.body.username
      const password = req.body.password
      const user = await UserModel.findOne({ username: username })
      if (!user) {
        throw new Error('Error 403 Wrong Login')
      }
      const checkPassword = await checkUserPassword(password, user.password)
      if (!checkPassword) {
        throw new Error('Error 403 Wrong Login')
      }
      req.session.regenerate(() => {
        req.session.user = user
        res.redirect(baseURL + 'snippet')
      })
    } catch (error) {
      error.status = 403
      next(error)
    }
  }

  /**
   * Logout user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    try {
      req.session.destroy()
      res.redirect(baseURL + 'snippet')
    } catch (error) {
      next(error)
    }
  }
}
