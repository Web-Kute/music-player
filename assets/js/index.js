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

// Song titles
const songs = ['hey', 'summer', 'ukulele'];

let songIndex = 2;

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

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

const timeFormat = (k) => k.toString().padStart(2, 0);
//Init load song details
loadSong(songs[songIndex]);

//Update progress bar width as song plays
const ariaprogressTime = chrono.getAttribute('aria-valuenow');
const ariaEndTime = endtime.getAttribute('aria-label');
audio.ontimeupdate = () => {
  const minutes = Math.floor((audio.duration % 3600) / 60);
  const secondes = Math.floor(audio.duration % 60);

  const minutesE = Math.floor((audio.currentTime % 3600) / 60);
  const secondesE = Math.floor(audio.currentTime % 60);
  chrono.innerText = `${timeFormat(minutesE)}:${timeFormat(secondesE)}`;
  chrono.setAttribute(
    'aria-valuenow',
    `${timeFormat(minutesE)}minutes:${timeFormat(secondesE)}secondes`,
  );
  progress.style.width =
    Math.min((audio.currentTime / audio.duration).toFixed(3) * 100, 100) + '%';

  if (isFinite(audio.duration)) {
    endtime.innerText = `${timeFormat(minutes)}:${timeFormat(secondes)}`;
    endtime.setAttribute(
      'aria-label',
      `${timeFormat(minutes)}minutes:${timeFormat(secondes)}secondes`,
    );
  }
};
