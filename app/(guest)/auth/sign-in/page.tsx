import SignIn from './_components/SignIn';

export default function SignInPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-center sm:justify-stretch px-2 sm:px-4 bg-base-200">
        <h1 className="mt-36 text-primary text-3xl font-bold hidden sm:block">
          Happy To See You Back!! 🎉
        </h1>
        <div className="w-full max-w-md rounded-lg bg-base-100 p-8 shadow-md flex flex-col space-y-2 sm:mt-16">
          <h2 className="font-bold text-xl sm:text-2xl text-center pb-4 text-base-content">
            Sign In To Your Account
          </h2>
          <SignIn />
        </div>
      </div>
    </>
  );
}
