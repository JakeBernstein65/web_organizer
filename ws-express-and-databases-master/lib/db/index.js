var pg = require('pg');

var cstr = 'postgres://student:student@localhost/users';

/**
 * This function adds a user to the database.
 */
function add(user, cb) {

if(user.uid === undefined || user.fname === undefined || user.lname === undefined || user.password === undefined || user.age === undefined)
{
console.log("A section in the form was undefined and missing from the database");
  cb('Not implemented yet');
}
else{

}

}

function createNewRow(uid, fname, lname, password, age){
var str = '<tr>';
str+= '<td>' + uid + '</td><td>' + fname +'</td> <td>' + lname +'</td>' + '<td>' + password + '</td>' + '<td>' + age +'</td>';
str+= '</tr>';
return str;
}


/**
 * This function returns a list of all users in the database.
 */
function list(cb) {
  
  pg.connect(cstr, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT * FROM users', function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    
    var finalTable = '<table style=\'width:50%\'>';
    
    finalTable += createNewRow("Uid", "First Name", "Last name", "Password", "age");
    
    	for(var i = 0; i < result.rowCount; i++){
    	var row = result.rows[i];
    	finalTable += createNewRow(row.uid, row.fname, row.lname, row.password, row.age);
   		}
   		finalTable += '</table>';
   		console.log(finalTable);
    	cb(finalTable);
    
    client.end();
  });
})
  
}

module.exports = {
  add     : add,
  list    : list
};
