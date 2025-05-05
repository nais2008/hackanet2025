CREATE TABLE "user_user" (
  "id" integer PRIMARY KEY,
  "name" text,
  "image" image,
  "password" varchar,
  "username" varchar,
  "email" varchar,
  "role" string,
  "date_join" datetime,
  "last_login" datetime,
  "attempts_count" intager,
  "black_date" datetime
);

CREATE TABLE "project_project" (
  "id" intager PRIMARY KEY,
  "title" string,
  "user_id" intager
);

CREATE TABLE "project_images" (
  "id" intager PRIMARY KEY,
  "project_id" int,
  "image" image
);

CREATE TABLE "project_files" (
  "id" intager PRIMARY KEY,
  "project_id" int,
  "file" file
);

CREATE TABLE "task_task" (
  "id" intager PRIMARY KEY,
  "prject_id" int,
  "title" varchar(150),
  "description" varchat(200),
  "full_description" text,
  "deadline" datetime,
  "status" integer,
  "prioritet" integer,
  "responsible_user_id" intager
);

CREATE TABLE "task_images" (
  "id" intager PRIMARY KEY,
  "task_id" int,
  "image" image
);

CREATE TABLE "task_files" (
  "id" intager PRIMARY KEY,
  "task_id" int,
  "file" file
);

CREATE TABLE "task_task_tags" (
  "id" integer PRIMARY KEY,
  "task_id" intager,
  "tag_id" integer
);

CREATE TABLE "task_tag" (
  "id" intager PRIMARY KEY,
  "name" text,
  "norm_text" text
);

CREATE TABLE "task_stages" (
  "id" intager PRIMARY KEY,
  "task_id" intager,
  "stage" intager
);

CREATE TABLE "task_comments" (
  "id" intager PRIMARY KEY,
  "user_id" integer,
  "message" text,
  "create_at" datetime
);

CREATE TABLE "project_comments" (
  "id" intager PRIMARY KEY,
  "user_id" integer,
  "message" text,
  "create_at" datetime
);

ALTER TABLE "user_user" ADD FOREIGN KEY ("id") REFERENCES "project_project" ("user_id");

ALTER TABLE "project_project" ADD FOREIGN KEY ("id") REFERENCES "project_images" ("project_id");

ALTER TABLE "project_project" ADD FOREIGN KEY ("id") REFERENCES "project_files" ("project_id");

ALTER TABLE "task_task" ADD FOREIGN KEY ("id") REFERENCES "task_images" ("task_id");

ALTER TABLE "task_task" ADD FOREIGN KEY ("id") REFERENCES "task_files" ("id");

ALTER TABLE "task_task" ADD FOREIGN KEY ("id") REFERENCES "task_task_tags" ("task_id");

ALTER TABLE "task_tag" ADD FOREIGN KEY ("id") REFERENCES "task_task_tags" ("tag_id");

ALTER TABLE "project_project" ADD FOREIGN KEY ("id") REFERENCES "project_comments" ("id");

ALTER TABLE "task_task" ADD FOREIGN KEY ("id") REFERENCES "task_comments" ("id");

ALTER TABLE "user_user" ADD FOREIGN KEY ("id") REFERENCES "task_task" ("responsible_user_id");

ALTER TABLE "project_project" ADD FOREIGN KEY ("id") REFERENCES "task_task" ("prject_id");

ALTER TABLE "task_task" ADD FOREIGN KEY ("id") REFERENCES "task_stages" ("task_id");
