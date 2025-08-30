import { Router } from 'express'
import { transformTone } from '../services/mistralService.js'
import { validateToneRequest } from '../middleware/validation.js'

const router = Router()

router.post('/transform-tone', validateToneRequest, async (req, res, next) => {
  try {
    const { text, tone } = req.body

    if (!text || !tone) {
      return res.status(400).json({
        error: 'Text and tone are required'
      })
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'Text is too long. Maximum 5000 characters allowed.'
      })
    }

    const transformedText = await transformTone(text, tone)
    
    res.json({
      text: transformedText,
      originalText: text,
      tone: tone,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    next(error)
  }
})

export { router as toneRouter }
