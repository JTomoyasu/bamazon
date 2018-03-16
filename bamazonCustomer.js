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
                    if (isNaN(value) || value > res.length) {
                        console.log("We don't have a product that matches that id. Please choose another.");
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
                    if (isNaN(value)) {
                        console.log("Please input a number.");
                        return false;
                    }
                    return true;
                }
            }
        ]).then(function (ans) {
            for (j = 0; j < res.length; j++) {
                if (ans.productBought == res[j].item_id) {
                    if (ans.productQuantity > res[j].stock_quantity) {
                        console.log("We don't have enough of that. Please choose something else.");
                        initial();
                    }
                    else {
                        var q2 = "UPDATE products SET ? WHERE ?";
                        var newQuant = res[j].stock_quantity - ans.productQuantity;
                        console.log(newQuant);
                        var totalPrice = ans.productQuantity * res[j].price;
                        connection.query(q2,
                            [{ stock_quantity: newQuant },
                            { item_id: res[j].item_id }],
                            function (error, response) {
                                console.log("Success! " + "You spent: " + totalPrice + " dollars" + " Thank you for your purchase.");
                                initial();
                            });
                    }
                }
            }
        })
    });
}