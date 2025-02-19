"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CircleCheck, Loader2 } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  companyName: z.string().min(2, "Company name is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function WaitlistForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setFirstName(data.firstName);
    try {
      const response = await fetch(
        "https://businex-backend-vexf.onrender.com/api/v1/waitlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      setStep(2);
      toast("Thank you for joining our waitlist. We'll be in touch soon!");
      form.reset();
      router.refresh();
    } catch (error) {
      toast("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='mx-auto max-w-xl space-y-8 p-4 flex justify-center items-center h-screen'>
      {step === 1 ? (
        <div>
          <div className='space-y-2 text-center mb-10'>
            <h1 className='text-3xl font-bold'>Join BusineX Waitlist</h1>
            <p className='text-muted-foreground'>
              Be the first to know when we launch. Join our exclusive waitlist
              today.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 '>
              <div className='grid gap-4 sm:grid-cols-2 '>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Larry' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Ndulaka' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='larry@damdamglobal.com'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+234 (816) 000-0000'
                        type='tel'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='companyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Acme Inc.' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full bg-[#6A22B2] hover:bg-[#6A22B2]/90'
                disabled={isLoading}
              >
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? "Submitting..." : "Join Waitlist"}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className='mx-auto max-w-xl space-y-8 p-4'>
          <div className='text-center space-y-4'>
            <div className='flex justify-center'>
              <CircleCheck className='h-16 w-16 text-[#6A22B2]' />
            </div>
            <h1 className='text-3xl font-bold'>Welcome to BusineX!</h1>
            <p className='text-xl text-muted-foreground'>
              Thank you for joining our waitlist, {firstName}!
            </p>
          </div>

          <div className='bg-muted/50 rounded-lg p-6 space-y-4'>
            <h2 className='font-semibold text-lg'>What's Next?</h2>
            <ul className='space-y-2 text-muted-foreground'>
              <li>✓ We've added you to our priority access list</li>
              <li>
                ✓ We would reach out on the next step in your onboarding process
              </li>
            </ul>

            <Button
              onClick={() => setStep(1)}
              className='w-full bg-[#6A22B2] hover:bg-[#6A22B2]/90'
            >
              Go back gome
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
