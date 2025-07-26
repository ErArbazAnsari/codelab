"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router"
import axiosClient from "../utils/axiosClient"
import { MessageSquare, ThumbsUp, ThumbsDown, Reply, Plus } from "lucide-react"

const DiscussionForum = () => {
  const { problemId } = useParams()
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    tags: ["discussion"],
  })
  const [replyContent, setReplyContent] = useState({})

  useEffect(() => {
    fetchDiscussions()
  }, [problemId])

  const fetchDiscussions = async () => {
    try {
      const response = await axiosClient.get(`/discussions/problem/${problemId}`)
      setDiscussions(response.data.discussions)
    } catch (error) {
      console.error("Error fetching discussions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDiscussion = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosClient.post("/discussions/create", {
        problemId,
        ...newDiscussion,
      })

      setDiscussions([response.data, ...discussions])
      setNewDiscussion({ title: "", content: "", tags: ["discussion"] })
      setShowCreateForm(false)
    } catch (error) {
      console.error("Error creating discussion:", error)
    }
  }

  const handleVote = async (discussionId, voteType) => {
    try {
      const response = await axiosClient.post(`/discussions/${discussionId}/vote`, {
        voteType,
      })

      // Update the discussion with new vote counts
      setDiscussions(
        discussions.map((d) =>
          d._id === discussionId
            ? {
                ...d,
                upvotes: Array(response.data.upvotes).fill(null),
                downvotes: Array(response.data.downvotes).fill(null),
              }
            : d,
        ),
      )
    } catch (error) {
      console.error("Error voting:", error)
    }
  }

  const handleReply = async (discussionId) => {
    const content = replyContent[discussionId]
    if (!content?.trim()) return

    try {
      const response = await axiosClient.post(`/discussions/${discussionId}/reply`, {
        content,
      })

      setDiscussions(discussions.map((d) => (d._id === discussionId ? response.data : d)))

      setReplyContent({ ...replyContent, [discussionId]: "" })
    } catch (error) {
      console.error("Error adding reply:", error)
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2" />
          Discussions
        </h1>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
          <Plus size={16} />
          New Discussion
        </button>
      </div>

      {/* Create Discussion Modal */}
      {showCreateForm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Start a New Discussion</h3>

            <form onSubmit={handleCreateDiscussion}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Tags</span>
                </label>
                <select
                  className="select select-bordered"
                  value={newDiscussion.tags[0]}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, tags: [e.target.value] })}
                >
                  <option value="discussion">Discussion</option>
                  <option value="question">Question</option>
                  <option value="solution">Solution</option>
                  <option value="optimization">Optimization</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
                <button type="button" className="btn" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discussions List */}
      <div className="space-y-6">
        {discussions.map((discussion) => (
          <div key={discussion._id} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              {/* Discussion Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{discussion.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-base-content/70 mt-1">
                    <span>
                      by {discussion.userId?.firstName} {discussion.userId?.lastName}
                    </span>
                    <span>•</span>
                    <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                    <div className="flex space-x-1">
                      {discussion.tags?.map((tag, index) => (
                        <span key={index} className="badge badge-sm badge-outline">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Discussion Content */}
              <div className="mb-4">
                <p className="whitespace-pre-wrap">{discussion.content}</p>
              </div>

              {/* Voting and Actions */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-4">
                  <button className="btn btn-sm btn-ghost" onClick={() => handleVote(discussion._id, "upvote")}>
                    <ThumbsUp size={16} />
                    {discussion.upvotes?.length || 0}
                  </button>
                  <button className="btn btn-sm btn-ghost" onClick={() => handleVote(discussion._id, "downvote")}>
                    <ThumbsDown size={16} />
                    {discussion.downvotes?.length || 0}
                  </button>
                  <span className="text-sm text-base-content/70">{discussion.replies?.length || 0} replies</span>
                </div>
              </div>

              {/* Replies */}
              {discussion.replies?.length > 0 && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  {discussion.replies.map((reply, index) => (
                    <div key={index} className="bg-base-200 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">
                          {reply.userId?.firstName} {reply.userId?.lastName}
                        </span>
                        <span className="text-xs text-base-content/70">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              <div className="mt-4 border-t pt-4">
                <div className="flex space-x-2">
                  <textarea
                    className="textarea textarea-bordered flex-1 textarea-sm"
                    placeholder="Write a reply..."
                    value={replyContent[discussion._id] || ""}
                    onChange={(e) =>
                      setReplyContent({
                        ...replyContent,
                        [discussion._id]: e.target.value,
                      })
                    }
                  />
                  <button className="btn btn-primary btn-sm" onClick={() => handleReply(discussion._id)}>
                    <Reply size={16} />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {discussions.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-base-content/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
            <p className="text-base-content/70 mb-4">Be the first to start a discussion about this problem!</p>
            <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
              Start Discussion
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscussionForum
