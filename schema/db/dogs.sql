drop table public.dogs;

CREATE TABLE public.dogs (
  id serial4 NOT NULL,
  name varchar(32) NOT NULL,
  breed_id int4 NOT NULL,
  description text NULL,
  location varchar(64) NULL,
  dob date NULL,
  datecreated timestamp NOT NULL DEFAULT now(),
  datemodified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  imageurl varchar(2048) NULL,
  published bool NULL,
  authorid int4 NULL,
  original_filename varchar(64) NULL,
  new_filename varchar(64) NULL,
  CONSTRAINT dogs_pkey PRIMARY KEY (id),
  CONSTRAINT fk_breed
  FOREIGN KEY(breed_id) 
    REFERENCES breeds(id)
);


INSERT INTO dogs (name, breed_id, description) VALUES
('Money', 1, 'Description for Money'),
('Nana', 2, 'Nana is 3 years old'),
('Octopus', 3, 'A dog, not an octopus'),
('Peppa', 3, 'PIG!!!!!'),
('Queen', 4, 'Your majesty'),
('Rocky', 1, 'Tough as a rock');