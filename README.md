# Summary
  
Title: My Garden Planner

Description: The backend for a simple gardening app that allows a gardener to plan, research, and organize their garden inspirations and goals.

## Purpose

To retrieve grow zone information based on a user account's zip code, display monthly calendars with ability to add/edit/delete notes, browse through a gallery of plants and add any inspiration to your favorite list and make personalize notes once favorited.


## Built With

* Express
* PostgreSQL

## Active Features/Endpoints
Endpoints currently used for this version of the app:

/account/:user_id
* Reads from the user table to pull zipcode information that's used to retreive grow zone information based on US zip code
* Updates user's zipcode

/account/zone/:zipcode
* Reads from the 

/calendar/month/:user_id/:start/:end
* Reads from the calendar notes table to display links to either view/edit or add new notes

/calendar/:user_id/:note_id
* Reads from the calendar notes table to retrieve a specific note
* Deletes specified note

/calendar/add/:user_id/:day
* Adds a brand new note to the calendar note table

/calendar/edit/:user_id/:day
* Updates notes for a specified day

/plants
* Reads all plants from the plants table

/plants/:category
* Reads only plants of a specific category from plant table (1: Flowers, 2: Fruits/Trees, 3: Herbs, 4: Vegetables)

/plants/plant/:id
* Reads specific plant from table

/plants/fav_plant/:user_id
* Reads all favorited plants from user_favplants table
* Posts any user created plant notes to user_favplants
* Updates notes by plant id
* Deletes favorited plant from table



## Demo

- [Live Demo](https://my-garden-planner.vercel.app/)

