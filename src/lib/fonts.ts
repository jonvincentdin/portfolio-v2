import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";

/**
 * Typography pairing — see .claude/context/DESIGN_SYSTEM.md
 *
 * Space Grotesk  -> headings (--font-heading)
 * JetBrains Mono -> technical / metadata labels (--font-technical)
 * Inter          -> body copy (--font-body)
 *
 * Each font exposes a CSS variable consumed by the Tailwind theme in
 * globals.css, so components use `font-heading` / `font-technical` /
 * `font-body` utility classes rather than referencing the font objects
 * directly.
 */

export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const fontVariables = `${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable}`;
