const UserService = {
    getUserById(knex, id){
        return knex.from('gp_users').select('*').where('id', id).first()
    },
    deleteUser(knex,id){
        return knex('gp_users')
        .where({id})
        .delete()
    },
    updateUser(knex, id, newUserFields){
        return knex('gp_users')
        .where({id})
        .update(newUserFields)
    },
    insertUser(knex, newUser){
        return knex
        .insert(newUser)
        .into('gp_users')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    getUserZone(knex,zipcode){
	return knex.select('*').from('gp_zipcode_zones as z').join('gp_grow_zones as g', 'z.zone','=','g.zone').where({zipcode:zipcode}).first()
    },
}

module.exports = UserService
