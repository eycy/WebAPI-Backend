CREATE TABLE public.breeds (
  id serial4 NOT NULL,
  name varchar(32) NOT NULL,
  CONSTRAINT breed_pkey PRIMARY KEY (id)
);

INSERT INTO breeds (name) VALUES
('akita'),
('bouvier'),
('dachshund'),
('germanshepherd'),
('otterhound'),
('terrier');