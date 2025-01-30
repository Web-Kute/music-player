// const baseURL = 'https://api.deezer.com/';

import { fisherYatesShuffle } from './random.js';
export async function fetchMusicData(endpoint, limit = 15) {
  try {
    const response = await fetch(`${endpoint}`);
    const data = await response.json();
    let randomData = fisherYatesShuffle(Array.from(data))
      .slice(0, limit)
      .map((id) => id);
    return randomData;
  } catch (error) {
    console.log(error);
  }
}

// https://developers.deezer.com/guidelines/getting_started
//  https://connect.deezer.com/oauth/auth.php?app_id=yesouican&redirect_uri=http://localhost:8888/music-player/&perms=basic_access,email
