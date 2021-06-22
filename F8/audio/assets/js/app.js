
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "NL-Audio"

var player = $('#player')
const audio = $('#audio')
const cd = $('#cd')
const cdThumb = $('.cd-thumb')

const btnPlay = $('.btn-toggle-play')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')

const playerHeader = $('.player__heading')
const progress = $('#progress')
const playlist = $(".playlist");

var app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isMouseDown: false,
    isRepeat: false,
    /* key: value */
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Click Pow Get Down",
            singer: "Raftaar x Fortnite",
            path: "./assets/musics/CauHenCauThe-DinhDung.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "./assets/musics/CauHenCauThe-DinhDung.mp3",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path: "./assets/musics/CauHenCauThe-DinhDung.mp3",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "./assets/musics/CauHenCauThe-DinhDung.mp3",
            image:
                "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "./assets/musics/CauHenCauThe-DinhDung.mp3",
            image:
                "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path: "./assets/musics/CauHenCauThe-DinhDung.mp3",
            image:
                "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "./assets/musics/CauHenCauThe-DinhDung.mp3",
            image:
                "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }],

    setConfig: function(key, value) {
        this.config[key] = value
       /*  console.log(this.config);
        console.log(JSON.stringify(this.config)); */
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    
    /* definieren defineProperties */
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
        Object.defineProperty(this, 'songCount', {
            get: function () {
                return app.songs.length
            }
        })
    },

    /* render song-list */
    render: function () {
        let html = this.songs.map((song, index) => {
            return `<div class="song-item ${(index === this.currentIndex) ?  'active' : ''}"
                    data-index= ${index}>
                    <div class="song-thumb">
                        <img src="${song.image}">    
                    </div>
                    <div class="song-body">
                        <h4>${song.name}</h4>
                        <p>${song.singer}</p>
                    </div>
                    <div class="song-option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        /* console.log(html.join('')) */
        $('.playlist').innerHTML = html.join('')

    },

    handleEvents: function () {
        const cdWidth = cd.offsetWidth
        _this = this

        /* animate mit javascrip */
        const cdThumbAnimate = cdThumb.animate(
            [
                { transform: 'rotate(360Deg)' },
                { // from
                    opacity: 0.3,
                    color: "#fff"
                },
                { // to
                    opacity: 1,
                    color: "#000"
                }
            ],
            {
                duration: 10000,
                iterations: Infinity,
            }
        )
        cdThumbAnimate.pause()

        /* scroll play-list, rechnen neu höhe CD */
        player.onscroll = function () {
            let newWidth = cdWidth - player.scrollTop
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }

        btnRandom.onclick = function () {
            _this.isRandom = !this.isRandom
            _this.isRepeat = false
            btnRandom.classList.toggle('active')
            btnRepeat.classList.remove('active', _this.isRepeat)
            _this.setConfig('isRepeat', false)
            _this.setConfig('isRandom', _this.isRandom)
        }

        btnRepeat.onclick = function () {
            _this.isRandom = false
            _this.isRepeat = !_this.isRepeat
            btnRepeat.classList.toggle('active', _this.isRepeat)
            btnRandom.classList.remove('active', _this.isRandom)
            _this.setConfig('isRepeat', _this.isRepeat)
            _this.setConfig('isRandom', false)
        }


        progress.onclick = function () {
            audio.currentTime = audio.duration * progress.value / 100
        }

        /* render um active song markieren */
        btnPrev.onclick = function () {
            _this.isRandom ? _this.randomSong() :  _this.prevSong()
            _this.render()
            audio.play()
            _this.scrollToActiveSong()
        }

        /* this von hier ist btnPlay */
        btnPlay.onclick = function () {
            audio.volume = 0.2;
            app.isPlaying ? audio.pause() : audio.play()
        }
        
        /* render um active song markieren */
        btnNext.onclick = function () {
            _this.isRandom ? _this.randomSong() : _this.nextSong()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }   

        playlist.onclick = function(e) {

            let songNode = e.target.closest('.song-item:not(.option):not(.active)')  
            let optionNode = e.target.closest('.song-option') 
            if (optionNode) {
                console.log('option-click');    
                return
            }
            if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
                
        }

        /* wenn das gespielt ist */
        audio.onplaying = function () {
            audio.volume = 0.1
            app.isPlaying = true
            player.classList.add('playing')
            // cdThumb.classList.add('playing')
            cdThumbAnimate.play()
        }

        /* wenn das pausiert ist */
        audio.onpause = function () {
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
            /* mit css */
            /* cdThumb.classList.remove('playing') */
        }

        audio.onended = function () {
            if (_this.isRepeat)
                audio.play()
            else {
                btnNext.onclick()
            }
        }

        /* Spielzeit des Liedes rechnen*/
        audio.ontimeupdate = function () {
            progress.value = 0
            if (audio.duration)
                progress.value = (audio.currentTime / audio.duration) * 100
        }
    },

    loadCurrentSong: function () {
        audio.src = this.currentSong.path
        playerHeader.children[0].innerText = this.currentSong.singer
        playerHeader.children[1].innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    },

    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songCount)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song-item.active').scrollIntoView({
                //inline: 'nearest', 
                block: 'nearest',
                behavior: "smooth"
            })
        }, 300);
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songCount - 1
        }
        this.loadCurrentSong()
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songCount)
            this.currentIndex = 0  
        this.loadCurrentSong()
    },


    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    start: function () {
        // load prperties
        this.defineProperties()
        
        // load-config from localstorage
        this.loadConfig()

        //
        this.loadCurrentSong()
        this.render()
        this.handleEvents()

        // Zustand random-repeat
        if (this.isRandom)
            btnRandom.classList.add("active")
        else if (this.isRepeat)
            btnRepeat.classList.add("active")
    },
}

app.start()
