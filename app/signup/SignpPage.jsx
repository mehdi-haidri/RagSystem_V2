"use client";
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
import { useId, useState } from "react";
import { useRouter } from "next/navigation";


export default function SignupPage({ children }) {
  const id = useId();
   const router = useRouter();
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("hi");
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
    } else {
      setSuccess("Account created!");
      setTimeout(() => {
       
        router.push("/")
      }, 2000) // Redirect to login page
    }
    setIsLoading(false)
  };

  return (
    <Dialog>
      {children}
      <DialogContent className="bg-[#1d232a] border-none">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
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
            <DialogTitle className="sm:text-center text-lg text-white">Sign up</DialogTitle>
            <DialogDescription className="sm:text-center">
              We just need a few details to get you started.
            </DialogDescription>
            {error && <p className="text-red-500 text-center  text-sm font-semibold">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white text-lg" htmlFor={`${id}-name`}>UserName</Label>
              <Input
                id={`${id}-name`}
               
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className=" input input-bordered p-5 text-md "
                required />
            </div>
            <div className="space-y-2">
              <Label className="text-white text-lg" htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`}
                className="input input-bordered p-5 text-md "

                 type="email"
                 name="email"
                 placeholder="example@ex.com"
                 value={formData.email}
                 onChange={handleChange}
                 required />
            </div>
            <div className="space-y-2">
              <Label className="text-white text-lg" htmlFor={`${id}-password`}>Password</Label>
              <Input
                className="input input-bordered p-5 text-md "
                id={`${id}-password`}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Button type="button" disabled={isLoading} className="w-full" onClick={handleSubmit}>
          {isLoading ? <span className="loading loading-ring loading-md"></span> : "Sign Up"}
          </Button>
        </form>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <Button variant="outline">Continue with Google</Button>

        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
