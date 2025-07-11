import React from 'react';
import SignUp from './_components/SignUp';

const SignUpPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center sm:justify-stretch px-2 sm:px-4 bg-base-200">
      <h1 className="mt-36 text-primary text-3xl font-bold hidden sm:block">
        Lets Start Your Journey
      </h1>
      <div className="w-full max-w-md rounded-lg bg-base-100 p-8 shadow-md flex flex-col space-y-2 sm:mt-16">
        <h2 className="font-bold text-xl sm:text-2xl text-center pb-4 text-base-content">
          Create An Account
        </h2>
        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage;
