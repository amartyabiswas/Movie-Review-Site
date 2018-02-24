var mysql=require('mysql');

var config={
  host: 'localhost',
  user:'root',
  password:'',
  database:'task'
};

var connection = mysql.createConnection(config);

function Connect() {
    connection.connect();
    console.log('Connection Successful');
}

/*function display(callback) {
    connection.query(`Select * FROM shoppinglist`, function (err, data) {
        callback(data);
    });
}*/

module.exports={
    'connect': Connect
    /*'display':display*/
};