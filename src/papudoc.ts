type Handler = (api: any) => void

let handler: Handler | null = null

export function papudoc(api: any) {
  handler?.(api)
}

export function setPapudocHandler(newHandler: Handler | null) {
  handler = newHandler
}