import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: hook up auth
          navigate("/");
        }}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">
            <Sparkles size={16} />
          </div>
          <span className="text-lg font-bold">QuoteWell</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Email" />
        <input className="w-full rounded-md border px-3 py-2 text-sm" type="password" placeholder="Password" />
        <button className="w-full rounded-md bg-violet-600 py-2 text-sm font-medium text-white">Sign in</button>
      </form>
    </div>
  );
}
