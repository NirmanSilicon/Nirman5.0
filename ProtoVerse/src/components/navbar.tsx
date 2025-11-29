"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

function Navbar() {
  // Prevent hydration mismatch by only rendering dynamic Clerk components after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 bg-slate-100 z-[10] h-fit py-4">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto">
        <div className="flex flex-row gap-3 justify-center">
          <Link href={"/dashboard"} className="flex items-center gap-2">
            <p className="px-2 py-1 text-2xl font-bold text-black">
              Folo<span className="text-indigo-600">Up</span>{" "}
              <span className="text-[8px]">Beta</span>
            </p>
          </Link>
          <p className="my-auto text-xl">/</p>
          <div className="my-auto">
            {mounted ? (
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/dashboard"
                hidePersonal={true}
                afterSelectOrganizationUrl="/dashboard"
                afterLeaveOrganizationUrl="/dashboard"
                appearance={{
                  variables: {
                    fontSize: "0.9rem",
                  },
                }}
              />
            ) : (
              <div className="w-40 h-8 bg-slate-200 animate-pulse rounded" />
            )}
          </div>
        </div>
        <div className="flex items-center">
          {mounted ? (
            <UserButton afterSignOutUrl="/sign-in" signInUrl="/sign-in" />
          ) : (
            <div className="w-10 h-10 bg-slate-200 animate-pulse rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
