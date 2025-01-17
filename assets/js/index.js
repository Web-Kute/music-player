import { fetchMusicData } from './fetchapi.js';

document.addEventListener('DOMContentLoaded', () => {
  const musicContainer = document.getElementById('music-container');
  const imgContainer = document.querySelector('.img-container');
  const playBtn = document.getElementById('play');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const audio = document.getElementById('audio');
  const progress = document.getElementById('progress');
  const progressContainer = document.getElementById('progress-container');
  const title = document.getElementById('title');
  const artist = document.getElementById('artist');
  const cover = document.getElementById('cover');
  const chrono = document.getElementById('timeupdate');
  const endtime = document.getElementById('endtime');
  const volume = document.getElementById('volume');
  const volumeImg = document.querySelector('.volume-img');
  // const rate = document.getElementById('rate');
  // const pitch = document.getElementById('pitch');
  const rangeVolume = document.getElementById('rangeVolume');
  const plusBtn = document.getElementById('plus');
  const minusBtn = document.getElementById('minus');

  let playListLength;
  let tuneIndex;
  let data;
  let nextSong;
  // Fetch music data
  async function listenTotheMusic(endpoint) {
    data = await fetchMusicData(endpoint);
    tuneIndex = Math.floor(Math.random() * data.length);
    playListLength = data.length;
    // tuneIndex = data.findIndex((song) => song.id === data[tune].id);

    loadSong(
      data[tuneIndex].id,
      data[tuneIndex].track,
      data[tuneIndex].title,
      data[tuneIndex].artist,
      data[tuneIndex].jacket,
    );

    const previousSong = () => {
      tuneIndex--;
      if (tuneIndex < 0) {
        tuneIndex = playListLength - 1;
      }
      loadSong(
        data[tuneIndex].id,
        data[tuneIndex].track,
        data[tuneIndex].title,
        data[tuneIndex].artist,
        data[tuneIndex].jacket,
      );
      playSong();
    };

    nextSong = () => {
      tuneIndex++;
      if (tuneIndex > playListLength - 1) {
        tuneIndex = 0;
      }
      loadSong(
        data[tuneIndex].id,
        data[tuneIndex].track,
        data[tuneIndex].title,
        data[tuneIndex].artist,
        data[tuneIndex].jacket,
      );
      playSong();
    };

    prevBtn.addEventListener('click', previousSong);
    nextBtn.addEventListener('click', nextSong);
  }
  listenTotheMusic('./assets/js/songslist.json');

  function loadSong(
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
  //Init load song details
  // loadSong(songs[tuneIndex]);

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

  function setVolume() {
    audio.muted = !audio.muted;

    audio.muted
      ? (volumeImg.src = './assets/images/mute.svg')
      : (volumeImg.src = './assets/images/volume.svg');
  }

  volume.addEventListener('click', setVolume);

  rangeVolume.addEventListener('change', (e) => {
    const volumeValue = e.target.value;
    audio.volume = volumeValue;
  });

  // Set initial volume to 0.5
  audio.volume = 0.5;
  rangeVolume.value = 0.5;

  plusBtn.addEventListener('click', () => {
    if (audio.volume < 1) {
      audio.volume = (parseFloat(audio.volume.toFixed(1)) + 0.1).toFixed(1);
      rangeVolume.value = audio.volume;
    }
  });

  minusBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
      audio.volume = (parseFloat(audio.volume.toFixed(1)) - 0.1).toFixed(1);
      rangeVolume.value = audio.volume;
    }
  });

  progressContainer.addEventListener('click', setProgress);
  audio.addEventListener('timeupdate', updateProgress);

  // rate.addEventListener('change', (e) => {
  //   audio.playbackRate = e.target.value;
  // });
  // pitch.addEventListener('change', (e) => {
  //   audio.playbackRate = e.target.value;
  // });
});
