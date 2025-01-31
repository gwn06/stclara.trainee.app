CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (user_id, secret_message)
    VALUES (NEW.id, NULL);  -- Set default values as needed
    RETURN NEW;
END;
$$
 LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();
