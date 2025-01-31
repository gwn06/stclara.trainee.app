import SecretMessage from "@/components/secret-message";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";
import { getCachedUser } from "@/utils/supabase/cachedActions";
import { cookies } from "next/headers";

export default async function SecretPage2() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  }


  const user = await getCachedUser(data.user.id, cookieStore);
  return (
    <div className="h-screen flex items-center justify-center">
      <Suspense fallback={<Loading />}>
        <SecretMessage currentUser={user} secretMessage={user.secret_message} readonly={false} />
      </Suspense>
    </div>
  );
}
