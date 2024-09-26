import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import React from "react";
import { NextFont } from "next/dist/compiled/@next/font";

import "../globals.css";

export const metadata: Metadata = {
    title: 'Threads',
    description: 'A Next.js 14 Meta Threads Application'
};

const inter: NextFont = Inter({ subsets: ['latin'] });

const AuthLayout = ({ children }: { children: Readonly<React.ReactNode> }): React.JSX.Element => {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="flex justify-center items-center w-full min-h-screen">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
};

export default AuthLayout;
