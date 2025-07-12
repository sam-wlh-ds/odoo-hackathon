import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email:    { type: String, required: true },
  name:     { type: String, required: true },
  location: { type: String },
  profilePhotoURL: { type: String },
  isPublic: { type: Boolean, default: true },
  availability: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  skillsOffered: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],     
  skillsWanted:  [{ type: Schema.Types.ObjectId, ref: 'Skill' }],     
  feedback: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }]   
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
