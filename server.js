import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;

const db = [
  {
    id: 1,
    username: "vaqueros@utrgv.edu",
    password: "goUTRGV!"
  },
  {
    id: 2,
    username: "student@utrgv.edu",
    password: "student123"
  },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
      // check if the user exists  
      const registeredUser = db.find( (user) => user.username === email);
      if (registeredUser) {
        res.send("Email already exists. Try logging in.");
      } else {
        // Part 2: Hash password before store. 
        bcrypt.hash(password, saltRounds, (err, hash) =>{
          if(err){
            console.error("Error hashing password", err)
          } else {
            console.log("Hased Password: ",  hash);
          }
          // register new user
          const newUser = {
            id: Math.max(...db.map( (user) => user.id )) + 1, 
            username: email.trim(),
            password: hash
          };
          
          db.push(newUser);

          console.log(db);
          res.render("secrets.ejs");
        })
      }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
  try {
    const registeredUser = db.find( (user) => user.username === email);
    console.log(registeredUser);
   
    if (registeredUser) {      
      //IMPORTANT: First param must be the login password, second param must be the DB password
      bcrypt.compare(password, registeredUser.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords: ", err);
        } else {
          if (result) {
            res.render("secrets.ejs");
          } else {
            res.send("Incorrect Password");
          }
        }

      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
