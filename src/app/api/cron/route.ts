import { NextResponse } from "next/server"
import { job } from "./cron"
import { logCronJob } from "./helper"

export const fetchCache = "force-no-store"

export async function GET() {
  if (!job.running) {
    job.start()
    logCronJob("Cron job started successfully")
    return NextResponse.json({ message: "Cron job started successfully" }, { status: 200 })
  }
  logCronJob("Cron job is already running")
  return NextResponse.json({ message: "Cron job is already running" }, { status: 200 })
}

export async function POST() {
  if (!job.running) {
    job.start()
    logCronJob("Cron job started successfully")
    return NextResponse.json({ message: "Cron job started successfully" }, { status: 200 })
  }
  logCronJob("Cron job is already running")
  return NextResponse.json({ message: "Cron job is already running" }, { status: 200 })
}
