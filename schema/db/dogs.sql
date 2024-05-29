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