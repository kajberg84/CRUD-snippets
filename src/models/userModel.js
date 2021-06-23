import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, maxlength: 100, trim: true, unique: true },
    password: { type: String, required: true, maxlength: 1000, minlength: 10 },
    email: { type: String, required: true, maxlength: 100, trim: true }
  })

export const UserModel = mongoose.model('User', UserSchema)
