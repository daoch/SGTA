import Image from "next/image";
import loafing_logo from "@/public/loading-logo.webp";

export default function AppLoading() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="w-20 h-20">
        <Image
          src={loafing_logo}
          alt="Logo"
          width={128}
          height={128}
          className="animate-pulse"
        />
      </div>
    </div>
  );
}
