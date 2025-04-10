import jwt from 'jsonwebtoken'
import TokenService from '../services/tokenService.js'
import UserRepository from '../repositories/userRepository.js'

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        return res.status(401).json({ message: 'No se proporciono un token' })
    }

    const token = authHeader.split(' ')[1]
    const userRepository = new UserRepository()

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const existingToken = await userRepository.getSessionToken(decoded.id)
        if(existingToken !== token || await TokenService.isTokenRevoked(token)) {
            throw { message: 'Token Inválido', statusCode: 401 }
        }
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({ message: 'token Inválido' })
    }
}

export default authMiddleware