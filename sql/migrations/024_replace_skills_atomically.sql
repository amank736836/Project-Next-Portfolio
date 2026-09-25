-- Migration 024: Replace the complete skills list in one transaction.

CREATE OR REPLACE FUNCTION replace_skills(new_skills JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF jsonb_typeof(new_skills) <> 'array' THEN
        RAISE EXCEPTION 'new_skills must be a JSON array';
    END IF;

    DELETE FROM skills;

    INSERT INTO skills (id, title, percentage, category, is_featured, icon, color, is_hidden)
    SELECT id, title, percentage, category, is_featured, icon, color, is_hidden
    FROM jsonb_to_recordset(new_skills) AS skill(
        id BIGINT,
        title TEXT,
        percentage INTEGER,
        category TEXT,
        is_featured BOOLEAN,
        icon TEXT,
        color TEXT,
        is_hidden BOOLEAN
    )
    WHERE id IS NOT NULL;

    INSERT INTO skills (title, percentage, category, is_featured, icon, color, is_hidden)
    SELECT title, percentage, category, is_featured, icon, color, is_hidden
    FROM jsonb_to_recordset(new_skills) AS skill(
        id BIGINT,
        title TEXT,
        percentage INTEGER,
        category TEXT,
        is_featured BOOLEAN,
        icon TEXT,
        color TEXT,
        is_hidden BOOLEAN
    )
    WHERE id IS NULL;
END;
$$;

REVOKE ALL ON FUNCTION replace_skills(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION replace_skills(JSONB) TO service_role;
