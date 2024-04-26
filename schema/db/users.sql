CREATE TABLE public.users (
  id serial4 NOT NULL,
  firstname varchar(32) NULL,
  lastname varchar(32) NULL,
  username varchar(16) NOT NULL,
  about text NULL,
  dateregistered timestamp NOT NULL DEFAULT now(),
  "password" varchar(32) NULL,
  passwordsalt varchar(16) NULL,
  email varchar(64) NOT NULL,
  avatarurl varchar(64) NULL,
  isStaff boolean DEFAULT false NOT NULL,
  signUpCode varchar(16) NULL,
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username),
  CONSTRAINT users_sign_up_code_key UNIQUE (signUpCode)
);


INSERT INTO users (username, email, isStaff) VALUES
('alice', 'alice@example.com', true),
('bob', 'bob@example.com', true),
('colin', 'colin@example.com', false);
