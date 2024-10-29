import mongoose from "mongoose"
import { autoIncrement } from "mongoose-plugin-autoinc"

const Category = new mongoose.Schema({
	id: { type: Number, unique: true },
	title: { type: String, required: true },
	description: { type: String },
	parent_category: { type: mongoose.Schema.Types.ObjectId }
})

Category.plugin(autoIncrement, {
	model: "categories",
	field: "id",
	startAt: 1,
});

export default mongoose.model('Category', Category)