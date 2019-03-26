export type ErrorInfo = {
  error?: Error | null,
  url?: string,
  line?: number,
  col?: number,
  info?: {
    extra?: string,
    componentStack?: string
  },
  message?: string
}