import { getUserBy, getUsers } from "@/app/actions";
import { unstable_cache } from "next/cache";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function getCachedUser(
  userId: string,
  cookies: ReadonlyRequestCookies,
) {
  return unstable_cache(
    () => getUserBy(userId, cookies),
    ['user'],
    { tags: ["user"] }
  )();
}

export async function getCachedUsers(cookies: ReadonlyRequestCookies) {
  return unstable_cache(
    () => getUsers(cookies),
    ['users'],
    { tags: ["users"] }
  )();
}