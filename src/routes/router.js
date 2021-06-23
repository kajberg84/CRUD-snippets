/**
 * Main Router.
 *
 * @author Kaj Berg
 * @version 1.0.0
 */

import express from 'express'
import { userRouter } from './user-router.js'
import { sessionRouter } from './session-router.js'
import { snippetRouter } from './snippet-router.js'

export const router = express.Router()

router.use('/user', userRouter)
router.use('/session', sessionRouter)
router.use('/snippet', snippetRouter)
router.use('/', snippetRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const error = new Error()
  error.status = 404
  error.message = 'Not Found'
  next(error)
})
