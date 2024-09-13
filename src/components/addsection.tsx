"use client"
import React, { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { createNewSection, createNewTopic, getSectionsall } from "@projectforum/app/actions"

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
    console.log(topics)
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
            <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
              <Dialog.Trigger asChild>
                <button className="bg-sky-500 text-white p-2 rounded-md hover:bg-sky-900 transition duration-200 ease-in-out w-50 h-8 flex items-center text-center">
                  + Add Topics
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out" />
                <Dialog.Content
                  className="DialogContent fixed bg-white pr-3 pl-3 pb-3 text-gray-800 w-4/12 h-auto z-auto shadow-lg shadow-sky-900 rounded-lg transform transition-transform duration-300 ease-in-out"
                  style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(1)" }}
                >
                  <div className="flex justify-between w-full items-center ">
                    <Dialog.Title className="DialogTitle mb-3 mt-2 text-xl font-semibold">
                      Add Topics
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="IconButton text-sky-600 hover:shadow-sky-900 transition-colors duration-200 ease-in-out"
                        aria-label="Close"
                      >
                        <Cross2Icon />
                      </button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="DialogDescription mb-4 text-sm text-gray-500">
                    Add the topics to the section.
                  </Dialog.Description>
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
                  <div className="mb-4">
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
                    <Dialog.Close asChild>
                      <button
                        onClick={handleAddSection}
                        className="bg-sky-500 text-white p-2 rounded-md hover:bg-sky-800 transition duration-200 ease-in-out"
                      >
                        + Add
                      </button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          )}
          {adding === "section" && (
            <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
              <Dialog.Trigger asChild>
                <button className="bg-sky-500 text-white p-2 rounded-md hover:bg-sky-900 transition duration-200 ease-in-out w-50 h-8 flex items-center text-center">
                  + Add Section
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out" />
                <Dialog.Content
                  className="DialogContent fixed bg-white pr-3 pl-3 pb-3 text-gray-800 w-4/12 h-auto z-auto shadow-lg shadow-sky-900 rounded-lg transform transition-transform duration-300 ease-in-out"
                  style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(1)" }}
                >
                  <div className="flex justify-between w-full items-center ">
                    <Dialog.Title className="DialogTitle mb-3 mt-2 text-xl font-semibold">
                      Add Section
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="IconButton text-sky-600 hover:shadow-sky-900 transition-colors duration-200 ease-in-out"
                        aria-label="Close"
                      >
                        <Cross2Icon />
                      </button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="DialogDescription mb-4 text-sm text-gray-500">
                    Add the sections and topics needed.
                  </Dialog.Description>
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
                  <div className="mb-4">
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
                    <Dialog.Close asChild>
                      <button
                        onClick={handleAddSection}
                        className="bg-sky-500 text-white p-2 rounded-md hover:bg-sky-800 transition duration-200 ease-in-out"
                      >
                        + Add
                      </button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddSection
