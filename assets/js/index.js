import { fetchMusicData } from './fetchapi.js';
import { showSpinner, hideSpinner } from './spinner.js';

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
    musicInfo: document.querySelector('.music-info'),
    btnMore: document.querySelector('.btn-more'),
    btnSearch: document.querySelector('.btn-search'),
    songTitles: document.querySelectorAll('.song-title'),
    tune: document.querySelectorAll('.tune'),
    searchInput: document.getElementById('search'),
    checkBoxTitle: document.getElementById('title-check'),
    checkBoxArtist: document.getElementById('artist-check'),
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
    musicInfo,
    btnMore,
    btnSearch,
    songTitles,
    tune,
    searchInput,
    checkBoxTitle,
    checkBoxArtist,
  } = elements;

  let playListLength;
  let tuneIndex;
  let data;
  let nextSong;
  let more = 10;
  const primaryColor = '#9831ff';
  const secondaryColor = '#cdc2d0';

  // Fetch music data
  async function listenTotheMusic(endpoint) {
    data = await fetchMusicData(endpoint);
    tuneIndex = 0;
    playListLength = data.length;
    showSpinner();
    const loadingSongs = (index) => {
      loadTune(
        data[index].id,
        data[index].track,
        data[index].title,
        data[index].artist,
        data[index].jacket,
      );

      musicInfo.dataset.index = tuneIndex;

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

    let pagination = data.slice(0, more);

    function addMoreSongs() {
      if (more < data.length) {
        const additionalSongs = data.slice(more, more + 10);
        more += additionalSongs.length;
        pagination = pagination.concat(additionalSongs);
        updateSongsList(pagination);
        searchInput.value = '';
      } else if (pagination.length === data.length) {
        btnMore.classList.add('disabled');
      }
    }
    updateSongsList(pagination);
    btnMore.addEventListener('click', addMoreSongs);

    function updateSongsList(songs) {
      let dataLi = [];
      let loadedCount = 0;

      songs.forEach((song, index) => {
        const audioElement = new Audio(`./assets/music/${song.track}.mp3`);

        audioElement.addEventListener('loadedmetadata', () => {
          const duration = audioElement.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);

          dataLi[index] =
            `<li tabindex="0" class="tune"><span class="thumb link" data-index="${index}"><img src="./assets/images/${song.jacket}" width="50" height="50" alt="${song.title}"></span><span class="link" data-index="${index}"><a href="#" class="song-title">${song.title}</a></span><span class="song-artist">${song.artist}</span><span>${minutes}&nbsp;:&nbsp;${seconds.toString().padStart(2, '0')}</span></li>`;

          loadedCount += 1;
          if (loadedCount === songs.length) {
            songsList.innerHTML = dataLi.join('');
          } else {
            songsList.innerHTML = dataLi.filter(Boolean).join('');
            hideSpinner();
          }

          const thumbNail = document.querySelectorAll('.thumb');

          thumbNail.forEach((thumb) => {
            if (musicInfo.dataset.index === thumb.dataset.index) {
              thumb.closest('li').classList.add('playing');
            } else {
              thumb.closest('li').classList.remove('playing');
            }
          });

          const observer = new MutationObserver(() => {
            thumbNail.forEach((thumb) => {
              if (musicInfo.dataset.index === thumb.dataset.index) {
                thumb.closest('li').classList.add('playing');
              } else {
                thumb.closest('li').classList.remove('playing');
              }
            });
          });

          observer.observe(musicInfo, {
            attributes: true,
            attributeFilter: ['data-index'],
          });
        });
      });
    }

    songsList.addEventListener('click', (e) => {
      const thumb = e.target.closest('.link');
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
    playBtn.querySelector('.btn-pause').classList.remove('hide');
    playBtn.querySelector('.btn-play').classList.add('hide');
    audio.play();
  }

  function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('.btn-pause').classList.add('hide');
    playBtn.querySelector('.btn-play').classList.remove('hide');
    audio.pause();
  }

  const togglePlayPause = () => {
    const isPlaying = musicContainer.classList.contains('play');
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  };

  playBtn.addEventListener('click', togglePlayPause);
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      togglePlayPause();
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
    volume.querySelector('.btn-volume').classList.remove('hide');
    volume.querySelector('.btn-mute').classList.add('hide');
    if (rangeVolume === 0 || audio.volume === 0) {
      volume.querySelector('.btn-volume').classList.add('hide');
      volume.querySelector('.btn-mute').classList.remove('hide');
    }
  });

  function setVolume() {
    audio.muted = !audio.muted;
    updateVolumeUI(audio.muted);
  }

  function updateVolumeUI(isMuted) {
    if (isMuted) {
      volume.querySelector('.btn-volume').classList.add('hide');
      volume.querySelector('.btn-mute').classList.remove('hide');
      rangeVolume.value = 0;
      rangeVolume.setAttribute('aria-valuenow', '0');
      rangeVolume.style.background = `linear-gradient(to right, ${secondaryColor} 0%, ${secondaryColor} 100%)`;
    } else {
      volume.querySelector('.btn-volume').classList.remove('hide');
      volume.querySelector('.btn-mute').classList.add('hide');
      const sizeBar = audio.volume * 100;
      rangeVolume.value = sizeBar;
      rangeVolume.setAttribute('aria-valuenow', sizeBar);
      rangeVolume.style.background = `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${sizeBar}%, ${secondaryColor} ${sizeBar}%, ${secondaryColor} 100%)`;
    }
  }

  function debounced(delay, fn) {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    };
  }

  let userSearch;
  function handleSearch(event) {
    event.preventDefault();
    if (searchInput.value === '') {
      tune.forEach((li) => li.classList.remove('hide'));
    }
    containerList.classList.add('show-playlist');
    userSearch = event.target.value.toLowerCase();
    const songTitles = document.querySelectorAll('.song-title');
    const songArtists = document.querySelectorAll('.song-artist');
    let label = [];

    if (checkBoxArtist.checked) {
      label = songArtists;
    } else if (checkBoxTitle.checked) {
      label = songTitles;
    }

    label.forEach((item) => {
      const text = item.innerText.toLowerCase();
      const isMatch = text.includes(userSearch);
      item.closest('li').classList.toggle('hide', !isMatch);
    });
  }

  const searchFilter = debounced(300, handleSearch);

  searchInput.addEventListener('input', searchFilter);

  checkBoxTitle.addEventListener('change', () => {
    document.querySelectorAll('.song-title').forEach((item) => {
      const text = item.innerText.toLowerCase();
      const isMatch = text.includes(userSearch);
      item.closest('li').classList.toggle('hide', !isMatch);
    });
  });
  checkBoxArtist.addEventListener('change', () => {
    document.querySelectorAll('.song-artist').forEach((item) => {
      const text = item.innerText.toLowerCase();
      const isMatch = text.includes(userSearch);
      item.closest('li').classList.toggle('hide', !isMatch);
    });
  });

  function resetSearch() {
    tune.forEach((li) => {
      li.classList.remove('hide');
    });
  }

  // btnSearch.addEventListener('click', () => {
  //   containerList.classList.add('show-playlist');
  // });

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
