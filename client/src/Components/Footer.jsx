import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
  BsLinkedin,
} from "react-icons/bs";
export default function FooterCom() {
  return (
    <Footer container className=" h-auto bg-slate-200">
      <div className="w-full max-w-7xl items-center mx-auto flex flex-col md:flex-row md:px-28">
        <div className="flex flex-col w-1/2 gap-2">
          <h1 className="font-bold text-2xl">Get in Touch</h1>
          <p className="text-[12px]">
            For any queries, please contact us at For any queries, please
            contact us at For any queries, please contact us at
          </p>
          <div className="flex gap-6 sm:mt-0 mt-8 ">
            <Footer.Icon href="#" className="bg-red-700 " icon={BsFacebook} />
            <Footer.Icon href="#" className="bg-red-700 " icon={BsInstagram} />
            <Footer.Icon href="#" className="bg-red-700 " icon={BsTwitter} />

            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
        <div className="flex w-1/2 gap-10 mt-5  md:mx-auto md:items-center justify-center">
          <div>
            <div className="bg-[#52555c] cursor-pointer absolute z-10 rounded-md w-24 h-24 items-center justify-center flex flex-col gap-3 shadow-md hover:shadow-lg ">
              <Footer.Icon
                href="#"
                className="bg-red-700 text-white"
                icon={BsGithub}
              />
              <p className="text-[12px] text-white">Github here</p>
            </div>
            <div className="bg-[#636467] relative top-2 left-2 rounded-md w-24 h-24"></div>
          </div>
          <div>
            <div className="bg-[#52555c] cursor-pointer absolute z-10 rounded-md w-24 h-24 items-center justify-center flex flex-col gap-3 shadow-md hover:shadow-lg ">
              <Footer.Icon
                href="#"
                className="bg-red-700 text-white"
                icon={BsLinkedin}
              />
              <p className="text-[12px] text-white">LinkedIn here</p>
            </div>
            <div className="bg-[#636467] relative top-2 left-2 rounded-md w-24 h-24"></div>
          </div>
        </div>
      </div>
    </Footer>
  );
}
