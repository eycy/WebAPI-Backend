CREATE TABLE public.users (
  id serial4 NOT NULL,
  firstname varchar(32) NULL,
  lastname varchar(32) NULL,
  username varchar(128)) NOT NULL,
  about text NULL,
  dateregistered timestamp NOT NULL DEFAULT now(),
  "password" varchar(32) NULL,
  passwordsalt varchar(16) NULL,
  email varchar(64) NOT NULL,
  avatarurl varchar(64) NULL,
  isStaff boolean DEFAULT false NOT NULL,
  signUpCode varchar(16) NULL,
  access_token VARCHAR(255) NULL,
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username),
  CONSTRAINT users_sign_up_code_key UNIQUE (signUpCode)
);


INSERT INTO users (firstname, lastname, username, email, password, isStaff) VALUES
('Alice', 'Wong', 'alicew', 'alice@example.com', 'zcbasd', true),
('bob', 'Chan', 'bobc', 'bob@example.com', 'zcbasd', true),
('Colin', 'McDonald' 'colinm', 'colin@example.com', 'zcbasd' false);
('CY', 'Wong', 'cywong', 'david@example.com',')
