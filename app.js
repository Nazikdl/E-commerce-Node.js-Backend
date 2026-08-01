import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import {fileURLToPath} from 'url'
import path from 'path'
import fs from 'fs'
import { catchError } from 'vanta-api'
import isAdmin from './Middlewares/isAdmin.js'
import userRouter from './Modules/User/user.js'
import authRouter from './Modules/Auth/auth.js'


const __filename=fileURLToPath(import.meta.url)
export const __dirname=path.dirname(__filename)
const app=express()
app.use(morgan("dev"))
app.use(cors())
app.use(express.json())
app.use('/api/users',isAdmin,userRouter)
app.use('/api/auth',authRouter)



app.use(catchError)
export default app
