'use client';
import {  useState } from "react";
import SplitText from "./Aurora/SplitText";
import { Button } from "@/components/ui/button";
import LoginPage from "../login/LoginPage";
import { DialogTrigger } from "@/components/ui/dialog";
import SignupPage from "../signup/SignpPage";
import Alert from "./Alert";
import ShinyText from "./Aurora/ShinyText";
import Test from "./Aurora/test"
const handleAnimationComplete = (setIsHovered) => {
  setIsHovered(true);
};

export default function Hellow() {
  const [isHovered, setIsHovered] = useState(false);
  const [alert, setAlert] = useState(null);

  return (
      <>
        {alert && <Alert message={alert.Message} type={alert.type} setAlert={setAlert} >  </Alert>}
     
        <div className="absolute  w-[100%] sm:w-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
           
      {/* {isHovered
          ?<> 
            <SplitText
                text="Welcome, to AI HealthMate"
                className="  text-3xl sm:text-5xl select-none font-semibold text-gray-200 text-center "
                delay={150}
                animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
                onLetterAnimationComplete={() => handleAnimationComplete(setIsHovered)} />
       
         </>
          : <SplitText
            text="Welcome, to AI HealthMate"
            className="  text-3xl sm:text-5xl select-none font-semibold text-gray-200 text-center "
            delay={150}
            animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            onLetterAnimationComplete={() => handleAnimationComplete(setIsHovered)}
        />} */}

        <Test
              gradientColors={["#ffffff", "#f0f0f0", "#d3d3d3", "#a9a9a9", "#808080"]}
              animationSpeed={3}
              showBorder={false}
          
           text="Welcome, to AI HealthMate"
           className="  text-3xl sm:text-5xl select-none font-semibold text-gray-200 text-center "
           delay={150}
           animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
           animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
           easing="easeOutCubic"
           threshold={0.2}
           rootMargin="-50px"
           onLetterAnimationComplete={() => handleAnimationComplete(setIsHovered)}
          
        >

        </Test>


        
        <SplitText
            text="This medical assistant chatbot is designed for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for any health concerns or medical decisions. If you are experiencing a medical emergency, please seek immediate medical attention"
            className=" hidden sm:block text-xl   font-semibold text-gray-400 text-center select-none "
            delay={20}
            animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            onLetterAnimationComplete={() => handleAnimationComplete(setIsHovered)}
          
            />
             
           
             <div className="h-12">
                {isHovered && <>
                    <LoginPage  setAlert={setAlert}>
              <DialogTrigger asChild>
                
                <Button variant="outline" className="mr-2 text-lg font-semibold bg-transparent">
                <ShinyText text="SignIn" disabled={false} speed={3} className='custom-class' />
                            </Button>
                            </DialogTrigger>
                    </LoginPage>
                    <SignupPage>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="mr-2 text-md font-semibold bg-gray-200">
                  Sign Up
                  <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 20">
                    <path fill="currentColor"
                      d="m16 8.4l-8.9 8.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7L14.6 7H7q-.425 0-.712-.288T6 6t.288-.712T7 5h10q.425 0 .713.288T18 6v10q0 .425-.288.713T17 17t-.712-.288T16 16z" />
                  </svg>
                              </Button>
                            </DialogTrigger>
                    </SignupPage>
                 </>
                }
            </div>
          
            
    
      </div>
      
      </>
  )
}
