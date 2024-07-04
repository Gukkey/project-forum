"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@projectforum/components/shadcn/button"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "@projectforum/components/shadcn/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@projectforum/components/shadcn/input-otp"
import { toast } from "@projectforum/components/shadcn/use-toast"
import { useContext } from "react"
import { InviteContext } from "@projectforum/context/invite"
import { InviteContextType } from "@projectforum/lib/types"

const FormSchema = z.object({
  invitecode: z.string().min(5, {
    message: "You invite code must be 5 characters."
  })
})

export function InviteForm() {
  const { validateInvite } = useContext(InviteContext) as InviteContextType

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      invitecode: ""
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await validateInvite(data.invitecode)
    if (result) {
      console.log("Valid Invite")
    } else {
      toast({
        title: "Your invite code is invalid"
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col items-center justify-center w-3/4 space-y-6 mx-auto"
      >
        <FormField
          control={form.control}
          name="invitecode"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Invite Code</FormLabel> */}
              <FormControl>
                <InputOTP maxLength={5} {...field} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>Please enter the invite-code that was given to you.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex">
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
