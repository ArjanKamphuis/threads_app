import "../globals.css";
import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Bottombar, LeftSidebar, RightSidebar, Topbar } from "@/components/shared";

export const metadata: Metadata = {
    title: "Threads",
    description: "A Next.js 14 Meta Threads application",
};

const RootLayout = ({ children }: { children: Readonly<React.ReactNode> }): React.JSX.Element => {
    return (
        <ClerkProvider>
            <html lang="en">
                <body>
                    <Topbar />
                    <main className="flex flex-row">
                        <LeftSidebar />
                        <section className="main-container">
                            <div className="w-full max-w-4xl">
                                {children}
                            </div>
                        </section>
                        <RightSidebar />
                    </main>
                    <Bottombar />
                </body>
            </html>
        </ClerkProvider>
    );
};

export default RootLayout;
