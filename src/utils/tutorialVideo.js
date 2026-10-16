import { getLessonLinkUrl } from './lessonLinks.js'

export function getTutorialVideo(value) {
  const href = getLessonLinkUrl(value)
  if (!href) return null
  const url = new URL(href)
  const host = url.hostname.replace(/^www\./, '')
  const parts = url.pathname.split('/').filter(Boolean)
  if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'youtu.be'].includes(host)) {
    const id = host === 'youtu.be' ? parts[0]
      : ['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : url.searchParams.get('v')
    return /^[\w-]{11}$/.test(id || '')
      ? { type: 'embed', src: `https://www.youtube-nocookie.com/embed/${id}` }
      : null
  }
  if (['vimeo.com', 'player.vimeo.com'].includes(host)) {
    const id = host === 'player.vimeo.com' && parts[0] === 'video' ? parts[1] : parts[0]
    if (!/^\d+$/.test(id || '')) return null
    const hash = url.searchParams.get('h') || (host === 'vimeo.com' ? parts[1] : '')
    const embed = new URL(`https://player.vimeo.com/video/${id}`)
    if (hash) embed.searchParams.set('h', hash)
    return { type: 'embed', src: embed.href }
  }
  return /\.(mp4|webm|ogg)$/i.test(url.pathname) ? { type: 'file', src: href } : null
}
