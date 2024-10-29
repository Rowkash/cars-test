import express from 'express'
import mongoose from "mongoose"
import router from "./router.js";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config()

async function bootstrap() {
	const app = express()
	const PORT = 3001
	await connectDB()

	app.use(express.urlencoded({ extended: true }));
	app.use(cors({ origin: '*' }))
	app.use(express.json())
	app.use('/', router)
	app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
}

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {})
		console.log('[db]: Connected to the database')
	} catch (err) {
		console.log('[db]: Database connection failed', err)
	}
}

setTimeout(bootstrap, 5000)
