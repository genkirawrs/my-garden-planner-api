const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeMaliciousCalendar,makeCalendarArray } = require('./calendar-fixtures')
const { makeUsersArray } = require('./user-fixtures')

describe.only(`user calendar service object`, function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db.raw('TRUNCATE gp_user_calnotes, gp_users RESTART IDENTITY CASCADE'))
  afterEach(() => db.raw('TRUNCATE gp_user_calnotes, gp_users  RESTART IDENTITY CASCADE'))

  describe(`GET /api/calendar/month/user_id/start/end`, () => {
    context(`Given no notes`, () => {
      it(`responds with 200 and empty list`, () => {
        return supertest(app)
          .get(`/api/calendar/month/1/202091/2020930`)
          .expect(200, [])
      })
    })

    context('Given there are notes in the database', () => {
      const testCalendar = makeCalendarArray()
      const expectedCalendar = [{
	  id: 1,
          user_id: 1,
          day: 202091,
          notes: 'cal notes for 9/1/2020'
        },
        {
	  id: 2,
          user_id: 1,
          day: 202095,
          notes: 'cal notes for 9/5/2020'
        }]

      beforeEach('insert calendar notes', () => {
	const testUsers = makeUsersArray()
	return db
          .into('gp_users').insert(testUsers)
          .then(()=> {
            return db
              .into('gp_user_calnotes')
              .insert(testCalendar)
          })
      })

      it('responds with 200 and requested all notes', () => {
        return supertest(app)
          .get('/api/calendar/month/1/202091/2020930')
          .expect(200, expectedCalendar)
      })
    })
  })

  describe(`GET /api/calendar/user_id/note_id`, () => {

    context(`Given no notes`, () => {
      it(`responds with 404`, () => {
        return supertest(app)
          .get(`/api/calendar/1/202093`)
          .expect(404, { error: { message: `No note found for this day` } })
      })
    })

    context('Given there are notes in the database', () => {
      const testCalendar = makeCalendarArray() 
      const expectedNoteInfo = { 
          id: 2,
          user_id: 1,
          day: 202095,
          notes: 'cal notes for 9/5/2020'
        }

      beforeEach('insert calendar notes', () => {
        const testUsers = makeUsersArray()
        return db
          .into('gp_users').insert(testUsers)
          .then(()=> {
            return db
              .into('gp_user_calnotes')
              .insert(testCalendar)
          })
      })
      
      it('responds with 200 and requested note info', () => {
        return supertest(app)
          .get('/api/calendar/1/2')
          .expect(200, expectedNoteInfo)
      })  
    })
  })

  describe(`DELETE /api/calendar/user_id/note_id`, () => {
    context('Given there are favorites in the database', () => {
      const testCalendar = makeCalendarArray()

      beforeEach('insert calendar notes', () => {
        const testUsers = makeUsersArray()
        return db
          .into('gp_users').insert(testUsers)
          .then(()=> {
            return db
              .into('gp_user_calnotes')
              .insert(testCalendar)
          })
      })

      it('responds with 204 and removes the entries for that day', () => {
        return supertest(app)
          .delete(`/api/calendar/1/2`)
          .expect(204)
      })
    })
  })

  describe(`POST /api/calendar/add/:user_id/:day`, () => {
      const testCalendar = makeCalendarArray()
          
      beforeEach('insert calendar notes', () => {
        const testUsers = makeUsersArray()
        return db
          .into('gp_users').insert(testUsers)
          .then(()=> {
            return db
              .into('gp_user_calnotes')
              .insert(testCalendar)
          })
      })  

    it(`creates a note, responding with 201 and the new note`, () => {
      this.retries(3)
      const newNote = {
        user_id: 1,
	day: 202098,
	notes: 'this is a new test!'
      }

      return supertest(app)
        .post('/api/calendar/add/1/202098')
        .send(newNote)
        .expect(201)
        .expect(res => {
          expect(res.body.day).to.eql(newNote.day)
          expect(res.body.user_id).to.eql(newNote.user_id)
	  expect(res.body.notes).to.eql(newNote.notes)
        })
    })
    const requiredFields = ['user_id','day','notes']

    requiredFields.forEach(field => {
      const newNote = {
        user_id: 1,
        day: 202098,
        notes: 'this is a new test!'
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newNote[field]

        return supertest(app)
          .post('/api/calendar/add/1/202098')
          .send(newNote)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
  })

  describe.only(`PATCH /api/calendar/edit/:user_id/:note_id`, () => {
      const testCalendar = makeCalendarArray()
          
      beforeEach('insert calendar notes', () => {
        const testUsers = makeUsersArray()
        return db
          .into('gp_users').insert(testUsers)
          .then(()=> {
            return db
              .into('gp_user_calnotes')
              .insert(testCalendar)
          })
      })  

    context('Given there are notes in the database', () => {

      it('responds with 204 and updates the note', () => {
        const idToUpdate = 2
        const updateNote = {
	  id: 2,
          user_id: 1,
          day: 202098,
          notes: 'rawr!'
        }

        const expectedNote = {
          ...testCalendar[idToUpdate - 1],
          ...updateNote
        }

        return supertest(app)
          .patch(`/api/calendar/edit/1/${idToUpdate}`)
          .send(updateNote)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/calendar/1/${idToUpdate}`)
              .expect(expectedNote)
          )
      })
      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/calendar/edit/1/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `invalid field`
            }
          })
      })

      it('removes XSS attack content from response', () => {
        const { maliciousNote, expectedNote } = makeMaliciousCalendar()
        return supertest(app)
          .patch(`/api/calendar/edit/1/1`)
          .send(maliciousNote)
          .expect(204)
          .expect(res => {
            supertest(app)
              .get(`/api/calendar/edit/1/1`)
              .expect(expectedNote)
          })
      })
    })
  })


})



