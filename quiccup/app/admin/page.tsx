'use client'
import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function AdminPage() {
    const { isSignedIn } = useUser();
  
    if (isSignedIn) {
        window.location.href = "/dashboard";
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center font-display text-3xl font-bold text-gray-900">
                        Sign Up to Platter
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to manage your restaurant content
                    </p>
                </div>
                <SignIn 
                    appearance={{
                        elements: {
                            formButtonPrimary: 
                                'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
                        },
                    }}
                    redirectUrl="/admin/dashboard"
                />
            </div>
        </div>
    );
}