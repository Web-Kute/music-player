const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

// Song titles
const songs = ['hey', 'summer', 'ukulele'];

let songIndex = 2;

//Init load song details
loadSong(songs[songIndex]);

function loadSong(song) {
  title.innerText = song;
  audio.src = `./assets/music/${song}.mp3`;
  cover.src = `./assets/images/${song}.jpg`;
}

function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

function prevSong() {
   prevBtn.disabled;
  if (songIndex >= 0) {
    songIndex--;
    loadSong(songs[songIndex]);
    playSong();
  } else if (songIndex < 0) {
    prevBtn.disabled;
  }
  console.log('Prev: ', songIndex);
}

function nextSong(song) {
  if (songIndex <= songs.length -1) {
    songIndex++;
    loadSong(songs[songIndex]);
    playSong();
  } else if (songIndex > songs.length - 1) {
    nextSong.disabled;
  }
  console.log('Next: ', songIndex);
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
