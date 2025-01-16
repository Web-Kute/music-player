// const baseURL = 'https://api.deezer.com/';
// console.log(baseURL);
export async function fetchMusicData(endpoint) {
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}

// https://developers.deezer.com/guidelines/getting_started
//  https://connect.deezer.com/oauth/auth.php?app_id=yesouican&redirect_uri=http://localhost:8888/music-player/&perms=basic_access,email
