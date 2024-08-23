const apiKey = 'AIzaSyC-7krkNuiAH1psB7-XLsoz0DTV78ZC7WM'; // Replace with your actual YouTube Data API key

function searchsong() {
    const query = document.getElementById('songsearch').value;
    if (query) {
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}&maxResults=10`)
            .then(response => response.json())
            .then(data => {
                displaySongs(data.items);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Failed to retrieve songs. Please try again later.');
            });
    } else {
        alert('Please enter a search query');
    }
}

function displaySongs(songs) {
    const songContainer = document.getElementById('song');
    songContainer.innerHTML = '';  // Clear any previous results

    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song-item';

        const thumbnail = song.snippet.thumbnails.default.url;
        const title = song.snippet.title;
        const artist = song.snippet.channelTitle;
        const videoId = song.id.videoId;

        songElement.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <div class="song-info">
                <h4>${title}</h4>
                <p>${artist}</p>
            </div>
            <button onclick="playSong('${videoId}', '${title}', '${artist}')">Play</button>
        `;

        songContainer.appendChild(songElement);
    });
}

let player;

function onYouTubeIframeAPIReady() {
    // This function is required for the YouTube API
}

function playSong(videoId, title, artist) {
    const nowPlayingInfo = document.getElementById('now-playing-info');

    nowPlayingInfo.innerHTML = `<strong>${title}</strong> by ${artist}`;

    if (player) {
        player.loadVideoById(videoId);
    } else {
        player = new YT.Player('audio-player', {
            height: '0',
            width: '0',
            videoId: videoId,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            },
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'showinfo': 0,
                'modestbranding': 1,
                'autohide': 1
            }
        });
    }

    playbutton.classList.add("active"); // Set the play button to active when a song is played
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        playbutton.classList.remove("active"); // Remove active class when the song ends
    }
}

document.getElementById('songsearch').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchsong();
    }
});

function togglePlayPause(){
    const playbutton=document.getElementById("play-pause-button");
    if(player && player.getPlayerState()===YT.PlayerState.PLAYING){
        player.pauseVideo();
        playbutton.textContent='Play';
    }
    else if(player){
        player.playVideo();
        playbutton.textContent='Pause';
    }
}