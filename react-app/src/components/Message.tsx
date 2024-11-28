import React from 'react'

type messageFunction = {
    singleMessage: string;
    upvoteCallback: () => void;
}

const Message = ({singleMessage, upvoteCallback}: messageFunction) => {
  return (
    <div className="flex justify-between text-white p-4 my-1">
      <div className="">{singleMessage}</div>
      <div>
        <div className="h-[10px]"></div>
        <div className="flex">
          <div className="cursor-pointer">
            {/* up arrow */}
            <div className="px-1">
              <div className="flex justify-center">0</div>
              <button
                className="text-3xl font-bold underline"
                onClick={upvoteCallback}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="cursor-pointer">
            {/* up arrow */}
            <div className="px-1">
              <div className="flex justify-center">0</div>
              <button className="text-3xl font-bold underline">
                {/* down arrow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
