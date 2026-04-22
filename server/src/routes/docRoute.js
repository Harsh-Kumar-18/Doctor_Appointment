import express from 'express'
import { cancelAppointmentDoctor, completeAppointment, doctorAppointments, doctorDashboard, doctorList, getDoctorProfile, loginDoctor, updateDoctorProfile } from '../controllers/docController.js'
import authDoctor from '../middleware/authDoctor.js'

const doctorRouter = express.Router()


doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments', authDoctor, doctorAppointments)
doctorRouter.post('/cancel-appointment', authDoctor, cancelAppointmentDoctor)
doctorRouter.post('/complete-appointment', authDoctor, completeAppointment)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, getDoctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)

export default doctorRouter