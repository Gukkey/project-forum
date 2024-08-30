interface IContentCard {
  name: string
  content: string
  timestamp: string
  username: string
  role: string
}
export const ContentCard = ({ name, content, timestamp, username, role }: IContentCard) => {
  return (
    <div className="flex-1  bg-gray-800 p-6 rounded-lg">
      <div>
        <div className="border-b border-gray-700">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center my-2 ">
              <div className="w-9 h-9 rounded-full bg-slate-500"></div>
              <div className="">
                <p className="text-sm font-bold text-slate-400">{username}</p>
                <p className="text-sm ">{role}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">{timestamp}</p>
            </div>
          </div>
        </div>
        <h1 className="my-2 text-xl font-extrabold">{name}</h1>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  )
}
