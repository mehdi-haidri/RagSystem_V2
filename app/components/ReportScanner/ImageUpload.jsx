'use client'

import { Themes } from "@/app/assets/Themes"
import Rr from "next/image";
import { useState } from "react";
function ImageUpload() {
    const [base64String, setBase64Data] = useState(null);
    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validImages = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validImages.includes(file.type)) {
            alert("Please select a valid image file (jpg, png, webp)");
            return
        }
        const image = new FileReader();
        image.onload = () => {
            setFile(image.result);
        };
        image.readAsDataURL(file);


        compressImage(file, (compressedFile) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result ;
                setBase64Data(base64String);
                console.log(base64String);
            };
            reader.readAsDataURL(compressedFile);
        });
    }









    function compressImage(file, callback) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Create a canvas element
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set  canvas dimensions to match the image
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0);


                // Apply basic compression (adjust quality as needed)
                const quality = 0.1; // Adjust quality as needed

                // Convert canvas to data URL
                const dataURL = canvas.toDataURL('image/jpeg', quality);

                // Convert data URL back to Blob
                const byteString = atob(dataURL.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);

                }
                const compressedFile = new File([ab], file.name, { type: 'image/jpeg' });

                callback(compressedFile);
            };
            img.src = e.target.result ;
        };

        reader.readAsDataURL(file);
    }
  return (
      <>
          
          
          <div className={`${Themes.dark.chatBackground} flex items-center justify-center w-full mb-4 mt-[10%]`}>
    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer   hover:bg-gray-600 ">
        {file ? <   Rr src={file} width={200} height={200} alt="image"/>   : <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-9 h-9 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400"><span className="font-semibold text-lg">Click to upload</span > or drag and drop</p>
            <p className="text-lg text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF </p>
        </div>}
        <input id="dropzone-file" onChange={(e) => handleFileChange(e)} type="file" className="hidden" />
    </label>
</div> 

      </>
  )
}

export default ImageUpload