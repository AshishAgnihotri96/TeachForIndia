import path from 'path'
import express, { json } from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import morgan from 'morgan'

import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import dataRoutes from "./routes/dataRoutes.js"

dotenv.config()

// Invoke connectDB
connectDB()

const app = express()
app.use(cors())
// Run morgan ONLY if in development mode
// morgan logs all activities
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}
app.use(express.json())

// Mount routes to respective imports

app.use('/api/users', userRoutes)
app.use('/api/data', dataRoutes)


if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/frontend/build')))
	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
	)
} else {
	// test get route
	app.get('/', (req, res) => {
		res.send('API is running...')
	})
}
  
// Set port number either use alternate port
const PORT = process.env.PORT || 8010

app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
	)
)

     