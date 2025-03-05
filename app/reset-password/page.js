'use client'
import { useState } from "react";
import { useSearchParams }  from "next/navigation";
import { set } from "mongoose";

function page() {

    const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(token);
  console.log(email);

  const handleResetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
        
      }
  
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Invalid or expired token");
    }
    setLoading(false);
  };
  return (
    <div className="flex justify-center bg-gray-300 items-center w-screen h-screen">
         
      <form onSubmit={handleResetPassword} className="flex flex-col gap-4 center bg-white p-4 w-[35%] rounded-md shadow-md">
        <p className="text-red-600   center">{message}</p>
        <label className="text-gray-600 text-md font-semibold"> New Password</label>
        <div className="flex flex-row gap-2  align-items-center justify-center" style={{alignItems:"center"}}>
         <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
        <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-transparent w-full  outline-none focus:outline-none focus:ring-0 p-4 border-b-2 border-gray-600" type="password" required placeholder="Password" minLength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
        </div>
        <label className="text-gray-600 text-md font-semibold"> Confirm Password</label>
        <div className="flex flex-row gap-2  align-items-center justify-center" style={{alignItems:"center"}}>
         <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-transparent w-full  outline-none focus:outline-none focus:ring-0 p-4  border-b-2 border-gray-600" type="password" required placeholder="Password" minLength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
        </div>
        <button className="bg-[#DB4437] text-white p-4 rounded-md hover:bg-red-800" type="submit">
          {loading ?<span className="loading loading-spinner loading-lg"></span>: "Reset Password"}
        </button>
       </form>
       <p className="validator-hint hidden">
        Must be more than 8 characters, including
     <br/>At least one number
      <br/>At least one lowercase letter
  <br/>At least one uppercase letter
</p>

     
    </div>
  );
}

export default page;
