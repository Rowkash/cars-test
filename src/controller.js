import { readFileSync } from "fs"
import path from 'path';
import { fileURLToPath } from 'url'
import mustache from "mustache"
import CarModel from "./models/Car.js"
import CategoryModel from "./models/Category.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lookupCars = {
	from: "cars",
	let: { id: "$id" },
	localField: "_id",
	foreignField: "category",
	as: "cars",
	pipeline: [
		{ $addFields: { category: "$$id" } }
	]
}

class Controller {

	async getHomePage(req, res) {
		try {
			const categories = await CategoryModel.aggregate([{ $lookup: lookupCars }])
			const template = readFileSync(__dirname + '/views/home.mustache', 'utf-8');
			const output = mustache.render(template, { categories });

			res.send(output);
		} catch (e) {
			console.error(e.message)
			return res.status(500).send("Something went wrong")
		}
	}

	async getCarPage(req, res) {
		try {
			const { id } = req.params
			const car = await CarModel.findOne({ id }).populate("category").lean()
			if (!car) res.status(404).send('Car not found');
			const template = readFileSync(__dirname + '/views/car.mustache', 'utf-8');
			const output = mustache.render(template, { car });

			res.send(output);
		} catch (e) {
			console.error(e.message)
			return res.status(500).json("Something went wrong")
		}
	}

	async getCategoryPage(req, res) {
		try {
			const { id } = req.params
			const category = await CategoryModel.findOne({ id }).lean()
			if (!category) res.status(404).send('Category not found');
			const cars = await CarModel.find({ category: category._id }).populate("category").lean()
			const template = readFileSync(__dirname + '/views/category.mustache', 'utf-8');
			const output = mustache.render(template, { category, cars });

			res.send(output);
		} catch (e) {
			console.error(e.message)
			return res.status(500).send("Something went wrong")
		}
	}

	async getEditCarsPage(req, res) {
		try {
			const [cars, categories] = await Promise.all([
				CarModel.find().populate("category").lean(),
				CategoryModel.find().select("title").lean()
			])
			const colors = ["red", "black", "green", "yellow"];

			cars.forEach(car => {
				const carColors = colors.map(color => ({
					title: color,
					available: car.colors.includes(color)
				}));
				car.colors = carColors
			})

			const template = readFileSync(__dirname + '/views/carEdit.mustache', 'utf-8');
			const output = mustache.render(template, { cars, categories });

			res.send(output);
		} catch (e) {
			console.error(e.message)
			return res.status(500).send("Something went wrong")
		}
	}

	async postCar(req, res) {
		try {
			const { id } = req.params
			if (!id) return res.status(400).send("Bad Request")
			const findCar = await CarModel.findOne({ id })
			if (!findCar) return res.status(404).send('Car not found')
			const { colors, category } = req.body

			const carColors = typeof colors === "string" ? [colors] : colors
			const validColors = ["red", "black", "green", "yellow"]
			const hasValidColor = carColors.some(color => validColors.includes(color));
			if (!hasValidColor) {
				return res.status(400).send('Error: No valid colors provided.');
			}

			const findCategory = await CategoryModel.findOne({ _id: category }).lean()
			if (!findCategory) return res.status(404).send('Category not found')

			await findCar.updateOne(req.body)
			res.redirect(`/crm`)
		} catch (e) {
			console.error(e.message)
			return res.status(500).send("Something went wrong")
		}
	}

}

export default new Controller()