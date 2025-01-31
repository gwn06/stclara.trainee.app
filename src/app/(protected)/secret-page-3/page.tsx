import { getUserBy, getUsers } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SecretMessageAndUserList from "./comonents/secret-message-and-user-list";

export default async function SecretPage3() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  }

  const currentUser = await getUserBy(data.user.id);
  const users = getUsers();
  return (
    <div className="h-screen flex items-center justify-center">
      <SecretMessageAndUserList currentUser={currentUser} users={users} /> 
    </div>
  );
}
