import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";
import SecretMessage from "@/components/secret-message";
import { cookies } from 'next/headers';
import { getCachedUser } from "@/utils/supabase/cachedActions";


export default async function SecretPage1() {
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
        <SecretMessage
          currentUser={user}
          secretMessage={user.secret_message}
          readonly={true}
        />
      </Suspense>
    </div>
  );
}
