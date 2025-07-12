import mongoose from 'mongoose';
const { Schema } = mongoose;

const skillsSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String },
  level: { type: String },
});

const SkillModel = mongoose.model('Skill', skillsSchema);
export default SkillModel;