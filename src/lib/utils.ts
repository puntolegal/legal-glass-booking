import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Valida un RUT chileno (formato 12.345.678-5)
export function validateRUT(rut: string): boolean {
  rut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (rut.length < 8) return false;
  const body = rut.slice(0, -1);
  let dv = rut.slice(-1);
  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  let expectedDV: string;
  const dvNum = 11 - (sum % 11);
  if (dvNum === 11) expectedDV = "0";
  else if (dvNum === 10) expectedDV = "K";
  else expectedDV = dvNum.toString();
  return dv === expectedDV;
}
