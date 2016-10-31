var inquirer = require("inquirer");
var color = require("colors");
var prettyTables = require("console.table");

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "vanilla.123",
    database: "Bamazon"
});

console.log("                              ".underline.green);
console.log("");
console.log(" WELCOME TO BAMAZON EXECUTIVE! ".green);
console.log("                              ".underline.green);

//checking connection to mysql, hopefully no errors
connection.connect(function(err) {
    if (err) throw err;
});

execCommands();

function execCommands() {
	inquirer.prompt([
	{
		name: "dothis",
		type: "list",
		choices: ["View Product Sales by Department", "Create New Department", "Exit Bamazon"],
		message: "What do you want to do?"
	}
	]).then(function(answer){
		if (answer.dothis == "View Product Sales by Department"){
			updateSales();
		}else if (answer.dothis == "Create New Department"){
			createDep();
		}else if (answer.dothis == "Exit Bamazon"){
			console.log("Nice doing business with you!".rainbow);
			process.exit();
		}
	});
}

function updateSales(){
	//the department sales are a sum of individual product sales from that department
	//using Products table. this combines by Department, adds individual ProductSales to get TotalSales for each department
	connection.query('SELECT DepartmentName, SUM(ProductSales) AS TotalSales FROM Products GROUP BY DepartmentName', function(err, res) {
		//starting with 3 departments: beauty, electronics, camping
		for (i=0; i<res.length; i++){
			var totSales = res[i].TotalSales;
			var dep = res[i].DepartmentName;
	

			//updates Departments table TotalSales column with what was just found by adding Products table data
			//does this by department. this is a field in both tables 
			connection.query('UPDATE Departments SET TotalSales = ? Where DepartmentName = ?',
  				[totSales, dep], function (err, result) {
			});
		}
	deptSales();
	});
}
// view sales by department
function deptSales(){
	console.log("");
	console.log(" Product Sales by Department ".green.underline);
	console.log("");

	connection.query("SELECT * FROM Departments", function(err, result){
		if (err) throw err;
		var categories = ["ID", "Department", "Overhead Costs", "Total Sales", "Total Profit"];
		var allDepartments = [];
		for (i=0; i<result.length; i++){
			var id = result[i].DepartmentID;
			var dep = result[i].DepartmentName;
			var ovhd = result[i].OverHeadCosts;
			var sales = result[i].TotalSales;

			//******* profit generated here and updated in Departments database
			var profit = sales - ovhd;
			connection.query('UPDATE Departments SET TotalProfit='+profit+' WHERE DepartmentID='+id);
	    	allDepartments.push([id, dep, ovhd, sales, profit]);
	    }
		console.table(categories, allDepartments);
		setTimeout(execCommands, 1000);
	});
}

function createDep(){
	console.log("");
	console.log(" Create a New Department ".green.underline);
	console.log("");
	inquirer.prompt([
		{
			name: "newDept",
			type: "input",
			message: "What do you want to call the new department?"
		},
		{
			name: "newOvhd",
			type: "input",
			message: "What is the overhead cost of the new department?",
			validate: function(value) {
	            if (isNaN(value) == false) {
	                return true;
	            } else {
	                return false;
	            }
	        }
		}
	]).then(function(answer) {

	var department = answer.newDept;
	var overhead = answer.newOvhd;

	connection.query("INSERT INTO Departments SET ?",
		{
			DepartmentName: department,
			OverHeadCosts: overhead,
			TotalSales: 0,
			TotalProfit: 0
		}
	);

	setTimeout(deptSales, 1000);
	});
}