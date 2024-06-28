const { readFile, writeFile } = require("fs").promises;
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose =require("mongoose");
const express=require('express')
const dotenv=  require('dotenv')

dotenv.config();

const app = express();
const SECRET_KEY = process.env.Secretkey;
const Mongo=process.env.Mongo;
console.log(Mongo);
app.use(cors());
app.use(express.json());
let users = [];

app.listen(5000, () => {
    console.log("Server is listening on port 5000.");
});

mongoose.connect(Mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => console.error("MongoDB connection error:", err));
db.once("open", () => console.log("Connected to MongoDB"));

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const watchLaterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{
    title: { type: String, required: true },
    img: { type: String },
    description: { type: String },
    category: { type: String },
    rating: { type: String }
  }]
});

const favoritesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{
    title: { type: String, required: true },
    img: { type: String },
    description: { type: String },
    category: { type: String },
    rating: { type: String }
  }]
});

const Favorites = mongoose.model('Favorites', favoritesSchema);
const WatchLater = mongoose.model('WatchLater', watchLaterSchema);
const User = mongoose.model("Movieuser", userSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ username });

    if (user) {
      return res
        .status(400)
        .json({ success: false, msg: "Username already exists" });
    }

    // Create new user
    user = new User({ username, password });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    res.status(201).json({ success: true, msg: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Invalid password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "1h", // Token expiration time
    });

    res.json({ success: true, accessToken,nameofuser:user.username });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

app.get("/api/movies/category/:category", async (req,res)=>{
    let data = JSON.parse(await readFile("./data/movies.json","utf8"));
    data = data.filter((e)=>{return e.category === req.params.category}).slice(Number(req.query.offset),Number(req.query.offset) + Number(req.query.limit));
    if(data.length >1)
     return res.status(200).json({ success:true, data:data});
    
     return res.status(200).json({ success:false, msg:`your movie category: ${req.params.category}, offset:${req.query.offset} or limit:${req.query.limit} are wrong`})
});

app.post('/api/favorites/add', async (req, res) => {
  const { username, details } = req.body;

  try{
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    let favorites = await Favorites.findOne({ user: user._id });

    if (!favorites) {
      favorites = new Favorites({ user: user._id, movies: [details.movieDetails] });
    } else {
      if (favorites.movies.some(movie => movie.title === details.movieDetails.title)) {
        return res.status(400).json({ success: false, msg: 'Movie already in favorites' });
      }
      favorites.movies.push(details.movieDetails);
    }

    await favorites.save();
    res.status(201).json({ success: true, msg: 'Movie added to favorites' });
  } catch (error) {
    console.error('Error adding movie to favorites:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});



app.get('/api/favorites/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    const favorites = await Favorites.findOne({ user: user._id });
    if (!favorites) {
      return res.status(404).json({ success: false, msg: 'No favorites found for this user' });
    }

    res.status(200).json({ success: true, data: favorites.movies });
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

app.get('/api/watchlater/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    const watchLater = await WatchLater.findOne({ user: user._id });
    if (!watchLater) {
      return res.status(404).json({ success: false, msg: 'No watch later list found for this user' });
    }

    res.status(200).json({ success: true, data: watchLater.movies });
  } catch (error) {
    console.error('Error fetching watch later list:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

app.get("/api/movies/category", async (req,res)=>{
    if("categoryList" in req.query){
        const data = [
            "Excitement",
            "Action",
            "Animation",
            "Historical",
            "Biography",
            "Drama",
            "Adventure",
            "Comedia",
            "Musical",
            "Fantasy",
            "Crime",
            "War",
            "Family",
            "Sci-Fi",
            "Horror",
            "Family",
            "Romance",
            "Sports",
            "Documentary",
            "Western",
            "Mystery"
        ];
         return res.status(200).json({ success:true, data:data});    
    }
    return res.status(200).json({ success:false, msg:`Couldn't get categorys.`})
})
app.get("/api/movies/:title",async (req,res)=>{
    let data = JSON.parse(await readFile("./data/movies.json","utf8"));
    data = data.find((e)=>e.title.trim() === req.params.title.trim())
    if(data)
        return res.status(200).json({success:true,data:data});
    
    return res.status(200).json({success:false,msg:`Couldn't found any Movie with name ${req.params.title}.tip:check spaces!`})

})
app.get("/api/movies",async (req,res)=>{
    let data = JSON.parse(await readFile("./data/movies.json","utf8"));
    data = data.slice(Number(req.query.offset),Number(req.query.offset) + Number(req.query.limit));
   
    if(data)    
        return res.status(200).json({success:true,data:data});
    
    return res.status(401).json({success:false,msg:`Something is worng! try later`})

})
app.get("/api/movies/search/:title",async(req,res)=>{
    let data = JSON.parse(await readFile("./data/movies.json","utf8"));
    data = data.filter((e)=>e.title.trim().toLowerCase().includes(req.params.title.trim().toLowerCase()) === true)
    if(data.length>1)
        return res.status(200).json({success:true,data:data});
    
    return res.status(200).json({success:false,msg:`Couldn't found any Movie with name ${req.params.title}`})

})