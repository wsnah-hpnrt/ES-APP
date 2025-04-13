import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "@/components/login/LogoutButton";

export default async function Navigation() {
  const cookieStore = await cookies();
  const id = cookieStore.get("id")?.value;
  const isLoggedIn = !!id; // user_id가 존재하면 true, 없으면 false
  return (
    <nav>
      <ul>
        <li>
          <Link href="/dashboard">DashBoard</Link>
        </li>
        <li>
          <Link href="/rawdata">RawData</Link>
        </li>
        <li className="ml-auto">
          {isLoggedIn ? <LogoutButton /> : <Link href="/login">Login</Link>}
        </li>
      </ul>
    </nav>
  );
}
