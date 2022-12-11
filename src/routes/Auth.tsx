import React, { useState } from "react";
import { firebaseInstance, authService } from "../fbase";
import { BsTwitter } from "react-icons/bs";
import { AiOutlineGooglePlus, AiFillGithub } from "react-icons/ai";

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
      <form onSubmit={onSubmit} className="login__form">
        <BsTwitter className="twitter__icon" />
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
          className="sign__in"
        />
        <span className="error">{error}</span>
        <span onClick={toggleAccount} className="toggle__account">
          {newAccount ? "Sign In" : "Create Account"}
        </span>
        <div className="socail__wrap">
          <button
            type="button"
            onClick={onSocialClick}
            name="google"
            className="google"
          >
            Continue with Google
            <AiOutlineGooglePlus className="google__icon" />
          </button>
          <button
            type="button"
            onClick={onSocialClick}
            name="github"
            className="github"
          >
            Continue with Github
            <AiFillGithub className="github__icon" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Auth;
