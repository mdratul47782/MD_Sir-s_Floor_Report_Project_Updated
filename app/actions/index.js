"use server";
import { redirect } from "next/navigation";
import { userModel } from "@/app/models/user-model"; // adjust path

async function performLogin(formData) {
  const username = formData.get("username"); // from input field
  const password = formData.get("password");

  // Find user by username (stored in 'email' field in your DB)
  const found = await userModel.findOne({ email: username });

  if (!found) {
    throw new Error(`User with username "${username}" not found`);
  }

  // Check plain password
  if (found.password !== password) {
    throw new Error("Incorrect password");
  }

  // Successful login → redirect
  redirect("/DashboardClient");
}

export { performLogin };
