import { fetchMusicData } from './fetchapi.js';

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    musicContainer: document.getElementById('music-container'),
    imgContainer: document.querySelector('.img-container'),
    playBtn: document.getElementById('play'),
    prevBtn: document.getElementById('prev'),
    nextBtn: document.getElementById('next'),
    audio: document.getElementById('audio'),
    progress: document.getElementById('progress'),
    progressVolume: document.getElementById('progress-volume'),
    progressContainer: document.getElementById('progress-container'),
    title: document.getElementById('title'),
    artist: document.getElementById('artist'),
    cover: document.getElementById('cover'),
    chrono: document.getElementById('timeupdate'),
    endtime: document.getElementById('endtime'),
    volume: document.getElementById('volume'),
    volumeImg: document.querySelector('.volume-img'),
    volumeBar: document.getElementById('volume-bar'),
    rangeVolume: document.getElementById('range-volume')
  };

  const {
    musicContainer,
    imgContainer,
    playBtn,
    prevBtn,
    nextBtn,
    audio,
    progress,
    progressVolume,
    progressContainer,
    title,
    artist,
    cover,
    chrono,
    endtime,
    volume,
    volumeImg,
    volumeBar,
    rangeVolume
  } = elements;

  let playListLength;
  let tuneIndex;
  let data;
  let nextSong;
  // Fetch music data
  async function listenTotheMusic(endpoint) {
    data = await fetchMusicData(endpoint);
    tuneIndex = Math.floor(Math.random() * data.length);
    playListLength = data.length;

    const loadingSongs = (index) => {
      loadTune(
        data[index].id,
        data[index].track,
        data[index].title,
        data[index].artist,
        data[index].jacket,
      );
    };

    loadingSongs(tuneIndex);

    const previousSong = () => {
      tuneIndex = tuneIndex - 1;
      loadingSongs(tuneIndex);
      playSong();
    };

    nextSong = () => {
      tuneIndex = tuneIndex + 1;
      loadingSongs(tuneIndex);
      playSong();
    };

    prevBtn.addEventListener('click', previousSong);
    nextBtn.addEventListener('click', nextSong);
  }
  listenTotheMusic('./assets/js/songslist.json');

  function loadTune(
    tuneIndex = 1,
    track,
    songTitle = 'Titre',
    artistAlbum = 'unknown',
    imgCover = 'hey.jpg',
  ) {
    tuneIndex = tuneIndex;
    title.innerText = songTitle;
    artist.innerText = artistAlbum;
    audio.src = `./assets/music/${track}.mp3`;
    cover.src = `./assets/images/${imgCover}`;
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

  playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  });

  const timeFormat = (k) => k.toString().padStart(2, 0);

  //Update progress bar width as song plays
  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  }

  function updateProgress(e) {
    const { duration, currentTime } = e.target;
    const updateProgressBar = () => {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progress.style.width = `${progressPercent}%`;
      if (!audio.paused && !audio.ended) {
      requestAnimationFrame(updateProgressBar);
      }
    };
    requestAnimationFrame(updateProgressBar);

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
      if (audio.currentTime === audio.duration) {
        nextSong();
      }
      endtime.innerText = `${timeFormat(minutes)}:${timeFormat(secondes)}`;
      endtime.setAttribute(
        'aria-label',
        `${timeFormat(minutes)}minutes:${timeFormat(secondes)}secondes`,
      );
    }
  }

  // Set initial volume
  audio.volume = 0.4;

  rangeVolume.addEventListener('input', function () {
    const sizeBar = this.value;
    this.style.background = `linear-gradient(to right, #f0932b 0%, #f0932b ${sizeBar}%, #cdc2d0 ${sizeBar}%, #cdc2d0 100%)`;
    audio.volume = sizeBar / 100;
    audio.muted = false;
    volumeImg.src = './assets/images/volume.svg';
  });

  function setVolume() {
    audio.muted = !audio.muted;
    updateVolumeUI(audio.muted);
  }

  function updateVolumeUI(isMuted) {
    if (isMuted) {
      volumeImg.src = './assets/images/mute.svg';
      audio.volume = 0;
      rangeVolume.value = 0;
      rangeVolume.style.background = '#cdc2d0';
    } else {
      volumeImg.src = './assets/images/volume.svg';
      audio.volume = 0.5;
      rangeVolume.value = 40;
      rangeVolume.style.background = `linear-gradient(to right, #f0932b 0%, #f0932b 40%, #cdc2d0 40%, #cdc2d0 100%)`;
    }
  }

  volume.addEventListener('click', setVolume);

  progressContainer.addEventListener('click', setProgress);
  audio.addEventListener('timeupdate', updateProgress);
});
