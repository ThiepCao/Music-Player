const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $("#audio");
const playBtn = $('.btn-toggle-play')
const cd = $('.cd');
const player = $('.player')
const playlist = $('.playlist')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


const app = {
            isRandom: false,
            currentIndex: 0,
            isPlaying: false,
            isRepeat: false,
            config: {},
            // JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY )) || {},
            songs: [
                {
                    name: "Hero",
                    singer: "Cash Cash & Christina Perri",
                    path: "./assets/music/song1.mp3",
                    image: "./assets/image/image1.jpg"
                },
                {
                    name: "Hold You One Last Time",
                    singer: "Mindme ft. Le June",
                    path: "./assets/music/song2.mp3",
                    image:"./assets/image/image2.jpg"
                },
                {
                    name: "7 Years",
                    singer: "Lukas Graham",
                    path: "./assets/music/song3.mp3",
                    image:"./assets/image/image3.jpeg"
                 },
                {
                    name: "One Call Away",
                    singer: "Charlie Puth ",
                    path: "./assets/music/song4.mp3",
                    image:"./assets/image/image4.jpeg"
                },
                {
                    name: "SomethingJustLikeThis",
                    singer: "The Chainsmokers Coldplay ",
                    path: "./assets/music/song5.mp3",
                    image:"./assets/image/image5.jpg"
                },
                {
                    name: "TasteTheFeeling",
                    singer: "Avicii Conrad Sewell",
                    path: "./assets/music/song6.mp3",
                    image:"./assets/image/image6.jpg"
                },
                {
                    name: "GuCukak",
                    singer: "Freaky Seachains Cukak ",
                    path: "./assets/music/song7.mp3",
                    image:"./assets/image/image7.jpeg"
                },
                {
                    name: "MaiMinhXa",
                    singer: "ThinhSuy",
                    path: "./assets/music/song8.mp3",
                    image:"./assets/image/image8.jpeg"
                },

            ],
            setConfig: function(key, value){
                this.config[key] = value;
                // localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
            },
            render: function(){
                const htmls = this.songs.map((song, index) => {
                    return `
                            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index} "">
                                <div class="thumb" 
                                    style="background-image: url('${song.image}')">
                                </div>
                                <div class="body">
                                    <h3 class="title">${song.name}</h3>
                                    <p class="author">${song.singer}</p>
                                </div>
                                <div class="option">
                                    <i class="fas fa-ellipsis-h"></i>
                                </div>
                            </div>
                    `;
                })
                playlist.innerHTML = htmls.join("");
            },
            defineProperties: function() {
                Object.defineProperty(this, 'currentSong', {
                    get: function(){
                        return this.songs[this.currentIndex];
                    } 
                });
                
            },
            handleEvent: function () {
                
                const cdWidth = cd.offsetWidth
                const _this = this

                //Xu li CD xoay
                const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)'}], {
                    duration: 10000,
                    iterations: Infinity
                });
                cdThumbAnimate.pause();

                //Xử lí phóng to / thu nhỏ Cd
                document.onscroll = function(){
                   const scrollTop = window.scrollY || document.documentElement.scrollTop  
                    const newCdWidth = cdWidth - scrollTop 

                    cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                    cd.style.opacity = newCdWidth / cdWidth
                };

                //Xử lí khi click play
                playBtn.onclick = function() {
                    if (_this.isPlaying) {
                        audio.pause();
                    }else{
                        audio.play();
                    }

                };
                audio.onplay = function() {
                    _this.isPlaying = true
                    player.classList.add("playing")
                    cdThumbAnimate.play();
                }
                audio.onpause = function() {
                    _this.isPlaying = false
                    player.classList.remove("playing")
                    cdThumbAnimate.pause();

                }
                //khi tiến độ thay đổi song
                audio.ontimeupdate = function() {
                    if ( audio.duration) {
                        const progressPersent = Math.floor(
                            (audio.currentTime / audio.duration) * 100);
                        progress.value = progressPersent
                    }
                },
                // Song load handle
                progress.onchange = function (e) {
                    const seekTime = (audio.duration /100) * e.target.value
                    audio.currentTime = seekTime
                },
                //khi next song
                nextBtn.onclick = function() {
                    if (_this.isRandom){
                        _this.playRandomSong()
                    }else{
                    _this.nextSong()
                }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }
                //khi prev song
                prevBtn.onclick = function() {
                    if (_this.isRandom){
                        _this.playRandomSong()
                    }else{
                    _this.prevSong()
                }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()

                }  
                //khi  Ramdom dc active
                randomBtn.onclick = function (e) {
                    _this.isRandom = !_this.isRandom
                    _this.setConfig('isRandom',_this.isRandom)
                    randomBtn.classList.toggle('active', _this.isRandom)
                }    
                //Khi audio ended
                audio.onended = function (){
                    if (_this.isRepeat) {
                        audio.play()
                    }else {
                        nextBtn.click()
                    }
                }

                //Lang nghe khi click plalist
                playlist.onclick = function(e){
                    const songNode = e.target.closest('.song:not(.active)')

                    if( songNode || e.target.closest('.option') ){
                        //Xu li khi click vao song
                        if ( songNode){
                            _this.currentIndex = Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            _this.render()
                            audio.play()
                        }
                        //xu li khi click vao option
                        if (e.target.closest('.option')){

                        }
                    }
                }
                //Xu li khi song repeat
                repeatBtn.onclick = function(e) {
                    _this.isRepeat = !_this.isRepeat
                    _this.setConfig('isRepeat', _this.isRepeat)
                    repeatBtn.classList.toggle('active', _this.isRepeat)
                }

            },
            loadCurrentSong: function() {
                  
                   heading.textContent = this.currentSong.name
                   cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
                   audio.src = this.currentSong.path;
            },
            loadConfig: function(){
                this.isRandom = this.config.isRandom;
                this.isRepeat = this.config.isRepeat;
            },
            nextSong: function () {
                this.currentIndex++;
                if( this.currentIndex >= this.songs.length) {
                    this.currentIndex= 0;
                }
                this.loadCurrentSong()
            },
            prevSong: function () {
                this.currentIndex--;
                if( this.currentIndex < 0) {
                    this.currentIndex= this.songs.length -1
                }
                this.loadCurrentSong()
            },
            playRandomSong: function(){
                let newIndex
                do {
                    newIndex = Math.floor(Math.random() * this.songs.length)
                } while( newIndex === this.currentIndex);
                this.currentIndex = newIndex;
                this.loadCurrentSong()

            },
            scrollToActiveSong: function(){
                
                    if(this.currentIndex < 0 ){
                        setTimeout(() => {
                            $('.song.active').scrollIntoView({
                                behavior: 'auto',
                                block: ('center')
                            })
                        }, 300)
                    } else {
                        setTimeout(() => {
                            $('.song.active').scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest'
                            })
                        }, 300)
                    }
            },
            start: function() {
                // Gawn cau hinh tu config vao app
                this.loadConfig();
                //Định nghĩa các thuộc tính cho ojb
                this.handleEvent();

                // Lắng nghe / xử lí các sử kiện ( DOM event)
                this.defineProperties();

                //Tải thông tin bài hat đầu tiên vào UI khi chạy ứng dụng
                this.loadCurrentSong();

                // Render playlist
                this.render();
                // hienthi trang thai ban dau cuar btn repeat va random
                randomBtn.classList.toggle('active', _this.isRandom)
                repeatBtn.classList.toggle('active', _this.isRepeat)
            }

        }
app.start();
