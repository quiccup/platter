import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateUniqueSubdomain(restaurantName: string) {
  // Convert restaurant name to slug
  const baseSlug = restaurantName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, '')      // Remove leading/trailing dashes

  // Add random 4 characters
  const randomChars = Math.random().toString(36).substring(2, 6)
  return `${baseSlug}-${randomChars}`
}