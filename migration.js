import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import CarModel from "./src/models/Car.js"
import CategoryModel from "./src/models/Category.js"
import { cars, categories } from "./data.js";

async function runMigration() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		await Promise.all([CarModel.deleteMany(), CategoryModel.deleteMany()])

		const categoriesDb = await CategoryModel.insertMany(categories);
		const mapCategories = categoriesDb.reduce((acc, category) => {
			acc[category.title] = category._id;
			return acc;
		}, {});

		const carWithCategory = cars.map(car => ({
			...car,
			category: mapCategories[car.category]
		}))

		await CarModel.insertMany(carWithCategory);
		console.log('Migration completed');
	} catch (error) {
		console.error("Migration error", error)
	} finally {
		mongoose.disconnect()
	}
}

setTimeout(runMigration, 5000)