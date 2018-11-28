let admin = 
	`create table if not exists admin(
	 id INT NOT NULL AUTO_INCREMENT,
	 name VARCHAR(100) NOT NULL,
	 pwd VARCHAR(100) NOT NULL,
	 avator VARCHAR(60),
	 token VARCHAR(200),
	 reg_time TIMESTAMP,
	 last_login_time TIMESTAMP,
	 PRIMARY KEY ( id )
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

let users =
    `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     nickname VARCHAR(100) NOT NULL,
     avator VARCHAR(400) NOT NULL,
     level TINYINT NOT NULL DEFAULT 1,
     sex TINYINT NOT NULL DEFAULT 1,
     country VARCHAR(60),
     province VARCHAR(60),
     city VARCHAR(60),
     introduction VARCHAR(200),
     fans INT NOT NULL DEFAULT 0,
     follow INT NOT NULL DEFAULT 0,
     collect INT NOT NULL DEFAULT 0,
     share INT NOT NULL DEFAULT 0,
     openId VARCHAR(100) NOT NULL,
     updateTime TIMESTAMP,
     PRIMARY KEY ( id )
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

let users_attention = 
	`create table if not exists users_attention(
	 id INT NOT NULL AUTO_INCREMENT,
	 userId INT NOT NULL,
	 followId INT NOT NULL,
	 followTime TIMESTAMP,
	 isFollowEach TINYINT NOT NULL DEFAULT 0,
	 PRIMARY KEY ( id )
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

let songs = 
	`create table if not exists songs(
	 id INT NOT NULL AUTO_INCREMENT,
	 name VARCHAR(200) NOT NULL,
	 author VARCHAR(400),
	 avator VARCHAR(100),
	 stage VARCHAR(60),
	 share_id INT NOT NULL,
	 share_time TIMESTAMP,
	 song_url  VARCHAR(800) NOT NULL,
   qiniu_url VARCHAR(800),
   cover VARCHAR(400),
	 lyric_url VARCHAR(800),
	 description VARCHAR(200),
	 tag TINYINT NOT NULL DEFAULT 0,
	 ispass TINYINT NOT NULL DEFAULT 0,
	 PRIMARY KEY ( id )
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

let songs_collect = 
	`create table if not exists songs_collect(
	 id INT NOT NULL AUTO_INCREMENT,
	 songId INT NOT NULL,
	 userId INT NOT NULL,
	 isCollect TINYINT NOT NULL DEFAULT 0,
	 collectTime TIMESTAMP,
	 PRIMARY KEY ( id )
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

let songs_praise = 
	`create table if not exists songs_praise(
	 id INT NOT NULL AUTO_INCREMENT,
	 songId INT NOT NULL,
	 userId INT NOT NULL,
	 isPraise TINYINT NOT NULL DEFAULT 0,
   praiseTime TIMESTAMP,
   praiseNum INT NOT NULL DEFAULT 0,
	 PRIMARY KEY ( id )
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

let songs_tag =
	`create table if not exists songs_tag(
	 id INT NOT NULL AUTO_INCREMENT,
	 tag_name VARCHAR(20),
	 cover VARCHAR(100),
	 PRIMARY KEY ( id )
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

let pass_songs =
  `create table if not exists pass_songs(
	 id INT NOT NULL AUTO_INCREMENT,
	 name VARCHAR(200) NOT NULL,
	 author VARCHAR(400),
	 avator VARCHAR(100),
	 stage VARCHAR(60),
	 share_id INT NOT NULL,
	 share_time TIMESTAMP,
	 song_url  VARCHAR(800) NOT NULL,
   qiniu_url VARCHAR(800),
   cover VARCHAR(400),
	 lyric_url VARCHAR(800),
	 description VARCHAR(200),
	 tag TINYINT NOT NULL DEFAULT 0,
   praise_num INT NOT NULL DEFAULT 0,
   comment_num INT NOT NULL DEFAULT 0,
   collect_num INT NOT NULL DEFAULT 0,
   listen_num INT NOT NULL DEFAULT 0,
   search_num INT NOT NULL DEFAULT 0,
   weight FLOAT(11) NOT NULL DEFAULT 0,
	 PRIMARY KEY ( id )
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

 module.exports = {
 	admin,
 	users,
 	users_attention,
 	songs,
  songs_collect,
  songs_praise,
  songs_tag,
  pass_songs
 }