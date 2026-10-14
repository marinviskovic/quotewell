import { Link } from "react-router-dom";
import { Wordmark } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper px-4 text-center">
      <Wordmark />
      <h1 className="text-xl font-semibold">This page doesn't exist.</h1>
      <Link to="/" className="text-sm text-fern underline">Go to the homepage</Link>
    </div>
  );
}
