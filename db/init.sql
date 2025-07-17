-- db/init.sql
-- SQL initialization script for PostgreSQL

CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(80) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO todos (title, completed) VALUES
    ('First todo', false),
    ('Second todo', true)
ON CONFLICT DO NOTHING; 