const express = require('express');
const path = require('path');
//const dbLayer = require('./config/db');
const cookieParser = require('cookie-parser');
const app = express();
const port = 9000;
const cors = require("cors");
const axios = require('axios');

//const User = require('./model/User');

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(cookieParser());
app.use(express.json());

app.get('/geo', (req,res)=>{

//console.log(req);
	let ip = req.socket.remoteAddress;
	if(ip=="::1"){

		ip="192.168.0.106";
	}

let loc = axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=e2c6be79875946668512a3c2690a46f1&ip=192.168.0.106')

//let loc = axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=e2c6be79875946668512a3c2690a46f1&ip=${ip}')

//console.log(req.socket.remoteAddress);

res.json(loc.data);
//res.json(ip);
//res.json({d:"test"});

});

app.listen(port, () => {
	//dbLayer.init();
	console.log(`listening on port: ${port}`);
});
