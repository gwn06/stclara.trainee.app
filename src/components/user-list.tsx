"use client";
import { use, useEffect, useState } from "react";
import { UserData } from "./secret-message";
import {
  acceptFriendRequest,
  addFriend,
  getFriendRequests,
  getSecretMessage,
  getUserBy,
  viewFriendSecretMessage,
} from "@/app/actions";

interface UserListProps {
  users: Promise<UserData[]>;
  currentUserData: UserData;
  setSecretMesage: (message: string | null) => void;
  setReadonly: (readonly: boolean) => void;
}

interface FriendRequest {
  id: number;
  requester_id: string;
  recipient_id: string;
  status: string;
}

interface UserDataWithFriendRequest extends UserData {
  friend_request: FriendRequest | null;
}

export default function UserList({
  currentUserData,
  users,
  setSecretMesage,
  setReadonly,
}: UserListProps) {
  const listOfUsers = use(users);

  const [
    listOfUsersWithCurrentUserFriendRequests,
    setListOfUsersWithCurrentUserFriendRequests,
  ] = useState<UserDataWithFriendRequest[]>([]);

  useEffect(() => {
    async function fetchCurrentUserFriendRequests() {
      const data = await getFriendRequests(currentUserData.user_id);
      if (data) {
        const usersWithFriendRequests = listOfUsers.map((userData) => ({
          ...userData,
          friend_request:
            data.find(
              (request) =>
                request.recipient_id === userData.user_id ||
                request.requester_id === userData.user_id
            ) ?? null,
        }));
        setListOfUsersWithCurrentUserFriendRequests(usersWithFriendRequests);
      }
    }

    fetchCurrentUserFriendRequests();
  }, []);

  const handleUserView = async (user: UserData) => {
    setReadonly(true);
    setSecretMesage("loading...");
    const userData = await getUserBy(user.user_id);

    if (userData === null) return;
    const result = await viewFriendSecretMessage(
      currentUserData.user_id,
      user.user_id
    );
    if (!result) {
      openDialog(`You are not friends with user ${user.email}`);
      setSecretMesage("");
      return;
    }

    const data = await getSecretMessage(user.id);
    setSecretMesage(data?.secret_message);
  };

  const updateListofUsers = (
    userData: UserData,
    friend_request: FriendRequest
  ) => {
    const updatedUsers = listOfUsersWithCurrentUserFriendRequests.map((user) =>
      (user.user_id === friend_request.recipient_id ||
        user.user_id === friend_request.requester_id) &&
      user.id !== currentUserData.id
        ? { ...userData, friend_request }
        : user
    );
    setListOfUsersWithCurrentUserFriendRequests(() => updatedUsers);
  };

  const handleUserFriendRequests = async (
    userData: UserDataWithFriendRequest
  ) => {
    const status = displayFriendRequestStatus(userData);
    if (status === "Accept") {
      if (userData.friend_request === null) return;
      const data = await acceptFriendRequest(userData.friend_request.id);
      if (data) {
        updateListofUsers(userData, data);
      }
    } else if (status === "Add") {
      const data = await addFriend(currentUserData.user_id, userData.user_id);
      if (data) {
        updateListofUsers(userData, data);
      }
    } else if (status === "Pending") {
      // await cancelFriendRequest(userData.friend_request.id);
    }
  };

  const displayFriendRequestStatus = (userData: UserDataWithFriendRequest) => {
    if (userData.friend_request) {
      if (userData.friend_request.status === "accepted") return "Friends";
      return userData.friend_request.recipient_id === currentUserData.user_id
        ? "Accept"
        : "Pending";
    }
    return "Add";
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const openDialog = (message: string) => {
    setDialogMessage(message);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogMessage("");
  };

  return (
    <div className="text-center overflow-auto rounded-lg border shadow-md p-2">
      {isDialogOpen && (
        <div className="fixed inset-0 rounded-lg flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="font-bold text-2xl pb-4">401 Unauthorized</p>
            <p>{dialogMessage}</p>
            <button
              onClick={closeDialog}
              className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-medium">User list</h1>
      <ul className="text-left">
        <li
          className="border-b-2 border-black p-4 mb-4 m-2 flex items-center"
          key={currentUserData.id}
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.21.714 5.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z"
            />
          </svg>
          <span className="mx-2 ">{currentUserData.email}</span>

          <button
            onClick={() => {
              setSecretMesage(currentUserData.secret_message);
              setReadonly(false);
            }}
            className="ml-auto bg-blue-500 text-white px-3 py-1 rounded"
          >
            View
          </button>
        </li>
        {listOfUsersWithCurrentUserFriendRequests
          .filter((userData) => userData.id !== currentUserData.id)
          .map((userData) => (
            <li
              className="border p-2 rounded-md m-2 flex items-center"
              key={userData.id}
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.21.714 5.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z"
                />
              </svg>
              <span className="text-sm mx-2">{userData.email}</span>

              <button
                onClick={() => handleUserView(userData)}
                className="ml-auto bg-blue-500 text-white px-3 py-1 rounded"
              >
                View
              </button>
              <button
                onClick={() => handleUserFriendRequests(userData)}
                className="ml-4 bg-black text-white px-3 py-1 rounded"
              >
                {displayFriendRequestStatus(userData)}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
