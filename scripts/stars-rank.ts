export function getStarsRankingUrl(): string {
  const users = ['lumirelle']
  // const repos = [
  // ]

  const query = users.map(i => `user:${i}`).join(' ')

  const url = `https://github.com/search?l=&o=desc&s=stars&type=Repositories&q=${encodeURIComponent(query)}`
  return url
}
