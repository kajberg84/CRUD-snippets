import { SnippetModel } from '../models/snippetModel.js'

const baseURL = process.env.BASE_URL || '/'

/**
 *
 */
export class SnippetController {
  /**
   * Displays a list of snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async showList (req, res, next) {
    try {
      const snippetsList = await SnippetModel.find({}).populate('User').lean()
      const user = req.session.user
      const viewData = { snippetsList, user }
      res.render('snippets/list', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async showSnippet (req, res, next) { // EDIT get
    try {
      const user = req.session.user
      const snippetId = req.params.id
      let snippet = {}

      if (snippetId === '0') {
        snippet = {
          _id: 0,
          user: user,
          title: '',
          content: ''
        }
      } else {
        snippet = await SnippetModel.findById(snippetId).populate('User').lean()
      }

      const viewData = { snippet, user }

      // If logged in as user and userid is the same as creator of snippetid.
      if (req.session.user && (req.session.user._id === snippet.user._id.toString())) {
        res.render('snippets/edit', { viewData })
      } else {
        res.render('snippets/show', { viewData })
      }
    } catch (error) {
      error.status = 404
      error.message = 'No snippet to show'
      next(error)
    }
  }

  /**
   * Update a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async saveSnippet (req, res, next) {
    try {
      let snippet
      const snippetId = req.params.id

      // If creating a new snippet
      if (snippetId === '0') {
        snippet = new SnippetModel({
          user: req.session.user._id,
          title: req.body.title,
          content: req.body.content
        })
        if (req.body.title.length > 30) {
          req.session.flash = { type: 'Failure', text: 'Snippettitle to long(Max 30 characters)' }
          res.redirect(baseURL + 'snippet')
        }
        if (req.body.content.length > 3000) {
          req.session.flash = { type: 'Failure', text: 'Snippetcontent to long(Max 3000 characters)' }
          res.redirect(baseURL + 'snippet')
        }

        await snippet.save()
        // If Editing a snippet
      } else {
        snippet = await SnippetModel.findById(snippetId)
        snippet.title = req.body.title

        if (req.body.title.length > 30) {
          req.session.flash = { type: 'Failure', text: 'Snippet title to long(Max 30 characters)' }
          res.redirect(baseURL + 'snippet')
        }
        if (req.body.content.length > 1000) {
          req.session.flash = { type: 'Failure', text: 'Snippet content to long(Max 1000 characters)' }
          res.redirect(baseURL + 'snippet')
        }
        snippet.content = req.body.content
        const newSnippet = new SnippetModel(snippet)
        await newSnippet.save()
      }
      req.session.flash = { type: 'Sucess', text: 'Snippet Created/Edited' }
      res.redirect(baseURL + 'snippet')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteSnippet (req, res, next) {
    const snippetId = req.params.id

    try {
      const snippet = await SnippetModel.findById(snippetId).populate('User').lean()
      if (req.session.user && (req.session.user._id === snippet.user._id.toString())) {
        await SnippetModel.findByIdAndDelete(snippetId)
        req.session.flash = { type: 'Success', text: 'Snippet deleted' }
      } else {
        req.session.flash = { type: 'Failure', text: 'Not your snippet' }
      }
      res.redirect(baseURL + 'snippet')
    } catch (error) {
      next(error)
    }
  }
}
