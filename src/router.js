import { Router } from "express"
import Controller from "./controller.js"

const router = Router()

router.get('/', Controller.getHomePage)
router.get('/category-:id', Controller.getCategoryPage)
router.get('/category-:id/car-:id', Controller.getCarPage)
router.get('/crm', Controller.getEditCarsPage)
router.post('/crm/post/car-:id', Controller.postCar)


export default router