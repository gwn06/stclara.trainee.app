"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { createServerAdminClient } from "@/utils/supabase/serverAdmin";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export async function deleteUserAccountAction(userId: string) {
  const supabase = await createServerAdminClient();

  // Check if the user is authorized to delete this account
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;

  if (user?.id !== userId) {
    throw new Error("Unauthorized: You cannot delete this user");
  }

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
  await supabase.auth.signOut();
  return redirect("/sign-in");
}

export async function getUserBy(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function getUser(id: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, user_id, email ")
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateSecretMessageAction(
  id: number,
  secret_message: string | null
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .update({ secret_message: secret_message })
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function getSecretMessage(id: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("secret_message")
    .eq("id", id)
    .single();
  return data;
}

export async function addFriend(userId: string, friendId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("friend_requests")
    .insert([{ requester_id: userId, recipient_id: friendId }])
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function getFriendRequests(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("friend_requests")
    .select("*")
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
  if (error) throw error;
  return data;
}

export async function acceptFriendRequest(requestId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("friend_requests")
    .update({ status: "accepted" })
    .eq("id", requestId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function viewFriendSecretMessage(userId: string, friendId: string) {
  const supabase = await createClient();

  const { data: directFriendship, error: directError } = await supabase
    .from("friendships")
    .select("*")
    .eq("user_id", userId)
    .eq("friend_id", friendId)
    .single();

  const { data: reverseFriendship, error: reverseError } = await supabase
    .from("friendships")
    .select("*")
    .eq("user_id", friendId)
    .eq("friend_id", userId)
    .single();

  if (directError && reverseError) {
    console.error("Error fetching friendships:", directError || reverseError);
    return null; 
  }

  const friendshipData = directFriendship || reverseFriendship;
  
  return friendshipData; 
}

