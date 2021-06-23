import mongoose from 'mongoose'

const SnippetSchema = mongoose.Schema

const snippet = new SnippetSchema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 30 },
    content: { type: String, required: true, trim: true, maxlength: 3000 }
  }
)

export const SnippetModel = mongoose.model('Snippet', snippet)
