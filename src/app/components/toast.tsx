"use client";
import { toast } from "react-toastify";

export const notify = (message:string, style?:object) => toast(message, { theme: "dark", ...style });

