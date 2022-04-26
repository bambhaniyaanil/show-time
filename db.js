const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'F7cS1U19LCvinazq1RQy',
    user: 'uqramwvhri9pem5w',
    database: 'bv4fn5emobhvvmoyrpij',
    host: 'bv4fn5emobhvvmoyrpij-mysql.services.clever-cloud.com',
    port: '3306'
})

let chirprdb = {};

chirprdb.all = () => {
    return new Promise((reso, rej) => {
        pool.query(`SELECT * FROM login`, (err, res) => {
            if (err) {
                return rej(err);
            } else {
                return reso(res);
            }
        })
    })
}

chirprdb.get_category = () => {
    return new Promise((reso, rej) => {
        pool.query(`SELECT cat_id as name FROM movies GROUP BY cat_id ORDER BY (cat_id) ASC`, (err, res) => {
            if (err) {
                return rej(err);
            } else {
                return reso(res);
            }
        })
    })
}

chirprdb.get_movie = (cat_id) => {
    return new Promise((reso, rej) => {
        pool.query(`SELECT * FROM movies where cat_id='${cat_id}' ORDER BY (id) DESC`, async (err, res) => {
            if (err) {
                return rej(err);
            } else {
                let data = res;

                for (let i = 0; i < res.length; i++) {
                    const files = await get_file(data[i].id);
                    data[i].files = files;
                }

                return await reso(data);
            }
        })
    })
}

function get_file(id) {
    return new Promise((reso, rej) => {
        pool.query(`SELECT * FROM files where movie_id='${id}' ORDER BY (id) DESC`, (err, res) => {
            if (err) {
                return rej([]);
            } else {
                reso(res);
            }
        })
    })
}

function get_category() {
    return new Promise((reso, rej) => {
        pool.query(`SELECT cat_id as name FROM movies GROUP BY cat_id ORDER BY (cat_id) ASC`, (err, res) => {
            if (err) {
                return rej([]);
            } else {
                reso(res);
            }
        })
    })
}

chirprdb.home = async () => {
    return new Promise(async (reso, rej) => {
        const category = await get_category();
        let returnData = [];
        for await (const item of category) {
            const movieLidt = await get_movie_limit_3(item.name);
            const cat_data = await {
                name: item.name,
                list: movieLidt
            };
            await returnData.push(cat_data);

        }

        return await reso(returnData);
    })
}

async function get_movie_limit_3(id) {
    return new Promise((reso, rej) => {
        pool.query(`SELECT * FROM movies where cat_id='${id}' ORDER BY (id) DESC LIMIT 3`, async (err, res) => {
            if (err) {
                return rej([]);
            } else {
                let data = res;
                for (let i = 0; i < res.length; i++) {
                    const files = await get_file(data[i].id);
                    data[i].files = files;
                }

                return await reso(data);
            }
        })
    })
}

module.exports = chirprdb;