// This is the dashboard layout that will wrap all dashboard pages
'use client'
import { useAuth } from "@/providers/auth-provider"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="">
        {children}
      </main>
    </div>
  )
} 