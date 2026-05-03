import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { User, Lock, Mail, KeyRound } from "lucide-react";
import AuthLayout, { AuthCard, AuthFooter } from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z
  .object({
    username: z.string().trim().min(2).max(40),
    email: z.string().trim().email().max(255),
    password: z.string().min(6).max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Password tidak sama", path: ["confirm"] });

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    
    // 1. Buat akun di sistem Autentikasi
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: form.username }, // Disimpan di metadata
      },
    });

    if (authError) {
      setLoading(false);
      return toast.error(authError.message);
    }

    // 2. Lakukan INSERSI MANUAL ke tabel profiles
    if (authData.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: authData.user.id,
          full_name: form.username,
          email: form.email,
        });

      if (profileError) {
        console.error("Gagal menyimpan profil:", profileError);
        // Kita tidak perlu memblokir user jika ini gagal, karena akun auth sudah terbuat
      }
    }

    setLoading(false);
    toast.success("Akun berhasil dibuat");
    navigate("/dashboard", { replace: true });
  };

  const fields = [
    { key: "username", label: "Username", icon: User, type: "text", placeholder: "Masukkan Username..." },
    { key: "email", label: "Email", icon: Mail, type: "email", placeholder: "Masukkan Email..." },
    { key: "password", label: "Password", icon: Lock, type: "password", placeholder: "Masukkan Password..." },
    { key: "confirm", label: "Konfirmasi Password", icon: KeyRound, type: "password", placeholder: "Masukkan Ulang Password..." },
  ] as const;

  return (
    <AuthLayout>
      <AuthCard>
        <h1 className="text-3xl font-bold text-center">
          Buat Akun <span className="text-primary">SPOT</span>-mu
        </h1>
        <p className="text-center text-sm text-muted-foreground mt-1">dan jadilah bagian dari SPOT!</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {fields.map((f) => (
            <div key={f.key} className="space-y-2">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <f.icon className="h-4 w-4" /> {f.label}
              </Label>
              <Input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                required
                className="rounded-full border-primary/60 h-11"
              />
            </div>
          ))}

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-full text-base font-semibold">
            {loading ? "Memproses..." : "Sign up"}
          </Button>
        </form>

        <AuthFooter text="Sudah memiliki akun?" linkText="Log in" to="/login" />
      </AuthCard>
    </AuthLayout>
  );
}
