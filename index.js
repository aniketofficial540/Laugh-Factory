import axios from "axios";
import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs", {
        jokes: ""
    });
});

app.post("/submit", async (req, res) => {
    let category = req.body.category === "Any" ? "Any" : req.body['custom-type'];
    let jokes = req.body.joke_amount;
    try {
        const result = await axios.get("https://v2.jokeapi.dev/joke/" + category, {
            params: {
                amount: jokes
            }
        });
        const jokesData = result.data.jokes || [result.data];
        const jokeText = jokesData.map(joke => joke.setup ? joke.setup + "\n - " + joke.delivery : joke.joke).join("\n \n");
        res.render("index.ejs", {
            jokes: jokeText
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
