import { ReactNode } from "react";
import { Link } from "react-router-dom";
import pattern from "@/assets/auth-pattern.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-[40%_1fr]">
      <div
        className="hidden md:block bg-cover bg-center"
        style={{ backgroundImage: `url(${pattern})` }}
        aria-hidden
      />
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl border-2 border-primary p-8 bg-card">{children}</div>;
}

export function AuthFooter({ text, linkText, to }: { text: string; linkText: string; to: string }) {
  return (
    <p className="text-center text-sm mt-4">
      {text}{" "}
      <Link to={to} className="text-primary font-semibold underline">
        {linkText}
      </Link>
    </p>
  );
}
