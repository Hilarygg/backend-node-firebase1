export class Usuario {
    constructor({nombre, apPaterno, apMaterno, direccion, telefono, ciudad, estado, usuario, password, rol = 'contabilidad', bloqueado = false, intentos = 0}) {
        this.nombre = nombre
        this.apPaterno = apPaterno
        this.apMaterno = apMaterno
        this.direccion = direccion
        this.telefono = telefono
        this.ciudad = ciudad
        this.estado = estado
        this.usuario = usuario
        this.password = password
        this.rol = rol
        this.bloqueado = bloqueado
        this.intentos = intentos
    }
}