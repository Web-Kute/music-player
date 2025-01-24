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
    rangeVolume: document.getElementById('range-volume'),
    containerList: document.getElementById('container-list'),
    songsList: document.getElementById('songs-list'),
    btnList: document.querySelector('.btn-list'),
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
    rangeVolume,
    containerList,
    songsList,
    btnList,
  } = elements;

  let playListLength;
  let tuneIndex;
  let data;
  let nextSong;
  const primaryColor = '#9831ff';
  const secondaryColor = '#cdc2d0';

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

      audio.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor((audio.duration % 3600) / 60);
        const seconds = Math.floor(audio.duration % 60);
        endtime.innerText = `${timeFormat(minutes)}:${timeFormat(seconds)}`;
        endtime.setAttribute(
          'aria-label',
          `${timeFormat(minutes)}minutes:${timeFormat(seconds)}seconds`,
        );
      });
    };

    const dataLi = [];
    data.forEach((song, index) => {
      const audioElement = new Audio(`./assets/music/${song.track}.mp3`);
      audioElement.addEventListener('loadedmetadata', () => {
        const duration = audioElement.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);

        dataLi.push(`<li class="tune"><span class="thumb" data-index="${index}"><img src="./assets/images/${song.jacket}" width="50" height="50"
          alt="${song.title}"></span><span><a href="#" class="link">${song.title}</a></span><span>${song.artist}</span><span>${minutes}&nbsp;:&nbsp;${seconds.toString().padStart(2, '0')}</span>
        </li>`);
        songsList.innerHTML = dataLi.join('');
      });
    });

    songsList.addEventListener('click', (e) => {
      const thumb = e.target.closest('.thumb');
      if (thumb) {
        const tunes = document.querySelectorAll('.tune');
        tunes.forEach((item) => item.classList.remove('playing'));
        thumb.parentNode.classList.add('playing');

        tuneIndex = parseInt(thumb.getAttribute('data-index'));
        if (!audio.paused) {
          audio.pause();
        }
        loadingSongs(tuneIndex);
        playSong();
      }
    });

    btnList.addEventListener('click', () => {
      containerList.classList.toggle('show-playlist');
    });

    loadingSongs(tuneIndex);

    const previousSong = () => {
      const isPlaying = musicContainer.classList.contains('play');
      tuneIndex = (tuneIndex - 1 + playListLength) % playListLength;
      loadingSongs(tuneIndex);
      if (isPlaying) {
        playSong();
      }
    };

    nextSong = () => {
      const isPlaying = musicContainer.classList.contains('play');
      tuneIndex = (tuneIndex + 1) % playListLength;
      loadingSongs(tuneIndex);
      if (isPlaying) {
        playSong();
      }
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
  rangeVolume.value = 40;

  rangeVolume.addEventListener('input', function () {
    const sizeBar = this.value;
    this.style.background = `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${sizeBar}%, ${secondaryColor} ${sizeBar}%, ${secondaryColor} 100%)`;
    rangeVolume.setAttribute('aria-valuenow', sizeBar);
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
      rangeVolume.value = 0;
      rangeVolume.setAttribute('aria-valuenow', '0');
      rangeVolume.style.background = `linear-gradient(to right, ${secondaryColor} 0%, ${secondaryColor} 100%)`;
    } else {
      volumeImg.src = './assets/images/volume.svg';
      const sizeBar = audio.volume * 100;
      rangeVolume.value = sizeBar;
      rangeVolume.setAttribute('aria-valuenow', sizeBar);
      rangeVolume.style.background = `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${sizeBar}%, ${secondaryColor} ${sizeBar}%, ${secondaryColor} 100%)`;
    }
  }

  volumeBar.addEventListener('mouseover', () => {
    volume.style.opacity = 1;
  });

  volumeBar.addEventListener('mouseout', () => {
    volume.removeAttribute('style');
  });

  volume.addEventListener('click', setVolume);

  progressContainer.addEventListener('click', setProgress);
  audio.addEventListener('timeupdate', updateProgress);
});
