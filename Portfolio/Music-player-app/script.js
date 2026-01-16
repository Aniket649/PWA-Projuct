
        // --- Custom Notification Implementation (Replaces alert() & confirm()) ---
        function showNotification(message, type = 'success') {
            const box = document.getElementById('notification-box');
            box.textContent = message;
            
            // Set background color based on type
            box.className = 'fixed top-20 right-4 p-4 rounded-lg shadow-xl transition-opacity duration-300 opacity-100 z-50 pointer-events-auto';
            if (type === 'success') {
                box.classList.add('bg-green-600');
            } else if (type === 'error') {
                box.classList.add('bg-red-600');
            } else {
                box.classList.add('bg-indigo-600');
            }

            setTimeout(() => {
                box.classList.remove('opacity-100');
                box.classList.add('opacity-0', 'pointer-events-none');
            }, 3000);
        }

        // --- Sample Playlist Data ---
      let playlist = [
            { title: "Sample Track 1 - Ambient", artist: "Artist 1", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "3:45", cover: "https://picsum.photos/seed/music1/192/192" },
            { title: "Sample Track 2 - Energetic", artist: "Artist 2", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "4:12", cover: "https://picsum.photos/seed/music2/192/192" },
            { title: "Sample Track 3 - Chill", artist: "Artist 3", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: "2:58", cover: "https://picsum.photos/seed/music3/192/192" },
            { title: "Sample Track 4 - Upbeat", artist: "Artist 4", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", duration: "3:05", cover: "https://picsum.photos/seed/music4/192/192" },
            { title: "Sample Track 5 - Mellow", artist: "Artist 5", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", duration: "4:40", cover: "https://picsum.photos/seed/music5/192/192" },
            { title: "Heeriye (Acoustic Cover)", artist: " Artist 6", src: "C:\Users\anike\Downloads\Audio.mp3", duration: "4:59", cover: "https://picsum.photos/seed/music6/192/192" }
        ];




        let currentIndex = 0;
        let isPlaying = false;
        let shuffleMode = false;
        let repeatMode = 'none'; // 'none', 'one', 'all'

        // --- DOM Elements ---
        const audio = document.getElementById('audio');
        const progress = document.getElementById('progress');
        const volume = document.getElementById('volume');
        const currentTimeEl = document.getElementById('current-time');
        const durationEl = document.getElementById('duration');
        const trackTitleEl = document.getElementById('track-title');
        const trackArtistEl = document.getElementById('track-artist');
        const artworkEl = document.getElementById('artwork');
        const playBtn = document.getElementById('play');
        const pauseBtn = document.getElementById('pause');
        const playlistSongsEl = document.getElementById('playlist-songs');
        const mainContentEl = document.getElementById('main-content');
        const authModal = document.getElementById('auth-modal');
        const authLink = document.getElementById('auth-link');
        const logoutBtn = document.getElementById('logout-btn');
        const toggleFormBtn = document.getElementById('toggle-form');
        const signInForm = document.getElementById('signin-form');
        const signUpForm = document.getElementById('signup-form');
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');
        const playerSection = document.querySelector('.player-section');
        const repeatBtn = document.getElementById('repeat');
        const shuffleBtn = document.getElementById('shuffle');

        // --- Utility Functions ---

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

        function updatePlayPauseClass() {
            if (isPlaying) {
                playerSection.classList.add('playing');
            } else {
                playerSection.classList.remove('playing');
            }
        }

        // --- Player Core Functions ---

        function loadTrack(index) {
            if (playlist.length === 0) return;
            currentIndex = index;
            const track = playlist[currentIndex];
            audio.src = track.src;
            trackTitleEl.textContent = track.title;
            trackArtistEl.textContent = track.artist;
            artworkEl.src = track.cover;
            
            // Reset progress on load
            progress.value = 0;
            currentTimeEl.textContent = '0:00';
            durationEl.textContent = track.duration || '0:00'; // Use placeholder duration until metadata loads
            
            // Highlight current song in playlist
            document.querySelectorAll('.playlist-song').forEach((el, i) => {
                if (i === currentIndex) {
                    el.setAttribute('aria-current', 'true');
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    el.removeAttribute('aria-current');
                }
            });

            if (isPlaying) {
                audio.play().catch(e => console.error("Play failed:", e));
            }
        }

        function playTrack() {
            if (playlist.length === 0) {
                showNotification('The playlist is empty!', 'error');
                return;
            }
            if (audio.src === '' || !audio.src.includes(playlist[currentIndex].src)) {
                // First play or new track was loaded but not started
                
                loadTrack(currentIndex);
            }
            audio.play().then(() => {
                isPlaying = true;
                updatePlayPauseClass();
            }).catch(e => {
                console.error("Autoplay failed:", e);
                showNotification('Playback failed. Please interact with the player first.', 'error');
            });
        }

        function pauseTrack() {
            audio.pause();
            isPlaying = false;
            updatePlayPauseClass();
        }

        function nextTrack() {
            if (playlist.length === 0) return;
            if (shuffleMode) {
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * playlist.length);
                } while (newIndex === currentIndex && playlist.length > 1);
                loadTrack(newIndex);
            } else {
                currentIndex = (currentIndex + 1) % playlist.length;
                loadTrack(currentIndex);
            }
            if (isPlaying) {
                playTrack();
            }
        }

        function prevTrack() {
            if (playlist.length === 0) return;
            if (audio.currentTime > 3) { // Restart song if less than 3 seconds elapsed
                audio.currentTime = 0;
            } else {
                currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
                loadTrack(currentIndex);
            }
            if (isPlaying) {
                playTrack();
            }
        }

        function toggleShuffle() {
            shuffleMode = !shuffleMode;
            shuffleBtn.classList.toggle('text-indigo-400', shuffleMode);
            shuffleBtn.classList.toggle('text-gray-400', !shuffleMode);
            
            if (shuffleMode) {
                showNotification('Shuffle Mode On', 'info');
            } else {
                showNotification('Shuffle Mode Off', 'info');
            }
        }

        function toggleRepeat() {
            if (repeatMode === 'none') {
                repeatMode = 'all';
                repeatBtn.classList.add('text-indigo-400');
                repeatBtn.querySelector('i').className = 'fas fa-redo';
                showNotification('Repeat All Mode', 'info');
            } else if (repeatMode === 'all') {
                repeatMode = 'one';
                repeatBtn.querySelector('i').className = 'fas fa-redo fa-spin-pulse'; 
                showNotification('Repeat One Mode', 'info');
            } else {
                repeatMode = 'none';
                repeatBtn.classList.remove('text-indigo-400');
                repeatBtn.querySelector('i').className = 'fas fa-redo';
                showNotification('Repeat Off Mode', 'info');
            }
        }

        // --- Player Event Handlers ---

        audio.addEventListener('loadedmetadata', () => {
            // Only update duration if it wasn't set from the playlist data
            if (audio.duration && isFinite(audio.duration)) {
                durationEl.textContent = formatTime(audio.duration);
            }
        });

        audio.addEventListener('timeupdate', () => {
            if (!audio.duration || isNaN(audio.duration)) return;
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progress.value = progressPercent;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            if (repeatMode === 'one') {
                audio.currentTime = 0;
                playTrack();
            } else if (repeatMode === 'all' || shuffleMode) {
                nextTrack();
            } else {
                // End of playlist
                isPlaying = false;
                updatePlayPauseClass();
                progress.value = 0;
                currentTimeEl.textContent = formatTime(0);
                trackTitleEl.textContent = "Playback Ended";
                trackArtistEl.textContent = "Playlist complete";
                showNotification('Playlist finished playing.', 'info');
            }
        });

        progress.addEventListener('input', (e) => {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        });

        volume.addEventListener('input', (e) => {
            // Set audio volume (0.0 to 1.0)
            audio.volume = e.target.value / 100; 
            const volumeIcon = document.querySelector('.volume i:first-child');
            if (audio.volume === 0) {
                volumeIcon.className = 'fas fa-volume-mute text-gray-400';
            } else if (audio.volume < 0.5) {
                volumeIcon.className = 'fas fa-volume-down text-gray-400';
            } else {
                volumeIcon.className = 'fas fa-volume-up text-gray-400';
            }
        });
        // Set initial volume
        audio.volume = volume.value / 100;

        // --- Playlist UI Rendering ---

        function renderPlaylist() {
            playlistSongsEl.innerHTML = '';
            playlist.forEach((track, index) => {
                const div = document.createElement('div');
                div.className = 'playlist-song flex justify-between items-center text-left text-gray-200 hover:bg-gray-700 p-3 rounded-lg';
                div.setAttribute('data-index', index);
                div.onclick = () => {
                    loadTrack(index);
                    playTrack();
                };

                div.innerHTML = `
                    <div class="flex items-center space-x-3 truncate">
                        <span class="text-sm font-bold text-indigo-400">${index + 1}.</span>
                        <div>
                            <p class="font-medium truncate">${track.title}</p>
                            <p class="playlist-song-artist text-sm text-gray-400">${track.artist}</p>
                        </div>
                    </div>
                    <span class="playlist-song-duration text-sm text-gray-400 flex-shrink-0">${track.duration}</span>
                `;
                playlistSongsEl.appendChild(div);
            });
        }

        // --- Auth Modal & UI Functions ---

        function hideAuthModal() {
            authModal.classList.add('hidden');
        }

        function showMainContent() {
            mainContentEl.classList.remove('hidden');
        }

        function hideMainContent() {
            mainContentEl.classList.add('hidden');
        }

        function checkAuth() {
            return localStorage.getItem('token') !== null;
        }

        function updateAuthUI() {
            if (checkAuth()) {
                authLink.style.display = 'none';
                logoutBtn.classList.remove('hidden');
            } else {
                authLink.style.display = 'block';
                logoutBtn.classList.add('hidden');
            }
        }

        window.checkAuthAndShowContent = function() {
            if (checkAuth()) {
                showMainContent();
            } else {
                showNotification('Please sign in to access the music player.', 'error');
                toggleAuthModal(); 
            }
        }

        window.toggleAuthModal = function() {
            if (checkAuth()) {
                window.logout();
            } else {
                authModal.classList.remove('hidden');
                // Ensure sign-in form is visible on open
                signInForm.style.display = 'block';
                signUpForm.style.display = 'none';
                modalTitle.textContent = 'Welcome Back';
                modalSubtitle.textContent = 'Please enter your details to continue.';
                toggleFormBtn.textContent = "Don't have an account? Sign up";
            }
        }

        window.logout = function() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            hideMainContent();
            updateAuthUI();
            pauseTrack(); // Stop music on logout
            showNotification('Logged out successfully!');
        }

        window.simulateSignIn = function(email, password) {
            if (email && password.length >= 6) {
                localStorage.setItem('token', 'fake-jwt-token');
                localStorage.setItem('user', JSON.stringify({ email }));
                hideAuthModal();
                showMainContent();
                updateAuthUI();
                loadTrack(currentIndex); // Load track after signing in
                showNotification('Signed in successfully!', 'success');
            } else {
                showNotification('Invalid credentials or password too short (min 6 chars).', 'error');
            }
        };
        
        window.simulateSignUp = function(email, password) {
            if (password.length >= 6) {
                localStorage.setItem('token', 'fake-jwt-token');
                localStorage.setItem('user', JSON.stringify({ email }));
                hideAuthModal();
                showMainContent();
                updateAuthUI();
                loadTrack(currentIndex); // Load track after signing up
                showNotification('Account created and signed in successfully!', 'success');
            } else {
                showNotification('Password must be at least 6 characters.', 'error');
            }
        };

        window.simulateSocialLogin = function(provider) {
            localStorage.setItem('token', 'fake-jwt-token');
            localStorage.setItem('user', JSON.stringify({ email: `${provider.toLowerCase()}@example.com` }));
            hideAuthModal();
            showMainContent();
            updateAuthUI();
            loadTrack(currentIndex); 
            showNotification(`Signed in with ${provider}!`, 'success');
        }

        // --- Initialization ---

        document.addEventListener('DOMContentLoaded', () => {
            renderPlaylist();
            updateAuthUI();
            
            if (checkAuth()) {
                showMainContent();
                if (playlist.length > 0) {
                    loadTrack(0);
                }
            } else {
                hideMainContent();
            }

            // Toggle form logic
            toggleFormBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isSignIn = signInForm.style.display !== 'none';
                
                signInForm.style.display = isSignIn ? 'none' : 'block';
                signUpForm.style.display = isSignIn ? 'block' : 'none';
                
                modalTitle.textContent = isSignIn ? 'Create Account' : 'Welcome Back';
                modalSubtitle.textContent = isSignIn ? 'Join the vibe and unlock your music world.' : 'Please enter your details to continue.';
                toggleFormBtn.textContent = isSignIn ? "Already have an account? Sign in" : "Don't have an account? Sign up";
            });

            // Form submission handlers
            signInForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                simulateSignIn(email, password);
            });

            signUpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                simulateSignUp(email, password);
            });

            // Player Control Listeners
            playBtn.addEventListener('click', playTrack);
            pauseBtn.addEventListener('click', pauseTrack);
            document.getElementById('next').addEventListener('click', nextTrack);
            document.getElementById('prev').addEventListener('click', prevTrack);
            shuffleBtn.addEventListener('click', toggleShuffle);
            repeatBtn.addEventListener('click', toggleRepeat);
            
            // Global listener to close modal on outside click
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    hideAuthModal();
                }
            });
            
            // Placeholder Add Song button
            document.getElementById('add-song').addEventListener('click', () => {
                showNotification('To add new songs, you would integrate this with a Firestore database or an external music API.', 'info');
            });
        });
    