import UserService from "../services/userService.js"
import TokenService from "../services/tokenService.js"

export default class UserController {
    constructor() {
        this.UserService = new UserService()
    }

    async getAll(req, res, next) {
        try {
            const users = await this.UserService.getAll()
            res.json({users})
        } catch (error) {
            next(error)
        }
    }

    async getByUser(req, res, next) {
        try {
            const { usuario } = req.params
            const user = await this.UserService.findByUser(usuario)
            res.json({user})
        } catch (error) {
            next(error)
        }
    }

    async getByRol(req, res, next) {
        try {
            const { rol } = req.params
            const user = await this.UserService.findByRol(rol)
            res.json(user)
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const userData = req.body
            console.log('User Data: ', userData)
            const user = await this.UserService.create(userData)
            res.status(201).json(user)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const userData = req.body
            const user = await this.UserService.update(id, userData)
            res.json(user)
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            const user = await this.UserService.delete(id)
            res.json(204).end()
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const { usuario, password } = req.body
            const token = await this.UserService.login(usuario, password)
            res.json({token})
        } catch (error) {
            next(error)
        }
    }
    
    async logout(req, res, next) {
        try {
            const authHeader = req.headers.authorization
            if(!authHeader) {
                throw { message: 'Token no proporcionado', statusCode: 400 }
            }
            const token = authHeader.split(' ')[1]
            const userId = req.user.id
            await this.UserService.logout(userId, token)
            res.status(204).json({ message: 'Sesión cerrada' })
        } catch (error) {
            next(error)
        }
    }

    async unlockUser(req, res, next) {
        try {
            const { id } = req.params
            await this.UserService.unlockUser(id)
            res.status(204).json({ message: 'Usuario desbloqueado' })
        } catch (error) {
            next(error)
        }
    }

    async getUserByUsername(req, res, next) {
        try {
            const { usuario } = req.user
            if(!usuario) {
                throw { message: 'Usuario no encontrado', statusCode: 404 }
            }

            const user = await this.UserService.getByUser(usuario)
            if(!user) {
                throw { message: 'Usuario no encontrado', statusCode: 404 }
            }
            res.json({user})
        } catch (error) {
            next(user)
        }
    }
}