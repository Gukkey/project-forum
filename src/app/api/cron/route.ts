import { NextResponse } from "next/server"
import { job } from "./cron"

export async function GET() {
  if (!job.running) {
    job.start()
    return NextResponse.json({ message: "Cron job started successfully" }, { status: 200 })
  }
  return NextResponse.json({ message: "Cron job is already running" }, { status: 200 })
}
