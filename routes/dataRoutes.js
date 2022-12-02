import express from 'express'
const router = express.Router()
import { getData, postData} from '../controllers/dataController.js'



       
router.route('/').post(postData).get( getData)

router.get("/allocate")
export default router


     