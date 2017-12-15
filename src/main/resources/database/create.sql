-- auto-generated definition
CREATE TABLE articles
(
  article_id SERIAL       NOT NULL
    CONSTRAINT articles_pkey
    PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  category   VARCHAR(100) NOT NULL
);


-- auto-generated definition
CREATE TABLE role
(
  id   SERIAL      NOT NULL
    CONSTRAINT role_pkey
    PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);


-- auto-generated definition
CREATE TABLE users
(
  id          SERIAL                  NOT NULL
    CONSTRAINT users_pkey
    PRIMARY KEY,
  name        VARCHAR(20)             NOT NULL,
  last_name   VARCHAR(20)             NOT NULL,
  birthday    DATE                    NOT NULL,
  register_on TIMESTAMP DEFAULT now() NOT NULL
);
COMMENT ON TABLE users IS 'user table';


-- auto-generated definition
CREATE TABLE user_credential
(
  user_id  INTEGER     NOT NULL
    CONSTRAINT user_credential_user_id_pk
    PRIMARY KEY
    CONSTRAINT user_credential_users_id_fk
    REFERENCES users
    ON UPDATE CASCADE ON DELETE CASCADE,
  login    VARCHAR(20) NOT NULL,
  password VARCHAR(20) NOT NULL
);


-- auto-generated definition
CREATE TABLE role_users
(
  role INTEGER DEFAULT 0 NOT NULL
    CONSTRAINT role_users_role_id_fk
    REFERENCES role,
  id   INTEGER           NOT NULL
    CONSTRAINT role_users_users_id_fk
    REFERENCES users
    ON UPDATE CASCADE ON DELETE CASCADE
);

create table persistent_logins (
  username VARCHAR(64) NOT NULL ,
  series VARCHAR(64) NOT NULL PRIMARY KEY,
  token VARCHAR(64) NOT NULL ,
  last_used TIMESTAMP NOT NULL
);