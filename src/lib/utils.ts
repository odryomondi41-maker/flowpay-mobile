import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Security Placeholders
export function hashPassword(password: string): string {
  // Placeholder: In real app, use bcrypt or a library
  return btoa(password).split('').reverse().join('');
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  // Simulate API call
  console.log(`Sending OTP ${otp} to email: ${email}`);
  return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
}

export function formatCurrency(amount: number | undefined | null): string {
  const value = amount ?? 0;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(value);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

/**
 * Checks if the payer refers to the payee number.
 * This logic can be customized based on business requirements.
 */
export function payerRefersPayeeNumber(payerPhone: string, recipientPhone: string): boolean {
  if (!payerPhone || !recipientPhone) return false;
  // Standardize formats (remove leading 0 or +254)
  const clean = (p: string) => p.replace(/^\\+254/, '').replace(/^0/, '');
  return clean(payerPhone) === clean(recipientPhone);
}