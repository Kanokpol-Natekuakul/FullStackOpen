import mongoose from 'mongoose'

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 4 },
  born: { type: Number, default: null },
})

export default mongoose.model('Author', authorSchema)
