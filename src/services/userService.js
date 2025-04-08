import UserRepository from "../repositories/userRepository.js"
import TokenService from "./tokenService.js"
import { Usuario } from "../models/Usuario.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class UserService {
    constructor() {
        this.userRepository = new UserRepository()
        this.tokenService = new TokenService()
    }

    async getAll() {
        return await this.userRepository.getAll()
    }

    async findByUser(usuario) {
        const user = this.userRepository.findByUser(usuario)
        if(!user) {
            throw { message: 'Usuario No Encontrado', statusCode: 404 }
        }

        return user
    }

    async findByRol(rol) {
        return await this.userRepository.findByRol(rol)
    }

    async create(userData) {
        const { nombre, apaterno, amaterno, usuario, password } = userData

        // Verificar que sea un usuario único
        const uniqueUser = await this.userRepository.findByUser(usuario)
        if(uniqueUser) {
            throw { message: 'El usuario ya existe', statusCode: 400 }
        }

        // Verificar si no hay otro registro con el mismo nombre
        const uniqueFullname = await this.userRepository.findByFullname(nombre, apaterno, amaterno)
        if(uniqueFullname) {
            throw { message: 'Ya existe un usuario con el mismo nombre completo', statusCode: 400 }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new Usuario({ ...userData, password: hashedPassword })
        return this.userRepository.create({...newUser})
    }

    async update(id, userData) {
        const { password } = userData
        const updateUser = await this.userRepository.getById(id)

        if (!updateUser) {
            throw { message: 'Usuario No Encontrado', statusCode: 404 }
        }

        if(password) {
            updateUser.password = await bcrypt.hash(password, 10)
        }

        const newUser = new Usuario({ ...updateUser, ...userData, password: updateUser.password })

        return this.userRepository.update(id, { ...newUser })
    }

    async delete(id) {
        const userExists = await this.userRepository.getById(id)
        if(!userExists) {
            throw { message: 'Usuario No Encontrado', statusCode: 404 }
        }

        await this.userRepository.delete(id)
    }

    async login(usuario, password) {
        const user = await this.userRepository.findByUser(usuario)
        if(!user) {
            throw { message: 'El usuario no existe', statusCode: 404 }
        }

        if(user.bloqueado) {
            throw { message: 'Usuario Bloqueado, contacta al administrador.', statusCode: 401 }
        }

        const existingToken = await this.userRepository.getSessionToken(user.id)
        console.log(existingToken);
        if(existingToken) {
            throw { message: 'Ya hay un sesión activa', statusCode: 401 }
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) {
            await this.handleFailedLogin(user.id)
            throw { message: 'Contraseña Incorrecta', statusCode: 401 }
        }

        const token = jwt.sign({ 
            id: user.id, 
            usuario: user.usuario, 
            rol: user.rol
        }, process.env.JWT_SECRET, { expiresIn: '1h' })

        await this.userRepository.updateSessionToken(user.id, token)
        return token
    }

    async logout(userId, token) {
        const sessionToken = await this.userRepository.getSessionToken(userId)

        if(sessionToken !== token) {
            throw { message: 'Token Invalido', statusCode: 401 }
        }

        await this.userRepository.updateSessionToken(userId, null)
        await TokenService.revokedToken(token)
    }

    async unlockUser(id) {
        const user = await this.userRepository.getById(id)
        if(!user) {
            throw { message: 'El usuario no existe', statusCode: 404 }
        }

        await this.userRepository.update(id, { bloqueado: false, intentos: 0 })
    }

    async handleFailedLogin(id) {
        const user = await this.userRepository.getById(id)
        const intentos = parseInt(user.intentos) + 1
        console.log('@@@ intentos => ', intentos, user)
        if(intentos >= 3) {
            await this.userRepository.update(id, { bloqueado: true })
            throw { message: 'Usuario Bloqueado despues de 3 intentos, contacta al Administrados', statusCode: 401 }
        }
        await this.userRepository.update(id, { intentos })
    }
    
    async getByUser(usuario) {
        const user = await this.userRepository.findByUser(usuario)

        if(!user) {
            throw { message: 'El usuario no existe', statusCode: 404 }
        }

        return user
    }
}