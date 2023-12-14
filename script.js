

function draw(w,h) {

    let arr = [];
    for (let i = 1; i <= 36; i++) {
        for (let j = 0; j < 4; j++) {
            arr.push(i);
        }
    }

    // Lấy thẻ cha theo id
    var parentDiv = document.getElementById("main-game");

    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 9; j++) {
            var childDiv = document.createElement("div");
            childDiv.style.position = "absolute";
            childDiv.style.width = w + "px";
            childDiv.style.height = h + "px";
            childDiv.style.top = j * h + "px";
            childDiv.style.left = i * w + "px";

            // Tạo một thẻ img
            var img = document.createElement("img");
            var index = Math.floor(Math.random() * arr.length);
            var imageIndex = arr[index];

            // Đặt thuộc tính src cho thẻ img
            img.src = "./images/section" + imageIndex + ".png"; // Thay đổi đường dẫn đến ảnh của bạn

            // Thêm lớp "image" vào thẻ div
            childDiv.classList.add("image");

            // Thêm thẻ img vào thẻ div con
            childDiv.appendChild(img);

            // Thêm thẻ div con vào thẻ cha
            parentDiv.appendChild(childDiv);

            // Xóa phần tử đã sử dụng khỏi mảng
            arr.splice(index, 1);
        }
    }
}


draw(42, 52);
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
        // Hiển thị modal game over
        modal.style.display = 'block';
    } else {

        // Tiếp tục cập nhật thời gian sau 1 giây
       timer= setTimeout(updateTime, 1000);
    }
}

// Bắt đầu đếm ngược
let start=document.getElementsByClassName("start")[0];
let again=document.getElementsByClassName("again")[0];
// Xử lý nút bắt đầu
function play()  {
    console.log(1111)
    start.style.display="none";
    again.style.display="block";


    // Ẩn modal
    modal.style.display = 'none';

    // Đặt lại thời gian ban đầu (10 phút)
    timeLeft = 60;

    // Bắt đầu đếm ngược lại
    updateTime();
}
function change(){
    var parentDiv = document.getElementById("main-game");
    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
    draw(42, 52);
}
// Xử lý khi nút "Chơi lại" được nhấn

function againPlay() {
    // Xóa các phần tử hiện tại trong trò chơi
    var parentDiv = document.getElementById("main-game");
    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
    clearTimeout(timer);
    // Đặt lại thời gian ban đầu (60 giây)
    timeLeft = 60;

    // Vẽ lại các phần tử trò chơi
    draw(42, 52);

    // Ẩn modal
    modal.style.display = 'none';


    updateTime();
}