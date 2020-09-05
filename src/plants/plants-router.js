const express = require('express')
const path = require('path')
const xss = require('xss')
const PlantService = require('./plants-services')

const plantRouter = express.Router()
const jsonParser = express.json()


const serializePlant = plant => ({
        id: plant.id,
	name: xss(plant.name),
	search_category: plant.search_category,
	description: xss(plant.description),
	image: xss(plant.image),
	plant_type: xss(plant.plant_type),
	sun: xss(plant.sun),
	zones: xss(plant.zones),
	soil: xss(plant.soil)
})


const serializeFavPlant = fav => ({
	id: fav.id,
	plant_id: fav.plant_id,
	user_id: fav.user_id,
	notes: xss(fav.notes)
})

plantRouter
    .route('/')
    .get((req, res, next) => {
      PlantService.getAllPlants(
        req.app.get('db')
      )
      .then(items=> {
	  if(items.length === 0){
	    return res.status(404).json({
		error: { message: `Sorry, no plants found` }
	    })
	  }
          res.json(items.map(serializePlant))
      })
      .catch(next)
    })

plantRouter
    .route('/:category')
    .get((req, res, next) => {
      PlantService.getPlantsByCategory(
        req.app.get('db'),
	req.params.category
      )
      .then(items=> {
          if(items.length === 0){
            return res.status(404).json({ 
                error: { message: `Sorry, no plants found` }
            })
          }
          res.json(items.map(serializePlant))
      })
      .catch(next)
    })

plantRouter
    .route('/plant/:plant_id')
    .all((req, res, next) => {
      PlantService.getPlantById(
        req.app.get('db'),
        req.params.plant_id
      )
        .then(item => {
          if (!item) {
            return res.status(404).json({
              error: { message: `Plant entry not found` }
            })
          }
          res.item = item
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
          res.json(serializePlant(res.item))
    })

plantRouter
  .route('/fav_plant/:user_id')
    .get((req, res, next) => {
      PlantService.getFavoritePlants(
        req.app.get('db'),
        req.params.user_id
      ).then(plants=> {
          if (plants.length === 0) {
            return res.status(200).json([])
          }
          res.json(plants.map(serializeFavPlant))
      })
      .catch(next)
    })

plantRouter
  .route('/fav_plant/:user_id/:fav_id')
    .get((req, res, next) => {
      PlantService.getFavoritePlant(
        req.app.get('db'),
        req.params.fav_id
      ).then(plant=> {
          if (!plant) {
            return res.status(404).json({
              error: { message: `Sorry, favorite plant not found` }
            })
          }
          res.json(serializeFavPlant(plant))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
      const { user_id, plant_id } = req.body
      const newFav = { user_id, plant_id }
      for (const [key, value] of Object.entries(newFav)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
        }
      }
      if (!Number.isInteger(user_id) || !Number.isInteger(plant_id) ){
	  return res.status(400).json({
            error: { message: `Invalid field` }
          })
      }
      PlantService.insertFavoritePlant(
        req.app.get('db'),
        newFav
      )
       .then(fav => {
         res
           .status(201)
           .json(fav)
       })
       .catch(next)
    })
    .delete(jsonParser, (req, res, next) => {
      const { id } = req.body
      PlantService.deleteFavoritePlant(
        req.app.get('db'),
        req.params.fav_id
      )
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
    })

    .patch(jsonParser, (req, res, next) => {

      PlantService.getFavoritePlant(
        req.app.get('db'),
        req.params.fav_id
      ).then(plant=> {
          if (!plant) {
            return res.status(404).json({
              error: { message: `Sorry, favorite plant not found` }
            })
          }
          const { id, notes } = req.body
          const favPlantToUpdate = { id:id, notes: xss(notes) }

          const numberOfValues = Object.values(favPlantToUpdate).filter(Boolean).length
            if (numberOfValues === 0) {
              return res.status(400).json({
                error: {
                  message: `invalid field`
                }
              })
            }

          PlantService.updateFavoritePlant(
             req.app.get('db'),
             req.params.fav_id,
             favPlantToUpdate
          )
          .then(numRowsAffected => {
             res.status(204).end()
          })
          .catch(next)
      })
    })

module.exports = plantRouter
