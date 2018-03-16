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
            choices: [`View Products for Sale`, `View Low Inventory`, `Add to Inventory``Add New Product`],
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