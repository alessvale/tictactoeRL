
//A simple Express server

let express = require('express');
let bodyParser = require('body-parser');

let fs = require('fs');

let app = express();
let server = app.listen(3000);

app.use(express.static('public'));

//Provide the value-state table;
app.get('/values', function(request, response) {
   let data = fs.readFileSync('values.json');
   let value_table = JSON.parse(data);
   response.send(value_table);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Save the value-state table;
app.post('/save', function(request, response){
   let data = JSON.stringify(request.body);
   fs.writeFileSync('values.json', data);
   console.log("Saving!");
});
