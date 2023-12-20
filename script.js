var help=document.querySelector(".help")

function draw(w, h) {
    let arr = [];
    for (let i = 1; i <= 36; i++) {
        for (let j = 0; j < 4; j++) {
            arr.push(i);
        }
    }

    const matrix = new Array(11);
    for (let i = 0; i < 11; i++) {
        matrix[i] = new Array(18).fill(0);
    }

    var parentDiv = document.getElementById("main-game");
    let barrier = 2;

    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 18; j++) {
            var childDiv = document.createElement("div");
            childDiv.style.position = "absolute";
            childDiv.style.width = w + "px";
            childDiv.style.height = h + "px";
            childDiv.style.top = i * h + "px";
            childDiv.style.left = j * w + "px";
            childDiv.setAttribute("col", j);
            childDiv.setAttribute("row", i);

            // Thêm thẻ div con vào thẻ cha
            parentDiv.appendChild(childDiv);

            childDiv.classList.add("section");


            if (i > 0 && i < 10 && j > 0 && j < 17) {
                matrix[i][j] = barrier;
                // Thêm lớp "image" vào thẻ div
                childDiv.classList.add("image");
                childDiv.classList.add("disabled-element");
                help.classList.add("disabled-element");
                var img = document.createElement("img");
                // Tạo một thẻ img

                var index = Math.floor(Math.random() * arr.length);
                var imageIndex = arr[index];
                childDiv.setAttribute("index", imageIndex);

                // Đặt thuộc tính src cho thẻ img
                img.src = "./images/section" + imageIndex + ".png"; // Thay đổi đường dẫn đến ảnh của bạn

                // Thêm thẻ img vào thẻ div con
                childDiv.appendChild(img);

                // Xóa phần tử đã sử dụng khỏi mảng
                arr.splice(index, 1);
            }
        }
    }

    // Lấy thẻ cha theo id
    clickSection(barrier, matrix);
    let re = clickSection(barrier, matrix);

    helpPlay(re, barrier)
    change()

    let againPlay = document.querySelectorAll('.againPlay')
        againPlay.forEach(item => {
        item.addEventListener("click", async () => {
            // Xóa các phần tử hiện tại trong trò chơi
            var parentDiv = document.getElementById("main-game");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }


            clearTimeout(timer);
            matrix.length = 0
            // Đặt lại thời gian ban đầu (60 giây)

            timeLeft = 60;


            // Vẽ lại các phần tử trò chơi
            await draw(42, 52);
            let image = document.querySelectorAll(".disabled-element")
            image.forEach(function (div) {
                div.classList.remove("disabled-element");
            });


            // Ẩn modal
            modal.style.display = 'none';
            // đặt lại diem và mạng
            renderBloodFirts(10,matrix)
            renderScore(0)
            helpPlay(matrix,barrier )
            updateTime();
        })
    })
}


draw(42, 52);

function clickSection(barrier, matrix) {
    var bloodFirts = 10;
    renderBloodFirts(bloodFirts, matrix)
    let number = 0
    renderScore(number);
    autoCheckMap(matrix,barrier);
    const sectionAll = document.querySelectorAll(".image");
    let firstSection = null; // Lưu section đầu tiên được click
    sectionAll.forEach((section) => {
        section.addEventListener("click", () => {
            const col = section.getAttribute("col");
            const row = section.getAttribute("row");
            const index = section.getAttribute("index");
            section.style.opacity = "0.6";
            const bloodFirst = document.querySelector(".bloodFirts");
            let bloodFirts = parseInt(bloodFirst.textContent);

            if (firstSection === null) {
                // Nếu đây là section đầu tiên được click
                firstSection = section;

            } else {

                // Nếu đây là section thứ hai được click
                const firstCol = firstSection.getAttribute("col");
                const firstRow = firstSection.getAttribute("row");
                const firstIndex = firstSection.getAttribute("index");

                if (col === firstCol && row === firstRow) {
                    // Nếu hai điểm trùng nhau, cho biến mất
                    firstSection.style.opacity = "1";
                    section.style.opacity = "1";


                    // xu lý trừ mạng
                    fail.play()

                } else {
                    if (firstIndex !== index) {
                        firstSection.style.opacity = "1";
                        section.style.opacity = "1"

                        fail.play()
                        // xu lý trừ mạng
                    } else {
                        section.style.opacity = "1"
                        matrix[firstRow][firstCol] = 1;
                        matrix[row][col] = 1;
                        // /Nếu không trùng thì lưu lại tọa độ của 2 điểm
                        const p1 = {x: firstRow, y: firstCol};
                        const p2 = {x: row, y: col};

                        let kq = checkTwoPoint(p1, p2, matrix, barrier);

                        if (kq) {

                            drawMyLine(p1, kq, p2);
                            matrix[firstRow][firstCol] = 0;
                            matrix[row][col] = 0;
                            autoCheckMap(matrix,barrier);//tự động kiem ta lại mang có cặp nào ăn được không
                            let a = firstSection;
                            success.play()

                            setTimeout(function () {

                                var imgElement = a.querySelector("img");
                                var imgElement1 = section.querySelector("img");
                                if (imgElement) {
                                    a.removeChild(imgElement);
                                    a.classList.add("disabled-element");
                                }
                                if (imgElement1) {
                                    section.removeChild(imgElement1);
                                    section.classList.add("disabled-element");
                                }

                                let right = document.querySelectorAll(" .path-right");
                                right.forEach(item => {
                                    item.classList.remove("path-right");
                                });
                                let bottom = document.querySelectorAll(" .path-bottom");
                                bottom.forEach(item => {
                                    item.classList.remove("path-bottom");
                                });

                                // a.style.visibility="hidden"
                                // section.style.visibility="hidden"
                            }, 400);
                            number += 1

                            renderScore(number)


                        } else {
                            firstSection.style.opacity = "1";
                            section.style.opacity = "1";
                            matrix[firstRow][firstCol] = barrier;
                            matrix[row][col] = barrier;
                            fail.play()
                        }

                    }

                }

                firstSection = null; // Reset lại section đầu tiên
            }

            return matrix
        });
    });
    return matrix
}


// kiem tra duong di thang theo hang x, tu cot y min den cot y max giua 2 diem chon
function checkLineX(y1, y2, x, matrix, barrier) {

    let min = Math.min(y1, y2);
    let max = Math.max(y1, y2);
    // run column
    for (let y = min; y <= max; y++) {
        if (matrix[x][y] == barrier) {
            return false;
        }
    }
    return true;
}

// kiem tra duong di thang theo cot y, tu hang x min den hang x max giua 2 diem duoc chon
function checkLineY(x1, x2, y, matrix, barrier) {
    let min = Math.min(x1, x2);
    let max = Math.max(x1, x2);
    for (let x = min; x <= max; x++) {
        if (matrix[x][y] == barrier) {
            return false;
        }
    }
    return true;
}

// kiem tra theo hinh chu nhat bao 2 diem, tim ra cot y thông
function checkRectX(p1, p2, matrix, barrier) {
    // find point have y min and max
    let pMinY = p1;
    let pMaxY = p2;
    if (p1.y > p2.y) {
        pMinY = p2;
        pMaxY = p1;
    }
    let minX = Math.min(p1.x, p2.x)
    let maxX = Math.max(p1.x, p2.x)
    for (let y = pMinY.y; y <= pMaxY.y; y++) {
        // check three line
        if (
            checkLineX(pMinY.y, y, pMinY.x, matrix, barrier) && // chay theo hang x min (tu cot y min den cot y max, den cot y thong thi dung lai)
            checkLineY(minX, maxX, y, matrix, barrier) && //chay theo tung cot y (tu hang x min den hang x max, xem cot y nào thông)
            checkLineX(y, pMaxY.y, pMaxY.x, matrix, barrier) // chay theo hang x max (tu cot y min den cot y max, xem bat dau thong tu cot nao)
        ) {

            // if three line is true return column y
            return y;
        }
    }
    // have a line in three line not true then return -1
    return -1;
}

// kiem tra theo hinh chu nhat bao quanh 2 diem, tim ra cot x thong
function checkRectY(p1, p2, matrix, barrier) {
    // find point have y min
    let pMinX = p1;
    let pMaxX = p2;
    if (p1.x > p2.x) {
        pMinX = p2;
        pMaxX = p1;
    }
    let minY = Math.min(p1.y, p2.y)
    let maxY = Math.max(p1.y, p2.y)

    // find line and y begin
    for (let x = pMinX.x + 1; x <= pMaxX.x; x++) {
        if (
            checkLineY(pMinX.x, x, pMinX.y, matrix, barrier) &&
            checkLineX(minY, maxY, x, matrix, barrier) &&
            checkLineY(x, pMaxX.x, pMaxX.y, matrix, barrier)
        ) {

            return x;
        }
    }
    return -1;
}

// kiem tra mo rong theo chieu ngang ve 2 phia cua 2 diem đã chọn, nếu cột y ở phần mở rộng thông thì trả về cột y đó
function checkMoreLineX(p1, p2, type, matrix, barrier) {

    // find point have y min
    let pMinY = p1;
    let pMaxY = p2;
    if (p1.y > p2.y) {
        pMinY = p2;
        pMaxY = p1;
    }
    // find line and y begin
    let y = pMaxY.y;
    let row = pMinY.x;
    if (type == -1) {
        y = pMinY.y;
        row = pMaxY.x;
    }
    // check more


    if (checkLineX(pMinY.y, pMaxY.y, row, matrix, barrier)) {
        // kiem tra xem hàng tu cot y min den cot y max co thông không
        // đk lặp: trong hàng x min và hàng x max, các cột tiếp theo có phần tử trống
        while (matrix[pMinY.x][y] != barrier && matrix[pMaxY.x][y] != barrier) {

            if (checkLineY(pMinY.x, pMaxY.x, y, matrix, barrier)) {
                // nếu cot y thông tu x min den x max thì tra ve cot y do
                return y;
            }
            y = parseInt(y) + type;
        }

    }
    return -1;
}

// kiểm tra mở rộng theo chiều dọc về 2 phía của 2 điểm được chọn, nếu tìm ra hàng x thông ở phần mở rộng thì trả về hành x đó
function checkMoreLineY(p1, p2, type, matrix, barrier) {

    let pMinX = p1;
    let pMaxX = p2;
    if (p1.x > p2.x) {
        pMinX = p2;
        pMaxX = p1;
    }
    let x = pMaxX.x;
    let col = pMinX.y;
    if (type == -1) {
        x = pMinX.x;
        col = pMaxX.y;
    }

    if (checkLineY(pMinX.x, pMaxX.x, col, matrix, barrier)) {
        // kiem tra xem cột tu hang x min den hang x max co thông không
        // đk lặp: trong cột y  min và cột y max, các hàng tiếp theo có phần tử trống
        while (matrix[x][pMinX.y] != barrier && matrix[x][pMaxX.y] != barrier) {
            if (checkLineX(pMinX.y, pMaxX.y, x, matrix, barrier)) {

                // neu hang x thong thi tra ve hang do
                return x;
            }
            x = parseInt(x) + type;

        }
    }
    return -1;
}


function checkTwoPoint(p1, p2, matrix, barrier) {
    // check line with x

    if (p1.x == p2.x) {

        if (checkLineX(p1.y, p2.y, p1.x, matrix, barrier)) {
            return [p1, p2, 1];
        }

    }
    // check line with y
    if (p1.y == p2.y) {
        if (checkLineY(p1.x, p2.x, p1.y, matrix, barrier)) {

            return [p1, p2, 2];
        }
    }


    // check in rectangle with x
    if (checkRectX(p1, p2, matrix, barrier) != -1) {

        return [{x: p1.x, y: checkRectX(p1, p2, matrix, barrier)}, {x: p2.x, y: checkRectX(p1, p2, matrix, barrier)}, 3]

    }

    // check in rectangle with y
    if (checkRectY(p1, p2, matrix, barrier) != -1) {

        return [{x: checkRectY(p1, p2, matrix), y: p1.y}, {x: checkRectY(p1, p2, matrix, barrier), y: p2.y}]

    }
    // check more right
    if (checkMoreLineX(p1, p2, 1, matrix, barrier) != -1) {

        return [{x: p1.x, y: checkMoreLineX(p1, p2, 1, matrix, barrier)}, {
            x: p2.x,
            y: checkMoreLineX(p1, p2, 1, matrix, barrier)
        }, 5]

    }
    // check more left
    if (checkMoreLineX(p1, p2, -1, matrix, barrier) != -1) {

        return [{x: p1.x, y: checkMoreLineX(p1, p2, -1, matrix, barrier)}, {
            x: p2.x,
            y: checkMoreLineX(p1, p2, -1, matrix, barrier)
        }]
    }
    // check more down
    if (checkMoreLineY(p1, p2, 1, matrix, barrier) != -1) {

        return [{
            x: checkMoreLineY(p1, p2, 1, matrix, barrier),
            y: p1.y
        }, {x: checkMoreLineY(p1, p2, 1, matrix, barrier), y: p2.y}, 7]

    }
    // check more up
    if (checkMoreLineY(p1, p2, -1, matrix, barrier) != -1) {

        return [{
            x: checkMoreLineY(p1, p2, -1, matrix, barrier),
            y: p1.y
        }, {x: checkMoreLineY(p1, p2, -1, matrix, barrier), y: p2.y}, 8]
    }
    return null;
}

function drawMyLine(p1, kq, p2) {
    let start = kq[0];
    let end = kq[1];
    drawTwoPoint(p1, start);
    drawTwoPoint(start, end);
    drawTwoPoint(end, p2);

}

function drawTwoPoint(p1, p2) {
    // const axis2index = (y, x) => (x - 1) * 9 + y - 1;
    const axis2index = (x, y) => x * 18 + y;

    const sections = document.querySelectorAll(".section");
    const getY1_to_Y2 = function (x, y1, y2) {
        const ret = [];
        for (let y = y2; y > y1; y--) {
            ret.push({x, y});

            const section = sections[axis2index(x, y)];
            section.classList.add("path-right");

        }

        return ret;
    };

    const getX1_to_X2 = function (y, x1, x2) {

        const ret = [];
        for (let x = x2; x > x1; x--) {
            ret.push({x, y});
            const section = sections[axis2index(x, y)];


            section.classList.add("path-bottom");
        }
        return ret;
    };
    let x1 = parseInt(p1.x)
    let x2 = parseInt(p2.x)
    let y1 = parseInt(p1.y)
    let y2 = parseInt(p2.y)
    if (x1 == x2) {

        if (y1 > y2) {

            return getY1_to_Y2(x1, y2, y1);
        } else {
            return getY1_to_Y2(x1, y1, y2);
        }
    } else {

        if (x1 > x2) {
            return getX1_to_X2(y1, x2, x1);
        } else {
            return getX1_to_X2(y1, x1, x2);

        }
    }
}

// tính mạng
function renderBloodFirts(bloodFirts, matrix) {
    const bloodFirt = document.querySelector(".bloodFirts");
    bloodFirt.innerHTML = bloodFirts;

    if (bloodFirts == 0) {

        luuDiemMax();

        clearTimeout(timer);

        audio.pause();
        // Hiển thị modal game over
        modal.style.display = 'block';
        image.forEach(function (div) {
            div.classList.add("disabled-element");
        });
        matrix.length = 0; // Gán giá trị 0 cho biến matrix

        // bloodFirt.innerHTM = 10;
    }
}

//tính điểm
function renderScore(number) {
    const score = document.querySelector(".score");
    score.innerHTML = number;
}

// trợ giúp;

function helpPlay(matrix, b) {
    const bloodFirst = document.querySelector(".bloodFirts");
    let mang = parseInt(bloodFirst.textContent);


    const help = document.getElementsByClassName("help")[0];
    help.addEventListener("click", () => {
        mang -= 1;
        renderBloodFirts(mang)

        const o = checkMap(matrix, b);
        if (o) {
            if (o) {
                const {p1, result, p2} = o;
                drawMyLine(p1, result, p2);


            }

        }
    });

}

function checkMap(matrix, b) {
    let result,
        ar = []
    const sectionAll = document.querySelectorAll(".image");

    sectionAll.forEach((section) => {
        const col = section.getAttribute("col");
        const row = section.getAttribute("row");
        const index = section.getAttribute("index");
        ar.push({x: row, y: col, index: index})
    })

    for (let i = 0; i < ar.length; i++) {
        for (let j = i + 1; j < ar.length; j++) {
            if (ar[i].index == ar[j].index) {


                let p1 = {x: parseInt(ar[i].x), y: parseInt(ar[i].y)}
                let p2 = {x: parseInt(ar[j].x), y: parseInt(ar[j].y)}

                if (matrix[p1.x][p1.y] == b && matrix[p2.x][p2.y] == b) {
                    matrix[p1.x][p1.y] = 1;
                    matrix[p2.x][p2.y] = 1;
                    result = checkTwoPoint(p1, p2, matrix, b)

                    matrix[p1.x][p1.y] = b;
                    matrix[p2.x][p2.y] = b;

                    if (result) {

                        return {p1, result, p2};
                    } else {

                    }

                }


            }
        }
    }
    return null
}
//tự động checkmap nếu không có đường đi thì trả về ma trận mới:
function autoCheckMap(matrix,b){
    let result= checkMap(matrix,b);
   while (!result){

       change()
   }

}
// làm thanh ray chạy thời gian :
let progressBar;
let initialWidth;
let remainingTime;
let intervalId;
let isPaused = false;

function setupProgressBar(duration) {
    progressBar = document.getElementById('progress-bar');
    let mangs = document.getElementsByClassName("bloodFirts");
    let mang = parseInt(mangs[0].textContent);

    initialWidth = progressBar.offsetWidth;
    remainingTime = duration;
    if(mang==0){
        console.log(mang)
        pauseProgressBar()
    }
    function updateProgressBar() {
        if (!isPaused) {
            const progress = (remainingTime / duration) * 100;
            progressBar.style.width = `${progress}%`;
            remainingTime--;

            if (remainingTime < 0) {
                clearInterval(intervalId);
                // Thực hiện hành động khi thời gian kết thúc, ví dụ: hiển thị thông báo.
                // Ví dụ: showNotification("Time's up!");
            }
        }
    }

    function pauseProgressBar() {
        isPaused = true;
    }

    function resumeProgressBar() {
        isPaused = false;
    }

    function restartProgressBar() {
        clearInterval(intervalId);
        progressBar.style.width = initialWidth + 'px';
        remainingTime = duration;
        isPaused = false;
        intervalId = setInterval(updateProgressBar, 1000);
    }
    let againPlay = document.querySelectorAll('.againPlay');
    againPlay.forEach(item=>{
        item.addEventListener("click", ()=>{
            restartProgressBar()
        })
    })


    intervalId = setInterval(updateProgressBar, 1000);
}
// Xử lý nút loa
const muteButton = document.getElementById('mute-button');
const muteCross = document.getElementById('mute-cross');

muteButton.addEventListener('click', function() {
    if (muteCross.style.display === 'none') {
        audio.pause()
        muteCross.style.display = 'block';
    } else {
        audio.play()
        muteCross.style.display = 'none';
    }
});

// Lấy biểu tượng đóng và modal
const closeButton = document.querySelector('.close');

// Xử lý khi biểu tượng đóng được nhấn
closeButton.addEventListener('click', () => {
    // Ẩn modal
    modal.style.display = 'none';
});
// Lấy thẻ div hiển thị thời gian
const timerDisplay = document.getElementById('time');

// Lấy modal game over
const modal = document.getElementById('gameOverModal');

// Đặt thời gian ban đầu là 10 phút (600 giây)
let timeLeft = 60;
let timer;

// Cập nhật thời gian hiển thị
function updateTime() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    // Đảm bảo rằng giây luôn hiển thị dưới dạng 2 chữ số
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    // Hiển thị thời gian trong thẻ div
    timerDisplay.textContent = `Time  ${minutes}:${seconds}`;

    // Giảm thời gian còn lại mỗi giây
    timeLeft--;

    // Kiểm tra xem thời gian đã về 0 chưa
    if (timeLeft < 0) {
        luuDiemMax();
        audio.pause();

        // Hiển thị modal game over
        modal.style.display = 'block';
        image.forEach(function (div) {
            div.classList.add("disabled-element");
        });
    } else {

        // Tiếp tục cập nhật thời gian sau 1 giây
        timer = setTimeout(updateTime, 1000);
    }
}

// Bắt đầu đếm ngược
let start = document.getElementsByClassName("start")[0];
let again = document.getElementsByClassName("again")[0];
let image = document.querySelectorAll(".disabled-element")

// Xử lý nút bắt đầu
function play() {
    audio.play();

    start.style.display = "none";
    again.style.display = "block";


    // Ẩn modal
    modal.style.display = 'none';
    help.classList.remove("disabled-element");

    image.forEach(function (div) {
        div.classList.remove("disabled-element");
    });
    // Đặt lại thời gian ban đầu (10 phút)
    timeLeft = 60;
    setupProgressBar(60)
    // Bắt đầu đếm ngược lại
    updateTime();
}


function change() {


    let changeButton = document.getElementsByClassName("change")[0];
    changeButton.addEventListener("click", () => {
        let right = document.querySelectorAll(" .path-right");
        right.forEach(item => {
            item.classList.remove("path-right");
        });
        let bottom = document.querySelectorAll(" .path-bottom");
        bottom.forEach(item => {
            item.classList.remove("path-bottom");
        });
        let arr = [];
        for (let i = 1; i <= 36; i++) {
            for (let j = 0; j < 4; j++) {
                arr.push(i);
            }
        }


        const imgTags = document.querySelectorAll('img');

        image.forEach(function (div) {
            div.classList.remove("disabled-element");
        });

        for (let i = 0; i < imgTags.length; i++) {

            imgTags[i].removeAttribute('src');
            const parentElement = imgTags[i].parentNode; // Lấy thẻ cha của phần tử <img>
            parentElement.removeAttribute('index');
            var index = Math.floor(Math.random() * arr.length);
            var imageIndex = arr[index];


            // Đặt thuộc tính src cho thẻ img
            imgTags[i].src = "./images/section" + imageIndex + ".png"; // Thay đổi đường dẫn đến ảnh của bạn
            parentElement.setAttribute("index", imageIndex);
            arr.splice(index, 1);
        }
    });


}

luuDiemMax()

// Lưu điểm cao nhất
function luuDiemMax() {
    const point = "diemMax"; // Khai báo tên của key trong localStorage

    const diemMax = localStorage.getItem(point);
    const diem = document.querySelector(".point");
    const score = document.querySelector(".score");
    const n = parseInt(score.textContent);
    console.log(diem, diemMax);

    if (diemMax !== null) {
        if (parseInt(diemMax) < n) {
            localStorage.setItem(point, n.toString());
            diem.innerHTML = localStorage.getItem(point);
        } else {
            diem.innerHTML = diemMax;
        }
    } else {
        diem.innerHTML = 0;
        localStorage.setItem(point, n.toString());
    }
}



const audio = new Audio('./images/NhacNenGamePikachu-VA-4698057.mp3');
const success = new Audio('./images/success-sound-effect.mp3');
const fail = new Audio('./images/fail-buzzer-04.mp3');


// Gọi hàm playMusic() khi bạn muốn phát âm thanh
//xử lý đăng nhập
// Lấy tham chiếu đến các phần tử cần sử dụng
var loginModal = document.getElementById('login-modal');
var mainContent = document.getElementById('main-content');
var loginForm = document.querySelector('#login-modal form');
var nameElement = document.querySelector('.name');

// Thiết lập sự kiện submit cho form đăng nhập
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định

    // Lấy giá trị từ ô input
    var usernameInput = document.getElementById("username");
    var usernameValue = usernameInput.value;

    // Cập nhật giá trị vào phần tử .name
    nameElement.innerText = usernameValue;

    // Sau khi đăng nhập thành công, ẩn modal đăng nhập và hiển thị nội dung chính
    loginModal.style.display = 'none';

});