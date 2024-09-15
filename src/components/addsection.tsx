"use client"
import React, { useEffect, useState } from "react"
import { createNewSection, createNewTopic, getSectionsall } from "@projectforum/app/actions"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPortal,
  DialogOverlay
} from "@projectforum/components/shadcn/dialog"
import { Button } from "@shadcn/button"

function AddSection() {
  const [isOpen, setOpen] = useState(false)
  const [section, setSection] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [topic, setTopic] = useState("")
  const [adding, setAdding] = useState("")
  const [allSects, setAllSects] = useState<{ id: string; name: string }[]>([])

  const allSections = async () => {
    const temp = await getSectionsall()
    setAllSects(temp)
  }

  useEffect(() => {
    allSections()
  }, [])

  const isAnyId = (sec: string) => {
    if (!section) return false
    const id = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return id.test(sec)
  }

  const handleAddSection = async () => {
    const newFoerm = new FormData()
    let sectId = ""
    if (!isAnyId(section)) {
      newFoerm.append("name", section)

      sectId = await createNewSection(newFoerm)
    } else {
      sectId = section
    }
    if (topics.length > 0) {
      topics.map((t) => {
        console.log(t)
        const tempForm = new FormData()
        tempForm.append("name", t)
        tempForm.append("section_id", sectId)
        createNewTopic(tempForm)
      })
    }
  }

  const handleAddsec = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSection(event.target.value)
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

  const handleAdding = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAdding(event.target.value)
  }

  const handleRemoveTopic = (indexToRemove: number) => {
    const updatedTopics = topics.filter((_, index) => index !== indexToRemove)
    setTopics(updatedTopics)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSection("")
      setTopics([])
      console.log("Dialog just closed")
    }
    setOpen(open)
  }

  return (
    <div className="p-3 pl-6">
      <h1 className="text-lg font-bold h-20 text-white">Add Section/Topic</h1>
      <div className="w-full h-80 flex items-center flex-col  justify-center">
        <div className="text-xl mb-3 hover:text-2xl transition-all duration-200 ease-in-out">
          What do you want to create ?
        </div>
        <div>
          <select
            name=""
            id="adder"
            onChange={handleAdding}
            className="appearance-none bg-inherit border-2 mb-3 text-center focus:outline-none rounded-lg border-sky-950 bg-slate-900 p-1 w-40"
          >
            <option defaultChecked className="bg-slate-900" value=""></option>
            <option className="bg-slate-900" value="section">
              Section
            </option>
            <option className="bg-slate-900" value="topic">
              Topic
            </option>
          </select>
        </div>
        <div className="flex">
          {adding === "topic" && (
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button>+ Add Topics</Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                  <DialogTitle className="DialogTitle mb-3 mt-2 text-xl font-semibold">
                    Add Topics
                  </DialogTitle>
                  <DialogDescription className="DialogDescription mb-4 text-sm text-gray-500">
                    Add the topics to the section.
                  </DialogDescription>
                  <fieldset className="Fieldset w-full items-baseline flex mb-4">
                    <label className="Label w-1/4 text-sm text-gray-600" htmlFor="name">
                      Select Section
                    </label>
                    <select
                      className="appearance-none mb-3 bg-gray-100 focus:ring-2 text-center focus:ring-sky-400 border-sky-900 text-gray-700 focus:outline-none rounded-lg h-10 border outline-0 p-1 w-3/4"
                      defaultValue={section}
                      onChange={handleAddsec}
                      name=""
                      id=""
                    >
                      <option value="">Select a section to add topics</option>
                      {allSects.map((sec) => {
                        return (
                          <option key={sec + "random"} value={sec.id}>
                            {sec.name}
                          </option>
                        )
                      })}
                    </select>
                  </fieldset>
                  <fieldset className="Fieldset w-full items-baseline flex mb-4">
                    <label className="Label w-1/4 text-sm text-gray-600" htmlFor="topics">
                      Topics
                    </label>
                    <input
                      className="Input bg-gray-100 border border-sky-900 rounded-md pl-2 text-gray-700 h-10 w-3/4 focus:outline-none focus:ring-2 focus:ring-sky-400"
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
                    <DialogClose asChild>
                      <Button onClick={handleAddSection}>+ Add</Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          )}
          {adding === "section" && (
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button>+ Add Section</Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                  <DialogTitle className="DialogTitle mb-3 mt-2 text-xl font-semibold">
                    Add Section
                  </DialogTitle>

                  <DialogDescription className="DialogDescription mb-4 text-sm text-gray-500">
                    Add the sections and topics needed.
                  </DialogDescription>
                  <fieldset className="Fieldset w-full items-baseline flex mb-4">
                    <label className="Label w-1/4 text-sm text-gray-600" htmlFor="name">
                      Section Name
                    </label>
                    <input
                      className="Input bg-gray-100 border border-sky-900 rounded-md pl-2 text-gray-700 h-10 w-3/4 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder="Add Section title"
                      id="name"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="Fieldset w-full items-baseline flex mb-4">
                    <label className="Label w-1/4 text-sm text-gray-600" htmlFor="topics">
                      Topics
                    </label>
                    <input
                      className="Input bg-gray-100 border border-sky-900 rounded-md pl-2 text-gray-700 h-10 w-3/4 focus:outline-none focus:ring-2 focus:ring-sky-400"
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
                          className="flex items-center gap-2 bg-sky-900 px-3 py-1  rounded-md text-white"
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
                    <DialogClose asChild>
                      <Button onClick={handleAddSection}>+ Add</Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddSection
