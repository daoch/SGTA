"use client";

import React from "react";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  backUrl?: string;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ backUrl, children }) => {
  const router = useRouter();

  const handleClick = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="outline"
      size={children ? "default" : "icon"}
      onClick={handleClick}
    >
      <ArrowLeft className="h-5 w-5" />
      {children && children}
    </Button>
  );
};

export default BackButton;
