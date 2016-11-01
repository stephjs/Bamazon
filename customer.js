var inquirer = require("inquirer");
var color = require("colors");
var mysql = require("mysql");
var prettyTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "vanilla.123",
    database: "Bamazon"
});

console.log("                              ".underline.blue);
console.log("");
console.log(" WELCOME TO BAMAZON CUSTOMER! ".blue);
console.log("                              ".underline.blue);

connection.connect(function(err) {
    if (err) throw err;
});
promptBuyer();

// ask if the buyer wants to purchase from Bamazon
function promptBuyer(){
	inquirer.prompt(
	    {
	        name: "buyerCheck",
	        type: "confirm",
	        message: "Would you like to buy an item from Bamazon?"    
    	}
    ).then(function(answer) {
        if (answer.buyerCheck == true) {
        	//console.log("blah");
        	showItems();
        	setTimeout(buyStuff, 1000);
        } else {
            exit();
        }
    });
}

// show items available for purchase
function showItems() {
	connection.query('SELECT * FROM Products', function(err, res) {
	    if (err) throw err;
	    console.log("");
	    console.log("All Products".blue.underline);
	    console.log("");
	    var products = [];
	    for (i=0; i<res.length; i++){
	    	products.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]);
	    }
	    var categories = ["Item ID", "Product", "Department", "Price ($)", "Quantity in Stock"];
	    console.table(categories, products);
	});
}

// handles buyer transaction
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
        connection.query('SELECT * FROM Products WHERE ItemID='+thatID, function(err, sqlOut) {
        	var chosen = sqlOut[0];
        
	    	if (numUnits > chosen.StockQuantity){
	    		console.log("Sorry, we only have "+chosen.StockQuantity+ " units of "+chosen.ProductName+"s available.");
	    		buyStuff();
	    	} else {
	    		if (numUnits == 1) {
	    			var statement = "You are purchasing "+numUnits+" "+chosen.ProductName+".";
	    			console.log(statement.blue);
	    		}
	    		else {
	    			var statement = "You are purchasing "+numUnits+" "+chosen.ProductName+"s.";
	    			console.log(statement.blue);
	    		}
	    		var cost = numUnits * parseInt(chosen.Price);

	    		inquirer.prompt(
			    {
			        name: "purchaseCheck",
			        type: "confirm",
			        message: "Are you sure you want to purchase "+numUnits+" "+chosen.ProductName+"s for $"+cost+"?"
			        
			    }).then(function(answer) {
			        if (answer.purchaseCheck == true) {
			        	if (numUnits == 1){
			        		var statement = "Great! Here is your "+numUnits+" "+chosen.ProductName+".";
			        		console.log(statement.blue);
			        	}else {
			        		var statement = "Great! Here are your "+numUnits+" "+chosen.ProductName+"s.";
			        		console.log(statement.blue);
			        	}

			        	var newUnits = parseInt(chosen.StockQuantity) - parseInt(numUnits);
			        	var newProductSales = parseInt(chosen.ProductSales) + parseInt(cost)
			        	connection.query('UPDATE Products SET StockQuantity='+newUnits+' WHERE ItemID='+thatID);
			        	connection.query('UPDATE Products SET ProductSales='+newProductSales+' WHERE ItemID='+thatID);
			        }
			        setTimeout(promptBuyer, 1000);
			    });
	    	}
        });
    });
}

// exit the application
function exit(){
	console.log("Nice doing business with you!".rainbow);
	process.exit();
}