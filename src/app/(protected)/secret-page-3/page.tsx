// import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
import SecretMessageAndUserList from "./comonents/secret-message-and-user-list";
import { getCachedUser, getCachedUsers } from "@/utils/supabase/cachedActions";
import { cookies } from "next/headers";

export default async function SecretPage3() {
  const cookieStore = await cookies();
  // const supabase = await createClient();

  // const { data, error } = await supabase.auth.getUser();
  // if (error || !data?.user) {
  //   redirect("/sign-in");
  // }

  const userId = cookieStore.get("userId")?.value;

  const currentUser = await getCachedUser(userId!, cookieStore);
  // const currentUser = await getUserBy(data.user.id);
  const users = getCachedUsers(cookieStore);

  return (
    <div className="">
      <SecretMessageAndUserList currentUser={currentUser} users={users} /> 
    </div>
  );
}
