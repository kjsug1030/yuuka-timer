// html 태그를 조작하는 변수는 $를 붙임
const $yuuka_profile = document.querySelector('#yuuka-profile');
const $yuuka_profile_photo = document.querySelector('#yuuka-profile-photo');
const $yuuka_profile_audio = document.querySelector('#yuuka-profile-audio');
const $start_btn = document.querySelector('#start-btn');
const $left = document.querySelector('#left');
const $home = document.querySelector('#home-container');
const $main = document.querySelector('#main-container');
const $main_logo = document.querySelector('#main-logo');
const $yuuka_back = document.querySelector('#yuuka-back');
const $timer_btn_start = document.querySelector('#timer-btn-start');
const $timer_btn_skip = document.querySelector('#timer-btn-skip');
const $hour = document.querySelector('#hour');
const $minute = document.querySelector('#minute');
const $second = document.querySelector('#second');
const $progress_bar = document.querySelector('#progress-bar');

// 사이트 전환시 나오는 배경음악
const start_audio = new Audio();
start_audio.src = './audio/Theme_21.ogg';
// start_audio.volume = 0.5;

// 타이머 시작시 나오는 음성
const timer_start_audio = new Audio();
timer_start_audio.src = './audio/Yuuka_ExSkill_1.ogg';

// 타이머 종료시 나오는 음성
const last_audio = new Audio();
last_audio.src = './audio/Yuuka_Lobby_1.ogg';

// 시간, 분, 초, 시간합계, 타이머 작동상태
let hour = 0;
let minute = 0;
let second = 0;
let result = 0;
let timerIsStop = true;

// 유우카 사진 클릭시 음성파일 재생
function helloYuuka() {
  console.log('어서오세요! 선생님');
  $yuuka_profile_audio.play();
}

// 로고 클릭시 첫화면으로 이동
function mainLogo() {
  console.log('홈페이지로 이동했어요! 선생님');
  console.log('음악을 정지했어요! 선생님');

  $home.style.transition = '0s';
  $main.style.transition = '0s';

  $home.style.pointerEvents = 'auto';
  $home.style.opacity = 1;
  $main.style.opacity = 0;

  start_audio.pause();
  start_audio.currentTime = 0;
  location.reload();
}

// 첫화면에서 시작시 화면전환과 오디오 재생
const startButton = () => {
  console.log('메인페이지로 전환할게요! 선생님');
  console.log('브금도 재생할게요! 선생님');

  $home.style.transition = '2s';
  $main.style.transition = '2s';
  $home.style.pointerEvents = 'none';
  $home.style.opacity = 0;
  $main.style.opacity = 1;

  start_audio.play();
};

// 입력한 타이머 총시간
function resultTime(hour, minute, second) {
  result = hour * 36e5 + minute * 6e4 + second * 1e3;
  return result;
}

// 타이머 시간별 한자릿수를 두자리로 표시
const timerCipher = (time, type) => {
  console.log(time);
  return time < 10 ? (type.value = `0${time}`) : (type.value = time);
};

// 타이머 작동
function timerStart() {
  // 문자열을 숫자로 변환
  hour = +$hour.value;
  minute = +$minute.value;
  second = +$second.value;
  console.log(`${hour}시간 ${minute}분 ${second}초`);

  // 입력한 총시간을 ms로 변환
  resultTime(hour, minute, second);
  console.log(result);

  // 입력시간이 없을 경우 타이머 작동방지
  if (result === 0) return;

  $timer_btn_start.style.display = 'none';
  $timer_btn_skip.style.display = 'inline-block';

  $progress_bar.style.width = '100%';
  // $progress_bar.ariaValuemax = result;
  $progress_bar.style.transitionDuration = `${result / 1000}s`;
  $progress_bar.style.transitionTimingFunction = 'linear';

  start_audio.pause();
  start_audio.currentTime = 0;

  timer_start_audio.play();
  timerIsStop = false;

  // 타이머 작동 상태
  if (!timerIsStop) {
    let timer = setTimeout(function run() {
      if (second > 0) {
        second -= 1;
        timerCipher(second, $second);
        timer = setTimeout(run, 1000);
      } else if (minute > 0 && second == 0) {
        second = 60;
        minute -= 1;
        timerCipher(minute, $minute);
        timer = setTimeout(run, 0);
      } else if (hour > 0 && minute == 0 && second == 0) {
        minute = 60;
        hour -= 1;
        timerCipher(hour, $hour);
        timer = setTimeout(run, 0);
      }

      // 타이머가 끝났을 때
      if (hour == 0 && minute == 0 && second == 0) {
        $timer_btn_start.style.display = 'inline-block';
        $timer_btn_skip.style.display = 'none';
        $progress_bar.style.width = '0%';
        $progress_bar.style.transitionTimingFunction = 'step-start';
        last_audio.play();
        console.log('타임아웃 일어나세요! 선생님');
      }
    }, 1000);
  }
}

// 타이머 정지 or 스킵
const timerSkip = () => {
  $hour.value = '00';
  $minute.value = '00';
  $second.value = '00';

  hour = 0;
  minute = 0;
  second = 0;
  result = 0;
  console.log(`result: ${result}`);

  timerIsStop = true;
  // console.log('clearInterval 발동!');

  $timer_btn_start.style.display = 'inline-block';
  $timer_btn_skip.style.display = 'none';

  $progress_bar.style.width = '0%';
  $progress_bar.style.transitionTimingFunction = 'step-start';

  last_audio.play();
  console.log(result);
  console.log('타이머 초기화! 일어나세요! 선생님');
};

// 타이머를 한자리만 입력했을 경우 앞자리에 0을 붙여 두자리로 표현
const numberCipher = e => {
  let num = e.target.value;
  e.target.value = num.length === 2 ? num : num.length === 1 ? `0${num}` : '00';
};

$yuuka_profile_photo.addEventListener('click', helloYuuka);
$start_btn.addEventListener('click', startButton);
$main_logo.addEventListener('click', mainLogo);
$timer_btn_start.addEventListener('click', timerStart);
$timer_btn_skip.addEventListener('click', timerSkip);
$hour.addEventListener('focus', e => (e.target.value = ''));
$minute.addEventListener('focus', e => (e.target.value = ''));
$second.addEventListener('focus', e => (e.target.value = ''));
$hour.addEventListener('focusout', e => numberCipher(e));
$minute.addEventListener('focusout', e => numberCipher(e));
$second.addEventListener('focusout', e => numberCipher(e));
