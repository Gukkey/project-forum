// import "@projectforum/components/Tiptap.css"
import { CreateThreadForm } from "@projectforum/components/create-thread"
// import { navigate } from "@projectforum/app/actions"

export default async function CreateThread({ params }: { params: { topicId: string } }) {
  return (
    <div className="m-4 rounded-md  ">
      <CreateThreadForm topicId={params.topicId} />
    </div>
  )
}
