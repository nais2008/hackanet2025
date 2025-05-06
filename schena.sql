-- Таблица пользователей
CREATE TABLE user_user (
                           id SERIAL PRIMARY KEY,
                           name TEXT,
                           image TEXT,
                           password VARCHAR,
                           username VARCHAR,
                           email VARCHAR,
                           role VARCHAR,
                           date_join TIMESTAMP,
                           last_login TIMESTAMP,
                           attempts_count INTEGER,
                           block_date TIMESTAMP
);

-- Таблица проектов
CREATE TABLE project_project (
                                 id SERIAL PRIMARY KEY,
                                 title TEXT,
                                 user_id INTEGER REFERENCES user_user(id)
);

-- Комментарии к проектам
CREATE TABLE project_comments (
                                  id SERIAL PRIMARY KEY,
                                  user_id INTEGER REFERENCES user_user(id),
                                  project_id INTEGER REFERENCES project_project(id),
                                  message TEXT,
                                  create_at TIMESTAMP
);

-- Файлы к проектам
CREATE TABLE project_files (
                               id SERIAL PRIMARY KEY,
                               project_id INTEGER REFERENCES project_project(id),
                               file TEXT
);

-- Изображения проектов
CREATE TABLE project_images (
                                id SERIAL PRIMARY KEY,
                                project_id INTEGER REFERENCES project_project(id),
                                image TEXT
);

-- Таблица задач
CREATE TABLE task_task (
                           id SERIAL PRIMARY KEY,
                           project_id INTEGER REFERENCES project_project(id),
                           title VARCHAR(150),
                           description VARCHAR(200),
                           full_description TEXT,
                           deadline TIMESTAMP,
                           status INTEGER,
                           priority INTEGER,
                           responsible_user_id INTEGER REFERENCES user_user(id)
);

-- Файлы задач
CREATE TABLE task_files (
                            id SERIAL PRIMARY KEY,
                            task_id INTEGER REFERENCES task_task(id),
                            file TEXT
);

-- Изображения задач
CREATE TABLE task_images (
                             id SERIAL PRIMARY KEY,
                             task_id INTEGER REFERENCES task_task(id),
                             image TEXT
);

-- Этапы задач
CREATE TABLE task_stages (
                             id SERIAL PRIMARY KEY,
                             task_id INTEGER REFERENCES task_task(id),
                             stage TEXT
);

-- Комментарии к задачам
CREATE TABLE task_comments (
                               id SERIAL PRIMARY KEY,
                               user_id INTEGER REFERENCES user_user(id),
                               task_id INTEGER REFERENCES task_task(id),
                               message TEXT,
                               create_at TIMESTAMP
);

-- Теги задач
CREATE TABLE task_tag (
                          id SERIAL PRIMARY KEY,
                          name TEXT,
                          norm_text TEXT
);

-- Промежуточная таблица: теги задач
CREATE TABLE task_task_tags (
                                id SERIAL PRIMARY KEY,
                                task_id INTEGER REFERENCES task_task(id),
                                tag_id INTEGER REFERENCES task_tag(id)
);
