const express = require("express");

const app = express();

// provide static files
app.use(express.static('static_build'))



app.listen(8000, () => { console.log("server running at port 8000") })