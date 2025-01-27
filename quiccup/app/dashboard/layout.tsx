// This is the dashboard layout that will wrap all dashboard pages
'use client'
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="">
        {children}
      </main>
    </div>
  )
} 