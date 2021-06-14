
const mongo = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

const url = "mongodb+srv://nicklas:ncnfunmax@node.gs8f9.mongodb.net/mydb?retryWrites=true&w=majority"

/*MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    let myobj = [{ name: "Nicklas Bøge", address: "Flensborggade 3" },
                {name: "Thea", address: "Landet"}];
    dbo.collection("customers").insertMany(myobj, function(err, res) {
    if (err) throw err;
        console.log("database created!");
        console.log("Collection created!");
        // console.log("Number of documents inserted: " + res.insertedCount);
        console.log(res);
        db.close();
    });
});*/

/*MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    dbo.collection("customers").find({}, { projection: { _id: 0 } }).toArray(function(err, result) {
    if (err) throw err;
        console.log("database created!");
        console.log("Collection created!");
        console.log(result);
        db.close();
    });
}); */


/* MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    const mysort = { name: -1 };
    dbo.collection("customers").find().sort(mysort).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  }); */

  /* MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    const myquery = { name: 'thea' };
    // const myquery = { address: /^N/ };
    dbo.collection("customers").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  }); */

  /* MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    dbo.collection("customers").drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
      db.close();
    });
  }); */


