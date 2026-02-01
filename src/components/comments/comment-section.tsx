'use client'

import { useState } from 'react'
import { CommentForm } from './comment-form'
import { CommentList } from './comment-list'

interface CommentSectionProps {
  postSlug: string
  allowGuest?: boolean
  defaultAvatarUrl?: string
}

export function CommentSection({ postSlug, allowGuest, defaultAvatarUrl }: CommentSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCommentSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <CommentForm postSlug={postSlug} allowGuest={!!allowGuest} onSuccess={handleCommentSuccess} />
      <CommentList
        postSlug={postSlug}
        refreshTrigger={refreshTrigger}
        defaultAvatarUrl={defaultAvatarUrl}
        allowGuest={allowGuest}
      />
    </div>
  )
}
