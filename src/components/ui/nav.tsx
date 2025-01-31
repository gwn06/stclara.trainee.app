import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import AccountDropdown from "../account-dropdown";

const routes = [
  { id: 1, route: "/secret-page-1", routeName: "Secret page 1" },
  { id: 2, route: "/secret-page-2", routeName: "Secret page 2" },
  { id: 3, route: "/secret-page-3", routeName: "Secret page 3" },
];

export default async function NavBar() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  return (
    <nav className="bg-green-700 text-white shadow-sm px-8 py-3 text-sm">
      <div className="flex justify-between items-center">
        <Link href="/"> Home </Link>

        <ul className="flex flex-col md:flex-row space-x-4 text-sm">
          {routes.map((link) => (
            <li key={link.id} className="hover:text-gray-200">
              <Link href={link.route}>{link.routeName}</Link>
            </li>
          ))}
        </ul>
        {!data?.user && (
          <Link
            className="p-2 px-4 hover:bg-white rounded-lg hover:text-black"
            href="/sign-in"
          >
            Sign in
          </Link>
        )}
        {!error && (
          <div className="flex flex-row items-center space-x-4">
            <AccountDropdown user={data.user} />
          </div>
        )}
      </div>
    </nav>
  );
}
