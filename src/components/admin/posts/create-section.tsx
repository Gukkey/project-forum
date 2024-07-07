import { Button } from "@shadcn/button"
import { Input } from "@shadcn/input"
import { Label } from "@shadcn/label"

export const CreateNewSection = () => {
  return (
    <div className="min-h-[200px] p-4 border-2 rounded-lg">
      <h1 className="text-xl font-bold mb-2">Create a new Section</h1>
      <div className="p-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" />
        <Button variant="default" className="mt-2 float-right">
          Create
        </Button>
      </div>
    </div>
  )
}
