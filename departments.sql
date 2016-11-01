USE Bamazon;

CREATE TABLE Departments (
  DepartmentID mediumint(9) NOT NULL AUTO_INCREMENT,
  DepartmentName varchar(50) DEFAULT NULL,
  OverHeadCosts int(11) DEFAULT NULL,
  TotalSales int(11) DEFAULT NULL,
  TotalProfit int(11) DEFAULT NULL,
  PRIMARY KEY (DepartmentID)
);

INSERT INTO Departments (DepartmentName, OverHeadCosts) VALUES 
("Outdoors", 5000),
("Pets", 100000),
("Clothing", 25000);