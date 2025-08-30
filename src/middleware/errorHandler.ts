import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error)

  // Handle specific error types
  if (error.message.includes('Mistral API key not configured')) {
    return res.status(500).json({
      error: 'API configuration error. Please contact support.'
    })
  }

  if (error.message.includes('Rate limit exceeded')) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please try again later.'
    })
  }

  if (error.message.includes('Invalid Mistral API key')) {
    return res.status(500).json({
      error: 'Authentication error. Please contact support.'
    })
  }

  if (error.message.includes('Network error')) {
    return res.status(503).json({
      error: 'Service temporarily unavailable. Please try again.'
    })
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error. Please try again later.'
  })
}
