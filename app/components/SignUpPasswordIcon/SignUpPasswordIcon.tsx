import React from "react";
import Image from "next/image";
import Eye from "../../../public/images/eye.svg";

interface SignUpPasswordIconProps {
  isVisible: boolean;
}

const SignUpPasswordIcon: React.FC<SignUpPasswordIconProps> = ({
  isVisible,
}) => {
  return (
    <>
      <Image
        src={Eye}
        alt={isVisible ? "hidePassword" : "showPassword"}
        width={20}
        height={20}
        className={isVisible ? "opacity-50" : "opacity-100"}
      />
      {isVisible && (
        <div className="absolute top-[10px] left-0 w-[20px] h-[1px] bg-gray-600 transform rotate-45"></div>
      )}
    </>
  );
};

export default SignUpPasswordIcon;
