'use client';
// import LoginPage from "./components/LoginPage";
import Aurora from './components/Aurora/AuroraBackGround';
import Hellow from "./components/Hellow";

function Page() {


  return (

    <>
      <Aurora
  colorStops={["#FFFFFF", "#97A4B5", "#1D232A"]}
        speed={0.5}
        amplitude={0.4}
      />
      <Hellow></Hellow>
    </>
   
  );
}

export default Page;