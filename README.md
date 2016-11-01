# Bamazon
Bamazon is a Node.js and SQL command line app with an Amazon-like storefront and separate customer, manager and executive facing applications. The app uses a database of products and takes in orders from customers, which depletes stock from the store's inventory. Managers and executives can add more products to different departments and track profit.
## Dependencies

Clone this repo to your desktop and run `npm install` to install its 4 dependencies.

- [mySQL](https://www.npmjs.com/package/mysql): A node.js driver for mysql

- [Colors](https://www.npmjs.com/package/colors): Used to generate colored text in the console 

- [Inquirer](https://www.npmjs.com/package/inquirer): Used to prompt users to guess a letter in the word

- [Console.table](https://www.npmjs.com/package/console.table): A method that prints an array of objects as a table in console

## Set Up
Once you are in the Bamazon repository, run the following code in the command line to create the Bamazon database and the Products and Departments tables.

- `mysql -u root -p`

- `source products.sql`

- `source departments.sql`

-  `exit`

Then use your text editor of choice to update each file (customer.js, manager.js, and exec.js) with your mysql password.

- -  ![screen shot 2016-10-31 at 7 27 14 pm](https://cloud.githubusercontent.com/assets/18673328/19877960/0a0847f0-9fa1-11e6-989f-77b9207d8a09.png)


# Customer

- Run `node customer.js` to start the customer facing Bamazon app

- Customers are shown the Products table and can purchase products by ID. The customer can buy up to the quantity of product in stock.

- After a purchase the Products database is updated to reflect new stock quantities.

- - ![screen shot 2016-10-31 at 7 42 59 pm](https://cloud.githubusercontent.com/assets/18673328/19878115/4cbd71dc-9fa2-11e6-8897-1513a173ea2e.png)

# Manager

Run `node manager.js` to start the manager facing Bamazon app. Managers can do 4 different things:

1. **View Products for Sale**

    - See the same full products table that customers see

2. **View Low Inventory (less than 50 products in Stock)** 

    - See a table that only includes products that have less than 50 in stock

3. **Add to Inventory** 

    - Increase the stock of current products by ID

4. **Add a New Product**

    - Create a new product with a specified price and stock quantity in an existing department and add it to the Products table

# Executive

Run `node exec.js` to start the executive facing Bamazon app. Executives can do 2 different things:

1. **View Product Sales by Department**

    - The Departments table combines product sales by department for total department sales.

    - Every department has a specified overhead cost.

    - Department profits are calculated as (SALES - OVERHEAD COST)

2. **Create New Department**

    - Name the new department and specify the overhead cost. Total sales starts at $0 and total profit will be negative.

    - Now managers can create new products in this department and then customers will be able to buy the products.
