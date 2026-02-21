import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";

import { Eye, EyeClosed } from "lucide-react";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../hooks/useAuth";
import type { LoginInputs } from "../../../types/types";

const Login = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please verify your email and password.");
      resetField("password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex w-full flex-col justify-center items-center bg-primary/40 p-12 lg:w-1/2 lg:p-24">
        <div className="max-w-lg mx-auto w-full space-y-2">
          <img
            src={logo}
            alt="Creative Hub Logo"
            className="h-44 w-auto rounded"
          />
          <h1 className="text-4xl font-bold">Creative Hub</h1>
          <p className="text-lg leading-relaxed">
            Creative Hub is the leading IT institute in the country,
            specializing in App Development, Website Design & Development, and
            UI/UX Design. For custom apps or professional websites, contact us
            today!
          </p>

          <div className="hidden lg:block h-1 w-40 bg-primary rounded"></div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-accent-foreground">Admin Login</h2>
          <p className="mb-8 text-accent">
            Please enter your credentials to access the system.
          </p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all disabled:bg-slate-50 disabled:text-accent ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-primary focus:ring-primary/20"
                }`}
                placeholder="admin@creativehub.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 transition-all disabled:bg-slate-50 disabled:text-accent ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-primary focus:ring-primary/20"
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye /> :<EyeClosed /> }
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
