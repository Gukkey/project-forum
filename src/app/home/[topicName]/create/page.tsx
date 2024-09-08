import { CreateThreadForm } from "@projectforum/components/create-thread"

export default async function CreateThread({ params }: { params: { topicName: string } }) {
  return <CreateThreadForm topicName={params.topicName} />
}
