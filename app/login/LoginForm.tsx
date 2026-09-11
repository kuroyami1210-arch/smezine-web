"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import "../../components/login.css";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Login Admin</h2>

        {state.error && (
          <div className="error-msg">
            <i className="fa-solid fa-circle-exclamation"></i> {state.error}
          </div>
        )}

        <form action={action}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              placeholder="masukkan email disini"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-control"
              placeholder="masukkan password disini"
              required
            />
          </div>
          <button type="submit" className="btn-login" disabled={pending}>
            {pending ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
