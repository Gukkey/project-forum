import React, { useEffect, useState } from "react"
import { createNewSection, createNewTopic, getSectionsall } from "@projectforum/app/actions"
import { Button } from "@shadcn/button"
import { Label } from "@shadcn/label"
import { Input } from "@shadcn/input"
import { ComboBox } from "@shadcn/combo-box"
import { toast } from "@projectforum/components/shadcn/use-toast"

const values = [
  { value: "section", label: "Section" },
  { value: "topics", label: "Topic" }
]

function AddSection() {
  const [section, setSection] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [topic, setTopic] = useState("")
  const [adding, setAdding] = useState("section")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSections, setFilteredSections] = useState<{ id: string; name: string }[]>([])
  const [created, setCreated] = useState(false)

  const allSections = async () => {
    const temp = await getSectionsall()
    setFilteredSections(temp)
  }

  useEffect(() => {
    allSections()
  }, [created])

  const isAnyId = (sec: string) => {
    if (!section) return false
    const id = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return id.test(sec)
  }

  const handleAddSection = async () => {
    const newFoerm = new FormData()
    let sectId = ""
    if (!isAnyId(section) && section !== "") {
      newFoerm.append("name", section)
      sectId = await createNewSection(newFoerm)
    } else {
      sectId = section
    }
    if (topics.length > 0) {
      topics.map((t) => {
        const tempForm = new FormData()
        tempForm.append("name", t)
        tempForm.append("section_id", sectId)
        createNewTopic(tempForm)
      })
    }
    if (!(section === "") || !(topics.length === 0)) {
      setCreated(true)
    }
    setTimeout(() => {
      setCreated(false)
    }, 2000)
    toast({ title: "Your section has been added" })
    setSection("")
    setTopics([])
  }

  const handleSelectSection = (sec: any) => {
    setSection(sec.id)
    setSearchTerm(sec.name)
    setFilteredSections([])
  }

  const handleAddTopic = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      if (topic.length > 1) {
        setTopics([...topics, topic])
        setTopic("")
      }
    }
  }

  const handleAdding = (value: string) => {
    setAdding(value)
    setSection("")
    setTopics([])
  }

  const handleRemoveTopic = (indexToRemove: number) => {
    const updatedTopics = topics.filter((_, index) => index !== indexToRemove)
    setTopics(updatedTopics)
  }

  return (
    <div className="p-3 pl-6">
      <h1 className="text-lg font-bold h-20 text-white">Add Section/Topic</h1>
      <div className="w-full h-80 flex items-center flex-col justify-center">
        <div className="text-base  mb-3 transition-all duration-200 w-full flex justify-between items-center ease-in-out">
          What do you want to create?
          <ComboBox comboValues={values} onValueChange={handleAdding} value={adding}></ComboBox>
        </div>
        <div className="w-full">
          <div className="text-center mb-3">
            {adding === "topics" ? "Add Topics" : "Add Section"}
          </div>
          <fieldset className="Fieldset w-full items-baseline flex mb-4">
            <Label className="Label w-1/4 text-sm " htmlFor="name">
              {adding === "topics" ? "Select Section" : "Section Name"}
            </Label>
            {adding === "topics" ? (
              <div className="relative w-3/4">
                <Input
                  className="mb-0 border-sky-900"
                  placeholder="Search for a section..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredSections.length > 0 && searchTerm.length > 0 && (
                  <ul className="absolute w-full bg-black text-white border border-sky-900 rounded-lg mt-0 max-h-40 overflow-y-auto">
                    {filteredSections.map((sec) => (
                      <li
                        key={sec.id}
                        onClick={() => handleSelectSection(sec)}
                        className="px-4 py-2 cursor-pointer hover:bg-sky-500"
                      >
                        {sec.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Input
                className="Input border border-sky-900 rounded-md pl-2 h-10 w-3/4 focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Add Section title"
                id="name"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            )}
          </fieldset>
          <fieldset className="Fieldset w-full items-baseline flex mb-4">
            <Label className="Label w-1/4 text-sm " htmlFor="topics">
              Topics
            </Label>
            <Input
              className="Input border border-sky-900 rounded-md pl-2  h-10 w-3/4 focus:outline-none focus:ring-2 focus:ring-sky-400"
              id="topics"
              placeholder="Add a topic and press Enter"
              onKeyDown={handleAddTopic}
              onChange={(e) => setTopic(e.target.value)}
              value={topic}
            />
          </fieldset>
          <div className="mb-0">
            <ul className="list-none flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <li
                  className="flex items-center gap-2 bg-sky-900 px-3 py-1 rounded-md text-white"
                  key={index}
                >
                  {topic}
                  <button
                    className="text-white hover:text-sky-600 transition-colors duration-200 ease-in-out"
                    onClick={() => handleRemoveTopic(index)}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center mt-4">
            <Button disabled={topics.length === 0 || section === ""} onClick={handleAddSection}>
              + Add
            </Button>
          </div>
        </div>

        {created && (
          <div className="mt-2 border-2 p-2 rounded-lg bg-green-500">
            {adding === "topics"
              ? "Topics added successfully"
              : "Section and Topics added successfully"}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddSection
