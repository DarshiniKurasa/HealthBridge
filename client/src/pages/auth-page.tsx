import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleModeSwitch = (loginMode: boolean) => {
    setIsLogin(loginMode);
    if (!loginMode) {
      registerForm.reset();
    } else {
      loginForm.reset();
    }
  };
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();

  // Redirect if user is already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resetOptions: {
      keepDirtyValues: false,
      keepErrors: false,
      keepTouched: false,
      keepDirty: false,
      keepValues: false
    }
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container flex flex-col-reverse md:flex-row items-center justify-center py-12">
        {/* Form Side */}
        <div className="w-full max-w-md space-y-6 p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin
                ? "Sign in to access your health services"
                : "Join HealthBridge to access comprehensive healthcare"}
            </p>
          </div>

          {isLogin ? (
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="johndoe@example.com" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                registerForm.trigger("email");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>

              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => handleModeSwitch(true)}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Sign in
                  </button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Hero Side */}
        <div className="w-full md:w-1/2 p-6 mb-8 md:mb-0">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Your Health Journey Starts Here
            </h1>
            <p className="text-xl text-muted-foreground">
              HealthBridge connects you with quality healthcare services, wherever you are.
            </p>
            <div className="grid gap-4 py-4">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path><circle cx="12" cy="12" r="10"></circle></svg>
                </div>
                <div>
                  <h3 className="font-medium">Symptom Check</h3>
                  <p className="text-sm text-muted-foreground">Get AI-powered symptom assessment</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="M15.6 2.7a10 10 0 1 0 5.7 5.7"></path><circle cx="12" cy="12" r="2"></circle><path d="M13.4 10.6 19 5"></path></svg>
                </div>
                <div>
                  <h3 className="font-medium">Find Care</h3>
                  <p className="text-sm text-muted-foreground">Locate nearby healthcare facilities</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                </div>
                <div>
                  <h3 className="font-medium">Telemedicine</h3>
                  <p className="text-sm text-muted-foreground">Connect with doctors virtually</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                </div>
                <div>
                  <h3 className="font-medium">Health Records</h3>
                  <p className="text-sm text-muted-foreground">Securely store and access your health data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;