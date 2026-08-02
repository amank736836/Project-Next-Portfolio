-- Migration 017: Remove incorrect achievements data
UPDATE education SET achievements = NULL WHERE id IN (1, 2, 3);