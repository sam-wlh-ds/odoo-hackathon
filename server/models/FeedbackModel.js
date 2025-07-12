import mongoose from 'mongoose';
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  feedbackId: { type: String, required: true }, // UUID
  swapId: { type: String, required: true },
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const FeedbackModel = mongoose.model('Feedback', feedbackSchema);

export default FeedbackModel;
