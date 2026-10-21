/**
 * The copy control on a code window.
 *
 * The windows are rendered by the markdown pipeline, so there is nothing to bind
 * per block: one delegated listener handles every window on every page, and works
 * on markup that was prerendered long before hydration.
 *
 * `navigator.clipboard` needs a secure context and permission, so a selection
 * based fallback covers the cases where it is unavailable or denied.
 */

async function copy(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  }
  catch {
    // Fall through to the selection-based copy.
  }

  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.top = '-1000px'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
  catch {
    return false
  }
}

export function installCodeCopy(): void {
  useEventListener(document, 'click', async (event) => {
    const button = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('.code-copy')
    if (!button) {
      return
    }

    const code = button.closest('.code-window')?.querySelector('pre')?.textContent ?? ''
    const ok = await copy(code)

    button.textContent = ok ? 'copied' : 'failed'
    window.setTimeout(() => {
      button.textContent = 'copy'
    }, 1200)
  })
}
