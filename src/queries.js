const Pool = require('pg').Pool;
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'biEdronek',
	port: 5432,
});

function getUsers() {
	return new Promise((resolve, reject) => {
		pool.query(
			'SELECT "email", "pass" FROM public."Users_1"',
			(error, results) => {
				if (error) {
					reject(error);
				}
				resolve(JSON.stringify(results.rows));
			}
		);
	});
}
function getUsersbyemail(email) {
	return new Promise((resolve, reject) => {
		pool.query(
			`SELECT * FROM public."Users_1" WHERE email='${email}'`,
			(error, results) => {
				if (error) {
					reject(error);
				}

				try {
					console.log(results.rows);
					resolve(results.rows)
				} catch (e) {
					resolve('');
				}
			}
		);
	});
}

function getUserAccess(email) {
	return new Promise((resolve, reject) => {
		pool.query(
			`SELECT * FROM public."access_1" WHERE id='${email}'`,
			(error, results) => {
				if (error) {
					reject(error);
				}

				try {
					//resolve(JSON.stringify(results.rows));
					resolve(results.rows)
				} catch (e) {
					resolve('');
				}
			}
		);
	});
}

function addUser(first,last,em,pas)  {
    pool.query(`INSERT INTO public."Users_1" ("Name", "Surname", "email", "pass") VALUES ('${first}','${last}','${em}','${pas}')`, (error, results) => {
        if (error) {
          throw error
        }}
        );
    }

	function getUserbyID(id) {
		return new Promise((resolve,reject) => {
		  pool.query(`SELECT * FROM public."Users_1" WHERE "ID"=${id}`, (error, results) => {
			if (error) {
			  reject(error);
			}
			resolve(JSON.stringify(results.rows));
		  });    
	  })}

	  function getSchedulesbyID(id) {
		return new Promise((resolve,reject) => {
		  pool.query(`SELECT * FROM public.schedules_1 WHERE "ID_user"=${id}`, (error, results) => {
			if (error) {
			  reject(error);
			}
			resolve(JSON.stringify(results.rows));
		  });    
	  })}


	  async function getSchedulesforUser(userid, day, from, to) {
		let dbanswer =  await pool.query(`SELECT "ID_user", "Day", "Start_at", "End_at" FROM public.schedules_1 where "ID_user" = ${userid} and "Day" = ${day} and ("Start_at" < '${to}' and '${from}' < "End_at")`)
		if (JSON.stringify(dbanswer.rowCount) == 0) {
		  try{let insertanswer = await pool.query(`INSERT INTO public.schedules_1("ID_user", "Day", "Start_at", "End_at") VALUES (${userid}, ${day}, '${from}', '${to}')`);
		  return "added"}
		  catch(e){console.log(e);}
		}
		else {return JSON.stringify(dbanswer.rows)}
		}

module.exports = {
	getUsers,
	getUsersbyemail,
	addUser,
	getUserbyID,
	getSchedulesbyID,
	getSchedulesforUser
};
