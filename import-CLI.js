import fs from "fs"
import mongoose from "mongoose"
import CarModel from "./src/models/Car.js"
import CategoryModel from "./src/models/Category.js"
import { Command } from "commander"
import dotenv from "dotenv"
dotenv.config()


const program = new Command();
const MONGO_URI = process.env.MONGO_URI

async function importData(filePath) {
	try {
		await mongoose.connect(MONGO_URI);
		console.log('Success connected to database.');

		const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		const { cars, categories } = data

		if (categories) {
			const filtered = categories.filter(cat => cat.title && cat.description)
			const existCategories = await CategoryModel.find().select("title").lean()
			const setExistTitles = new Set(existCategories.map(cat => cat.title));
			const newCategories = filtered.filter(cat => !setExistTitles.has(cat.title));
			if (newCategories.length > 0) await CategoryModel.insertMany(newCategories)
		}

		if (cars) {
			const filtered = cars.filter(car => car.title && car.description && car.price && car.colors)
			const existCategories = await CarModel.find().select("title").lean()
			const setExistTitles = new Set(existCategories.map(car => car.title));
			const newCars = filtered.filter(car => !setExistTitles.has(car.title));
			if (newCars.length > 0) {
				const categoriesDb = await CategoryModel.find().select("title").lean();
				const mapCategories = categoriesDb.reduce((acc, category) => {
					acc[category.title] = category._id;
					return acc;
				}, {});

				const carWithCategory = newCars.map(car => ({
					...car,
					category: mapCategories[car.category]
				}))

				console.log(carWithCategory)
				await CarModel.insertMany(carWithCategory)
			}
		}

		console.log('Data successful imported.');
	} catch (error) {
		console.error('Error data import:', error);
	} finally {
		mongoose.connection.close();
		console.log("Connection closed")
	}
}

program
	.version('1.0.0')
	.description('Import data from JSON-file into MongoDB')
	.argument('<filePath>', 'Path to JSON data file')
	.action((filePath) => {
		importData(filePath);
	});

program.parse(process.argv);