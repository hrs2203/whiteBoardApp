// ===== standart http server ======
const express = require('express');
const cors = require('cors');
const app = express();

// ======== db instance ============
var db = {};

function makeVideoId(length = 15) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function addNewVideoLink() {
  var videoName = makeVideoId()
  while (db[videoName] !== undefined) { videoName = makeVideoId() }
  db[videoName] = { "username": new Set(), "connectionList": [], "screenAccess": "" }
  return videoName
}

// provide static files
app.use(express.static('static_build'));

app.use(cors());

app.get("/createVideo", (req, res) => {
  const newVideoId = addNewVideoLink();
  return res.status(200).json({ "sid": newVideoId });
});

app.get("/endVideo", (req, res) => {
  try {
    delete db[req.params.sessionId];
    return res.status(200).json({ "status": true });
  } catch (_) {
    return res.status(500).json({ "status": false });
  }
});

app.get("/getDb", (req, res) => { return res.status(200).json({ "data": db }) });

app.listen(8000, () => { console.log("server running at port 8000") })

// ======== ws code =========
