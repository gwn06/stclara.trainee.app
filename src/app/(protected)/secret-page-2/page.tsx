import SecretMessage from "@/components/secret-message";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";
import { getUserBy } from "@/app/actions";

export default async function SecretPage2() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  }

  const user = await getUserBy(data.user.id);
  return (
    <div className="h-screen flex items-center justify-center">
      <Suspense fallback={<Loading />}>
        <SecretMessage currentUser={user} secretMessage={user.secret_message} readonly={false} />
      </Suspense>
    </div>
  );
}
