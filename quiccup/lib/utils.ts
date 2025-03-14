import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateUniqueSubdomain(name: string): Promise<string> {
  let baseName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  
  return `${baseName}-${randomSuffix}`;
}
