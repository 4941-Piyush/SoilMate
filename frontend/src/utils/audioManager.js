// Central Audio Manager for SoilMate Conversational Barge-In
// Ensures only ONE audio response plays at a time.
// Immediately silences previous speech when the user speaks or asks another question.

let currentAudioInstance = null

/** Stop and purge any currently playing audio across the entire application */
export function stopCurrentAudio() {
  if (currentAudioInstance) {
    try {
      currentAudioInstance.pause()
      currentAudioInstance.currentTime = 0
    } catch (_) {}
    currentAudioInstance = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel()
    } catch (_) {}
  }
}

/** Play audio from base64 wav string and track as active global instance */
export function playAudioBase64(base64Data, onEnded = null, onError = null) {
  stopCurrentAudio()
  if (!base64Data) return null

  try {
    const audio = new Audio(`data:audio/wav;base64,${base64Data}`)
    currentAudioInstance = audio

    audio.onended = () => {
      if (currentAudioInstance === audio) {
        currentAudioInstance = null
      }
      onEnded?.()
    }

    audio.onerror = (e) => {
      if (currentAudioInstance === audio) {
        currentAudioInstance = null
      }
      onError?.(e)
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (currentAudioInstance === audio) {
          currentAudioInstance = null
        }
        onError?.(err)
      })
    }

    return audio
  } catch (err) {
    console.warn('playAudioBase64 exception:', err)
    return null
  }
}

export function isAudioPlaying() {
  return currentAudioInstance !== null && !currentAudioInstance.paused
}

