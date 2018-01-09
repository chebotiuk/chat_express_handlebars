var path = require('path');
var mongoose = require(path.join(__dirname, '../libs/mongoose')),
	Schema = mongoose.Schema; // подключаем модуль Schema

var schema = new Schema({ // Создаем схему
	username: {
		type: String,
		unique: true,
		required: true
	},
	hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

schema.methods.encryptPassword = function() {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};
schema.virtual('password')
	.set(function() {
		this._plainPassword = password;
		this.salt = Math.random() + '';
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function() {
		return this._plainPassword;
	});

schema.methods.checkPassword = function(password) {
	return this.encryptPassword(password) === this.hashedPassword;
};

exports.User = mongoose.model('User', schema); // Экспортируем объект для управления бд
