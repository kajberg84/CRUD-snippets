/**
 * Module for the User Controller.
 *
 * @author Kaj Berg
 * @version 1.0.0
 */
import { UserModel } from '../models/userModel.js'
import validator from 'validator'

const baseURL = process.env.BASE_URL || '/'

/**
 *
 */
export class UserController {
  /**
   * Getting user signup form.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async signupUserGet (req, res, next) {
    const user = req.session.user
    const viewData = { user }
    res.render('users/index', { viewData })
  }

  /**
   * Greating a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async signupUserPost (req, res, next) {
    try {
      // Validate email and same password.
      if (!validator.isEmail(req.body.email)) {
        req.session.flash = { type: 'Failure', text: 'Not a correct email' }
        res.redirect(baseURL + 'user/signup')
      } else if (req.body.password !== req.body.password2) {
        req.session.flash = { type: 'Failure', text: 'Not same password' }
        res.redirect(baseURL + 'user/signup')
      } else {
        const username = req.body.username
        // Creating user and login.
        const userData = {
          username: username,
          email: req.body.email,
          password: req.body.password
        }
        const newUser = new UserModel(userData)
        await newUser.save()
        const user = await UserModel.findOne({ username: username })
        req.session.user = user
        req.session.flash = { type: 'Success', text: 'User Created' }
        res.redirect(baseURL + 'snippet')
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes a specific user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteUser (req, res, next) {
    try {
      const user = await UserModel.findById(req.params.userId)
      // Can only delete himself
      if (!(req.session.user) || !(user._id.toString() === req.session.user._id)) {
        throw new Error('Forbidden request')
      }
      await UserModel.findByIdAndDelete(req.params.userId)
      req.session.destroy()
      res.redirect(baseURL + 'snippet')
    } catch (error) {
      res.status(403)
      next(error)
    }
  }
}
