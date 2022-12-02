import mongoose from 'mongoose'

const DataSchema = mongoose.Schema(
	{
		
classroomID:{type : String},
capacity: {
			type: Number
			
		},
		
requirement: {
			type: Number
			
		},
		
subjects : [{type : String}],
languageRequirement : [{type : String,ref:"User"}],
location: {type : String},
		
	}
	
)                        
const DataBase = mongoose.model('Database', DataSchema)
export default DataBase