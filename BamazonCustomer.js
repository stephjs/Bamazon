//npm install inquirer
var inquirer = require("inquirer");

//my sql connection stuff
//npm install mysql
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "vanilla.123", //Your password
    database: "Bamazon"
})

console.log("WELCOME TO BAMAZON!");

//checking connection to mysql, hopefully no errors
connection.connect(function(err) {
    if (err) throw err;
})


//initial check to see if they want to buy
inquirer.prompt(
    {
        name: "buyerCheck",
        type: "confirm",
        message: "Would you like to buy an item from Bamazon?"
        
    }).then(function(answer) {
        if (answer.buyerCheck == true) {

        	inquirer.prompt(
    			{
			        name: "catalogCheck",
			        type: "confirm",
			        message: "Would you like to see items in the catalog?"
			        
			    }).then(function(answer) {
			        showItems();
			    });
        } else {
            console.log("Awwww maybe next time.");
        }
    });

//connection queries...
function showItems() {
	//selects entire table
	connection.query('SELECT * FROM Products', function(err, res) {
	    if (err) throw err;
	    console.log("________________");
	    console.log(" ");
	    console.log("CATALOG OF ITEMS")
	    console.log("________________");
	    for (i=0; i<res.length; i++){
	    	console.log(res[i].ProductName);
	    	console.log("Item ID: "+res[i].ItemID);
	    	console.log("Department: "+res[i].DepartmentName);
	    	console.log("Price: $"+res[i].Price);
	    	console.log("# available: "+res[i].StockQuantity);
	    	console.log("_____________");
	    }
	    buyStuff();
	    //console.log(res);
	})
}

//holds prompts for item ID and quantity    
function buyStuff(){
    inquirer.prompt([
    {
        name: "selectID",
        type: "input",
        message: "What is the ID of the product you want to buy?",
        //validates that it's a number
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "units",
        type: "input",
        message: "How many units of the product do you want to buy?",
        //validates that it's a number
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }
    ]).then(function(answer){
    	var numUnits = answer.units;
    	var thatID = answer.selectID;
        console.log("You want "+numUnits+ "x");
        console.log("_____________");
        connection.query('SELECT * FROM Products WHERE ItemID='+thatID, function(err, sqlOut) {
        	//coming out of the sql table...
        	var chosen = sqlOut[0];
        	console.log(chosen.ProductName);
	    	console.log("Item ID: "+chosen.ItemID);
	    	console.log("Department: "+chosen.DepartmentName);
	    	console.log("Price: $"+chosen.Price);
	    	console.log("# available: "+chosen.StockQuantity);
	    	console.log("_____________");
        
	    	if (numUnits > chosen.StockQuantity){
	    		console.log("Sorry, we only have "+chosen.StockQuantity+ " units of "+chosen.ProductName+"s available.");
	    		buyStuff();
	    	} else {
	    		if (numUnits == 1) {
	    			console.log("You are purchasing "+numUnits+" "+chosen.ProductName+".");
	    		}
	    		else {
	    			console.log("You are purchasing "+numUnits+" "+chosen.ProductName+"s.");
	    		}
	    		
	    		var cost = numUnits * chosen.Price;
	    		console.log("Total cost: $"+cost);

	    		inquirer.prompt(
			    {
			        name: "purchaseCheck",
			        type: "confirm",
			        message: "Are you sure you want to purchase "+numUnits+" "+chosen.ProductName+"s for $"+cost+"?"
			        
			    }).then(function(answer) {
			        if (answer.purchaseCheck == true) {
			        	if (numUnits == 1){
			        		console.log("Great! Here is your numUnits"+numUnits+" "+chosen.ProductName+".")
			        	}else {
			        		console.log("Great! Here are your "+numUnits+" "+chosen.ProductName+"s.");
			        	}

			        	var newUnits = parseInt(chosen.StockQuantity) - parseInt(numUnits);
			        	connection.query('UPDATE Products SET StockQuantity='+newUnits+' WHERE ItemID='+thatID);
			        } else {
			            console.log("Awwww maybe next time.");
			        }
			        connection.end();
			    });

	    	}
        });
    });
}