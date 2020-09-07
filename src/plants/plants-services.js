const PlantService = {
    getAllPlants(knex){
        return knex.from('gp_plant_gallery').select('*')
    },
    getPlantById(knex, id){
	return knex.from('gp_plant_gallery').select('*').where('id', id).first()
    },
    getPlantsByCategory(knex, category){
        return knex.from('gp_plant_gallery').select('*').where('search_category', category)
    },
    getFavoritePlants(knex, user_id){
        return knex.from('gp_user_favplants').select('*').where('user_id', user_id)
    },
    getFavoritePlant(knex,user_id,plant_id){
	return knex
	    .from('gp_user_favplants')
	    .select('*')
	    .where('user_id', user_id)
	    .where('plant_id', plant_id)
	    .first()
    },
    getFavoritePlantById(knex,fav_id){
        return knex
            .from('gp_user_favplants')
            .select('*')
            .where('id', fav_id)
            .first()
    },
    insertFavoritePlant(knex, newFav){
        return knex
        .insert(newFav)
        .into('gp_user_favplants')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    deleteFavoritePlant(knex,id){
        return knex('gp_user_favplants')
        .where({id})
        .delete()
    },
    updateFavoritePlant(knex, id, newFavFields){
        return knex('gp_user_favplants')
        .where({id})
        .update(newFavFields)
    },
}

module.exports = PlantService

