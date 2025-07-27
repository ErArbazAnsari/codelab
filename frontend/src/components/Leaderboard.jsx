"use client"

import { useState, useEffect } from "react"
import axiosClient from "../utils/axiosClient"
import { Trophy, Medal, Award } from "lucide-react"

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchLeaderboard()
  }, [currentPage])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get(`/stats/leaderboard?page=${currentPage}&limit=50`)
      setLeaderboard(response.data)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={24} />
    if (rank === 2) return <Medal className="text-gray-400" size={24} />
    if (rank === 3) return <Award className="text-amber-600" size={24} />
    return <span className="text-lg font-bold">{rank}</span>
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return "badge-warning"
    if (rank === 2) return "badge-neutral"
    if (rank === 3) return "badge-accent"
    return "badge-ghost"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12 lg:py-16">
        <div className="card bg-base-100 rounded-2xl shadow-lg border border-base-300 mb-10">
          <div className="card-body">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">🏆 Leaderboard</h1>
              <p className="text-base-content/70">Top performers on our platform</p>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
              <th className="text-center">Rank</th>
              <th>User</th>
              <th className="text-center">Problems Solved</th>
              <th className="text-center">Easy</th>
              <th className="text-center">Medium</th>
              <th className="text-center">Hard</th>
              <th className="text-center">Acceptance Rate</th>
              <th className="text-center">Current Streak</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry._id} className={index < 3 ? "bg-base-200" : ""}>
                <td className="text-center">
                  <div className={`badge ${getRankBadge(entry.ranking)} gap-2`}>
                    {getRankIcon(entry.ranking)}
                    {entry.ranking > 3 && entry.ranking}
                  </div>
                </td>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                        <span className="text-xl">{entry.userId?.firstName?.charAt(0) || "U"}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">
                        {entry.userId?.firstName} {entry.userId?.lastName}
                      </div>
                      <div className="text-sm opacity-50">{entry.badges?.length || 0} badges</div>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  <div className="stat-value text-2xl text-primary">{entry.totalSolved}</div>
                </td>
                <td className="text-center">
                  <div className="badge badge-success">{entry.easySolved}</div>
                </td>
                <td className="text-center">
                  <div className="badge badge-warning">{entry.mediumSolved}</div>
                </td>
                <td className="text-center">
                  <div className="badge badge-error">{entry.hardSolved}</div>
                </td>
                <td className="text-center">
                  <div className="text-lg font-semibold">{entry.acceptanceRate}%</div>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-lg">🔥</span>
                    <span className="font-bold">{entry.currentStreak}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="btn-group">
                <button
                  className="btn"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button className="btn btn-active">{currentPage}</button>
                <button className="btn" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={leaderboard.length < 50}>
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
