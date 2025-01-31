"use client";
import { useState } from "react";
import { type User } from "@supabase/supabase-js";
import { SubmitButton } from "./submit-button";
import { deleteUserAccountAction, signOutAction } from "@/app/actions";

export default function AccountDropdown({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div>
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-white text-sm font-medium hover:text-black  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        >
          Account
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06 0L10 10.293l3.71-3.08a.75.75 0 111.02 1.1l-4.25 3.5a.75.75 0 01-.92 0l-4.25-3.5a.75.75 0 010-1.1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute text-black p-4 right-10 z-10 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="text-sm p-2 .">{user.email}</div>
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <form>
              <SubmitButton
                className="w-full hover:bg-gray-100 text-sm p-2"
                formAction={signOutAction}
                pendingText="Signing out..."
              >
                Sign out
              </SubmitButton>
            </form>
            <form>
              <SubmitButton
                className="w-full text-red-600 hover:bg-red-100 text-sm p-2"
                formAction={() => deleteUserAccountAction(user.id)}
                pendingText="Deleting..."
              >
                Delete Account
              </SubmitButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
