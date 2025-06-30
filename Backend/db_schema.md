Database changed
MariaDB [simutrade]> show tables;
+---------------------+
| Tables_in_simutrade |
+---------------------+
| community_purchase  |
| community_shop      |
| portfolio           |
| stock_cache         |
| transactions        |
| users               |
+---------------------+
6 rows in set (0.000 sec)

MariaDB [simutrade]> SHOW FULL TABLES FROM simutrade;
+---------------------+------------+
| Tables_in_simutrade | Table_type |
+---------------------+------------+
| community_purchase  | BASE TABLE |
| community_shop      | BASE TABLE |
| portfolio           | BASE TABLE |
| stock_cache         | BASE TABLE |
| transactions        | BASE TABLE |
| users               | BASE TABLE |
+---------------------+------------+
6 rows in set (0.000 sec)

MariaDB [simutrade]> DESCRIBE community_purchase;
+-----------+----------+------+-----+---------+----------------+
| Field     | Type     | Null | Key | Default | Extra          |
+-----------+----------+------+-----+---------+----------------+
| id        | int(11)  | NO   | PRI | NULL    | auto_increment |
| user_id   | int(11)  | NO   | MUL | NULL    |                |
| item_id   | int(11)  | NO   | MUL | NULL    |                |
| timestamp | datetime | YES  |     | NULL    |                |
+-----------+----------+------+-----+---------+----------------+
4 rows in set (0.001 sec)

MariaDB [simutrade]> DESCRIBE community_shop;
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int(11)      | NO   | PRI | NULL    | auto_increment |
| name        | varchar(100) | NO   |     | NULL    |                |
| description | mediumtext   | NO   |     | NULL    |                |
| cost        | float        | NO   |     | NULL    |                |
| score_value | int(11)      | NO   |     | NULL    |                |
| emoji       | varchar(10)  | YES  |     | NULL    |                |
| available   | tinyint(1)   | YES  |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
7 rows in set (0.001 sec)

MariaDB [simutrade]> DESCRIBE portfolio;
+------------+-------------+------+-----+---------+----------------+
| Field      | Type        | Null | Key | Default | Extra          |
+------------+-------------+------+-----+---------+----------------+
| id         | int(11)     | NO   | PRI | NULL    | auto_increment |
| user_id    | int(11)     | NO   | MUL | NULL    |                |
| symbol     | varchar(10) | NO   |     | NULL    |                |
| shares     | float       | NO   |     | NULL    |                |
| avg_price  | float       | NO   |     | NULL    |                |
| updated_at | datetime    | YES  |     | NULL    |                |
+------------+-------------+------+-----+---------+----------------+
6 rows in set (0.000 sec)

MariaDB [simutrade]> DESCRIBE stock_cache;
+--------------+-------------+------+-----+---------+----------------+
| Field        | Type        | Null | Key | Default | Extra          |
+--------------+-------------+------+-----+---------+----------------+
| id           | int(11)     | NO   | PRI | NULL    | auto_increment |
| symbol       | varchar(10) | NO   | UNI | NULL    |                |
| price        | float       | NO   |     | NULL    |                |
| last_updated | datetime    | YES  |     | NULL    |                |
+--------------+-------------+------+-----+---------+----------------+
4 rows in set (0.000 sec)

MariaDB [simutrade]> DESCRIBE transactions;
+-----------+-------------+------+-----+---------+----------------+
| Field     | Type        | Null | Key | Default | Extra          |
+-----------+-------------+------+-----+---------+----------------+
| id        | int(11)     | NO   | PRI | NULL    | auto_increment |
| user_id   | int(11)     | NO   | MUL | NULL    |                |
| symbol    | varchar(10) | NO   |     | NULL    |                |
| shares    | float       | NO   |     | NULL    |                |
| price     | float       | NO   |     | NULL    |                |
| type      | varchar(4)  | NO   |     | NULL    |                |
| timestamp | datetime    | YES  |     | NULL    |                |
+-----------+-------------+------+-----+---------+----------------+
7 rows in set (0.001 sec)

MariaDB [simutrade]> DESCRIBE users;
+-----------------+--------------+------+-----+---------+----------------+
| Field           | Type         | Null | Key | Default | Extra          |
+-----------------+--------------+------+-----+---------+----------------+
| id              | int(11)      | NO   | PRI | NULL    | auto_increment |
| username        | varchar(50)  | NO   | UNI | NULL    |                |
| email           | varchar(100) | NO   | UNI | NULL    |                |
| password_hash   | varchar(256) | YES  |     | NULL    |                |
| balance         | float        | YES  |     | NULL    |                |
| created_at      | datetime     | YES  |     | NULL    |                |
| community_score | int(11)      | YES  |     | 0       |                |
+-----------------+--------------+------+-----+---------+----------------+
7 rows in set (0.001 sec)


CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    name VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


## Table: `learning_articles`

| Column        | Type           | Description                         |
|---------------|----------------|-------------------------------------|
| `id`          | INTEGER (PK)   | Unique article ID                   |
| `title`       | VARCHAR(255)   | Title of the article                |
| `summary`     | TEXT           | Short summary or excerpt            |
| `content`     | MEDIUMTEXT     | Full article content (optional)     |
| `source_url`  | VARCHAR(500)   | Original URL (optional)             |
| `created_at`  | TIMESTAMP      | Time article was added              |
