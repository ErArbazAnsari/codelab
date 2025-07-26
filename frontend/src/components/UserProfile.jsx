"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import axiosClient from "../utils/axiosClient"
import { Calendar, Trophy, Target, Zap, Award } from "lucide-react"

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [statsResponse, bookmarksResponse] = await Promise.all([
        axiosClient.get("/stats/my-stats"),
        axiosClient.get("/bookmarks/my-bookmarks"),
      ])

      setStats(statsResponse.data)
      setBookmarks(bookmarksResponse.data)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Profile Header */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex items-center space-x-6">
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                <span className="text-3xl">{user?.firstName?.charAt(0)}</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-base-content/70">{user?.emailId}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="badge badge-primary">Rank #{stats?.ranking || "Unranked"}</div>
                <div className="flex items-center space-x-1">
                  <Zap size={16} className="text-orange-500" />
                  <span>{stats?.currentStreak || 0} day streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Overview */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <Trophy className="text-yellow-500" />
                Problem Solving Stats
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="stat">
                  <div className="stat-title">Total Solved</div>
                  <div className="stat-value text-primary">{stats?.totalSolved || 0}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Easy</div>
                  <div className="stat-value text-success">{stats?.easySolved || 0}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Medium</div>
                  <div className="stat-value text-warning">{stats?.mediumSolved || 0}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Hard</div>
                  <div className="stat-value text-error">{stats?.hardSolved || 0}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="stat">
                  <div className="stat-title">Acceptance Rate</div>
                  <div className="stat-value">{stats?.acceptanceRate || 0}%</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Max Streak</div>
                  <div className="stat-value text-orange-500">{stats?.maxStreak || 0}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Total Submissions</div>
                  <div className="stat-value">{stats?.totalSubmissions || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Topic-wise Progress */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <Target className="text-blue-500" />
                Topic-wise Progress
              </h2>

              <div className="space-y-4">
                {Object.entries(stats?.solvedByTopic || {}).map(([topic, count]) => (
                  <div key={topic} className="flex items-center justify-between">
                    <span className="capitalize font-medium">{topic}</span>
                    <div className="flex items-center space-x-2">
                      <div className="badge badge-outline">{count} solved</div>
                      <progress className="progress progress-primary w-32" value={count} max="50"></progress>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <Award className="text-purple-500" />
                Badges
              </h2>

              {stats?.badges?.length > 0 ? (
                <div className="space-y-2">
                  {stats.badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="badge badge-secondary">{badge.name}</div>
                      <span className="text-sm text-base-content/70">{badge.description}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/70">No badges earned yet. Keep solving!</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <Calendar className="text-green-500" />
                Recent Activity
              </h2>

              {stats?.lastSolvedDate ? (
                <div className="space-y-2">
                  <p className="text-sm">Last solved: {new Date(stats.lastSolvedDate).toLocaleDateString()}</p>
                  <p className="text-sm">Current streak: {stats.currentStreak} days</p>
                </div>
              ) : (
                <p className="text-base-content/70">No recent activity</p>
              )}
            </div>
          </div>

          {/* Bookmarked Problems */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Bookmarked Problems</h2>

              {bookmarks.length > 0 ? (
                <div className="space-y-2">
                  {bookmarks.slice(0, 5).map((problem) => (
                    <div key={problem._id} className="flex items-center justify-between">
                      <span className="text-sm truncate">{problem.title}</span>
                      <div
                        className={`badge badge-sm ${
                          problem.difficulty === "easy"
                            ? "badge-success"
                            : problem.difficulty === "medium"
                              ? "badge-warning"
                              : "badge-error"
                        }`}
                      >
                        {problem.difficulty}
                      </div>
                    </div>
                  ))}
                  {bookmarks.length > 5 && (
                    <p className="text-sm text-base-content/70">+{bookmarks.length - 5} more bookmarks</p>
                  )}
                </div>
              ) : (
                <p className="text-base-content/70">No bookmarked problems</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
