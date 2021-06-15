const mysql = require('mysql2');
const stream = require('stream');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'employees'
});

connection.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connection established')
  }
})

//criação stream
const updateStream = new stream.Transform({highWaterMark: 5, objectMode: true});

// função de escrita

updateStream._write = (chunk, encoding, callback) => {
  const fullName = `${chunk.first_name} ${chunk.last_name}`;
  const sql = mysql.format('UPDATE employees SET full_name = ? WHERE emp_no = ?', [fullName, chunk.emp_no]);
  connection.query(sql);
  callback();
}

const query = connection.query('SELECT emp_no, first_name, last_name  FROM employees')
.on('end', () => {
  connection.end();
  console.log('terminei!')
});

query.stream({highWaterMark: 5}).pipe(updateStream);