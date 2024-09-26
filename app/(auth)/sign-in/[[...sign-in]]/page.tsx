import { SignIn } from "@clerk/nextjs";

const Page = (): React.JSX.Element => {
    return (<SignIn fallbackRedirectUrl="/" />);
};

export default Page;
