'use client'

interface PreviewButtonProps {
  websiteId: string
}

export function PreviewButton({ websiteId }: PreviewButtonProps) {
  const handlePreview = () => {
    // Open preview in new tab
    window.open(`/preview/${websiteId}`, '_blank')
  }

  return (
    <button
      onClick={handlePreview}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
    >
      Preview Website
    </button>
  )
}