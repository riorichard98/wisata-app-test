const CDN_WISATA_URL = 'https://cdn.wisata.app'
const CDN_TWITTER_URL = 'https://pbs.twimg.com'
const CDN_WISATA_IMG_SIZE = {
  TH: 'th',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
}

/**
 * TASK: Find available image size for Twitter CDN
 */
const CDN_TWITTER_IMG_SIZE = {
  THUMB: 'thumb',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
}

/**
 * TASK: Replace original image URL with size-optimized image URL.
 * @example
 * For Wisata CDN URL:
 * ```
 * https://cdn.wisata.app/diary/87511695-cafc-401b-8eba-2db648083556.jpg
 * - https://cdn.wisata.app/diary/87511695-cafc-401b-8eba-2db648083556_th.jpg
 * - https://cdn.wisata.app/diary/87511695-cafc-401b-8eba-2db648083556_lg.jpg
 * ```
 *
 * Note that some images may not have optimized URL variants.
 */
export function getSizeOptimizedImageUrl(originalUrl, desiredSize) {
  try {
    const url = new URL(originalUrl)
    const hostname = url.hostname

    // Handle Wisata CDN
    if (hostname === new URL(CDN_WISATA_URL).hostname) {
      const path = url.pathname
      const dotIndex = path.lastIndexOf('.')
      if (dotIndex === -1) return originalUrl // No extension

      const base = path.substring(0, dotIndex)
      const ext = path.substring(dotIndex)
      desiredSize = CDN_WISATA_IMG_SIZE[desiredSize]
      if (!desiredSize) {
        return originalUrl
      }
      const optimizedPath = `${base}_${desiredSize}${ext}`
      return `${url.origin}${optimizedPath}`
    }

    // Handle Twitter CDN
    if (hostname === new URL(CDN_TWITTER_URL).hostname) {
      desiredSize = CDN_TWITTER_IMG_SIZE[desiredSize]
      if (!desiredSize) {
        return originalUrl
      }
      url.searchParams.set('name', desiredSize)
      return url.toString()
    }

    // Unknown CDN, return original
    return originalUrl
  } catch {
    // Malformed URL or unexpected error
    return originalUrl
  }
}

/**
 * TASK: Extracts SEO attributes from diary content
 */
export function getDiaryContentSEOAttributes(contentData) {
  if (!contentData || typeof contentData !== 'string') {
    // default value of extracted (descripton , images , videos)
    return {
      description: '',
      images: [],
      videos: [],
    }
  }

  // images & videos in content data will be stored below
  const images = []
  const videos = []

  // === Extract image URLs from "![](url)"
  // image searching position begin at index 0
  let imageSearchPos = 0
  while (true) {
    // finding index of url of image started with ![](
    const imageStart = contentData.indexOf('![](', imageSearchPos)
    // if not found break the loop
    if (imageStart === -1) break

    // url string index started after ![]( which is +4
    const urlStart = imageStart + 4 // position after "![]("
    // get the ")" index that will be used for slicing in the next step for getting url
    const urlEnd = contentData.indexOf(')', urlStart)
    // if there is no ')' means invalid image , then break the loop
    if (urlEnd === -1) break
    // slice from the first index of url , until before the index of ")"
    const url = contentData.slice(urlStart, urlEnd).trim()
    // push image found
    images.push(url)
    // change the next image searh position right after ")" for next search
    imageSearchPos = urlEnd + 1
  }

  // === Extract TikTok URLs from <TiktokEmbed url="..." />
  // video searching position begin at index 0
  let videoSearchPos = 0
  while (true) {
    // finding the index of titkok embed tag
    const tagStart = contentData.indexOf('<TiktokEmbed', videoSearchPos)
    // if index == -1 break (no video found)
    if (tagStart === -1) break
    // string before url value
    const urlKey = 'url="'
    // finding index string 'url=' for getting the url string after that
    const urlStart = contentData.indexOf(urlKey, tagStart)
    // if there is no url break
    if (urlStart === -1) break
    // url value index start right after 'url="'
    const urlValueStart = urlStart + urlKey.length
    // finding '"' index as sign of finished url index for slicing in next step
    const urlValueEnd = contentData.indexOf('"', urlValueStart)
    // if not found means invalid url use in titkok embed tag
    if (urlValueEnd === -1) break
    // slice the url from url value started and before '"' (complete url)
    const videoUrl = contentData.slice(urlValueStart, urlValueEnd).trim()
    // push video url to videos stored
    videos.push(videoUrl)
    // add +1 at '"" index for next search starting position
    videoSearchPos = urlValueEnd + 1
  }

  // === Extract description from first paragraph
  // Remove image and TikTok tags first
  let cleanText = contentData
  // temporary position index for found '![](' and '<TiktokEmbed'
  let tempPos

  // Remove all ![](image-url)
  // loop will run while index of image url (temporary position) is still there (!== -1)
  while ((tempPos = cleanText.indexOf('![](')) !== -1) {
    // close index for image from current temporary position
    const close = cleanText.indexOf(')', tempPos)
    // if close is not found , break
    if (close === -1) break
    // re-assign clean text with 2 string before the found '![](' and after ')'
    cleanText = cleanText.slice(0, tempPos) + cleanText.slice(close + 1)
  }

  // Remove <TiktokEmbed url="..." />
  // loop will run while index of video url (temporary position) is still there (!== -1)
  while ((tempPos = cleanText.indexOf('<TiktokEmbed')) !== -1) {
    // close index for video tag from current temporary position
    const close = cleanText.indexOf('/>', tempPos)
    // if close is not found , break
    if (close === -1) break
    // re-assign clean text with 2 string before the found '<TiktokEmbed' and after '/>'
    cleanText = cleanText.slice(0, tempPos) + cleanText.slice(close + 2)
  }

  // Remove markdown symbols like ###, **, -, etc
  cleanText = cleanText
    .split('\n') // split text per-line in content
    .map(line => line.replace(/[*#>-]/g, '').trim()) // replacing markdown character for clean string
    .filter(line => line.length > 0)[0] || '' // take first non-empty line

  // description is first line and limited to only 160 in length
  const description = cleanText.slice(0, 160)
  return {
    description,
    images,
    videos
  }
}

/**
 * TASK: Convert diary content to renderable data
 * 
 * The content coming from `/cms/diary` is in MDX (Markdown with Embedded Components) format. This function help render that content.
 * 
 * Known MDX components are:
 * - \<YoutubeEmbed />
 * - \<InstagramEmbed />
 * - \<TiktokEmbed />
 * - \<TwitterEmbed />
 */
export function renderDiaryContent(contentData) {
}
