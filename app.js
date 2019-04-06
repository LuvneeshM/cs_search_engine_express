var config = require("./config.js")
var express = require("express")
var path=require('path')
var bodyParser = require('body-parser');
var request = require('request');

let api_key = config.api_key
let app = express()
let port = 3000

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug")

app.get("/search", (req, res)=>{
	res.render("homepage",{
		pageType:"initial"
	})
})
app.post("/search", (req, res)=>{
	//hit the google api now
	search_this = req.body.tosearch
	var url = `https://www.googleapis.com/customsearch/v1?key=${api_key}&cx=017576662512468239146:omuauf_lfve&q=${search_this}`
	request(url, function (err, response, body) {
		if(err) {
			res.render("homepage",{
				pageType:"error"
			})
		}
		else{
			body_json = JSON.parse(body)
			if(body_json["items"] != null){
				results = body_json["items"]
				if (body_json["items"].length > 5){
					results = body_json["items"].slice(0, 5);
				}
				res.render("homepage", {
					pageType:"searched", 
					tosearch: req.body.tosearch,
					res: results
				})
			}else{
				res.render("homepage", {
					pageType:"no_res"
				})
			}


		}
	})
})
app.listen(port)
console.log("Listening to port " + port)