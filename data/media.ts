export type MediaType = 'anime' | 'book' | 'movie' | 'drama' | 'game' | 'song'
type MediaState = 'done' | 'doing' | 'todo'

export interface MediaRecord {
  name: string
  creator?: string
  state?: MediaState
  date?: string
  note?: string
  lang?: string
}

const anime: MediaRecord[] = []

const book: MediaRecord[] = []

const movie: MediaRecord[] = []

const drama: MediaRecord[] = []

const game: MediaRecord[] = []

const song: MediaRecord[] = []

export const media: Record<MediaType, MediaRecord[]> = {
  anime,
  drama,
  movie,
  game,
  song,
  book,
}
