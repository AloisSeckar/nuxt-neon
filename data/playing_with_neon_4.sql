CREATE SCHEMA neon2;

CREATE TABLE neon2.playing_with_neon (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  value REAL
);

INSERT INTO neon2.playing_with_neon VALUES (1, 'neon2-1', 0.14571515);
INSERT INTO neon2.playing_with_neon VALUES (2, 'neon2-2', 0.55776522);
INSERT INTO neon2.playing_with_neon VALUES (3, 'neon2-3', 0.74727505);
INSERT INTO neon2.playing_with_neon VALUES (4, 'neon2-4', 0.11442527);
INSERT INTO neon2.playing_with_neon VALUES (5, 'neon2-5', 0.37553883);
