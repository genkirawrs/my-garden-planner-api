const express = require('express')
const path = require('path')
const xss = require('xss')
const CalendarService = require('./calendar-services')

const calendarRouter = express.Router()
const jsonParser = express.json()

calendarRouter
    .route('/')
    .get((req, res, next) => {
	const start = 20200801;
	const end = 20200831;
      CalendarService.getAllMonthNotes(
        req.app.get('db'),
	start,
	end
      )
      .then(items=> {
          res.json(items)
      })
      .catch(next)
    })

calendarRouter
    .route('/:note_id')
    .all((req, res, next) => {
      CalendarService.getNotesById(
        req.app.get('db'),
        req.params.note_id
      )
        .then(item => {
          if (!item) {
            return res.status(404).json({
              error: { message: `Notes not found` }
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
            notes: xss(res.item.notes),
	    day: res.item.day,
	    user_id: res.item.user_id,
      })
    })
    .post(jsonParser, (req, res, next) => {
      const { user_id, day, notes} = req.body
      const newNote = { user_id, day, notes }
      for (const [key, value] of Object.entries(newNote)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
        }
      }
      CalendarService.insertNotes(
        req.app.get('db'),
        newNote
      )
       .then(note => {
         res
           .status(201)
           .location(path.posix.join(req.originalUrl, `/calendar/${item.id}`))
           .json(item)
       })
       .catch(next)
    })
    .delete((req, res, next) => {
      CalendarService.deleteNotes(
        req.app.get('db'),
        req.params.note_id
      )
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { user_id, day, notes } = req.body
      const noteToUpdate = { user_id, day, notes }

      const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
          return res.status(400).json({
            error: {
              message: `invalid field`
            }
          })
        }

      CalendarService.updateNotes(
         req.app.get('db'),
         req.params.note_id,
         noteToUpdate
      )
       .then(numRowsAffected => {
         res.status(204).end()
       })
       .catch(next)
    })

module.exports = calendarRouter
