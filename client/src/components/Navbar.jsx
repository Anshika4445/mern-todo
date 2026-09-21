import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header>
      <Link className="brand" to="/">
        TaskFlow
      </Link>
      <div>
        {user && (
          <>
            <span className="welcome">Hi, {user.name}</span>
            <button className="ghost" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
