
import asyncHandler from 'express-async-handler'
import DataBase from '../models/dataBaseModel.js'


 const getData = asyncHandler(async (req, res) => {
	const users = await DataBase.find()
	res.json(users)
})

const postData = asyncHandler(async (req, res) => {
	//api for posting more data
	const { classroomID,capacity,requirement, subjects, languageRequirement,location } = req.body
	const user = await DataBase.create({
		classroomID,capacity,requirement, subjects, languageRequirement,location
	})

	if (user) {
		res.status(201).json({
			msg:"Success"
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}
})

				 	         
export  {getData,postData}
