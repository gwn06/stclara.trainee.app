CREATE OR REPLACE FUNCTION public.create_friendship()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into friendships when a friend request is accepted
    INSERT INTO public.friendships (user_id, friend_id)
    VALUES (NEW.requester_id, NEW.recipient_id);
    
    RETURN NEW;
END;
$$
 LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER friend_request_accepted_trigger
AFTER UPDATE OF status ON friend_requests
FOR EACH ROW
WHEN (NEW.status = 'accepted')
EXECUTE FUNCTION public.create_friendship();