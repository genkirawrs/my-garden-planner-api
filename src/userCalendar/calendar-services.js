const CalendarService = {
    getAllMonthNotes(knex, monStart, monEnd, user_id){
        return knex
	.from('gp_user_calnotes')
	.select('*')
	.where('day','>=', monStart)
	.where('day', '<=', monEnd)
	.where('user_id', user_id)
    },
    getNotesById(knex, id){
        return knex.from('gp_user_calnotes').select('*').where('id', id).first()
    },
    getNoteByDay(knex,user_id, day){
	return knex.from('gp_user_calnotes').select('*').where('user_id', user_id).where('day',day).first()
    },
    insertNotes(knex, newNotes){
        return knex
        .insert(newNotes)
        .into('gp_user_calnotes')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    deleteNotes(knex,id){
        return knex('gp_user_calnotes')
        .where({id})
        .delete()
    },
    updateNotes(knex, id, newNoteFields){
        return knex('gp_user_calnotes')
        .where({id})
        .update(newNoteFields)
    },
}

module.exports = CalendarService

