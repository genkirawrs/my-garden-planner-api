const express = require('express')
const path = require('path')
const xss = require('xss')
const PlantService = require('./plants-services')

const plantRouter = express.Router()
const jsonParser = express.json()

plantRouter
    .route('/')
    .get((req, res, next) => {
      PlantService.getAllPlants(
        req.app.get('db')
      )
      .then(items=> {
          res.json(items)
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
          res.json(items)
      })
      .catch(next)
    })

plantRouter
    .route('/:plant_id')
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
      res.json({
            id: res.item.id,
            name: xss(res.item.name),
            description: xss(res.item.description),
	    image: xss(res.item.image),
	    plant_type: xss(res.item.plant_type),
	    sun: xss(res.item.sun),
	    zones: xss(res.item.zones),
	    soil: xss(res.item.soil),
	    search_category: res.item.search_category,
      })
    })


plantRouter
  .route('/fav_plant/:user_id/:plant_id')
    .get((req, res, next) => {
      PlantService.(
        req.app.get('db'),
	re
        req.params.plant_id
      ).then(events=> {
          res.json(events)
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
        req.params.id
      )
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { id, notes } = req.body
      const favPlantToUpdate = { id, notes }

      const numberOfValues = Object.values(eventToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
          return res.status(400).json({
            error: {
              message: `invalid field`
            }
          })
        }

      PlantService.updateFavoritePlant(
         req.app.get('db'),
         req.params.id,
         favPlantToUpdate
      )
       .then(numRowsAffected => {
         res.status(204).end()
       })
       .catch(next)
    })
module.exports = plantRouter
