function makePlantsArray(){
    return [
      {
        id: 1,
	name: 'Blueberries – Misty',
	search_category: 2,
	description: 'Misty is one of the most attractive, vigorous and high yielding Southern Highbush varieties. The bright blue-green foliage provides a perfect contrast to the pink and white spring flowers and sky blue summer fruit. Yields best when planted with other varieties. Chilling needs are very low at 300 hours, but do not hesitate to plant it all the way to Seattle. One of the most popular varieties in California because of fast growth, high yields, consistent quality.',
	image: 'plant1.png',
	plant_type: 'Perennial',
	sun: 'Full Sun',
	zones: 'Zones 5 to 10',
	soil: 'Acidic, well-drained'
      },
      {
        id: 2,
        name: 'Strawberry – Alpine Mignonette',
        search_category: 2,
        description: 'Exclusive French delicacy. This improved variety of easy to grow, compact perennial plants with dainty leaves produces sweet little pointed berries to savor all summer long.',
        image: 'plant2.png',
        plant_type: 'Perennial',
        sun: 'Full Sun/Partial Shade',
        zones: 'Frost Hardy to Zone 5',
        soil: 'Rich, well-drained'
      },
      {
        id: 3,
        name: 'Marigold – African',
        search_category: 1,
        description: 'No annual is more cheerful or easier to grow than the marigold. These flowers are the spendthrifts among annuals, bringing a wealth of gold, copper, and brass into our summer and autumn gardens. The flower popularity probably derives in part from its ability to bloom brightly all summer long.  Attracts bees and butterflies.',
        image: 'plant9.png',
        plant_type: 'Annual',
        sun: 'Full Sun',
        zones: 'Zones 3 to 10',
        soil: 'Moderately fertile, well-drained'
      },
      {
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
    ];
}

function makeFavoritesArray(){
    return[
	{
	  plant_id: 1,
	  user_id: 1,
	  notes: 'test notes for 1'
	},
        {
          plant_id: 4,
          user_id: 1,
          notes: 'tomatoes!!'
        },
        {
          plant_id: 1,
          user_id: 2,
          notes: 'test notes for user 2'
        },
        {
          plant_id: 4,
          user_id: 3,
          notes: 'test notes for user 3'
        },
    ];
}

function makeMaliciousNote() {
  const maliciousNote = {
	id: 1,
	notes: 'xss entry <script>alert("xss");</script>'
  }

  const expectedNote = {
    ...maliciousNote,
    user_id: 1,
    plant_id: 1,
    notes: 'xss entry &lt;script&gt;alert("xss");&lt;/script&gt;'
  }
  return {
    maliciousNote,
    expectedNote,
  }
}

module.exports = {
    makePlantsArray,
    makeFavoritesArray,
    makeMaliciousNote,
}

