const mysql = require('mysql')

var db = mysql.createConnection({
  user: 'myuser',
  password: 'youxiwang',
  database: 'easycar'
})

db.connect()
db.query('create table users(' +
  'id int not null default 0 primary key, ' +
  "tel varchar(32) not null default '' unique key, " +
  'role tinyint not null default 0, ' +
  "cipher varchar(64) not null default '', " +
  "salt int not null default 0, ip char(32) not null default '', " +
  "date varchar(32) not null default '')"
)
db.query('create table cars(' +
  'id int not null default 0 primary key,' +
  "car_brand varchar(64) not null default ''," +
  "car_type varchar(64) not null default ''," +
  'category tinyint not null default 0,' +
  'start_price tinyint not null default 0,' +
  'time_price tinyint not null default 0,' +
  'dist_price tinyint not null default 0' +
  ')'
)
db.query('create table driver_cars(' +
  'uid int not null default 0, ' +
  'car_id int not null default 0, ' +
  "date varchar(32) not null default '')"
)
db.query('create table driver_dests(' +
  'uid int not null default 0, ' +
  'dest_id int not null default 0, ' +
  "date varchar(32) not null default '')"
)
db.query('create table pasnger_logs(' +
  'pasnger_id int not null default 0, ' +
  'driver_id int not null default 0, ' +
  'origin_id int not null default 0, ' +
  'dest_id int not null default 0, ' +
  "start_time varchar(32) not null default '', " +
  "end_time varchar(32) not null default '', " +
  'price int not null default 0)'
)
db.end()
