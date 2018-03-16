DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL auto_increment,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2),
    stock_quantity INT NOT NULL,
    primary key (item_id)
);
INSERT INTO Top5000 (product_name,department_name,price,stock_quantity)
VALUES ("lightbulbs","Electronics",7.50,100),
       ("plastic chair","Home Decor",15.00,50),
       ("lamp","Electronics",20.00,30),
       ("clock","Home Decor",8.00,40),
       ("rake","Gardening",20.00,30),
       ("tomato seeds","Gardening",3.00,200),
       ("beef jerky","Food",7.00,120),
       ("candy bars","Food",4.00,150),
       ("Barbie Doll","Toys",10.00,60),
       ("Lego Star Wars Set","Toys",50.00,20);