export class Paciente {
    constructor({fullName, email, mobile, dateBirth, motherTongue, govId, sex, maritalStatus, address, city, zipCode, state, country, district, international = false, photo}) {
        this.fullName = fullName
        this.email = email
        this.mobile = mobile
        this.dateBirth = dateBirth
        this.motherTongue = motherTongue
        this.govId = govId
        this.sex = sex
        this.maritalStatus = maritalStatus
        this.address = address
        this.city = city
        this.zipCode = zipCode
        this.state = state
        this.country = country
        this.district = district
        this.international = international
        this.photo = photo
    }
}