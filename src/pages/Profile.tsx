import { useEffect, useRef, useState } from "react";
import { Lock, KeyRound, UserCircle, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.newPassword === d.confirm, { message: "Konfirmasi password tidak cocok", path: ["confirm"] });

export default function Profile() {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); 
  
  const [pwd, setPwd] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Ekstrak kata di depan "@" dari email pengguna
    const defaultNameFromEmail = user.email ? user.email.split("@")[0] : "";

    supabase
      .from("profiles")
      // 1. PERBAIKAN: Panggil juga kolom avatar_url dari database
      .select("full_name, avatar_url") 
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.full_name || defaultNameFromEmail); 
          
          // 2. PERBAIKAN: Masukkan URL foto ke dalam state jika datanya ada
          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url);
          }
        } else {
          setDisplayName(defaultNameFromEmail);
        }
      });
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Maksimal 2MB");
      return;
    }
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    
    // Upload ke storage Supabase tetap berjalan
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) return toast.error(upErr.message);
    
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    
    const { error: dbErr } = await supabase.from("profiles").update({ avatar_url: pub.publicUrl }).eq("id", user.id);
    if (dbErr) return toast.error(dbErr.message);
    
    setAvatarUrl(pub.publicUrl);
    toast.success("Foto profil diperbarui (Hanya di sesi ini)");
  };

  const saveName = async () => {
    if (!user) return;
    const trimmed = nameDraft.trim();
    if (trimmed.length < 2 || trimmed.length > 60) {
      toast.error("Nama 2-60 karakter");
      return;
    }
    
    // PERBAIKAN 3: Update menggunakan kolom full_name
    const { error } = await supabase.from("profiles").update({ full_name: trimmed }).eq("id", user.id);
    
    if (error) return toast.error(error.message);
    setDisplayName(trimmed);
    setEditingName(false);
    toast.success("Nama diperbarui");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = passwordSchema.safeParse(pwd);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!user?.email) return;
    setSavingPwd(true);
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: pwd.oldPassword,
    });
    if (signInErr) {
      setSavingPwd(false);
      return toast.error("Password lama salah");
    }
    const { error } = await supabase.auth.updateUser({ password: pwd.newPassword });
    setSavingPwd(false);
    if (error) return toast.error(error.message);
    toast.success("Password berhasil diperbarui");
    setPwd({ oldPassword: "", newPassword: "", confirm: "" });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-4xl font-bold heading-underline inline-block">Profil Akun</h1>

      <div className="rounded-3xl border-2 border-primary p-8 bg-card max-w-md mx-auto">
        <div className="flex flex-col items-center">
          <div className="relative">
            {avatarUrl ? (
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <UserCircle className="h-32 w-32 text-primary" strokeWidth={1.5} />
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              aria-label="Ubah foto"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>

          <div className="flex items-center gap-2 mt-3">
            {editingName ? (
              <>
                <Input
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className="h-9 rounded-full border-primary/60"
                  autoFocus
                />
                <button onClick={saveName} className="text-primary"><Check className="h-5 w-5" /></button>
                <button onClick={() => setEditingName(false)} className="text-muted-foreground"><X className="h-5 w-5" /></button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{displayName || "—"}</h2>
                <button
                  onClick={() => {
                    setNameDraft(displayName);
                    setEditingName(true);
                  }}
                >
                  <Pencil className="h-5 w-5 text-primary" />
                </button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
        </div>

        <form onSubmit={handlePasswordSubmit}>
          <h3 className="font-bold text-lg mt-6 mb-3">Ubah Password</h3>
          <div className="space-y-4">
            {[
              { key: "oldPassword" as const, label: "Password Lama", icon: Lock, ph: "Masukkan Password Lama Anda..." },
              { key: "newPassword" as const, label: "Password Baru", icon: Lock, ph: "Masukkan Password Baru Anda..." },
              { key: "confirm" as const, label: "Konfirmasi Password Baru", icon: KeyRound, ph: "Masukkan Ulang Password Baru Anda..." },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="flex items-center gap-2 font-semibold">
                  <f.icon className="h-4 w-4" /> {f.label}
                </Label>
                <Input
                  type="password"
                  placeholder={f.ph}
                  value={pwd[f.key]}
                  onChange={(e) => setPwd({ ...pwd, [f.key]: e.target.value })}
                  className="rounded-full border-primary/60 h-11"
                />
              </div>
            ))}
          </div>

          <Button type="submit" disabled={savingPwd} className="w-full h-11 rounded-full text-base font-semibold mt-6">
            {savingPwd ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </div>
    </div>
  );
}