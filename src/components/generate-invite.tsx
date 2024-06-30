"use client"
import * as React from "react"
import { useState } from "react"
import { CaretSortIcon, CheckIcon, CopyIcon } from "@radix-ui/react-icons"

import { cn } from "@projectforum/lib/utils"
import { Button } from "@shadcn/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@shadcn/command"
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/popover"
import { generateInviteCode } from "@projectforum/app/dashboard/helper"

const values = [
  {
    value: "admin",
    label: "Admin"
  },
  {
    value: "member",
    label: "Member"
  }
]

const ComboBox = ({
  comboValues,
  value,
  onValueChange
}: {
  comboValues: { value: string; label: string }[]
  value: string
  // eslint-disable-next-line no-unused-vars
  onValueChange: (v: string) => void
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? comboValues.find((c) => c.value === value)?.label : "Select value..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {comboValues.map((c) => (
                <CommandItem
                  key={c.value}
                  value={c.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {c.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === c.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export const GenerateInviteForm = () => {
  const [value, setValue] = useState("")
  const [generatedInvite, setGeneratedInvite] = useState("SAMPLE")

  const onValueChange = (value: string) => setValue(value)

  const generate = async () => {
    const res = await generateInviteCode(value)
    if (res.isInviteCodeGenerated && res.inviteCode) {
      setGeneratedInvite(res.inviteCode)
    }
  }

  return (
    <div className="p-3">
      <h1 className="text-xl font-bold mb-2">Generate Invite</h1>
      <ComboBox comboValues={values} value={value} onValueChange={onValueChange} />
      {value !== "" && (
        <Button className="ml-2" onClick={generate}>
          Generate
        </Button>
      )}

      <div className="w-1/2 h-[200px] m-4 bg-accent text-accent-foreground font-extrabold text-3xl flex items-center justify-center">
        {generatedInvite}
      </div>
      <Button>
        <CopyIcon />
      </Button>
    </div>
  )
}
