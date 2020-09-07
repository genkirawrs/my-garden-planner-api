const express = require('express')
const path = require('path')
const xss = require('xss')
const CalendarService = require('./calendar-services')

const calendarRouter = express.Router()
const jsonParser = express.json()

const serializeCalNote = note => ({
        id: note.id,
	user_id: note.user_id,
	day: note.day,
	notes: xss(note.notes)
})

calendarRouter
    .route('/month/:user_id/:start/:end')
    .get((req, res, next) => {
      CalendarService.getAllMonthNotes(
        req.app.get('db'),
	req.params.start,
	req.params.end,
	req.params.user_id
      )
      .then(items=> {
          if(items.length === 0){
            return res.status(200).json([])
          }
          res.json(items.map(serializeCalNote))
      })
      .catch(next)
    })

calendarRouter
    .route('/:user_id/:note_id')
    .all((req, res, next) => {
      CalendarService.getNotesById(
        req.app.get('db'),
        req.params.note_id
      )
        .then(item => {
          if (!item) {
            return res.status(404).json({
              error: { message: `No note found for this day` }
            })
          }
          res.item = item
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
	res.json(serializeCalNote(res.item))
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

calendarRouter
    .route('/note/:user_id/:day')
    .get((req, res, next) => {
      CalendarService.getNoteByDay(
        req.app.get('db'),
        req.params.user_id,
        req.params.day
      )
      .then(item=> {
          if( !item ){
            return res.status(200).json()
          }
          res.json(serializeCalNote(item))
      })
      .catch(next)
    })



calendarRouter
    .route('/add/:user_id/:day')
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
           .location(path.posix.join(req.originalUrl, `/calendar/${note.user_id}/${note.id}`))
           .json(note)
       })
       .catch(next)
    })

calendarRouter
    .route('/edit/:user_id/:note_id')
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
