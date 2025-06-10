"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(12),
  email: z.string().email({ message: "Enter a valid email." }),
  plan: z.enum(["Basic", "Mid", "Power"]),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Purchase Form</Card.Title>
        <Card.Description>Enter your details to complete your purchase</Card.Description>
      </Card.Header>
      <Card.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="pepito123" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="changeme123" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="pepito123@gmail.com" {...field} className="w-full" />
                  </FormControl>
                  <FormDescription>Your email address will be used for confirmations.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Basic">Basic (2 vCPU - 4G - 50G)</SelectItem>
                      <SelectItem value="Mid">Mid-size (4 vCPU - 8G - 100G)</SelectItem>
                      <SelectItem value="Power">Power (8 vCPU - 16G - 200G)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card.Footer className="flex justify-between p-0 pt-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit">Complete Purchase</Button>
            </Card.Footer>
          </form>
        </Form>
      </Card.Content>
    </Card>
  )
}

