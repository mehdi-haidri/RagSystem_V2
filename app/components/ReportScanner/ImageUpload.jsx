"use client";

import Rr from "next/image";
import { useState } from "react";

function ImageUpload({ setBase64Data, setAlert }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfName , setPdfName] = useState("")
  const handleFileChange = (e) => {
    const file = e;
    if (!file) return;
    let isImage = false;
    let isPdf = false;

    const validImages = ["image/jpeg", "image/png", "image/webp"];
    const validPdf = ["application/pdf"];

    if (validImages.includes(file.type)) {
      isImage = true;
    }
    if (validPdf.includes(file.type)) {
      isPdf = true;
    }
    if (!isImage && !isPdf) {
      setAlert({ Message: "Invalid file type", type: "alert-error" });
      return;
    }

    if (isImage) {
      const image = new FileReader();
      image.onload = () => {
        setFile(image.result);
      };
      image.readAsDataURL(file);
      compressImage(file, (compressedFile) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result;
          setBase64Data(base64String);
        };
        reader.readAsDataURL(compressedFile);
      });
    }
    if (isPdf) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        setBase64Data(base64String);
      };
      reader.readAsDataURL(file);
      setPdfName(file.name)
      setFile(null)
    }
  };

  function compressImage(file, callback) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set  canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Apply basic compression (adjust quality as needed)
        const quality = 0.1; // Adjust quality as needed

        // Convert canvas to data URL
        const dataURL = canvas.toDataURL("image/jpeg", quality);

        // Convert data URL back to Blob
        const byteString = atob(dataURL.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const compressedFile = new File([ab], file.name, {
          type: "image/jpeg",
        });

        callback(compressedFile);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  const handleDragEnter = (e) => {
    e.preventDefault();

    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
   
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileChange(droppedFiles[0]); // Preview
    }
  };

  return (
    <>
      <div className={` flex items-center justify-center w-full mb-4 mt-[10%]`}>
        <label
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragEnter={handleDragEnter}
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full min-h-60  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-200 ${
            isDragging ? "bg-gray-600" : ""
          }`}
        >
          {file ? (
            <Rr src={file} width={150} height={150} alt="image" />
          ) : (
             
              pdfName ? (
                <p className=" text-lg text-gray-500 " > {pdfName}</p>
              ):
              (!isDragging && (
                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="select-none w-9 h-9 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className=" select-none mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-lg">Click to upload</span>{" "}
                or drag and drop
              </p>
              <p className=" select-none text-lg text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG , GIF or PDF{" "}
              </p>
            </div>
              ))
 
          )}
          <input
            id="dropzone-file"
            onChange={(e) => handleFileChange(e.target.files[0])}
            type="file"
            className="hidden"
          />
        </label>
      </div>
    </>
  );
}

export default ImageUpload;
