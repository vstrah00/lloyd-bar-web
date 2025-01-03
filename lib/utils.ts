import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date:string){
  return new Date(date).toLocaleDateString('en-GB', {
    day:"2-digit",
    month:"long",
    year:"numeric"
  })
}

export function formatDateCro(date:string){
  return new Date(date).toLocaleDateString('hr', {
    day:"2-digit",
    month:"long",
    year:"numeric"
  })
}