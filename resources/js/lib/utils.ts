// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// export const getAvatar = (name: string) => {
//   const names = name.split(" ");
//   return names[0].substring(0, 1) + names?.[1].substring(0, 1).toUpperCase();
// };

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAvatar = (name: string = "") => {
  if (!name.trim()) return "?"; // Jika kosong, tampilkan tanda tanya

  const names = name.split(" ");
  const firstLetter = names[0]?.substring(0, 1).toUpperCase();
  const secondLetter = names[1]?.substring(0, 1).toUpperCase() || "";

  return firstLetter + secondLetter;
};
