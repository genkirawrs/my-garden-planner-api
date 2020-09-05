function makeCalendarArray(){
    return[
	{
	  user_id: 1,
	  day: 202091,
	  notes: 'cal notes for 9/1/2020'
	},
        {
          user_id: 1,
          day: 202095,
          notes: 'cal notes for 9/5/2020'
        },
        {
          user_id: 1,
          day: 20201015,
          notes: 'cal notes for 10/15/2020'
        },
        {
          user_id: 2,
          day: 202091,
          notes: 'cal notes for 9/1/2020'
        },
    ];
}

function makeMaliciousCalendar() {
  const maliciousNote = {
	user_id: 1,
	day: 202091,
	notes: 'xss entry <script>alert("xss");</script>'
  }

  const expectedNote = {
    ...maliciousNote,
    user_id: 1,
    day: 202091,    
    notes: 'xss entry &lt;script&gt;alert("xss");&lt;/script&gt;'
  }
  return {
    maliciousNote,
    expectedNote,
  }
}

module.exports = {
    makeCalendarArray,
    makeMaliciousCalendar,
}

