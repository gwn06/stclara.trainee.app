"use client";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: any) {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded p-2 border hover:bg-gray-100 hover:text-black"
      type="submit"
      aria-disabled={pending}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  );
}
