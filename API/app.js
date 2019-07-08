//node Desktop/a/app.js
var express = require('express');//The express module
var app = express();//The app
const bodyParser = require('body-parser');
var DButilsAzure = require('./DButils');//The db utils
var dataBaseHandler = require('./dataBaseHandler')//The db handler
var http = require('http')//The http module
const validation= require('./validation')//The validation module
const jwt = require("jsonwebtoken");//The jwt module
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// For giving authorization to requests from browsers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        // return res.status(200).json({});
    }
    next();
});

secret = "yonatanGuy";

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Start listening to port ' + port);
});

/*
    A generic sql script with the following structure

    SELECT 'column'
    FROM 'table'

*/
app.get('/select/:table/:column', function(req, res){
    var flag =false
    var table = JSON.stringify(req.params.table)
    table = table.substring(1,table.length-1)

    //If the table is city
    if(table === "city")
    {
        flag = validation.isGetFromCities(req,res)
    }
    else
    {
        //If the table is category
        if(table === "category")
        {
            flag = validation.isGetFromCategories(req,res)
        }
        else
        {
            //If the table is countries
            if(table === "countries")
            {
                flag = validation.isGetFromCountries(req,res)
            }
            else(table === "pointOfInterest")
            {
                flag=true;
            }
        }

    }

    if(flag)
        dataBaseHandler.selectWithoutCondition(req,res)
    else
        res.status(400).send("something went wrong with the request")
})

/*
    A generic sql script with the following structure

    SELECT 'column'
    FROM 'table'
    WHERE 'query'
*/
app.get('/select/:table/:column/:query', function(req, res){

    var flag = false
    var table = JSON.stringify(req.params.table)
    table = table.substring(1,table.length-1)
    var stop = false
    var column = JSON.stringify(req.params.column)
    column = column.substring(1,column.length-1)
    //If the table is pointOfInterest
    if(table==="pointOfInterest")
    {

        flag = validation.isPointOfInterestByCategory(req,res) || validation.getRankByPOI(req,res) || validation.getPOIByName(req,res)
    }
    else
    {
        //If the table is reviews
        if(table==="reviews")
        {
            flag = validation.getReviewByPOI(req,res)

        }
        else
        {
            //If the table is cityImg
            if(table ==="cityImg")
            {
                flag = validation.getSelectedPhotos(req,res)
            }
            else
            {
                //If the table is question_and_answer
                if(table === "question_and_answer")
                    flag = validation.getQuestionAndAnswersByUsername(req,res)
                else
                {
                    //If the table is users
                    if(table === "users")
                    {
                        if(column ==="password")
                        {
                            flag = validation.getPasswordByQuestionAndAnswer(req,res)
                            if(flag)
                            {
                                dataBaseHandler.getPasswordFromQAUsername(req,res)
                                stop= true
                            }
                        }

                    }
                }
            }
        }
    }
    if(!stop)
    {
        if(flag)
            dataBaseHandler.selectWithCondition(req,res)
        else
            res.status(400).send("something went wrong with the request")
    }
})

/*
    A generic sql script with the following structure

    INSERT INTO 'table' (c1,c2,...)
    VALUES (v1,v2,...)
*/
app.post('/insert', function(req, res){
    req.params.table = req.body.table;
    req.params.columns = req.body.columns;
    req.params.values = req.body.values;

    var flag = false;
    var table = JSON.stringify(req.params.table)
    table = table.substring(1,table.length-1)

    //If the table is pointOfInterest
    if(table==="reviews")
    {
        flag = validation.isAddReview(req,res)
    }
    else
    {
        //If the table is pointOfInterest
        if(table === "pointOfInterest")
        {
            flag = validation.isAddPOI(req,res)
        }
        else
        {
            //If the table is question_and_answer
            if(table=== "question_and_answer")
            {
                flag = validation.isAddQuestionAndAnswer(req,res)
            }
            else
            {
                //If the table is category
                if(table=== "category")
                {

                    flag = validation.isAddCategory(req,res)

                }
            }
        }
    }
    if (!flag)
        flag = validation.validateFinal(req)
    if(flag)
        dataBaseHandler.postWithoutCondition(req,res)
    else
        res.status(400).send("something went wrong with the request")
})

/*
    A generic sql script with the following structure

    DELETE FROM 'table'
    WHERE 'condition'

*/
app.delete('/delete/:table/:condition', function(req, res){

    if(validation.isRemoveFromFavoriets(req,res))
    {
        dataBaseHandler.deleteFromdb(req,res)
    }
    else
        res.status(400).send("something went wrong with the request")
})

/*
    A generic sql script with the following structure

    UPDATE 'table'
    SET c1=v1, c2=v2, ...
    WHERE 'condition'
*/
app.put('/update/:table/:values/:condition', function(req, res){
    var flag = false
    var table = JSON.stringify(req.params.table)
    table = table.substring(1,table.length-1)

    //If the table is pointOfInterest
    if(table==="favorites")
    {
        flag = validation.isAddFavorites(req,res)
        console.log(table)
    }
    else
    {
        if(table === "pointOfInterest")
            dataBaseHandler.updateWithCondition(req,res)
    }
    if(flag)
        dataBaseHandler.updateWithCondition(req,res)
    else
        res.status(400).send("something went wrong with the request")

})

//This function will handle the registration
app.post('/register', function(req, res){
    req.params.table = req.body.table;
    req.params.columns = req.body.columns;
    req.params.values = req.body.values;

    //need to check validation
    var flag = false;
    var table = JSON.stringify(req.params.table)
    table  = table.substring(1,table.length-1)
    //If the table is pointOfInterest

    if(table==="users")
    {
        console.log("validating...");
        flag = validation.isGoodregister(req,res)
    }
    else{
        res.status(400).send("something went wrong with the request 1")
    }
    if(!flag){
        res.status(400).send("something went wrong with the request 2")
    }

    dataBaseHandler.postWithoutCondition(req,res)
});

//Login
app.post("/login", (req, res) => {
    req.params.UserName = req.body.UserName;
    req.params.passward = req.body.passward;

    payload = { id: req.params.UserName, name: req.params.UserName, admin: true };
    options = { expiresIn: "1d" };
    const token = jwt.sign(payload, secret, options);
    res.send(token);
});

app.post("/private", (req, res) => {
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        if (req.decoded.admin)
            res.status(200).send({ result: "Hello admin." });
        else
            res.status(200).send({ result: "Hello user." });
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
});

//This fucntion will invoke the appi request from the code (should be used by the client)
function httpInvoke(path,kind)
{
    var options = {

        port: port,
        path: path,
        method: kind
    };
    var ans=''

    http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            ans = chunk
        });
    }).end();

    return ans

}
