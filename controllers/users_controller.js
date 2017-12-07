const User = require('../models/user');
const Concept = require('../models/concept');
const Feedback = require('../models/feedback');

module.exports = {

	getOne(req, res, next) {
		const param = req.params.username;
		const username = param.toLowerCase();

		User.findById(username)
			.then((user) => res.send(user))
			.catch((next));
	},

	post(req, res, next) {
		const newEntry = req.body;

		User.create(newEntry)
			.then((createdEntry) => res.status(201).send(createdEntry))
			.catch((next));
	},

	put(req, res, next) {
		const param = req.params.username;
		const username = param.toLowerCase();

		const update = req.body;

		delete update.username;

		User.findByIdAndUpdate(username, update)
			.then((response) => {
				if (response === null) {
					res.status(404).send({ error: 'The given user does not exist' })
				} else {
					User.findById(username)
						.then((updatedEntry) => res.send(updatedEntry))
						.catch((next))
				}
			})
			.catch((next));
	},

	delete(req, res, next) {
		const param = req.params.username;
		const username = param.toLowerCase();

		User.findByIdAndRemove(username)
			.then((response) => {
				if (response === null) {
					res.status(404).send({ error: 'The given user does not exist' })
				} else {
					Concept.remove({ user: username })
						.then(() => {
							Feedback.remove({ author: username })
								.then(() => {
									res.send(response);
								});
						})
						.catch((next));
				}
			})
			.catch((next));
	}
};