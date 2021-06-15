const mysql = require('mysql2');

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

const processFullName = (employee, callback) => {
  const fullName = `${employee.first_name} ${employee.last_name}`;
  const sql = mysql.format('UPDATE employees SET full_name = ? WHERE emp_no = ?', [fullName, employee.emp_no]);
  connection.query(sql);
  callback();

}

const query = connection.query('SELECT emp_no, first_name, last_name  FROM employees');

query.on('error', (err) => {
  console.error(err);
})
.on('result', (row) => {
  connection.pause();
  processFullName(row, () => {
    connection.resume();
  })
})
.on('end', () => {
  connection.end();
});