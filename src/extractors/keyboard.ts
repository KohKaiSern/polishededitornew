import charmap from './charmap'

const valid_chars = [
  'a', 'b', 'c', 'd', 'e',
  'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y',
  'z', '-', 'é', "'d", "'l",
  "'m", "'r", "'s", "'t", "'v",
  '0', '1', '2', '3', '4',
  '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E',
  'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O',
  'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y',
  'Z', ' ', '/', '(', ')',
  '¥', '<PK>', '<MN>', '★', '♥',
  '♪', '?', '!', '♂', '♀',
  '.', ',', ':', '&', '%'
]
const keyboard = Object.fromEntries(
  Object.entries(charmap).filter(([_, v]) => valid_chars.includes(v)))

export default keyboard
