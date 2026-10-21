import { Password } from "@/generated/react/Password.tsx";

export function PasswordDemo() {
  return (
    <div className="password-demo-stack">
      <Password
        label="Password"
        placeholder="Enter your password"
        defaultValue="correct-horse-battery"
      />
      <Password
        label="Confirm password"
        placeholder="Repeat it"
        error="The passwords do not match."
      />
      <Password label="Disabled" defaultValue="locked" disabled />
    </div>
  );
}
