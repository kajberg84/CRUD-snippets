/**
 * Session Router.
 *
 * @author Kaj Berg
 * @version 1.0.0
 */

import express from 'express'
import { SessionController } from '../controller/session-controller.js'

export const sessionRouter = express.Router()

const controller = new SessionController()

// Login
sessionRouter.get('/login', controller.loginGet)
sessionRouter.post('/login', controller.loginPost)
// Logout
sessionRouter.get('/logout', controller.logout)
