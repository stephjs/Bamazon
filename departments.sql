USE Bamazon

CREATE TABLE Departments (
  DepartmentID mediumint(9) NOT NULL AUTO_INCREMENT,
  DepartmentName varchar(50) DEFAULT NULL,
  OverHeadCosts int(11) DEFAULT NULL,
  TotalSales int(11) DEFAULT 0,
  TotalProfit int(11) NOT NULL,
  PRIMARY KEY (DepartmentID)
);