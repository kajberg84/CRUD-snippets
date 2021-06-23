/**
 * Snippet Router.
 *
 * @author Kaj Berg
 * @version 1.0.0
 */

import express from 'express'
import { SnippetController } from '../controller/snippet-controller.js'

export const snippetRouter = express.Router()

const controller = new SnippetController()

// Show list of snippets
snippetRouter.get('/', controller.showList)
// Show a snippet
snippetRouter.get('/:id', controller.showSnippet)
snippetRouter.post('/:id', controller.saveSnippet)

snippetRouter.post('/delete/:id', controller.deleteSnippet)
