const express = require("express");
const app = express();
const cors = require('cors')

const { v4: uuidv4 } = require('uuid');
const port = 3000;

app.use(express.json());

app.use(cors());

var loki = require("lokijs");
var db = new loki("example.db");

const text = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
provident neque at facere ratione quaerat cumque dicta nulla. Earum
rerum sunt nostrum deleniti qui. Nostrum repellendus odit quis
impedit possimus.`;

const users = ["Rob Hope", "Green Lantern", "Deadpool", "Shelby"];

const comments = db.addCollection("comments");
comments.insert({ id: uuidv4(), user: "Rob Hope", time: "45 min ago", text, upvotes: 0 });
comments.insert({ id: uuidv4(), user: "Green Lantern", time: "45 min ago", text, upvotes: 1 });

app.get("/comments", (req, res) => {
	try {
		const results = comments.find();
		return res.send(results);
	} catch (e) {
		return res.send({ error: e.message});
	}
});

app.patch("/comments", (req, res) => {
	try {
		const { id } = req.body;

		console.log(req.body, id);
		if (!id) {
			res.statusCode = 400;
			return res.send({
				error: 'Missing params'
			})
		}
		const comment = comments.by('id', id);
		comment.upvotes++;
		comments.update(comment);

		return res.send({ message: "Upvote added"});

	} catch (e) {
		console.log(e.message);
		return res.send({ error: e.message });
	}
})

app.post("/comments", (req, res) => {
	try {
		const text = req.body?.text;
		if (!text) {
			res.statusCode = 400;
			return res.send({
				error: "Missing text",
			});
		}

		const comment = {
			user: users[Math.floor(Math.random() * users.length)],
			text,
			time: '45 min ago',
			upvotes: 0,
			id: uuidv4()
		};
		comments.insert(comment);
		return res.send({
			message: 'Comment added'
		})

	} catch (e) {
		console.log(e);
		res.statusCode = 500;
		return res.send({ error: e.message });
	}
});

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
