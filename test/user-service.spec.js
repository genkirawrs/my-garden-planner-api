const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./user-fixtures')


describe(`user service object`, function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db.raw('TRUNCATE gp_user_favplants, gp_user_calnotes, gp_users RESTART IDENTITY CASCADE'))
  afterEach(() => db.raw('TRUNCATE gp_user_favplants, gp_user_calnotes, gp_users RESTART IDENTITY CASCADE'))


  describe(`GET /api/account/:user_id`, () => {
    context(`Given no user`, () => {
      it(`responds with 404`, () => {
        const user_id = 123456
        return supertest(app)
          .get(`/api/account/${user_id}`)
          .expect(404, { error: { message: `Sorry, could not locate user information` } })
      })
    })

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray()
      const expectedUserInfo = {id: 1,zipcode: '95132'}
      beforeEach('insert users', () => {
        return db
          .into('gp_users')
          .insert(testUsers)
      })

      it('responds with 200 and requested user info', () => {
        return supertest(app)
          .get('/api/account/1')
          .expect(200, expectedUserInfo)
      })
    })
  })

  describe(`PATCH /api/account/`, () => {
    context(`Given no user`, () => {
      it(`responds with 404`, () => {
        const user_id = 123456
        return supertest(app)
          .delete(`/api/account/${user_id}`)
          .expect(404, { error: { message: `Sorry, could not locate user information` } })
      })
    })

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray()

      beforeEach('insert users', () => {
        return db
          .into('gp_users')
          .insert(testUsers)
      })

      it('responds with 204 and updates the user', () => {
        const idToUpdate = 3
        const updateUser = {
	  zipcode: 12345
        }
        const expectedUser = {id:3, zipcode:'12345'}

        return supertest(app)
          .patch(`/api/account/${idToUpdate}`)
          .send(updateUser)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/account/${idToUpdate}`)
              .expect(expectedUser)
          )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 3
        return supertest(app)
          .patch(`/api/account/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `invalid field`
            }
          })
      })
    })
  })

  describe(`GET /api/account/zone/:zipcode`, () => {
    context(`Given no zipcode found`, () => {
      it(`responds with 404`, () => {
        const zipcode = 123456
        return supertest(app)
          .get(`/api/account/zone/${zipcode}`)
          .expect(204)
      })
    })

    context('Given the zip code value is found', () => {
      const expectedZoneInfo = {
	zipcode: '95132', 
	zone:'9b',
	zone_description: '<p>Planting Zone 9 is considered a year-round planting zone. Located in California, Arizona, Texas, Florida and along the Gulf of Mexico coast, this zone features warm winters and hot summers. With an average minimum winter temperature of 20 to 30 degrees F, Zone 9 features active gardens throughout the entire year.</p><p>Long, hot summers and mild winter conditions make the heat more of an issue than the cold in this zone. Tropical plants with low water requirements thrive in Zone 9. Because of the extreme heat, spring gardening begins much earlier and fall gardens produce much longer than in other zones.</p>',
	zone_first_frost: 'Nov 20 to Dec 20',
	zone_last_frost: 'Feb 15 to Mar 15',
	zone_hardiness: '25 to 30 F'
      }

      it('responds with 200 and requested zone', () => {
        return supertest(app)
          .get('/api/account/zone/95132')
          .expect(200, expectedZoneInfo)
      })
    })
  })



})
