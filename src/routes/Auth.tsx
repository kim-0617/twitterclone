import React, { useState } from "react";
import { firebaseInstance, authService } from "../fbase";

declare namespace JSX {
  interface IntrinsicElements {
    span: any;
  }
}

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data;
    try {
      if (newAccount) {
        // create account
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        // Sign In
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error: any) {
      console.log(error.code);
      setError(error.code.replace("auth/", ""));
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  const onSocialClick = async (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;

    let provider: any;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error}
        <div>
          <button type="button" onClick={onSocialClick} name="google">
            Continue with Google
          </button>
          <button type="button" onClick={onSocialClick} name="github">
            Continue with Github
          </button>
        </div>
      </form>
      <b onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</b>
    </div>
  );
}

export default Auth;
