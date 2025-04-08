import PacienteRepository from '../repositories/pacienteRepository.js'
import { Paciente } from '../models/Pacientes.js'

export default class PacienteService {
    constructor() {
        this.pacienteRepository = new PacienteRepository()
    }

    async getAll() {
        return await this.pacienteRepository.getAll()
    }

    async create(pacienteData) {
        const { fullName } = pacienteData

        // Verificar que sea un paciente único
        const uniquePaciente = await this.pacienteRepository.findByName(fullName)
        if (uniquePaciente) {
            throw { message: 'El paciente ya existe', statusCode: 400 }
        }

        const newPaciente = new Paciente({ ...pacienteData })
        return this.pacienteRepository.create({ ...newPaciente })
    }

    async update(id, pacienteData) {
        const updatePaciente = await this.pacienteRepository.getById(id)
        if(!updatePaciente) {
            throw { message: 'Paciente No Encontrado ', statusCode: 404 }
        }
        const newPaciente = new Paciente({ ...updatePaciente, ...pacienteData })
        return this.pacienteRepository.update(id, { ...newPaciente })
    }
    
    async delete(id) {
        const deletePaciente = await this.pacienteRepository.getById(id)
        if (!deletePaciente) {
            throw { message: 'Paciente No Encontrado', statusCode: 404 }
        }
        return this.pacienteRepository.delete(id)
    }
}