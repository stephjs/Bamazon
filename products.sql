CREATE database Bamazon;

USE Bamazon

CREATE TABLE Products (
  ProductName varchar(50) DEFAULT NULL,
  DepartmentName varchar(50) DEFAULT NULL,
  Price int(10) NOT NULL,
  StockQuantity int(11) DEFAULT NULL,
  ItemID mediumint(9) NOT NULL AUTO_INCREMENT,
  ProductSales int(11) DEFAULT 0,
  PRIMARY KEY (ItemID)
);