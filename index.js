import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "singh@123!",
  port: "5432"
})

db.connect();
let items;

app.get("/", async (req, res) => {
  const result= await db.query("select * from items ");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("insert into items (title) values ($1)",[item])
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const newID = req.body.updatedItemId;
  const newTitle = req.body.updatedItemTitle;
  try {
    await db.query("update items set title = ($1) where id = $2",[newTitle,newID]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("delete from items where id = $1",[id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
