import { SignUp } from "@clerk/nextjs";

const Page = (): React.JSX.Element => {
    return (<SignUp fallbackRedirectUrl="/onboarding" />);
};

export default Page;
