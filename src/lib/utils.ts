import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const timeDifference = endDate.getTime() - startDate.getTime()
  return Math.ceil(timeDifference / (1000 * 3600 * 24))
}

export function calculateFine(daysOverdue: number, finePerDay: number = 0.50): number {
  return Math.max(0, daysOverdue * finePerDay)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidISBN(isbn: string): boolean {
  // Remove hyphens and spaces
  const cleanISBN = isbn.replace(/[-\s]/g, '')
  
  // Check if it's ISBN-10 or ISBN-13
  if (cleanISBN.length === 10) {
    return isValidISBN10(cleanISBN)
  } else if (cleanISBN.length === 13) {
    return isValidISBN13(cleanISBN)
  }
  
  return false
}

function isValidISBN10(isbn: string): boolean {
  let sum = 0
  for (let i = 0; i < 9; i++) {
    if (!/\d/.test(isbn[i])) return false
    sum += parseInt(isbn[i]) * (10 - i)
  }
  
  const lastChar = isbn[9]
  if (lastChar === 'X') {
    sum += 10
  } else if (/\d/.test(lastChar)) {
    sum += parseInt(lastChar)
  } else {
    return false
  }
  
  return sum % 11 === 0
}

function isValidISBN13(isbn: string): boolean {
  let sum = 0
  for (let i = 0; i < 12; i++) {
    if (!/\d/.test(isbn[i])) return false
    const weight = i % 2 === 0 ? 1 : 3
    sum += parseInt(isbn[i]) * weight
  }
  
  if (!/\d/.test(isbn[12])) return false
  const checkDigit = parseInt(isbn[12])
  const calculatedCheckDigit = (10 - (sum % 10)) % 10
  
  return checkDigit === calculatedCheckDigit
}