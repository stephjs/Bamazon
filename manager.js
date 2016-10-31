var inquirer = require("inquirer");
var color = require("colors");
var prettyTables = require("console.table");
var mysql = require("mysql");
var categories = ["Item ID", "Product", "Department", "Price ($)", "Quantity in Stock"];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "vanilla.123",
    database: "Bamazon"
});
console.log("                            ".underline.red);
console.log("");
console.log(" WELCOME TO BAMAZON MANAGER ".red);
console.log("                            ".underline.red);

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
		choices: ["View Products for Sale", "View Low Inventory (<50 In Stock)", "Add to Inventory", "Add New Product", "Exit Bamazon"],
		message: "What do you want to do?"
	}
	]).then(function(answer){
		if (answer.dothis == "View Products for Sale"){
			showItems();
		}else if (answer.dothis == "View Low Inventory (<50 In Stock)"){
			lowInv();
		}else if (answer.dothis == "Add to Inventory"){
			addToInv();
		}else if (answer.dothis == "Add New Product"){
			newProduct();
		}else if (answer.dothis == "Exit Bamazon"){
			console.log("Nice doing business with you!".rainbow);
			process.exit();
		}
	});
}

function printTable(res){
    
    var shortTitle = [];
    for (i=0; i<res.length; i++){
    	shortTitle.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]);
    }
    console.table(categories, shortTitle);
}

function showItems() {
	connection.query('SELECT * FROM Products', function(err, res) {
	    if (err) throw err;
	    console.log("");
	    console.log("All Products".red.underline);
	    console.log("");
	    printTable(res);
	})
	setTimeout(whatNow, 3000);
}

function lowInv() {
	connection.query('SELECT * FROM Products WHERE StockQuantity < 50', function(err, res) {
	    if (err) throw err;
	    if (res.length == 0){
	    	console.log("There are no low inventory items.");
	    }else {
	    	console.log("");
	    	console.log("Low Inventory".red.underline);
	    	console.log("");
		    printTable(res);
		}
	});
	setTimeout(whatNow, 3000);
}

function addToInv() {
	inquirer.prompt(
	    {
	        name: "seeList",
	        type: "confirm",
	        message: "Do you already know the ID of the product?"
	        
	    }).then(function(answer) {
	        if (answer.seeList == true) {
	        	console.log("");
			    console.log("Add to Inventory".red.underline);
			    console.log("");
	        	actualAdd();
	        } else {
	            showItems();
	        }
	    });
}

function actualAdd(){
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
	    connection.query('SELECT * FROM Products WHERE ItemID='+thatID, function(err, sqlOut) {
	    	//coming out of the sql table...
	    	var chosen = sqlOut[0];

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
			        setTimeout(whatNow, 3000);
			    });
	    	});
	    });
}
var deplist = [];
connection.query("SELECT DepartmentName FROM Departments", function(err, result){
	if (err) throw err;
	for (i=0; i<result.length; i++){
		deplist.push(result[i].DepartmentName);
	}
});

function newProduct() {
	console.log("");
    console.log("Add a New Product".red.underline);
    console.log("");

	inquirer.prompt([
	{
		name: "product",
		type: "input",
		message: "What product do you want to add?"

	},
	{
		name: "dep",
		type: "list",
		choices: deplist,
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