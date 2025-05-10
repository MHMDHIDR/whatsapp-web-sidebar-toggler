// Wait for the WhatsApp Web to fully load
document.addEventListener('DOMContentLoaded', initSidebarToggler)
window.addEventListener('load', initSidebarToggler)

// In case the app loads after our content script
const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      const sidebarElement = document.getElementById('side')
      if (sidebarElement) {
        initSidebarToggler()
        observer.disconnect()
        break
      }
    }
  }
})

observer.observe(document.body, { childList: true, subtree: true })

// Initialize the sidebar toggler
function initSidebarToggler() {
  // Check if the sidebar exists
  const sidebar = document.getElementById('side')
  if (!sidebar) {
    setTimeout(initSidebarToggler, 1000) // Try again after 1 second
    return
  }

  // Check if we've already added the toggler
  if (document.getElementById('wa-sidebar-toggler')) {
    return
  }

  // Create the toggle button
  const toggleButton = document.createElement('button')
  toggleButton.id = 'wa-sidebar-toggler'
  toggleButton.innerHTML = '<span>◀</span>'
  toggleButton.title = 'Toggle Sidebar (Alt+S)'

  // Add the button to the page
  document.body.appendChild(toggleButton)

  // Get the parent container of the sidebar
  const sidebarContainer = sidebar.closest(
    '._aigw, .x9f619, .x1n2onr6, .x5yr21d, .x17dzmu4, .x1i1dayz, .x2ipvbc, .x1w8yi2h, .x78zum5, .xdt5ytf, .xa1v5g2, .x1plvlek, .xryxfnj, .xd32934, .x1m6msm'
  )

  // Load the saved state
  chrome.storage.local.get(['sidebarHidden'], result => {
    if (result.sidebarHidden) {
      hideSidebar(sidebarContainer, toggleButton)
    }
  })

  // Add click event listener to the toggle button
  toggleButton.addEventListener('click', () => {
    toggleSidebar(sidebarContainer, toggleButton)
  })

  // Add keyboard shortcut listener
  document.addEventListener('keydown', e => {
    if ((e.key === 'b' || e.key === 'B') && e.ctrlKey) {
      e.preventDefault()
      toggleSidebar(sidebarContainer, toggleButton)
    }
  })
}

// Toggle the sidebar visibility
function toggleSidebar(sidebarContainer, toggleButton) {
  if (sidebarContainer.classList.contains('wa-sidebar-hidden')) {
    showSidebar(sidebarContainer, toggleButton)
  } else {
    hideSidebar(sidebarContainer, toggleButton)
  }
}

// Hide the sidebar
function hideSidebar(sidebarContainer, toggleButton) {
  sidebarContainer.classList.add('wa-sidebar-hidden')
  toggleButton.innerHTML = '<span>▶</span>'
  chrome.storage.local.set({ sidebarHidden: true })
}

// Show the sidebar
function showSidebar(sidebarContainer, toggleButton) {
  sidebarContainer.classList.remove('wa-sidebar-hidden')
  toggleButton.innerHTML = '<span>◀</span>'
  chrome.storage.local.set({ sidebarHidden: false })
}
