const VIBRATION_PATTERN_MS = [200, 100, 200]
const BEEP_FREQUENCY_HZ = 880
const BEEP_DURATION_S = 0.18
const BEEP_GAP_S = 0.26
const BEEP_COUNT = 2

let audioContext: AudioContext | null = null

// Les navigateurs n'autorisent le son qu'après un geste de l'utilisateur : on prépare le contexte
// audio au moment où il lance le repos, pour que l'alerte puisse sonner à la fin.
export const primeRestAlert = () => {
  try {
    audioContext ??= new AudioContext()
    void audioContext.resume()
  } catch {
    // Audio indisponible : l'alerte restera silencieuse.
  }
}

const beep = (context: AudioContext, startAt: number) => {
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.frequency.value = BEEP_FREQUENCY_HZ
  gain.gain.setValueAtTime(0.2, startAt)
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + BEEP_DURATION_S)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(startAt)
  oscillator.stop(startAt + BEEP_DURATION_S)
}

export const playRestAlert = () => {
  navigator.vibrate?.(VIBRATION_PATTERN_MS)

  if (!audioContext) return

  try {
    Array.from({ length: BEEP_COUNT }, (_unused, index) =>
      beep(audioContext!, audioContext!.currentTime + index * BEEP_GAP_S),
    )
  } catch {
    // Audio indisponible : la vibration suffit.
  }
}
