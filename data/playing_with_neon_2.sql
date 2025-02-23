CREATE TABLE playing_with_neon_2 (
  id SERIAL PRIMARY KEY,
  value_int INT,
  value_bool BOOLEAN,
  value_text TEXT
);

INSERT INTO playing_with_neon_2 VALUES (1, 3, true, 'lorem sit amet leo');
INSERT INTO playing_with_neon_2 VALUES (2, -2, false, 'non lobortis a enim');
INSERT INTO playing_with_neon_2 VALUES (3, 5, NULL, 'erat libero tristique tellus');
INSERT INTO playing_with_neon_2 VALUES (4, NULL, true, NULL);
INSERT INTO playing_with_neon_2 VALUES (5, 7, NULL, 'esse quam nihil molestiae');
INSERT INTO playing_with_neon_2 VALUES (6, NULL, false, 'sed quia non numquam');
INSERT INTO playing_with_neon_2 VALUES (7, 5655, true, NULL);
INSERT INTO playing_with_neon_2 VALUES (8, -789, false, 'dui sem fermentum vitae');
INSERT INTO playing_with_neon_2 VALUES (9, NULL, NULL, 'sunt in culpa qui');
INSERT INTO playing_with_neon_2 VALUES (10, NULL, NULL, NULL);
