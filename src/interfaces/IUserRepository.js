export default class IUserRepository {
    /*
    Crear Usuario
    @partam {onjeto} - Datos del Usuario
    @return {Promise<Objeto>} - Usuario Creado
    */

    create(user) {
        throw new Error('Metodo no implementado')
    }
    update(id,  updateData) {
        throw new Error('Metodo no implementado')
    }
    delete(id) {
        throw new Error('Metodo no implementado')
    }
    getAll() {
        throw new Error('Metodo no implementado')
    }
    findByFullname(nombre, apPaterno, apMaterno) {
        throw new Error('Metodo no implementado')
    }
    findByRol(rol) {
        throw new Error('Metodo no implementado')
    }
    getById(id) {
        throw new Error('Metodo no implementado')
    }
}