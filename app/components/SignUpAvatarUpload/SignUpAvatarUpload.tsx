import React, { useCallback } from "react";
import Image from "next/image";
import Camera from "../../../public/images/camera.svg";
import { SignUpAvatarUploadProps } from "@/app/types/sign-up-types/sign-up-types";

const SignUpAvatarUpload: React.FC<SignUpAvatarUploadProps> = ({
  avatar,
  onAvatarChange,
  onError,
}) => {
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          onError("Image size should be less than 5MB");
          return;
        }

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          onError("Please select a valid image file (JPEG, PNG, WebP)");
          return;
        }

        onAvatarChange(file);
      } catch (error) {
        console.error("Image upload error:", error);
        onError("Failed to upload image. Please try again.");
      }
    },
    [onAvatarChange, onError]
  );

  const handleRemoveImage = useCallback(() => {
    onAvatarChange(null);
    const fileInput = document.getElementById(
      "signUpImageUpload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }, [onAvatarChange]);

  return (
    <div className="mt-[46px] flex items-center">
      <label
        htmlFor="signUpImageUpload"
        className="w-[100px] h-[100px] rounded-full border border-[#D1D5DB] flex items-center justify-center cursor-pointer transition-colors duration-300 ease-in-out hover:border-gray-500 hover:bg-gray-100"
      >
        {avatar ? (
          <Image
            src={URL.createObjectURL(avatar)}
            alt="Uploaded preview"
            width={100}
            height={100}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <Image
            src={Camera}
            width={20}
            height={20}
            alt="cameraIcon"
            className="transition-all duration-200"
          />
        )}
      </label>
      <input
        id="signUpImageUpload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <div className="ml-[16px]">
        {avatar ? (
          <div className="flex items-center gap-2">
            <label
              htmlFor="signUpImageUpload"
              className="text-[#3E424A] cursor-pointer transition-colors duration-200 hover:text-[#e63900] text-[14px]"
            >
              Upload new
            </label>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-[#3E424A] cursor-pointer transition-colors duration-200 hover:text-[#e63900] text-[14px] bg-transparent border-none"
            >
              Remove
            </button>
          </div>
        ) : (
          <label
            htmlFor="signUpImageUpload"
            className="text-[#3E424A] cursor-pointer transition-colors text-[14px] duration-200 hover:text-[#FF4000] block"
          >
            Upload image
          </label>
        )}
      </div>
    </div>
  );
};

export default SignUpAvatarUpload;
