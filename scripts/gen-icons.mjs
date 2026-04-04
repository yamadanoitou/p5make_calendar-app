import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync } from 'fs'

function draw(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const s = size

  // Background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, s, s)

  // Red parallelogram
  const grad = ctx.createLinearGradient(0, 0, s, s)
  grad.addColorStop(0, '#e5001a')
  grad.addColorStop(1, '#b3001a')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(s * 0.1, s * 0.08)
  ctx.lineTo(s * 0.95, s * 0.08)
  ctx.lineTo(s * 0.9, s * 0.92)
  ctx.lineTo(s * 0.05, s * 0.92)
  ctx.closePath()
  ctx.fill()

  // Text "P5"
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold italic ${s * 0.45}px "Arial Black", Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('P5', s * 0.5, s * 0.52)

  return canvas.toBuffer('image/png')
}

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192.png', draw(192))
writeFileSync('public/icons/icon-512.png', draw(512))
console.log('Icons generated: public/icons/icon-192.png, public/icons/icon-512.png')
