-- Denormalization
ALTER TABLE project ADD COLUMN last_shapes_data TEXT;
UPDATE project SET last_shapes_data = '[]' WHERE last_shapes_data IS NULL;
ALTER TABLE project MODIFY COLUMN last_shapes_data TEXT NOT NULL;
