const DAY_MS = 24 * 60 * 60 * 1000

// Odmiana polskich liczebników
export function plural(count, one, few, many) {
  if (count === 1) return one
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) return few
  return many
}

// Wiek z daty urodzenia: „3 lata”, „8 miesięcy”, „2 tygodnie”.
export function formatAge(birthDate) {
  if (!birthDate) return null
  const [year, month, day] = birthDate.split('-').map(Number)
  const birth = new Date(year, month - 1, day)
  const now = new Date()

  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (now.getDate() < birth.getDate()) months -= 1

  if (months >= 12) {
    const years = Math.floor(months / 12)
    return `${years} ${plural(years, 'rok', 'lata', 'lat')}`
  }
  if (months >= 1) return `${months} ${plural(months, 'miesiąc', 'miesiące', 'miesięcy')}`
  const weeks = Math.max(0, Math.floor((now - birth) / (7 * DAY_MS)))
  return `${weeks} ${plural(weeks, 'tydzień', 'tygodnie', 'tygodni')}`
}

const SPECIES_LABELS = { dog: 'Pies', cat: 'Kot', other: 'Inne zwierzę' }

export function speciesLabel(species) {
  return SPECIES_LABELS[species] ?? SPECIES_LABELS.other
}