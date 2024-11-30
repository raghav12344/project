use defaultdb;

-- users table 
create table users(emailid varchar(500) primary key,pwd varchar(30),utype varchar(20),dos date,status int);
select * from users;
delete from users;
drop table users;

-- players table 
create table players(emailid varchar(500) primary key, fullname varchar(500),gender varchar(50),mobile varchar(30),address varchar(1000),city varchar(40),state varchar(40),zip varchar(20),proof varchar(30),proofpath varchar(5000),games varchar(500),prev_achv varchar(500),insta varchar(100));
select * from players;
delete from players;

-- organisers table
select * from organizers;
delete  from organizers;
drop table organizers;
create table organizers(email varchar(500) primary key,organization varchar(500),contact varchar(30),address varchar(1000),city varchar(40),state varchar(40),zip varchar(20),proof varchar(30),proofpath varchar(5000),sports varchar(500),hosted varchar(1000),website varchar(500),intagram varchar(100));

-- tournaments table 
create table tournaments(tid int primary key auto_increment,email varchar(500),mobile varchar(20),game varchar(100),title varchar(100),fee varchar(10),dot date,city varchar(40),state varchar(50),zip varchar(30),location varchar(500),prizes varchar(1000),posterpic varchar(5000),info varchar(5000));
drop table tournaments;
select * from tournaments;
drop table tournaments;
delete from tournaments;
select DISTINCT game from tournaments;