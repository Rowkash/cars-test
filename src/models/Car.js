import mongoose from "mongoose"
import { autoIncrement } from "mongoose-plugin-autoinc"
import Category from "./Category.js";

const Car = new mongoose.Schema({
	id: { type: Number, unique: true },
	title: { type: String, required: true },
	price: { type: Number, required: true },
	description: { type: String },
	image: { type: String },
	colors: { type: Array, required: true },
	category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: Category }
})

Car.plugin(autoIncrement, {
	model: "cars",
	field: "id",
	startAt: 1,
});

export default mongoose.model('Car', Car)