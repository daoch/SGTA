import Image from "next/image";
import loading_logo from "@/public/loading-logo.webp";

export default function AppLoading() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="w-20 h-20">
        <Image
          src={loading_logo}
          alt="Cargando..."
          width={128}
          height={128}
          className="animate-pulse"
          priority={true}
        />
      </div>
    </div>
  );
}
