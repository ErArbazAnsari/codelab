import React from "react";
import { useTheme } from "../utils/ThemeContext.jsx";


const demoDiscussions = [
  {
    id: 1,
    title: "How to solve the Summer Coding Challenge problem 3?",
    author: "Alice",
    replies: 5,
    lastReply: "2025-07-25"
  },
  {
    id: 2,
    title: "Tips for JavaScript optimization",
    author: "Bob",
    replies: 2,
    lastReply: "2025-07-26"
  },
  {
    id: 3,
    title: "Weekly Contest #42 - Editorial Discussion",
    author: "Charlie",
    replies: 8,
    lastReply: "2025-07-27"
  }
];

const Discuss = () => {
    const { theme } = useTheme();
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-pureblack text-lightgray' : 'bg-base-100'} transition-colors duration-300`}>
      <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12 lg:py-16">
        <div className={`card ${theme === 'dark' ? 'bg-darkgray text-lightgray border-lightgray' : 'bg-base-100'} rounded-2xl shadow-lg border border-base-300 mb-10`}>
          <div className="card-body">
            <h1 className="text-4xl font-bold mb-6">Discussion Forum</h1>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Replies</th>
                    <th>Last Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {demoDiscussions.map(discussion => (
                    <tr key={discussion.id}>
                      <td className="font-semibold">{discussion.title}</td>
                      <td>{discussion.author}</td>
                      <td>{discussion.replies}</td>
                      <td>{discussion.lastReply}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discuss;
