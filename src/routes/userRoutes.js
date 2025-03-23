import express from 'express'
import UserController from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'

const router = express.Router()
const userController = new UserController()

const userRoutes = [
    {
        method: 'get',
        path: '/',
        middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handle: 'getAll'
    },
    {
        method: 'post',
        path: '/create',
        // middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handle: 'create'
    },
    {
        method: 'put',
        path: '/update/:id',
        middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handle: 'update'
    },
    {
        method: 'delete',
        path: '/delete/:id',
        middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handle: 'delete'
    },
    {
        method: 'post',
        path: '/login',
        // middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handle: 'login'
    },
    {
        method: 'post',
        path: '/logout',
        middleware: [authMiddleware],
        handle: 'logout'
    },
    {
        method: 'post',
        path: '/unlock/:id',
        middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handle: 'unlockUser'
    },
    {
        method: 'get',
        path: '/user',
        middleware: [authMiddleware],
        handle: 'getUserByUsername'
    }
]

userRoutes.forEach(route => {
    router[route.method](
        route.path,
        ...(route.middleware || []),
        userController[route.handle].bind(userController)
    )
})

export default router