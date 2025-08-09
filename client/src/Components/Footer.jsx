import { Footer } from "flowbite-react";
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
    <Footer container className="h-auto bg-slate-200">
      <div className="w-full max-w-7xl items-center mx-auto flex flex-col md:flex-row md:px-28">
        {/* Left Side - Contact Info */}
        <div className="flex flex-col w-1/2 gap-2">
          <h1 className="font-bold text-2xl">Get in Touch</h1>
          <p className="text-[12px]">
            For any queries, please contact us at info@example.com or reach out
            through our social media channels below.
          </p>
          <div className="flex gap-6 sm:mt-0 mt-8">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-700 rounded-full text-white"
            >
              <BsFacebook size={18} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-orange-700 rounded-full text-white"
            >
              <BsInstagram size={18} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-700 rounded-full text-white"
            >
              <BsTwitter size={18} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-700 rounded-full text-white"
            >
              <BsDribbble size={18} />
            </a>
          </div>
        </div>

        {/* Right Side - Cards */}
        <div className="flex w-1/2 gap-10 mt-5 md:mx-auto md:items-center justify-center">
          {/* GitHub Card */}
          <div>
            <a
              href="https://github.com/md-fahad1?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#52555c] cursor-pointer absolute z-10 rounded-md w-24 h-24 flex flex-col items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              <BsGithub className="text-white text-xl" />
              <p className="text-[12px] text-white">Github here</p>
            </a>
            <div className="bg-[#636467] relative top-2 left-2 rounded-md w-24 h-24"></div>
          </div>

          {/* LinkedIn Card */}
          <div>
            <a
              href="https://www.linkedin.com/in/md-fahad-khan/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#52555c] cursor-pointer absolute z-10 rounded-md w-24 h-24 flex flex-col items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              <BsLinkedin className="text-white text-xl" />
              <p className="text-[12px] text-white">LinkedIn here</p>
            </a>
            <div className="bg-[#636467] relative top-2 left-2 rounded-md w-24 h-24"></div>
          </div>
        </div>
      </div>
    </Footer>
  );
}
