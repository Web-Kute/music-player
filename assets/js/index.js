const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const chrono = document.getElementById('timeupdate');
const endtime = document.getElementById('endtime');
const volume = document.getElementById('volume');
const volumeImg = document.querySelector('.volume-img');
const rate = document.getElementById('rate');
const pitch = document.getElementById('pitch');

// Song titles
const songs = ['hey', 'summer', 'ukulele'];

let songIndex = 1;

function loadSong(song) {
  title.innerText = song;
  audio.src = `./assets/music/${song}.mp3`;
  cover.src = `./assets/images/${song}.jpg`;
}

function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  playBtn.querySelector('.fa-pause').classList.add('active');
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  playBtn.querySelector('.fa-play').classList.remove('active');
  audio.pause();
}

function prevSong() {
  prevBtn.disabled;
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong(song) {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

const timeFormat = (k) => k.toString().padStart(2, 0);
//Init load song details
loadSong(songs[songIndex]);

//Update progress bar width as song plays
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

function updateProgress(e) {
  const { duration, currentTime } = e.target;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  // Display elapsed time
  const minutesE = Math.floor((audio.currentTime % 3600) / 60);
  const secondesE = Math.floor(audio.currentTime % 60);
  chrono.innerText = `${timeFormat(minutesE)}:${timeFormat(secondesE)}`;
  chrono.setAttribute(
    'aria-valuenow',
    `${timeFormat(minutesE)}minutes:${timeFormat(secondesE)}secondes`,
  );

  // Display total time
  const minutes = Math.floor((audio.duration % 3600) / 60);
  const secondes = Math.floor(audio.duration % 60);
  if (isFinite(audio.duration)) {
    endtime.innerText = `${timeFormat(minutes)}:${timeFormat(secondes)}`;
    endtime.setAttribute(
      'aria-label',
      `${timeFormat(minutes)}minutes:${timeFormat(secondes)}secondes`,
    );
  }
}

function setVolume() {
  audio.muted = !audio.muted;

  audio.muted
    ? (volumeImg.src = './assets/images/mute.svg')
    : (volumeImg.src = './assets/images/volume.svg');
}

volume.addEventListener('click', setVolume);

progressContainer.addEventListener('click', setProgress);
audio.addEventListener('timeupdate', updateProgress);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
rate.addEventListener('change', (e) => {
  audio.playbackRate = e.target.value;
});
pitch.addEventListener('change', (e) => {
  audio.playbackRate = e.target.value;
});
