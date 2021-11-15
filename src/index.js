const express = require('express');
const port = 3000;
const app = express();
const CryptoJS = require('crypto-js');
const bodyParser = require('body-parser')
const pug = require('pug');
const db = require('./queries');
app.set('view engine', 'pug');
app.set('views', 'src/views');
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
const sessions = require('express-session');



app.use(sessions({
    secret: "verylongandrandomsetofstrings1234568999908",
    saveUninitialized:false,
    cookie: { maxAge: 9999999999999 },
    resave: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

app.use(cookieParser());

app.route('/login')
//wyświetla formularz z polami Adres email i password z pug.login.
	.get(function (req, res) {
		let session=req.session;
    		if(session.userid){
				console.log("logged userd");
				res.redirect("/main")
		}
			else {
				console.log("Not logged user");
				res.render('login', {title: 'Login'})}
	})
	//metodą POST przesyła dane do formlarza i porównuje z bazą
	.post(function (req, res) {
		let email = req.body.email;
		let name = req.body.Name;
		let surname = req.body.Surname;
		let password = req.body.password;
		let passhash = CryptoJS.SHA256(password).toString()
		db.getUsersbyemail(email)
		.then(data => {
			//jak nie poprawne dane to robi if z info o login failed!
				if  (data.length === undefined) {
				res.render('login', {
				title: 'Login',
				answer: `Login failed! Enter correct credentials or register now!`,})
				return false
				}

			//a jak poprawne to przekeirowuje na main_page.pug
			let emailDb = data[0].email; 
			let passDb = data[0].pass; 
			let userid = data[0].ID;
			if (emailDb == email && passDb == passhash) {
				let session=req.session;
        		session.userid=userid;
				session.email=email;
				session.name=data[0].Name;
				session.surname=data[0].Surname;
				session.role="admin"
				res.redirect("/main")
				//res.render('mainpage', { title: 'Main Page', answer: 'Welcome'			})
			}
			else {res.render('login', {
				title: 'Login',
				answer: `Login failed! Enter correct credentials or register now!`,})}
		})
		.catch(err => { console.error(err); });	
	})

app.get('/main',  function (req, res) {
	let session=req.session;
    		if(session.userid){
				db.getUserbyID(session.userid)
					.then(data => {
						res.render('mainpage', { title: 'User', 
							name: session.name,
							surname: session.surname,
							email: session.email
						})})
					.catch(err => { console.error(err); });
						//res.render('mainpage', { title: 'Main Page', answer: 'Welcome'})
			}
			else {res.redirect("/login")}
})

app.get('/logout', function (req, res) {
	let session=req.session;
    		if(session.userid){
				res.render('logout')
			}
			else {res.redirect("/login")}
})

app.get('/logout1', function (req,res) {
	req.session.destroy();
    res.redirect('/login');
})
		

app.route('/register')
	.post(async function (req, res) {
		let first = req.body.firstname;
		let last = req.body.lastname;
		let mail = req.body.email;
		let pass = req.body.password;
		let users = await db.getUsersbyemail(mail);
		if (users.length == 0) {
		db.addUser(first, last, mail, CryptoJS.SHA256(pass).toString());
		res.render('login', {
			title: 'Login',
			message: `User ${first} ${last} has been added! Please login now!`,
		});}
		else {res.render('register', {
			title: 'Register New User',
			message: `User already created! Enter different email address!`,
		});}
	})
	.get(function (req, res) {
		res.render('register', { title: 'Register New User'})
	});

app.get('/schedules', function (req, res) {
	let session=req.session;
    		if(session.userid){
				db.getSchedulesbyID(session.userid)
					.then(data => {
						res.render('schedules', { title: 'Schedules', message: data})})
					.catch(err => { console.error(err); });
					}
			else {res.redirect("/login")}
});


app.route('/schedule/new')
	.post(async function (req, res) {
		let id = req.body.User_ID;
		let day = req.body.Day;
		let from = req.body.From;
		let to = req.body.To;
		if (from >= to) {
		res.render('new_schedule', {
				title: 'New Schedule',
				answer: `Start time must be earlier than end time!`})
			return false}
		let addResult = await db.getSchedulesforUser(id, day, from, to);
		if (addResult == "added") {
		res.render('new_schedule', { title: 'New Schedule', answer: 'Schedule has been added!'})
		}
		else {
		res.render('new_schedule', { title: 'New Schedule', answer: 'Schedule has not been added! There are conflicting schedules:', message: addResult})
		}
	})
	.get(function (req, res) {let session=req.session;
		if(session.userid){
		res.render('new_schedule', { title: 'New Schedule' });
	}
	else {res.redirect("/login")}
})

app.get('/',  function (req, res) {
	res.redirect("/main")
})

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
