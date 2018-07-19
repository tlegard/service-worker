const express = require('express');
const app = express();
const router = express.Router();

app.use(express.static('public'));


router.get('/', function(req, res) {
    res.json([{ id: '7wV4l8ZP36XWQAD2', message: 'Checked item into holding area for real'}]);
});

app.use('/api/messages', router);



app.listen(1234, () => console.log("listening on port 1234"));