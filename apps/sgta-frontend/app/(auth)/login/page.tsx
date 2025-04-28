"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
