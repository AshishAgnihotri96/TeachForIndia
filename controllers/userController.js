import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import DataBase from '../models/dataBaseModel.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error('Invalid email or password')
	}
})


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name,password,email, contact_information, user_location,spoken_languages,availability } = req.body
		const data=	await DataBase.find()
		const userExists = await User.findOne({ email })
		const match=[]
		
		for(let i=0;i<data.length;i++)
		{	
			let lang=data[i].languageRequirement
			let required=data[i].requirement
		    let data1=data[i]
			
			for(let j=0;j<lang.length;j++)
			{
				for(let k=0;k<spoken_languages.length;k++)
				{
					if(lang[j]===spoken_languages[k] && required>0)
					{
						match.push(data[i])
						required--
					    await DataBase.find(data1).updateOne({"requirement":required})
						
					}
					
				}
				
			}
		

		}
		
		if(match.length==0)
			{
				
				for(let i=0;i<data.length;i++)
				{    let data1=data[i]
					let lang=data[i].languageRequirement
					let required=data[i].requirement
					
					if(lang.length===0 && required>0)
					{
						match.push(data[i])
						
						required--
						await DataBase.find(data1).updateOne({"requirement":required})
						
					}
					
				}
				
			}
			
		if (userExists) {
			res.status(400)
			
			throw new Error('User already exists')
		}
		
		const user = await User.create({
			name,
			email,
			password,
			contact_information,
			user_location,
			spoken_languages,
			availability,
			allocation:match
		})
	
		if (user) {
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				contact_information:user.contact_information,
				user_location:user.user_location,
				spoken_languages:user.spoken_languages,
				availability:user.availability,
				allocation:match,
				isAdmin: user.isAdmin,
				token: generateToken(user._id),
			})
		} else {
			res.status(400)
			throw new Error('Invalid user data')
		}
	
	
})	
	

   
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		})
	} else {
		res.status(404)
		throw new Error('User Not Found')
	}
})
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
	
	if (user) {
		user.name = req.body.name || user.name
		user.email = req.body.email || user.email
		user.contact_information=req.body.contact_information|| user.contact_information
		user.user_location=req.body.user_location||user.user_location
		user.spoken_languages=req.body.spoken_languages||user.spoken_languages
		user.availability=req.body.availability||user.availability
		if (req.body.password) {
			user.password = req.body.password
		}
	
		const updatedUser = await user.save()

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			contact_information:updatedUser.contact_information,
			user_location:updatedUser.user_location,
			spoken_languages:updatedUser.spoken_languages,
			isAdmin: updatedUser.isAdmin,
			availability:updatedUser.availability,
			token: generateToken(user._id),
		})
	} else {
		res.status(404)
		throw new Error('User Not Found')
	}
})
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin

      
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find()
	res.json(users)
})


export {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
	getUsers
	
}
      