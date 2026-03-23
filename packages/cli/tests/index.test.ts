import { expect, test } from "vite-plus/test";
import { encode } from "../src/preset/encode";
import { decode } from "../src/preset/decode";

test("encode/decode round-trips correctly", () => {
  const input = {
    framework: "react" as const,
    typescript: true,
    styleEngine: "tailwind" as const,
    themeDefault: "espresso",
    darkMode: "data-attribute" as const,
  };
  const preset = encode(input);
  const result = decode(preset);
  expect(result).toEqual(input);
});

test("encode/decode handles vue + class dark mode", () => {
  const input = {
    framework: "vue" as const,
    typescript: false,
    styleEngine: "tailwind" as const,
    themeDefault: "espresso",
    darkMode: "class" as const,
  };
  expect(decode(encode(input))).toEqual(input);
});
