import mongoose from 'mongoose';
const { Schema } = mongoose;

const swapRequestSchema = new Schema({
  swapId: { type: String, required: true }, // UUID
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  offeredSkill: { type: String, required: true },
  requestedSkill: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

const SwapRequestModel = mongoose.model('Skill', swapRequestSchema);
export default SwapRequestModel;