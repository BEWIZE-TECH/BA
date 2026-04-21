"use client";
import * as React from "react";
import { useState, useId, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function BiwizeLogo() {
  return (
    <div className="relative h-11 w-11 flex items-center justify-center group/logo">
      <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl group-hover/logo:bg-blue-500/20 transition-colors duration-500" />
      <div className="absolute inset-0 animate-[spin_8s_linear_infinite] opacity-20 group-hover/logo:opacity-40 transition-opacity">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-400 fill-none stroke-[2]">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
        </svg>
      </div>
      <div className="absolute h-7 w-7 border border-blue-400/50 rotate-45 animate-[spin_4s_linear_infinite_reverse] group-hover/logo:border-white transition-colors duration-500" />
      <div className="absolute h-7 w-7 border border-blue-500/50 -rotate-12 group-hover/logo:rotate-12 transition-transform duration-700" />
      <div className="relative h-3 w-3 bg-white rounded-[2px] shadow-[0_0_15px_rgba(255,255,255,0.8)]">
        <div className="absolute inset-0 bg-white rounded-[1px] animate-ping opacity-50" />
      </div>
    </div>
  );
}

export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export function Typewriter({
  text,
  speed = 100,
  cursor = "|",
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);
  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  useEffect(() => {
    if (!currentText) return;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < currentText.length) {
          setDisplayText((prev) => prev + currentText[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        } else if (loop) {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex(0);
          setTextArrayIndex((prev) => (prev + 1) % textArray.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, currentText, loop, speed, deleteSpeed, delay, displayText, textArray.length]);

  return <span className={className}>{displayText}<span className="animate-pulse">{cursor}</span></span>;
}

const labelVariants = cva("text-sm font-medium leading-none text-neutral-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>>(({ className, ...props }, ref) => (<LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />));
Label.displayName = LabelPrimitive.Root.displayName;

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-700 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-white text-black hover:bg-neutral-200",
      outline: "border border-neutral-800 bg-transparent text-white hover:bg-neutral-900 hover:text-white",
      link: "text-neutral-400 underline-offset-4 hover:underline hover:text-white",
    },
    size: { default: "h-10 px-4 py-2", sm: "h-9 rounded-md px-3", lg: "h-12 rounded-md px-6" },
  },
  defaultVariants: { variant: "default", size: "default" },
});
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean; }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => { const Comp = asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />; });
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => { return <input type={type} className={cn("flex h-11 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-white shadow-sm transition-all placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50", className)} ref={ref} {...props} />; });

const PasswordInput = React.forwardRef<HTMLInputElement, { label?: string } & React.InputHTMLAttributes<HTMLInputElement>>(({ className, label, ...props }, ref) => {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="grid w-full items-center gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input id={id} type={showPassword ? "text" : "password"} className={cn("pe-10", className)} ref={ref} {...props} />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-neutral-500 hover:text-white focus:outline-none">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
      </div>
    </div>
  );
});

function BrandIdentity() {
  return (
    <div className="flex items-center gap-4 group/brand min-w-fit mb-8 justify-center">
      <BiwizeLogo />
      <div className="flex flex-col text-left">
        <span className="text-xl font-black tracking-[0.3em] text-white leading-none">
          BIWIZE
        </span>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="h-[2px] w-4 bg-blue-500 rounded-full" />
          <span className="text-[8px] uppercase tracking-[0.4em] text-slate-500 font-bold group-hover/brand:text-blue-400 transition-colors">
            Intelligence Layer
          </span>
        </div>
      </div>
    </div>
  );
}

function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSignIn} className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <BrandIdentity />
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
        <p className="text-sm text-neutral-500 mt-2">Access the BIWIZE BA Intelligence Suite</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" placeholder="name@example.com" required /></div>
        <PasswordInput name="password" label="Password" required placeholder="" />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? <Loader2 className="animate-spin size-4" /> : "Sign In"}
        </Button>
      </div>
    </form>
  );
}

function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) {
      setStatus({ type: 'error', msg: error.message });
    } else {
      setStatus({ type: 'success', msg: "Check your email for the verification link!" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <BrandIdentity />
        <h1 className="text-3xl font-bold tracking-tight text-white">Create Account</h1>
        <p className="text-sm text-neutral-500 mt-2">Start your BIWIZE BA Intelligence Suite</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" type="text" placeholder="Full Name" required /></div>
        <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" placeholder="name@example.com" required /></div>
        <PasswordInput name="password" label="Password" required placeholder="" />
        {status && <p className={cn("text-xs", status.type === 'success' ? "text-green-500" : "text-red-500")}>{status.msg}</p>}
        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? <Loader2 className="animate-spin size-4" /> : "Register"}
        </Button>
      </div>
    </form>
  );
}

export function AuthUI() {
  const [isSignIn, setIsSignIn] = useState(true);

  const currentContent = {
    image: isSignIn ? "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" : "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072",
    quote: isSignIn ? "Secure your insights. BIWIZE Core." : "Decentralized BA Intelligence starts here."
  };

  return (
    <div className="w-full min-h-screen md:grid md:grid-cols-2 bg-black text-white selection:bg-neutral-800">
      <div className="flex h-screen items-center justify-center p-6 md:p-12 bg-black/50">
        <div className="mx-auto grid w-full max-w-[350px] gap-6">
          {isSignIn ? <SignInForm /> : <SignUpForm />}
          <div className="text-center text-sm">
            <span className="text-neutral-500">{isSignIn ? "New to BIWIZE?" : "Member already?"}</span>{" "}
            <Button variant="link" className="pl-1 h-auto p-0" onClick={() => setIsSignIn(!isSignIn)}>
              {isSignIn ? "Create account" : "Log in"}
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:block relative bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${currentContent.image})` }}>
        
        <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end p-12 pb-24">
          <blockquote className="space-y-3 text-center">
            <p className="text-3xl font-light tracking-tight text-white leading-relaxed">
              “<Typewriter key={currentContent.quote} text={currentContent.quote} speed={60} />”
            </p>
            <footer className="text-xs uppercase tracking-[0.3em] text-neutral-500">— BIWIZE CORE —</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}