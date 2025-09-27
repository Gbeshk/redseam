import Image from "next/image";
import LoginPicture from "../../../public/images/login-picture.png";
import SignInForm from "../SignInForm/SignInForm";

export default async function SignInPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  return (
    <div className="w-[1920px] flex mx-auto">
      <Image
        src={LoginPicture}
        alt="loginPic"
        width={948}
        height={1000}
        className="w-[948px] h-[1000px]"
      />
      <div className="w-full justify-center flex mt-[241px] mr-[36px]">
        <div className="w-[554px]">
          <p className="text-[#10151F] font-semibold text-[42px] mb-8">
            Log In
          </p>
          <SignInForm apiUrl={API_URL} />
        </div>
      </div>
    </div>
  );
}
