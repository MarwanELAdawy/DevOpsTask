const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT||3000;
const Pool = require('pg').Pool; 

const pool = new Pool({
    user: 'marwan',
    host: 'localhost',
    database: 'ip',
    password: 'password',
    port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: false,
    })
);

pool.connect((err, client, release) => { 
    if (err) { 
        return console.error('Error acquiring client', err.stack);
    } 
    client.query('SELECT NOW()', (err, result) => { 
        release();
        if (err) { 
            return console.error( 'Error executing query', err.stack);
        } 
        console.log("Connected to Database !");
    }); 
});


app.get('/', (req, res)=>{
    res.send('Halan ROCKS It');
});

app.get('/:id', (req, res)=>{
    let n = req.params.id;
    res.send(`${n*n}`);
});

app.get('/allips', (req, res, next)=>{
    pool.query('Select ip from ips').then(testData => { 
        console.log(testData); 
        res.status(200).json(testData.rows);
        //res.send(testData.rows); 
    });
});

app.post('/ips', ()=>{
    const { ip } = request.body;
    pool.query('INSERT INTO users (ip) VALUES ($1)', [ip], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`IP added with ID: ${result.insertId}`);
    });
});

app.use((req, res) => res.status(404).send({
    error: 'Oops! Endpoint not found, Please Check that you are entering the right thing!',
}));

app.use((err, req, res, next) => {
    res.status(500).send({
        error: 'Invalid Request! Please Check that you are entering the right thing!',
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
