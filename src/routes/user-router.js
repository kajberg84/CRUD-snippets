/**
 * User Router.
 *
 * @author Kaj Berg
 * @version 1.0.0
 */

import express from 'express'
import { UserController } from '../controller/user-controller.js'

export const userRouter = express.Router()

const controller = new UserController()

// Creating a new user
userRouter.get('/signup', controller.signupUserGet)
userRouter.post('/signup', controller.signupUserPost)

// Delete a user
userRouter.post('/delete/:userId', controller.deleteUser)
