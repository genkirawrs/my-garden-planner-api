const path = require('path')
const express = require('express')
const xss = require('xss')
const UserService = require('./user-services')

const userRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
        id: user.id,
        zipcode: xss(user.zipcode),
})

userRouter
    .route('/')
    .get((req, res, next) => {
      UserService.getUserById(req.app.get('db'))
      .then(events=> {
          res.json(user.map(serializeUser))
      })
      .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { zipcode } = req.body
      const userToUpdate = { zipcode }

      const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
          return res.status(400).json({
            error: {
              message: `invalid field`
            }
          })
        }

      UserService.updateUser(
         req.app.get('db'),
         req.params.id,
         userToUpdate
      )
       .then(numRowsAffected => {
         res.status(204).end()
       })
       .catch(next)
    })

userRouter
  .route('/zone/:zipcode')
    .get((req, res, next) => {
      UserService.getUserZone(
        req.app.get('db'),
        req.params.zipcode
      ).then(events=> {
          res.json(events)
      })
      .catch(next)
    })

module.exports = userRouter
