// const butInstall = document.getElementById('buttonInstall');
// let deferredPrompt;
// // Logic for installing the PWA
// // Add event listener for beforeinstallprompt event
// window.addEventListener('beforeinstallprompt', (e) => {
//   // Prevent the mini-infobar from appearing on mobile
//   e.preventDefault();
//   // Stash the event so it can be triggered later.
//   deferredPrompt = e;
//   // Update UI notify the user they can install the PWA
//   butInstall.style.visibility = 'visible';
//   console.log('beforeinstallprompt event fired');
// });

// //Install the PWA
// butInstall.addEventListener('click', async () => {
//   console.log('btn clicked');
//   if (!deferredPrompt) {
//     console.log('No deferred prompt to show');
//     return;
//   }
//   deferredPrompt.prompt();
//   // Wait for the user to respond to the prompt
//   const { outcome } = await deferredPrompt.userChoice;
//   if (outcome === 'accepted') {
//     console.log('User accepted the install prompt');
//   } else {
//     console.log('User dismissed the install prompt');
//   }
//   // We've used the prompt, and can't use it again, discard it
//   deferredPrompt = null;
// });

// // Logic for determining when the PWA is installed
// window.addEventListener('appinstalled', (event) => {
//   // Hide the app-provided install promotion
//   butInstall.style.visibility = 'hidden';
//   // Clear the deferredPrompt so it can be garbage collected
//   deferredPrompt = null;
//   console.log('PWA was installed');
// });

const butInstall = document.getElementById('buttonInstall');

window.addEventListener('beforeinstallprompt', (event) => {
  // Store the triggered events
  window.deferredPrompt = event;

  // Remove the hidden class from the button.
  butInstall.classList.toggle('hidden', false);
});

butInstall.addEventListener('click', async () => {
  const promptEvent = window.deferredPrompt;

  if (!promptEvent) {
    return;
  }

  // Show prompt
  promptEvent.prompt();

  // Reset the deferred prompt variable, it can only be used once.
  window.deferredPrompt = null;

  butInstall.classList.toggle('hidden', true);
});

window.addEventListener('appinstalled', (event) => {
  // Clear prompt
  window.deferredPrompt = null;
});
