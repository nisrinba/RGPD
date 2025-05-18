
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    console.log('Login attempt with:', data);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Connexion à SensiScan</h1>
        <p className="text-muted-foreground">
          Entrez vos identifiants pour accéder à votre compte
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="votre@email.com"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Mot de passe</FormLabel>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                {...form.register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </FormItem>

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
      </Form>
    </div>
  );
};
