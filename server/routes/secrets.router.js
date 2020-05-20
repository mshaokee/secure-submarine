const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
// ADD REQUIRE HERE
// const { rejectUnauthenticated } = require ('../modules/authentication-middleware');
const { rejectAuthorization } = require('../modules/authorization-middleware');

// router.get('/', rejectUnauthenticated, (req, res) => { /* ADD rejectUnauthenticated HERE */
//     console.log('req.user:', req.user);
//     pool.query('SELECT * FROM "secret";')
//         .then(results => res.send(results.rows))
//         .catch(error => {
//             console.log('Error making SELECT for secrets:', error);
//             res.sendStatus(500);
//         });
// });

router.get('/', rejectAuthorization, (req, res) => {
    console.log('req.user:', req.user);
    // pool.query('SELECT * FROM "user";')
    let queryString = `SELECT "content" FROM "secret"
                JOIN "user" ON "user".clearance_level >= "secret".secrecy_level
                WHERE "user".id = $1;`;
    console.log(req.user.clearance_level);
    pool.query(queryString, [req.user.id])
        .then(results => {
            console.log(results.rows)
            res.send(results.rows)
        }).catch(error => {
            console.log('Error making SELECT for secrets:', error);
            res.sendStatus(500);
        });
});

module.exports = router;