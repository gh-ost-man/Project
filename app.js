// GET
// POST
// PUT
// DELETE

var express = require('express');
var bodyParser = require("body-parser");
var fs = require("fs");

var app = express();
var jsonParser = bodyParser.json();

//__dirname папка нашого проекту
app.use(express.static(__dirname + "/public"))

app.get("/api/users", function (request, response) {
    var content = fs.readFileSync("users.json", "utf-8");
    // var users = jsonParser(content);
    response.send(content);
});

app.get("/api/users/:id", function (request, response) {
    var id = request.params.id;
   
    var users = fs.readFileSync("users.json", "utf-8");
    users = JSON.parse(users);

    var user = users.find(i => i.id == id);

    if (user) {
        response.send(JSON.stringify(user));
    } else {
        response.sendStatus(404);
    }

});

app.post("/api/users", jsonParser, function (request, response) {
    if (!request.body) {
        response.sendStatus(400);
    }
    var name = request.body.name;
    var family = request.body.family;
    var users = fs.readFileSync("users.json", "utf-8");
    users = JSON.parse(users);
    var id = Math.max.apply(Math, users.map(function (item) {
        return item.id
    }));
    var user_new = {
        id: id + 1,
        name: name,
        family: family
    }
    users.push(user_new);
    users = JSON.stringify(users);
    fs.writeFileSync("users.json", users);
    response.send(JSON.stringify(user_new));

});

app.put("/api/users", jsonParser, function (request, response) {
    if (!request.body)  response.sendStatus(400);
  
    var id = request.body.id;
    var name = request.body.name;
    var family = request.body.family;

    console.log(`Id: ${id}\nname: ${name}`);

    var users = fs.readFileSync("users.json", "utf-8");
    users = JSON.parse(users);

    var user = users.find(i => i.id == id);

    if (user) {
        user.name = name;
        user.family = family;
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        
        response.send(JSON.stringify(user));
    } else {
        response.sendStatus(404);
    }
});

app.delete("/api/users/:id", function (request, response) {
    var id = request.params.id;
   
    var users = fs.readFileSync("users.json", "utf-8");
    users = JSON.parse(users);

    let index = -1;
    for(let i = 0;i< users.length;i++){
        if(users[i].id == id ){
            index = i;
        } 
    }

    if(index > -1){
        let user = users.splice(index, 1)[0];
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);

        response.send(JSON.stringify(user));
    }
    else{
        response.sendStatus(404);
    }
});

app.listen(3000, function () {
    console.log("Server started\nPort:3000");
});
