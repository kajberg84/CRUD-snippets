/**
 * The starting point.
 *
 * @author Kaj Berg
 * @version 1.0.0
 */

import express from 'express'
import helmet from 'helmet'
import session from 'express-session'
import hbs from 'express-hbs'
import logger from 'morgan'
import { connectDB } from './config/mongoose.js'
import { router } from './routes/router.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config()

/**
 * The main function of the application.
 */
async function main () {
  await connectDB()

  const app = express()
  const PORT = process.env.MY_PORT
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Setting up base url.
  const baseURL = process.env.BASE_URL || '/'

  // Set various HTTP headers to make the application a little more secure
  // (The web application uses external scripts and therefore needs to explicitly trust on code.jquery.com and cdn.jsdelivr.net.)
  app.use(helmet())
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net']
      }
    })
  )

  // Set morgan logger
  app.use(logger('dev'))

  // View engine setup.
  app.engine('hbs', hbs.express4({
    defaultLayout: join(directoryFullName, 'views', 'layouts', 'default'),
    partialsDir: join(directoryFullName, 'views', 'partials')
  }))
  app.set('view engine', 'hbs')
  app.set('views', join(directoryFullName, 'views'))

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  app.use(express.urlencoded({ extended: false }))

  // Session Options
  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false, // Resave even if a request is not changing the session.
    saveUninitialized: false, // Don't save a created but not modified session.
    cookie: {
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    }
  }

  app.use(session(sessionOptions))

  // Executes middleware before the routes.
  app.use((req, res, next) => {
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    // Pass the base URL to the views.
    res.locals.baseURL = baseURL

    next()
  })

  // Set routing
  app.use('/', router)

  // Error handler.
  app.use((err, req, res, next) => {
    // 403 Not Found.
    if (err.status === 403) {
      res.status(403)
    }
    // 404 Not Found.
    if (err.status === 404) {
      res.status(404)
    }
    // Render the error page.
    res.status(err.status || 500)
      .render('errors/error', { error: err })
  })

  // Server listen
  app.listen(PORT, (req, res) => {
    console.log(`Server listening to port ${PORT}.`)
  })
}

main()
