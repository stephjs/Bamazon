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

//checking connection to mysql, hopefully no errors
connection.connect(function(err) {
    if (err) throw err;
})
whatNow();

//What action does the manager want to take?
function whatNow() {
	inquirer.prompt([
	{
		name: "dothis",
		type: "list",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
		message: "What do you want to do?"
	}
	]).then(function(answer){
		if (answer.dothis == "View Products for Sale"){
			showItems();
		}else if (answer.dothis == "View Low Inventory"){
			lowInv();
		}else if (answer.dothis == "Add to Inventory"){
			moreInv();
		}else if (answer.dothis == "Add New Product"){
			newProduct();
		}
	});
}

//shows entire table.
function showItems() {
	//selects entire table
	connection.query('SELECT * FROM Products', function(err, res) {
	    if (err) throw err;
	    console.log("______________________");
	    console.log(" ");
	    console.log("FULL CATALOG OF ITEMS")
	    console.log("______________________");
	    for (i=0; i<res.length; i++){
	    	console.log(res[i].ProductName);
	    	console.log("Item ID: "+res[i].ItemID);
	    	console.log("Department: "+res[i].DepartmentName);
	    	console.log("Price: $"+res[i].Price);
	    	console.log("# available: "+res[i].StockQuantity);
	    	console.log("_____________");

	    }
	})
	connection.end();
}

function lowInv() {
	connection.query('SELECT * FROM Products WHERE StockQuantity < 5', function(err, res) {
	    if (err) throw err;
	    if (res.length == 0){
	    	console.log("There are no low inventory items.");
	    }else {
		    console.log("________________");
		    console.log(" ");
		    console.log("LOW INVENTORY")
		    console.log("________________");
		    for (i=0; i<res.length; i++){
		    	console.log(res[i].ProductName);
		    	console.log("Item ID: "+res[i].ItemID);
		    	console.log("Department: "+res[i].DepartmentName);
		    	console.log("Price: $"+res[i].Price);
		    	console.log("# available: "+res[i].StockQuantity);
		    	console.log("_____________");
		    }
		}
	})
	connection.end();
}

function moreInv() {
	inquirer.prompt([
    {
        name: "selectID",
        type: "input",
        message: "What is the ID of the product you want to add to?",
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
        message: "How many units of the product do you want to add?",
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
        

	    		if (numUnits == 1) {
	    			console.log("You are adding "+numUnits+" "+chosen.ProductName+".");
	    		}
	    		else {
	    			console.log("You are adding "+numUnits+" "+chosen.ProductName+"s.");
	    		}
	    		

	    		inquirer.prompt(
			    {
			        name: "purchaseCheck",
			        type: "confirm",
			        message: "Are you sure you want to add "+numUnits+" "+chosen.ProductName+"s?"
			        
			    }).then(function(answer) {
			        if (answer.purchaseCheck == true) {
			        	var newUnits = parseInt(chosen.StockQuantity) + parseInt(numUnits);
			        	connection.query('UPDATE Products SET StockQuantity='+newUnits+' WHERE ItemID='+thatID);
			        	console.log("Great. Now there are "+newUnits+" "+chosen.ProductName+ "s available for purchase.");
			        } else {
			            console.log("Awwww maybe next time.");
			        }
			        connection.end();
			    });

	    	});
        });
}

function newProduct() {
	inquirer.prompt([
	{
		name: "product",
		type: "input",
		message: "What product do you want to add?"

	},
	{
		name: "dep",
		type: "list",
		choices: ["camping", "beauty", "electronics"],
		message: "What department is it in?"
	},
	{
		name: "cost",
		type: "input",
		message: "How much ($) does it cost?",
		validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
	},
	{
		name: "quant",
		type: "input",
		message: "How many units are available?",
		validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
	}
	]).then(function(answer) {

	var prodNew = answer.product;
	var depNew = answer.dep;
	var priceNew = answer.cost;
	var quantNew = answer.quant;

	var sql = "INSERT INTO Products (name, email, n) VALUES ?";
	connection.query('INSERT INTO Products SET ?', {
		ProductName: prodNew,
		DepartmentName: depNew,
		Price: priceNew,
		StockQuantity: quantNew
	}, function(err, res) { 
		console.log("Got it!");
	});
	showItems();
	});
}