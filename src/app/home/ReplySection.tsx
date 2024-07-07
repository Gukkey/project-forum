"use client"

import React, { useState } from "react"

const RepliesSection = ({ threads }: { threads: any[] }) => {
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replies, setReplies] = useState<{ id: number; content: string }[]>([])
  const [newReply, setNewReply] = useState("")

  const handleReplyClick = () => {
    setShowReplyBox(true)
  }

  const handleReplySubmit = () => {
    if (newReply.trim()) {
      setReplies([...replies, { id: replies.length + 1, content: newReply }])
      setNewReply("")
      setShowReplyBox(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <div className="flex flex-col lg:flex-row p-6">
        <div className="flex-1 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Thread page</h2>
          <table className="w-full text-left">
            {threads.map((thread) => (
              <React.Fragment key={thread.id}>
                <thead>
                  <tr>
                    <th className="pb-2 border-b border-gray-700">{thread.title}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td dangerouslySetInnerHTML={{ __html: thread.content }}></td>
                  </tr>
                </tbody>
              </React.Fragment>
            ))}
          </table>

          <div className="mt-6">
            <h3 className="text-xl mb-4">Replies</h3>
            {replies.map((reply) => (
              <div key={reply.id} className="mt-2 bg-gray-700 p-4 rounded">
                {reply.content}
              </div>
            ))}
          </div>

          {showReplyBox ? (
            <div className="mt-4 bg-gray-700 p-4 rounded">
              <textarea
                className="w-full p-2 bg-gray-800 text-gray-300 rounded"
                rows={4}
                placeholder="Write your reply here..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
              />
              <button
                type="button"
                className="mt-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleReplySubmit}
              >
                Submit Reply
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleReplyClick}
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RepliesSection
