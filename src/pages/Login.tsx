import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLayout, { AuthCard, AuthFooter } from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate("/dashboard", { replace: true });
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else navigate("/dashboard", { replace: true });
  };

  return (
    <AuthLayout>
      <AuthCard>
        <h1 className="text-3xl font-bold text-center">
          Welcome back to <span className="text-primary">SPOT</span>
        </h1>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Proteksi barangmu dengan deteksi pergerakan cepat dan pelacakan akurat
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Mail className="h-4 w-4" /> Email
            </Label>
            <Input
              type="email"
              placeholder="Masukkan Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-full border-primary/60 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Lock className="h-4 w-4" /> Password
            </Label>
            <Input
              type="password"
              placeholder="Masukkan Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-full border-primary/60 h-11"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-full text-base font-semibold">
            {loading ? "Memproses..." : "Log in"}
          </Button>
        </form>

        <AuthFooter text="Belum memiliki akun?" linkText="Sign Up" to="/register" />
      </AuthCard>
    </AuthLayout>
  );
}
