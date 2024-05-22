drop table public.users_adoption;

CREATE TABLE public.users_adoption (
  id serial4 NOT NULL,
  userid int NOT NULL,
  dogid int NOT NULL,
  user_message varchar(128),
  staff_message varchar(128),
  datecreated timestamp NOT NULL DEFAULT now(),
  status varchar(16) NOT NULL DEFAULT 'Pending',
  CONSTRAINT unique_user_dog UNIQUE (userid, dogid)
);

