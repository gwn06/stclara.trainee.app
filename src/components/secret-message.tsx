"use client";
import { updateSecretMessageAction } from "@/app/actions";
import {  useEffect, useState } from "react";

interface SecretMessageProps {
  secretMessage: string | null;
  readonly: boolean;
  currentUser: UserData;
}

export interface UserData {
  id: number;
  inserted_at: string;
  secret_message: null | string;
  user_id: string;
  email: string;
}

export default function SecretMessage({ secretMessage, readonly, currentUser }: SecretMessageProps) {

  const [message, setMessage] = useState(secretMessage);
  const [isSecretMessageUpdating, setIsSecretMessageUpdating] = useState(false);

  useEffect(() => {
    setMessage(secretMessage);
  }, [secretMessage]);

  const handleUpdateSecretMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSecretMessageUpdating(true);
    await updateSecretMessageAction(currentUser.id, message);
    setIsSecretMessageUpdating(false);
  };

  return (
    <div className="p-4 border shadow-md text-center rounded-lg ">
      <form className="flex flex-col justify-center">
        <h1 className="text-2xl font-medium mb-2">Secret message </h1>
        <div className="my-2 mb-4">
          <input
            name="secretMessage"
            value={message ?? ""}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={message ?? ""}
            className="border border-green-300 rounded p-2 text-center"
            disabled={readonly}
          />
        </div>
        {!readonly && (
            <button
            className={`border p-2 ${isSecretMessageUpdating ? "cursor-not-allowed" : "hover:bg-gray-100"}`}
            disabled={isSecretMessageUpdating}
            onClick={handleUpdateSecretMessage}
            >
            {isSecretMessageUpdating ? "Updating..." : secretMessage ? "Update" : "Add"}
            </button>
        )}
      </form>
    </div>
  );
}
