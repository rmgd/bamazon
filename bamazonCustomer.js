promptCustomer(res);

var promptCustomer = function(res) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'choice',
        message: 'What would you like to purchase? [Quit with Q]'
      }
    ])
    .then(function(answer) {
      var correct = false;
      if (answer.choice.toUpperCase() == 'Q') {
        process.exit();
      }
      for (var i = 0; i < res.length; i++) {
        if (res[i].product_name == answer.choice) {
          correct = true;
          var product = answer.choice;
          var id = i;
          inquirer
            .prompt({
              type: 'input',
              name: 'quantity',
              message: 'How many items would you like to buy?',
              validate: function(value) {
                if (isNaN(value) == false) {
                  return true;
                } else {
                  return false;
                }
              }
            })
            .then(function(answer) {
              if (res[id].stock_quantity - answer.quantity > 0) {
                connection.query(
                  "UPDATE products SET stock_quantity='" +
                    (res[id].stock_quantity - answer.quantity) +
                    "' WHERE product_name='" +
                    product +
                    "'",
                  function(err, res2) {
                    console.log('Product Purchased!');
                    makeTable();
                  }
                );
              } else {
                console.log('Invalid Selection!');
                promptCustomer(res);
              }
            });
        }
      }
      if (i == res.length && correct == false) {
        console.log('Not a valid selection!');
        promptCustomer(res);
      }
    });
};
