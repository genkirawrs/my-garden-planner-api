const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeMaliciousNote,makePlantsArray,makeFavoritesArray } = require('./plant-fixtures')
const { makeUsersArray } = require('./user-fixtures')

describe(`plant service object`, function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db.raw('TRUNCATE gp_user_favplants, gp_plant_gallery RESTART IDENTITY CASCADE'))
  afterEach(() => db.raw('TRUNCATE gp_user_favplants, gp_plant_gallery RESTART IDENTITY CASCADE'))

  describe(`GET /api/plants`, () => {
    context(`Given no plants`, () => {
      it(`responds with 404`, () => {
        return supertest(app)
          .get(`/api/plants`)
          .expect(404, { error: { message: `Sorry, no plants found` } })
      })
    })

    context('Given there are plants in the database', () => {
      const testPlants = makePlantsArray()
      const expectedPlantInfo = testPlants[1]
      beforeEach('insert plants', () => {
        return db
          .into('gp_plant_gallery')
          .insert(testPlants)
      })

      it('responds with 200 and requested plant info', () => {
        return supertest(app)
          .get('/api/plants')
          .expect(200, testPlants)
      })
    })
  })

  describe(`GET /api/plants/category_id`, () => {
    context('Given there are plants in the database', () => {
      const testPlants = makePlantsArray() 
      const expectedPlantInfo = []
	expectedPlantInfo.push({
        id: 4,
        name: 'Tomatoes – San Marzano',
        search_category: 4,
        description: 'Native to Italy, San Marzano tomatoes are distinctive tomatoes with an oblong shape and a pointed end. This tomato is bright red with thick skin and very few seeds. They grow in clusters of six to eight fruits. Also known as San Marzano sauce tomatoes, the fruit is sweeter and less acidic than standard tomatoes. This provides a unique balance of sweetness and tartness. They are widely used in sauces, pastes, pizza, pasta, and other Italian cuisines.',
        image: 'plant16.png',
        plant_type: 'Annual',
        sun: 'Full Sun',
        zones: 'Zones 5 to 10',
        soil: 'Rich, fertile soil'
      })

      beforeEach('insert plants', () => {
        return db
          .into('gp_plant_gallery')
          .insert(testPlants)
      })  
      
      it('responds with 200 and requested plant info', () => {
        return supertest(app)
          .get('/api/plants/4')
          .expect(200, expectedPlantInfo)
      })  
    })
  })


  describe(`GET /api/plants/plant/:plant_id`, () => {
    context(`Given no plant`, () => {
      it(`responds with 404`, () => {
        const plant_id = 123456
        return supertest(app)
          .get(`/api/plants/plant/${plant_id}`)
          .expect(200, [])
      })
    })

    context('Given there are plants in the database', () => {
      const testPlants = makePlantsArray()
      const expectedPlantInfo = {
        id: 4,
        name: 'Tomatoes – San Marzano',
        search_category: 4,
        description: 'Native to Italy, San Marzano tomatoes are distinctive tomatoes with an oblong shape and a pointed end. This tomato is bright red with thick skin and very few seeds. They grow in clusters of six to eight fruits. Also known as San Marzano sauce tomatoes, the fruit is sweeter and less acidic than standard tomatoes. This provides a unique balance of sweetness and tartness. They are widely used in sauces, pastes, pizza, pasta, and other Italian cuisines.',
        image: 'plant16.png',
        plant_type: 'Annual',
        sun: 'Full Sun',
        zones: 'Zones 5 to 10',
        soil: 'Rich, fertile soil'
      }

      beforeEach('insert plantss', () => {
        return db
          .into('gp_plant_gallery')
          .insert(testPlants)
      })

      it('responds with 200 and requested plant info', () => {
        return supertest(app)
          .get('/api/plants/plant/4')
          .expect(200, expectedPlantInfo)
      })
    })
  })

})

describe(`favorite plants service object`, function() {
  let db
   
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })
 
  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db.raw('TRUNCATE gp_user_favplants, gp_users, gp_plant_gallery RESTART IDENTITY CASCADE'))
  afterEach(() => db.raw('TRUNCATE gp_user_favplants, gp_users, gp_plant_gallery RESTART IDENTITY CASCADE'))

  describe(`GET /api/plants/fav_plant/:user_id`, () => {
    context(`Given no favorite plants`, () => {
      it(`responds with 200 and empty list`, () => {
        return supertest(app)
          .get(`/api/plants/fav_plant/1`)
          .expect(200, [])
      })
    })

    context('Given there are favorites in the database', () => {
        const testFavs = makeFavoritesArray()
	const expectedPlants = [
        {
          id: 1,
          plant_id: 1,
          user_id: 1,
          notes: 'test notes for 1'
        },
        {
          id: 2,
          plant_id: 4,
          user_id: 1,
          notes: 'tomatoes!!'
        }	
	]
      beforeEach('insert favs', () => {
        const testPlants = makePlantsArray()
	const testUsers = makeUsersArray()
        return db
	  .into('gp_plant_gallery').insert(testPlants)
	  .then(()=> {
	    return db
              .into('gp_users')
              .insert(testUsers)
	  }).then(()=>{
	    return db
              .into('gp_user_favplants')
              .insert(testFavs)
	  })

      })

      it('responds with 200 and the specified favorites', () => {
        return supertest(app)
          .get(`/api/plants/fav_plant/1`)
          .expect(200, expectedPlants)
      })
    })
  })

  describe(`GET /api/plants/fav_plant/:user_id/:fav_id`, () => {
    context(`Given no favorite plants`, () => {
      it(`responds with 200 and empty array`, () => {
        return supertest(app)
          .get(`/api/plants/fav_plant/1/12345`)
          .expect(200, [] )
      })
    })

    context('Given there are favorites in the database', () => {
        const testFavs = makeFavoritesArray()
        const expectedPlants = {
          id: 2,
          plant_id: 4,
          user_id: 1,
          notes: 'tomatoes!!'
        }
        
      beforeEach('insert favs', () => {
        const testPlants = makePlantsArray()
        const testUsers = makeUsersArray()
        return db
          .into('gp_plant_gallery').insert(testPlants)
          .then(()=> {
            return db
              .into('gp_users')
              .insert(testUsers)
          }).then(()=>{
            return db
              .into('gp_user_favplants')
              .insert(testFavs)
          })

      })

      it('responds with 200 and the specified favorite info', () => {
        return supertest(app)
          .get(`/api/plants/fav_plant/1/4`)
          .expect(200, expectedPlants)
      })
    })
  })

  describe(`DELETE /api/plants/fav_plant/:user_id/:fav_id`, () => {
    context('Given there are favorites in the database', () => {
      const testFavs = makeFavoritesArray()

      beforeEach('insert favs', () => {
        const testPlants = makePlantsArray()
        const testUsers = makeUsersArray()
        return db
          .into('gp_plant_gallery').insert(testPlants)
          .then(()=> {
            return db
              .into('gp_users')
              .insert(testUsers)
          }).then(()=>{
            return db
              .into('gp_user_favplants')
              .insert(testFavs)
          })

      })
      it('responds with 204 and removes the favorite', () => {
        const idToRemove = 2
        const expectedEvents = testFavs.filter(fav => fav.id !== idToRemove)
        return supertest(app)
          .delete(`/api/plants/fav_plant/1/${idToRemove}`)
          .expect(204)
      })
    })
  })

  describe(`POST /api/plants/fav_plant/:user_id/:plant_id`, () => {
      const testFavs = makeFavoritesArray()

      beforeEach('insert favs', () => {
        const testPlants = makePlantsArray()
        const testUsers = makeUsersArray()
        return db
          .into('gp_plant_gallery').insert(testPlants)
          .then(()=> {
            return db
              .into('gp_users')
              .insert(testUsers)
          }).then(()=>{
            return db
              .into('gp_user_favplants')
              .insert(testFavs)
          })

      })

    it(`creates a fav, responding with 201 and the new fav`, () => {
      this.retries(3)
      const newFav = {
        user_id: 1,
        plant_id: 3,
      }

      return supertest(app)
        .post('/api/plants/fav_plant/1/3')
        .send(newFav)
        .expect(201)
        .expect(res => {
          expect(res.body.plant_id).to.eql(newFav.plant_id)
          expect(res.body.user_id).to.eql(newFav.user_id)
        })
    })
    const requiredFields = ['user_id','plant_id']

    requiredFields.forEach(field => {
      const newFav = {
        plant_id: 2,
        user_id: 1
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newFav[field]

        return supertest(app)
          .post('/api/plants/fav_plant/1/2')
          .send(newFav)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
  })

  describe(`PATCH /api/plants/fav_plant/:user_id/:fav_id`, () => {
      const testFavs = makeFavoritesArray()

      beforeEach('insert favs', () => {
        const testPlants = makePlantsArray()
        const testUsers = makeUsersArray()
        return db
          .into('gp_plant_gallery').insert(testPlants)
          .then(()=> {
            return db
              .into('gp_users')
              .insert(testUsers)
          }).then(()=>{
            return db
              .into('gp_user_favplants')
              .insert(testFavs)
          })
      
      })

    context(`Given no fav found`, () => {
      it(`responds with 404`, () => {
        return supertest(app)
          .patch(`/api/plants/fav_plant/1/12345`)
          .expect(404, { error: { message: `Sorry, favorite plant not found` } })
      })
    })

    context('Given there are events in the database', () => {

      it('responds with 204 and updates the fav', () => {
        const idToUpdate = 2
        const updateFav = {
	  id : 2,
	  notes: 'blargh' 
        }
        const expectedFav = {
          ...testFavs[idToUpdate - 1],
          ...updateFav
        }
        return supertest(app)
          .patch(`/api/plants/fav_plant/1/${idToUpdate}`)
          .send(updateFav)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/plants/fav_plant/1/4`)
              .expect(expectedFav)
          )
      })
      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/plants/fav_plant/1/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `invalid field`
            }
          })
      })

      it('removes XSS attack content from response', () => {
        const { maliciousNote, expectedNote } = makeMaliciousNote()
        return supertest(app)
          .patch(`/api/plants/fav_plant/1/1`)
          .send(maliciousNote)
          .expect(204)
          .expect(res => {
            supertest(app)
              .get(`/api/plants/fav_plant/1/1`)
              .expect(expectedNote)
          })
      })
    })
  })



})



