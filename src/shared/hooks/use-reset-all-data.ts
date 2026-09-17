export const useResetAllData = () => {
  const resetAllData = () => {
    try {
      window.localStorage.clear()
      window.sessionStorage.clear()
    } catch {
      // Stockage indisponible (navigation privée, quota atteint) : on ignore.
    }

    window.location.href = '/'
  }

  return { resetAllData }
}
