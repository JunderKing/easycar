const mysql = require('mysql')

var db = mysql.createConnection({
  user: 'myuser',
  password: 'youxiwang',
  database: 'easycar'
})

db.connect()
db.query('create table users(' +
  'id int not null default 0 primary key, ' +
  "tel varchar(16) not null default '' unique key, " +
  'role tinyint not null default 0, ' +
  "cipher varchar(64) not null default '', " +
  "salt varchar(16) not null default '', " +
  "ip char(16) not null default '', " +
  'date_time timestamp not null default current_timestamp)'
)
db.query('create table cars(' +
  'id int not null default 0 primary key,' +
  "car_brand varchar(16) not null default ''," +
  "car_type varchar(16) not null default ''," +
  'category tinyint not null default 0,' +
  'start_price float not null default 0,' +
  'time_price float not null default 0,' +
  'dist_price float not null default 0)'
)
db.query('create table driver_cars(' +
  'uid int not null default 0 key, ' +
  'car_id int not null default 0, ' +
  'date_time timestamp not null default current_timestamp)'
)
db.query('create table driver_dests(' +
  'uid int not null default 0 key, ' +
  'dest_id int not null default 0, ' +
  'date_time timestamp not null default current_timestamp)'
)
db.query('create table pasnger_logs(' +
  'pasnger_id int not null default 0 key, ' +
  'driver_id int not null default 0, ' +
  'origin_id int not null default 0, ' +
  'dest_id int not null default 0, ' +
  'start_time timestamp not null default current_timestamp, ' +
  'end_time timestamp not null default current_timestamp, ' +
  'dist_money int not null default 0,' +
  'time_money int not null default 0)'
)
db.end()
