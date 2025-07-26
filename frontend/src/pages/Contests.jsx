import React from "react";
import { useTheme } from "../utils/ThemeContext.jsx";


const demoContests = [
  {
    id: 1,
    name: "Summer Coding Challenge",
    date: "2025-08-10",
    problems: 5,
    status: "Upcoming"
  },
  {
    id: 2,
    name: "Spring Hackathon",
    date: "2025-04-15",
    problems: 8,
    status: "Completed"
  },
  {
    id: 3,
    name: "Weekly Contest #42",
    date: "2025-07-20",
    problems: 4,
    status: "Ongoing"
  }
];

const Contests = () => {
    const { theme } = useTheme();
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-pureblack text-lightgray' : 'bg-base-100'} transition-colors duration-300`}>
      <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12 lg:py-16">
        <div className={`card ${theme === 'dark' ? 'bg-darkgray text-lightgray border-lightgray' : 'bg-base-100'} rounded-2xl shadow-lg border border-base-300 mb-10`}>
          <div className="card-body">
            <h1 className="text-4xl font-bold mb-6">Contests</h1>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Problems</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {demoContests.map(contest => (
                    <tr key={contest.id}>
                      <td className="font-semibold">{contest.name}</td>
                      <td>{contest.date}</td>
                      <td>{contest.problems}</td>
                      <td>
                        <span className={`badge ${contest.status === "Upcoming" ? "badge-info" : contest.status === "Ongoing" ? "badge-success" : "badge-ghost"}`}>{contest.status}</span>
                      </td>
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

export default Contests;
