"use client"
import SecretMessage, { UserData } from "@/components/secret-message";
import { Suspense,  useState } from "react";
import Loading from "../../loading";
import UserList from "@/components/user-list";

interface SecretMessageAndUserListProps {
  currentUser: UserData;
  users: Promise<UserData[]>;
}

export default function SecretMessageAndUserList({ currentUser, users }: SecretMessageAndUserListProps) {
    const [readonly, setReadonly] = useState(false);
    const [secretMessage, setSecretMessage] = useState(currentUser.secret_message);
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-row space-x-4 justify-between">
        <div></div>
        <div className="min-h-screen flex items-center justify-center">
          <Suspense fallback={<Loading />}>
            <SecretMessage currentUser={currentUser} secretMessage={secretMessage} readonly={readonly} />
          </Suspense>
        </div>

        <div className="min-h-screen flex items-center justify-center">
          <Suspense fallback={<Loading />}>
            <UserList currentUserData={currentUser} users={users} setSecretMesage={setSecretMessage} setReadonly={setReadonly} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}