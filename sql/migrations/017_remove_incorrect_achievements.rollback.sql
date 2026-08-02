-- Rollback for 017_remove_incorrect_achievements
-- Re-add the achievements (for rollback only)
UPDATE education SET achievements = 'Dean''s List (4 semesters), Best Final Year Project Award, Hackathon Winner (3x)' WHERE id = 1;
UPDATE education SET achievements = 'School Topper in Computer Science, Science Exhibition Winner' WHERE id = 2;
UPDATE education SET achievements = 'Merit Certificate in Mathematics, Sports Captain' WHERE id = 3;