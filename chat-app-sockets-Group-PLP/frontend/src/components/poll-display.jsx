import { useState } from "react";

export default function PollDisplay({ poll, currentUser, onVote, userColors }) {
  const [expanded, setExpanded] = useState(true);

  // Calculate total votes
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  // Check if user has already voted
  const hasVoted = poll.options.some((option) =>
    option.voters.includes(currentUser)
  );

  // Find which option the user voted for
  const userVotedOptionIndex = poll.options.findIndex((option) =>
    option.voters.includes(currentUser)
  );

  return (
    <div className="mb-4 mx-auto w-full max-w-[90%] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-indigo-50 px-4 py-3 flex justify-between items-center">
        <div>
          <span className="text-sm text-indigo-600 font-medium">Poll by </span>
          <span
            className="font-medium"
            style={{ color: userColors[poll.creator] || "#4F46E5" }}
          >
            {poll.creator === currentUser ? "You" : poll.creator}
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {expanded ? (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </button>
      </div>

      {expanded && (
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {poll.question}
          </h3>

          <div className="space-y-3">
            {poll.options.map((option, index) => {
              // Calculate percentage
              const percentage =
                totalVotes === 0
                  ? 0
                  : Math.round((option.votes / totalVotes) * 100);

              // Determine if this is the option the user voted for
              const isUserVote = userVotedOptionIndex === index;

              return (
                <div key={index} className="relative">
                  {/* Progress bar background */}
                  <div
                    className="absolute inset-0 bg-indigo-50 rounded-md"
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative flex items-center p-3 z-10">
                    {/* Vote button or indicator */}
                    {!hasVoted ? (
                      <button
                        onClick={() => onVote(poll.id, index)}
                        className="mr-3 h-5 w-5 rounded-full border-2 border-indigo-500 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      />
                    ) : (
                      <div
                        className={`mr-3 h-5 w-5 rounded-full flex-shrink-0 ${
                          isUserVote
                            ? "bg-indigo-500"
                            : "border-2 border-gray-300"
                        }`}
                      />
                    )}

                    {/* Option text and votes */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-gray-900">{option.text}</span>
                        <span className="text-gray-500 text-sm">
                          {option.votes} vote{option.votes !== 1 ? "s" : ""} (
                          {percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {totalVotes} total vote{totalVotes !== 1 ? "s" : ""} •
            {hasVoted ? (
              <span className="ml-1 text-indigo-600">You voted</span>
            ) : (
              <span className="ml-1">Click an option to vote</span>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-400">
            Created {new Date(poll.createdAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
