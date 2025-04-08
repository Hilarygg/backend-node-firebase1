import PacienteService from '../services/pacienteService.js'

export default class PacienteController {
    constructor() {
        this.pacienteService = new PacienteService()
    }

    async getAll(req, res, next) {
        try {
            const pacientes = await this.pacienteService.getAll()
            res.status(200).json(pacientes)
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const paciente = await this.pacienteService.create(req.body)
            res.status(201).json(paciente)
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const paciente = await this.pacienteService.update(req.params.id, req.body)
            res.status(200).json(paciente)
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            await this.pacienteService.delete(req.params.id)
            res.status(204).end()
        } catch (error) {
            next(error)
        }
    }
}