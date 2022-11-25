//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));


// mongoose.connect("mongodb://0.0.0.0:27017/todolist");

mongoose.connect("mongodb+srv://admin-siva:admin-siva@cluster0.a8xkzs5.mongodb.net/?retryWrites=true&w=majority");

const itemschema = {
  name: String
}

const Item = mongoose.model("Item", itemschema);

const item1 = new Item({
  name: "Welcome to my todolist"
})

const item2 = new Item({
  name: "try to save something"
})

const item3 = new Item({
  name: "tick the box to delete"
})

var defaultItems = [item1, item2, item3]

// user defined list                            
const listSchema = {
  name: String,
  items: [itemschema]
}

const List = mongoose.model("list", listSchema)

app.get("/", function (req, res) {

  Item.find({}, function (err, finditems) {

    if (finditems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("page reseted");
        }
      })
      res.redirect("/")
    } else {
      res.render("list", {
        listTitle: "today",
        newListItems: finditems
      });
      //console.log(finditems);

    }
  })
});

app.get("/:customparam", function (req, res) {

  const customList = req.params.customparam;

  List.findOne({
    name: customList
  }, function (err, foundlist) {
    if (!err) {

      if (!foundlist) {
        // create a new list
        const list = new List({
          name: customList,
          items: defaultItems
        });

        list.save();
        // res.redirect("/")

        console.log("sucessfully created new list");

      } else {
        // show a existing list

        res.render("list", {
          listTitle: foundlist.name,
          newListItems: foundlist.items
        })
        // res.redirect("/")
        console.log("list existed!");
      }
    }
  })


  res.redirect("/")
})

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })

  item.save();
  res.redirect("/");

});


app.post("/delete", function (req, res) {

  const checkedItemId = req.body.checkbox

  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("sucessfully deleted");
    }
    res.redirect("/")
  })

})


app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});


let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port 3000");
});