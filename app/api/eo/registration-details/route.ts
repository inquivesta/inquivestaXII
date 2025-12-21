import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/eo-auth/session"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Verify session
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { registrationId } = await request.json()

    if (!registrationId) {
      return NextResponse.json(
        { error: "Registration ID is required" },
        { status: 400 }
      )
    }

    // Fetch registration details from the EO's assigned table
    const { data: registration, error } = await supabase
      .from(session.tableName)
      .select("*")
      .eq("id", registrationId)
      .single()

    if (error || !registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      registration,
    })
  } catch (error) {
    console.error("Registration details error:", error)
    return NextResponse.json(
      { error: "Failed to fetch registration details" },
      { status: 500 }
    )
  }
}
