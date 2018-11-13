var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
})

//Connect
connection.connect(function(err){
    console.log("Connection successful.")
    console.log("Connect as id: " + connection.threadId);
    start();
   
})

//Start screen
var start = function(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw(err);
        for(var i = 0; i < res.length; i++)
        console.log("-------"+"\nProduct: "+res[i].product_name+"\nID: "+res[i].item_id+"\nPrice: "+res[i].price);
        
        idOfProduct();
    })
}


//Ask customer questions 
var idOfProduct = function(){
    inquirer.prompt([{
    
        name: "id",
        type: "input",
        message: "What is the ID of the product you would like to buy?"
    },
    {
        name: "amount",
            type: "input",
            message: "How many units of the product would you like to buy?"
    }

    ]).then(function(answer){
    var query = "SELECT product_name FROM products WHERE ?";
    connection.query(query, {item_id:answer.id}, function(err, res){
        console.log("--------------");
        console.log("Product: " + res[0].product_name);
        //amountOfProduct();
        var query = "SELECT stock_quantity FROM products WHERE ?";
        connection.query(query, {item_id:answer.id}, function(err, res){
            console.log("In Stock: " + res[0].stock_quantity);
            if(answer.amount > res[0].stock_quantity){
                console.log("--------------");
                console.log("Not in stock. Order has been canceled.")
                console.log("--------------");
                idOfProduct();
            }
            else{
                console.log("--------------");
                console.log("In stock. Order has been placed.")
                console.log("--------------");
                idOfProduct();
            }
        })
        
        })
       
})
}

