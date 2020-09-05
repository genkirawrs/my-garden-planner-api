function makeUsersArray(){
    return [
      {
        id: 1,
	email: 'test1@mygardenplanner.com',
	username: 'test1_user',
	password: 'test1password',
	zipcode: '95132'
      },
      {
        id: 2,
        email: 'test2@mygardenplanner.com',
        username: 'test2_user',
        password: 'test2password',
        zipcode: '99999'
      },
      {
        id: 3,
        email: 'test3@mygardenplanner.com',
        username: 'test3_user',
        password: 'test3password',
        zipcode: '94042'
      },
      {
        id: 4,
        email: 'test4@mygardenplanner.com',
        username: 'test4_user',
        password: 'test4password',
        zipcode: '98034'
      }
    ];
}




module.exports = {
    makeUsersArray,
}

