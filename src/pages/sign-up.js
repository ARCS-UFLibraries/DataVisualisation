import React from 'react';
import { SignUp } from '@clerk/react';

export default function SignUpPage() {
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
      <SignUp
        path="/sign-up"
        routing="path"
      />
    </main>
  );
}