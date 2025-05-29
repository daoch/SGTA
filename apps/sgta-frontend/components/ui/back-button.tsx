"use client";

import React from "react";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  backUrl?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ backUrl }) => {
  const router = useRouter();

  const handleClick = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};

export default BackButton;
