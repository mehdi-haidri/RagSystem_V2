"use client";
import { signIn  ,useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {  RiGoogleFill } from "@remixicon/react";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId ,useState } from "react";

export default function LoginPage({children}) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const id = useId();
  const { data: session , status : sessionStatus } = useSession();

  const handleLogin = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
    
        if (result?.error) {
          setError("Invalid email or password");
          setIsLoading(false);
        } else {
          router.push("/chatbot"); // Redirect after successful login
    }
  };
  
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/chatbot"); // Redirect to home page if user is already logged in
    }
  }, [sessionStatus]);


  const handlePasswordReset = async () => {
    if (email) {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } else {
      setError("Please enter your email");
    }
  };
    
  return (

  
    <Dialog   >
      {children}
      <DialogContent className="bg-[#1d232a] border-none">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100 "
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center text-gray-200 text-lg ">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to login to your account.
            </DialogDescription>
            {error && <p className="text-center text-semibold text-red-500">{error}</p>}
          </DialogHeader>
        </div>
              <form onSubmit={handleLogin} className="space-y-5">
             
          <div className="space-y-4">
            <div className="space-y-2  ">
                <Label className="text-white text-lg" htmlFor={`${id}-email`}>Email</Label>
              <Input 
                className="input input-bordered p-5 text-md  "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id={`${id}-email`}
                    placeholder="hi@yourcompany.com"
                type="email" required />
              
            </div>
            <div className="space-y-2">
                <Label className="text-white text-lg" htmlFor={`${id}-password`}>Password</Label>
              <Input
                className="p-5 text-md "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id={`${id}-password`}
                placeholder="Enter your password"
                type="password"
                required
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
         
              <Label htmlFor={`${id}-remember`} className="font-normal text-md text-muted-foreground">
                Remember me
              </Label>
            </div>
            <a className="text-md text-gray-400 underline hover:no-underline cursor-pointer" onClick={handlePasswordReset}>
              Forgot password?
            </a>
          </div>
          <Button type="submit" className="w-full">
           {isLoading ? <span className="loading loading-ring loading-md"></span> : <p className="text-lg">Sign in</p>}
          </Button>
        </form>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <Button className="bg-[#DB4437] text-white items-center  hover:bg-[#DB4437]/90" onClick={() => {
          signIn("google", { callbackUrl: "/chatbot" })
          setIsLoading(true);  }}>
          {isLoading ? <span className="loading  loading-ring loading-md"></span> :
            (<><span className="pointer-events-none me-2 ">
              <RiGoogleFill className="opacity-100" size={23} aria-hidden="true" />
            </span>
          <p className="text-lg">Login with Google</p> </>)
          }
        </Button>
       
      </DialogContent>
    </Dialog>


  );
}
