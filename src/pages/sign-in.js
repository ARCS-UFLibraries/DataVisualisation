import React from 'react';
import { SignIn } from '@clerk/react';

export default function SignInPage() {
  return (
    <main
      style={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <SignIn
        path="/sign-in"
        routing="path"
      />
    </main>
  );
}