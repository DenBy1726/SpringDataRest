drop TABLE concretepage;
CREATE DATABASE concretepage;
CREATE TABLE IF NOT EXISTS articles (
  article_id serial NOT NULL PRIMARY KEY,
  title varchar(200) NOT NULL,
  category varchar(100) NOT NULL
);
-- Dumping data for table concretepage.articles: ~3 rows (approximately)
INSERT INTO articles (article_id, title, category) VALUES
	(1, 'Java Concurrency', 'Java'),
	(2, 'Hibernate HQL ', 'Hibernate'),
	(3, 'Spring MVC with Hibernate', 'Spring');