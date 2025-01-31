ALTER TABLE users ADD COLUMN email text UNIQUE;

CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (user_id, secret_message, email)
    VALUES (NEW.id, NULL, NEW.email);  -- Set default values as needed
    RETURN NEW;
END;
$$
 LANGUAGE plpgsql SECURITY DEFINER;



