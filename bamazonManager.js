var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "swords",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    initial();
});

function initial() {
    inquirer.prompt([
        {
            type: "list",
            name: "command",
            choices: [`View Products for Sale`, `View Low Inventory`, `Add to Inventory`, `Add New Product`],
            message: "Please choose a command:"
        }
    ]).then(function (ans) {
        switch (ans.command) {
            case `View Products for Sale`:
                listProducts();
                break;
            case `View Low Inventory`:
                listLowInventory();
                break;
            case `Add to Inventory`:
                addInventory();
                break;
            case `Add New Product`:
                addProduct();
                break;
        }
    })
}
function listProducts() {
    var quary = "SELECT item_id, product_name, price,stock_quantity FROM products";
    connection.query(quary, function (err, res) {
        for (i = 0; i < res.length; i++) {
            console.log("\nItem ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity+"\n");
        }
    });
    initial();
}
function listLowInventory() {
    var quary = "SELECT item_id, product_name, price,stock_quantity FROM products";
    connection.query(quary, function (err, res) {
        for (i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log("\nItem ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity+"\n");
            }
        }
    });
    initial();
}
function addInventory() {
    var quary = "SELECT item_id, product_name, price,stock_quantity FROM products";
    connection.query(quary, function (err, res) {
        inquirer.prompt([
            {
                name: "productID",
                message: "Please specify the ID of the product you'd like to add more of:",
                type: "input",
                validate: function (value) {
                    if (isNaN(value) || res.length < value || value < 1 || !Number.isInteger(parseFloat(value))) {
                        console.log("\nThat ID doesn't match one on our records. Please choose another.");
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "amount",
                type: "input",
                message: "Please specify the amount of product you want to add: ",
                validate: function (value) {
                    if (isNaN(value) || value < 1 || !Number.isInteger(parseFloat(value))) {
                        console.log("\nPlease type a number in digits not letters.")
                        return false;
                    }
                    return true;
                }
            }
        ]).then(function (ans) {
            var q2 = "UPDATE products SET ? WHERE ?";
            var newQuant = parseFloat(res[ans.productID - 1].stock_quantity) + parseFloat(ans.amount);
            connection.query(q2,
                [{ stock_quantity: newQuant },
                { item_id: res[ans.productID - 1].item_id }],
                function (error, response) {
                    console.log("\nSuccess! Product successfully added.");
                });
            initial();
        });
    });
}
function addProduct() {
    inquirer.prompt([
        {
            type:"input",
            name:"productName",
            message:"Please specify the name of the product to be added:",
            validate:function(value){
                if(value==""){
                    console.log("\nPlease input data");
                    return false;
                }
                return true;
            }
        },
        {
            type:"input",
            name:"productDepartment",
            message:"Please specify the department of the product to be added:",
            validate:function(value){
                if(value==""){
                    console.log("\nPlease input data");
                    return false;
                }
                return true;
            }
        },
        {
            type:"input",
            name:"productPrice",
            message:"Please specify the price of the product to be added:",
            validate:function(value){
                if(isNaN(value)||parseFloat(value)<0){
                    console.log("\nPlease input a positive number");
                    return false;
                }
                return true;
            }
        },
        {
            type:"input",
            name:"productQuantity",
            message:"Please specify the quantity of the product to be added:",
            validate:function(value){
                if(isNaN(value)||parseFloat(value)<0||!Number.isInteger(parseFloat(value))){
                    console.log("\nPlease input a positive integer");
                    return false;
                }
                return true;
            }
        }
    ]).then(function(ans){
        connection.query("INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES (?,?,?,?)",[ans.productName,ans.productDepartment,ans.productPrice,ans.productQuantity],function(err,resp){
            console.log("\nSuccess! Product added to stock.")
            initial();
        })
    });
}