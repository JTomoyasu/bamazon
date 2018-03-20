var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    initial();
});
function initial() {
    var quary = "SELECT item_id, product_name, price,stock_quantity FROM products";
    connection.query(quary, function (err, res) {
        for (i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price);
        }
        inquirer.prompt([
            {
                type: "input",
                name: "productBought",
                message: "Please input the id of the product you'd like to buy:",
                validate: function (value) {
                    if (isNaN(value) || value > res.length || value < 1 || !Number.isInteger(parseFloat(value))) {
                        console.log("\nWe don't have a product that matches that id. Please choose another.");
                        return false;
                    }
                    return true;
                }
            },
            {
                type: "input",
                name: "productQuantity",
                message: "Please specify the amount you'd like to buy:",
                validate: function (value) {
                    if (isNaN(value) || value < 1 || !Number.isInteger(parseFloat(value))) {
                        console.log("\nPlease input a number.");
                        return false;
                    }
                    return true;
                }
            }
        ]).then(function (ans) {
            if (ans.productQuantity > res[ans.productBought-1].stock_quantity) {
                console.log("\nWe don't have enough of that. Please choose something else.");
                initial();
            }
            else {
                var q2 = "UPDATE products SET ? WHERE ?";
                var newQuant = res[ans.productBought-1].stock_quantity - ans.productQuantity;
                var totalPrice = ans.productQuantity * res[ans.productBought-1].price;
                connection.query(q2,
                    [{ stock_quantity: newQuant },
                    { item_id: res[ans.productBought-1].item_id }],
                    function (error, response) {
                        console.log("\nSuccess! " + "You spent: " + totalPrice + " dollars" + " Thank you for your purchase.");
                        initial();
                    });
            }
        })
    });
}
