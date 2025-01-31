"use client";
import SecretMessage, { UserData } from "@/components/secret-message";
import { Suspense, useState } from "react";
import Loading from "../../loading";
import UserList from "@/components/user-list";

interface SecretMessageAndUserListProps {
  currentUser: UserData;
  users: Promise<UserData[]>;
}

export default function SecretMessageAndUserList({
  currentUser,
  users,
}: SecretMessageAndUserListProps) {
  const [readonly, setReadonly] = useState(false);
  const [secretMessage, setSecretMessage] = useState(
    currentUser.secret_message
  );
  return (
    <div className="">
      <div className="flex flex-col md:flex-row  justify-center space-x-4 mt-8">
        <div className="flex mb-8"></div>
        <div className="flex h-min justify-center mb-8 ">
          <Suspense fallback={<Loading />}>
            <SecretMessage
              currentUser={currentUser}
              secretMessage={secretMessage}
              readonly={readonly}
            />
          </Suspense>
        </div>

        <div className="flex justify-center min-h-[400px] mb-8">
          <Suspense fallback={<Loading />}>
            <UserList
              currentUserData={currentUser}
              users={users}
              setSecretMesage={setSecretMessage}
              setReadonly={setReadonly}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
