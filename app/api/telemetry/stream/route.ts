import { NextRequest } from 'next/server'
import { telemetryHub } from '@/lib/telemetry/hub'

export const runtime = 'nodejs'

let listeners: Set<ReadableStreamDefaultController> = new Set()

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      listeners.add(controller)
      const handler = (evt: any) => {
        controller.enqueue(`data: ${JSON.stringify(evt)}\n\n`)
      }
      telemetryHub.on('telemetry', handler)
      // Remove on close
      ;(controller as any)._handler = handler
    },
    pull() {},
    cancel(reason) {
      // noop
    }
  })

  // Ensure the hub is started (singleton auto-starts on import)
  telemetryHub.start?.()

  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })

  return new Response(stream, { headers })
}


