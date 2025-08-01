// Initialize Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  
  // Expand the web app to full height
  tg.expand();
  
  // Enable closing confirmation
  tg.enableClosingConfirmation();
  
  // Set header color to match app theme
  tg.setHeaderColor('#1a1c2c');
  
  // Set background color
  tg.setBackgroundColor('#0b0f24');
  
  // Ready the web app
  tg.ready();
  
  console.log('Telegram Web App initialized and expanded');
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDdvKeBfe8p2UC8dCkXziECUlJEUw3_l4s",
  authDomain: "karina-5d44d.firebaseapp.com",
  projectId: "karina-5d44d",
  storageBucket: "karina-5d44d.appspot.com",
  messagingSenderId: "930914134264",
  appId: "1:930914134264:web:0e527a744b3d2c7182330d"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Dynamic references based on current pair
function getDocRef() {
  if (!currentPairId) return null;
  return db.collection("pairs").doc(currentPairId).collection("data").doc("counter");
}

function getStatsRef() {
  if (!currentPairId) return null;
  return db.collection("pairs").doc(currentPairId).collection("data").doc("stats");
}

function getPhotoGamesRef() {
  if (!currentPairId) return null;
  return db.collection("pairs").doc(currentPairId).collection("data").doc("photo_games");
}

function getOrgasmRequestsRef() {
  if (!currentPairId) return null;
  return db.collection("pairs").doc(currentPairId).collection("data").doc("orgasm_requests");
}

function getPunishmentsRef() {
  if (!currentPairId) return null;
  return db.collection("pairs").doc(currentPairId).collection("data").doc("punishments");
}

// Punishment tasks data
const punishmentTasks = [
  { "type": "punishment", "description": "7 минут на гречке + аудио 'я виновата' + фото коленей" },
  { "type": "punishment", "description": "10 приседаний + написать 'Я буду послушной' 20 раз" },
  { "type": "punishment", "description": "5 минут стоять в углу + аудио извинения + селфи с опущенными глазами" },
  { "type": "punishment", "description": "Холодный душ 2 минуты + видео как дрожишь" },
  { "type": "punishment", "description": "15 отжиманий + аудио 'Я заслуживаю наказания'" },
  { "type": "punishment", "description": "Написать письмо-извинение + прочитать вслух на аудио" },
  { "type": "punishment", "description": "Снять трусики и держать их во рту 3 минуты + фото" },
  { "type": "punishment", "description": "Видео с фразой 'Я глупая девочка и заслуживаю наказания'" },
  { "type": "punishment", "description": "Стоять с поднятыми руками 5 минут + фото" },
  { "type": "punishment", "description": "Нарисовать на теле слово 'непослушная' и сфотографировать" },
  { "type": "punishment", "description": "5 минут на коленях на полу + аудио 'я сожалею'" },
  { "type": "punishment", "description": "Надеть что-то стыдное и сделать 3 фото" },
  { "type": "punishment", "description": "Полоскание рта водой с солью 30 сек + видео реакции" },
  { "type": "punishment", "description": "Описать в тексте 5 своих ошибок + отправить скрин" },
  { "type": "punishment", "description": "5 минут в позе покаяния + аудио 'прости меня'" },
  { "type": "punishment", "description": "20 прыжков на месте + селфи после с потным лицом" },
  { "type": "punishment", "description": "Записать видео, где умоляешь о прощении" },
  { "type": "punishment", "description": "Нарисовать себя наказанной и отправить фото рисунка" },
  { "type": "punishment", "description": "Ползать 3 минуты по полу + видео" },
  { "type": "punishment", "description": "Один час тишины — без общения и телефона" },
  { "type": "punishment", "description": "Видео, где говоришь 'я разочаровала тебя'" },
  { "type": "punishment", "description": "Один день без нижнего белья + отчёт вечером" },
  { "type": "punishment", "description": "Сделать 10 поклонов + аудио с каждым 'Прости меня'" },
  { "type": "punishment", "description": "Записать 1 минуту стона без прикосновений" },
  { "type": "punishment", "description": "Фраза 'я глупая девочка' написана на теле + фото" },
  { "type": "punishment", "description": "Выставить себя в неловкой позе и сфотографироваться" },
  { "type": "punishment", "description": "5 минут с прикушенной губой + фото" },
  { "type": "punishment", "description": "Публично сказать 'я непослушная' (в аудио)" },
  { "type": "punishment", "description": "Сделать себе 'ошейник' из подручных средств + фото" },
  { "type": "punishment", "description": "Надеть что-то вызывающее и снять 3 селфи" },
  { "type": "punishment", "description": "1 час без комфорта: сесть на жёсткий пол + отчёт" },
  { "type": "punishment", "description": "Написать 3 причины, за что тебя надо наказать" },
  { "type": "punishment", "description": "Промолчать час и не жаловаться ни на что" },
  { "type": "punishment", "description": "Устроить показательный 'стыд' и записать видео" },
  { "type": "punishment", "description": "Видео на 10 секунд: 'я проиграла свою волю'" },
  { "type": "punishment", "description": "Снять 3 фото в разных позах покорности" },
  { "type": "punishment", "description": "Отказ от сладкого на сутки + аудио отчёт вечером" },
  { "type": "punishment", "description": "Написать 20 раз 'я не буду спорить' + фото" },
  { "type": "punishment", "description": "Поза 'наказанной школьницы' 5 минут + фото" },
  { "type": "punishment", "description": "Сделать 5 шпагатов или попыток + видео" },
  { "type": "punishment", "description": "Заставить себя заплакать и сфотографироваться" },
  { "type": "punishment", "description": "Сказать 'я игрушка' и снять аудио" },
  { "type": "punishment", "description": "30 секунд в позе 'собаки' + фото" },
  { "type": "punishment", "description": "Снять себя с завязанными глазами + аудио покорности" },
  { "type": "punishment", "description": "Сделать 5 фото со связанными руками (символически)" },
  { "type": "punishment", "description": "Подразнить и не кончить — аудио сдерживания" },
  { "type": "punishment", "description": "1 час без зеркала и макияжа + фото" },
  { "type": "punishment", "description": "Нарисовать себе след от шлёпка + фото" },
  { "type": "punishment", "description": "Записать аудио 'я готова принять любое наказание'" }
];

// Photo game tasks data
const photoGameTasks = [
  {
    "title": "Пленница",
    "description": "Ты моя пленница. Сделай 5 фото, как будто тебя держат в неволе: связаны руки, взгляд вниз, частичная обнажённость."
  },
  {
    "title": "Секретарша",
    "description": "Ты строгая секретарша. Сделай 4 фото в деловом стиле: в рубашке, за столом, с документами, но с намёком на соблазн."
  },
  {
    "title": "Горничная",
    "description": "Ты непослушная горничная. Сделай 6 фото в процессе уборки: наклоны, игривые позы, частично расстёгнутая форма."
  },
  {
    "title": "Студентка",
    "description": "Ты озорная студентка. Сделай 5 фото с учебниками: невинный взгляд, короткая юбка, соблазнительные позы за партой."
  },
  {
    "title": "Медсестра",
    "description": "Ты заботливая медсестра. Сделай 4 фото в белом халате: профессиональные позы с игривым подтекстом."
  },
  {
    "title": "Фитнес-тренер",
    "description": "Ты спортивный тренер. Сделай 5 фото в спортивной форме: растяжка, упражнения, подчёркивающие твою фигуру."
  },
  {
    "title": "Школьница",
    "description": "Ты непослушная ученица. Сделай 5 фото с ремнём, доской, на коленях у парты."
  },
  {
    "title": "Игрушка",
    "description": "Ты моя кукла. Сделай 4 фото с пустым взглядом, в нелепых позах и детских аксессуарах."
  },
  {
    "title": "Кошечка",
    "description": "Ты моя киска. Сделай 6 фото с ушками, ошейником, на четвереньках и с язычком наружу."
  },
  {
    "title": "Ждущая наказания",
    "description": "Ты провинилась. Сделай 5 фото в углу, на коленях, со связанными руками или взглядом вниз."
  },
  {
    "title": "Подарок",
    "description": "Ты подарок. Сделай 4 фото, обмотав себя лентами или бантами, как сюрприз для меня."
  },
  {
    "title": "Пижамная непослушная",
    "description": "Ты в пижаме, но шалишь. Сделай 5 фото с одеялом, в кровати, в игривых позах."
  },
  {
    "title": "Ванная сцена",
    "description": "Ты мокрая и послушная. Сделай 4 фото в ванне или душе, с каплями воды и мыльной пеной."
  },
  {
    "title": "Наказанная",
    "description": "Ты наказана. Сделай 5 фото в позах подчинения, с надписями на теле (например, 'непослушная')."
  },
  {
    "title": "Домашняя стриптизёрша",
    "description": "Ты танцуешь для меня. Сделай 5 фото с медленным снятием одежды и страстным взглядом."
  },
  {
    "title": "Телесная исповедь",
    "description": "Ты рассказываешь телом. Сделай 4 фото с надписями на теле: 'прости', 'виновата', 'твоя'."
  },
  {
    "title": "Зеркало",
    "description": "Ты играешь с отражением. Сделай 5 фото у зеркала: фронт, бок, сзади, взгляд в глаза себе."
  },
  {
    "title": "Кухонная сцена",
    "description": "Ты 'забылась' на кухне. Сделай 4 фото во фартуке без белья, наклоняясь над плитой или столом."
  },
  {
    "title": "Служанка из прошлого",
    "description": "Ты викторианская горничная. Сделай 5 фото в классической позе, со свечами, книгами или щёткой."
  },
  {
    "title": "Невинная под юбкой",
    "description": "Ты играешь с воображением. Сделай 5 фото в юбке, с видимыми краями белья или без него."
  },
  {
    "title": "Прозрачная непокорность",
    "description": "Ты в прозрачной одежде. Сделай 4 фото в ночнушке или тонкой ткани на просвет."
  },
  {
    "title": "Танцовщица",
    "description": "Ты как на сцене. Сделай 5 фото в движении, с волосами, бросающимися в глаза и телом в ритме."
  },
  {
    "title": "Гимнастка",
    "description": "Ты гнёшься ради меня. Сделай 4 фото с растяжкой, шпагатом, мостиком или позами гибкости."
  },
  {
    "title": "Сельская простушка",
    "description": "Ты на поле. Сделай 4 фото в рубашке, босиком, с соломой или банкой варенья."
  },
  {
    "title": "Книга грехов",
    "description": "Ты читаешь книгу. Сделай 5 фото с эротичной позой и текстом на теле или в книге."
  },
  {
    "title": "Звонок Доминанту",
    "description": "Ты только что позвонила. Сделай 4 фото с телефоном у губ, страстным или покорным выражением лица."
  },
  {
    "title": "В ожидании",
    "description": "Ты ждёшь меня. Сделай 5 фото у двери, на стуле, с раскрытыми руками или ногами."
  },
  {
    "title": "Запретный флирт",
    "description": "Ты знаешь, что нельзя. Сделай 5 фото, флиртуя с камерой, но оставаясь одетой (почти)."
  },
  {
    "title": "Чулки и послушание",
    "description": "Ты в чулках. Сделай 4 фото с медленным натягиванием или снятием чулков."
  },
  {
    "title": "Наказание текстом",
    "description": "Ты описываешь себя. Напиши 5 фраз на теле и сделай 5 фото с разных ракурсов."
  },
  {
    "title": "Застенчивая развратница",
    "description": "Ты смущаешься. Сделай 4 фото, где прячешь лицо, но показываешь тело."
  },
  {
    "title": "Коврик под ногами",
    "description": "Ты внизу. Сделай 4 фото с нижнего ракурса — будто ты у ног хозяина."
  },
  {
    "title": "Наказанная письмом",
    "description": "Ты пишешь. Сделай 5 фото с текстом извинений, ручкой во рту, в покорной позе."
  },
  {
    "title": "Ошейник и поводок",
    "description": "Ты на привязи. Сделай 4 фото с шарфом или ремнём как поводком."
  },
  {
    "title": "Ночная игрушка",
    "description": "Ты принадлежишь ночью. Сделай 4 фото в темноте с яркой подсветкой или свечой."
  },
  {
    "title": "Грязная фантазия",
    "description": "Ты испачкана. Сделай 5 фото с кремом, маслом, вареньем или пеной на теле."
  },
  {
    "title": "Селфи подчинения",
    "description": "Ты отправляешь селфи. Сделай 5 фото, смотря в камеру и прикусывая губу."
  },
  {
    "title": "Точка Gлаз",
    "description": "Ты соблазняешь глазами. Сделай 4 фото крупным планом взгляда, без слов."
  },
  {
    "title": "Винтажная развратница",
    "description": "Ты из прошлого. Сделай 4 фото в чулках, перчатках, с винтажными аксессуарами."
  },
  {
    "title": "Блондиночка наказана",
    "description": "Ты ломаешь образ. Сделай 4 фото как стереотипная блондинка, но покорная."
  },
  {
    "title": "Под столом",
    "description": "Ты там, где тебя не видно. Сделай 3 фото под столом — на коленях, под креслом, как игрушка."
  },
  {
    "title": "В ожидании команды",
    "description": "Ты слушаешь. Сделай 4 фото с телефоном рядом, взглядом в экран и телом в ожидании."
  },
  {
    "title": "Сексуальная тень",
    "description": "Ты в силуэте. Сделай 5 фото с задней подсветкой, чтобы были видны только очертания тела."
  },
  {
    "title": "Прислуга в ожидании",
    "description": "Ты ничем не занята. Сделай 4 фото с тряпкой, пылесосом или метлой, но без одежды."
  },
  {
    "title": "Контроль белья",
    "description": "Ты не носишь его. Сделай 3 фото в юбке без трусиков или с трусиками в руке."
  },
  {
    "title": "Ты без прав",
    "description": "Ты под контролем. Сделай 5 фото с запиской 'не принадлежу себе'."
  },
  {
    "title": "Послушная поза",
    "description": "Ты застываешь. Сделай 4 фото в статичных позах: стоя, сидя, на четвереньках, лёжа."
  },
  {
    "title": "Сексуальный беспорядок",
    "description": "Ты после бурной ночи. Сделай 5 фото в растрёпанном виде: скомканные простыни, слезы, следы на теле."
  },
  {
    "title": "Фантазия без контроля",
    "description": "Ты забылась. Сделай 5 фото, будто тебя застали врасплох за фантазией."
  }
];

let counter = 0;
let incrementHistory = [];
let currentPhotoTask = null;
let currentPunishment = null;
let currentPunishmentId = null;
const MAX_HISTORY = 100;
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // Default to true

// Sound effects
function playSound(type) {
  if (!soundEnabled) return;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let frequency, duration;

  switch(type) {
    case 'increment':
      frequency = 800;
      duration = 0.1;
      break;
    case 'achievement':
      frequency = 600;
      duration = 0.3;
      break;
    case 'success':
      frequency = 900;
      duration = 0.2;
      break;
    case 'error':
      frequency = 300;
      duration = 0.3;
      break;
    default:
      frequency = 500;
      duration = 0.1;
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function updateDisplay() {
  const percent = Math.min(counter / 100, 1) * 100;
  document.getElementById("counter-display").textContent = counter;
  const progress = document.getElementById("progress-bar");
  progress.style.width = percent + "%";
}

function createFloatingHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerText = ["💖", "💗", "💝", "💕"][Math.floor(Math.random() * 4)];
  heart.style.left = (10 + Math.random() * 80) + "%";
  heart.style.fontSize = (12 + Math.random() * 8) + "px";
  heart.style.animation = `float-up ${2.5 + Math.random() * 2}s ease-in-out forwards`;
  document.getElementById("heart-container").appendChild(heart);
  setTimeout(() => heart.remove(), 4500);
}

function updateStatsDisplay(data) {
  document.getElementById("stat-today").textContent = `Сегодня: ${data.today || 0}`;
  document.getElementById("stat-week").textContent = `На этой неделе: ${data.week || 0}`;
  document.getElementById("stat-month").textContent = `В этом месяце: ${data.month || 0}`;
  document.getElementById("stat-record").textContent = `Рекорд: ${data.record || 0}`;
  
  // Add visual progress bars for stats
  const todayPercent = Math.min((data.today || 0) / 20 * 100, 100);
  const weekPercent = Math.min((data.week || 0) / 100 * 100, 100);
  
  updateStatBar('today-bar', todayPercent);
  updateStatBar('week-bar', weekPercent);
}

function updateStatBar(barId, percent) {
  const bar = document.getElementById(barId);
  if (bar) {
    bar.style.width = percent + '%';
    bar.style.background = `linear-gradient(90deg, 
      ${percent > 80 ? '#4CAF50' : percent > 50 ? '#ff9800' : '#ff4081'}, 
      ${percent > 80 ? '#66BB6A' : percent > 50 ? '#ffb74d' : '#ff6b9e'})`;
  }
}

function updateStreakDisplay(data) {
  const streakCount = document.getElementById("streak-count");
  const dailyProgress = document.getElementById("daily-progress");

  if (streakCount) {
    streakCount.textContent = data.streak || 0;
  }

  if (dailyProgress) {
    const today = data.today || 0;
    dailyProgress.textContent = today;

    // Change color based on progress
    const streakInfo = document.getElementById("streak-info");
    if (today >= 10) {
      streakInfo.style.color = "#4CAF50"; // Green when goal reached
    } else if (today >= 7) {
      streakInfo.style.color = "#ff9ec6"; // Pink when close
    } else {
      streakInfo.style.color = "#ffb6d5"; // Default
    }
  }
}

async function updateFirestoreStats(increment = 1) {
  if (!currentPairId) return;

  const todayKey = new Date().toISOString().slice(0, 10);
  const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  try {
    const statsRef = getStatsRef();
    if (!statsRef) return;

    const snapshot = await statsRef.get();
    let data = snapshot.exists ? snapshot.data() : {
      today: 0, week: 0, month: 0, record: 0, lastUpdated: todayKey, streak: 0, lastStreakUpdate: todayKey
    };

    if (increment < 0) {
      if (data.today <= 0 && data.week <= 0 && data.month <= 0) return;
      data.today = Math.max(0, (data.today || 0) + increment);
      data.week = Math.max(0, (data.week || 0) + increment);
      data.month = Math.max(0, (data.month || 0) + increment);
    } else {
      // Handle day change
      if (data.lastUpdated !== todayKey) {
        // Check if streak should continue
        if (data.lastStreakUpdate === yesterdayKey && (data.today || 0) >= 10) {
          data.streak = (data.streak || 0) + 1;
        } else if (data.lastStreakUpdate !== yesterdayKey && data.lastStreakUpdate !== todayKey) {
          data.streak = 0; // Reset streak if gap
        }
        data.today = increment;
        data.lastStreakUpdate = todayKey;
      } else {
        data.today = (data.today || 0) + increment;
      }

      // Update weekly goal progress (if reached daily goal of 10)
      if (data.today >= 10 && data.lastStreakUpdate !== todayKey) {
        data.streak = (data.streak || 0) + 1;
        data.lastStreakUpdate = todayKey;
      }

      data.week = (data.week || 0) + increment;
      data.month = (data.month || 0) + increment;
      data.record = Math.max(data.record || 0, counter);
      data.lastUpdated = todayKey;
    }

    await statsRef.set(data);
    updateStatsDisplay(data);
    updateStreakDisplay(data);
  } catch (e) {
    console.error("Error updating stats:", e);
  }
}

async function loadStats() {
  if (!currentPairId) return;

  const statsBox = document.getElementById("stats-display");
  statsBox.classList.add("loading");
  try {
    const statsRef = getStatsRef();
    if (!statsRef) return;

    const snapshot = await statsRef.get();
    if (snapshot.exists) {
      const data = snapshot.data();
      updateStatsDisplay(data);
      updateStreakDisplay(data);
    }
  } catch (e) {
    console.error("Failed to load stats:", e);
  } finally {
    statsBox.classList.remove("loading");
  }
}

// Photo Game functionality
function getRandomPhotoTask() {
  const randomIndex = Math.floor(Math.random() * photoGameTasks.length);
  return photoGameTasks[randomIndex];
}

function displayPhotoTask(task) {
  document.getElementById("photo-game-title").textContent = task.title;
  document.getElementById("photo-game-description").textContent = task.description;
  currentPhotoTask = task;
}

async function savePhotoGameTask(task) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString();

    const photoGameData = {
      date: today,
      timestamp: timestamp,
      type: "photo_game",
      title: task.title,
      description: task.description,
      status: "pending"
    };

    const photoGamesRef = getPhotoGamesRef();
    if (photoGamesRef) {
      await photoGamesRef.collection("tasks").add(photoGameData);
    }

    // Send task to Telegram bot
    const partnerName = currentUser === 'he' ? 'вашего партнёра' : 'себя';
    const message = `📷 <b>Задание фото игры для ${partnerName}</b>\n\n<b>${task.title}</b>\n\n${task.description}`;

    if (currentUser === 'he') {
      // Dominant sending task to submissive
      await sendTelegramMessage(message, null, 'she');
    } else {
      // Submissive choosing task for themselves, notify dominant
      await sendTelegramMessage(message, null, 'he');
    }

    // Show success notification
    showPhotoGameNotification("📷 Задание отправлено в Telegram!");

  } catch (error) {
    console.error("Error saving photo game task:", error);
    showPhotoGameNotification("❌ Ошибка сохранения задания");
  }
}

function showPhotoGameNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #ff4081, #ff9ec6);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(255, 64, 129, 0.4);
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Punishment functionality
function getRandomPunishment() {
  const randomIndex = Math.floor(Math.random() * punishmentTasks.length);
  return punishmentTasks[randomIndex];
}

function displayPunishment(punishment) {
  document.getElementById("punishment-description").textContent = punishment.description;
  currentPunishment = punishment;
}

async function savePunishment(punishment) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString();

    const punishmentData = {
      date: today,
      timestamp: timestamp,
      type: "punishment",
      description: punishment.description,
      status: "pending",
      assignedBy: currentUser
    };

    const punishmentsRef = getPunishmentsRef();
    if (!punishmentsRef) return;

    const docRef = await punishmentsRef.collection("tasks").add(punishmentData);
    currentPunishmentId = docRef.id;

    if (currentUser === 'she') {
      // Send notification to dominant about self-chosen punishment
      const domMessage = `🩸 <b>Ваш партнёр выбрал наказание:</b>\n\n${punishment.description}`;
      await sendTelegramMessage(domMessage, null, 'he');

      showPunishmentNotification("🩸 Наказание выбрано и сообщено!");
    } else {
      // Dominant assigning punishment
      const message = `🩸 <b>Наказание назначено вашим доминантом</b>\n\n${punishment.description}\n\n<i>Статус: Ожидание</i>`;
      await sendTelegramMessage(message, null, 'she');

      showPunishmentNotification("🩸 Наказание назначено!");
    }

    document.getElementById("punishment-completed").style.display = "block";

  } catch (error) {
    console.error("Error saving punishment:", error);
    showPunishmentNotification("❌ Ошибка сохранения наказания");
  }
}

async function completePunishment() {
  if (!currentPunishmentId) return;

  try {
    const punishmentsRef = getPunishmentsRef();
    if (!punishmentsRef) return;

    const docRef = punishmentsRef.collection("tasks").doc(currentPunishmentId);
    await docRef.update({
      status: "done",
      completedAt: new Date().toISOString()
    });

    // Send completion notification to Telegram
    const message = `✅ <b>Наказание выполнено</b>\n\nВаш партнёр выполнил наказание:\n${currentPunishment.description}`;

    // Notify the dominant about punishment completion
    if (currentUser === 'she') {
      await sendTelegramMessage(message, null, 'he');
    } else {
      await sendTelegramMessage(message, null, 'she');
    }

    showPunishmentNotification("✅ Наказание выполнено!");

    // Reset punishment state
    currentPunishment = null;
    currentPunishmentId = null;
    document.getElementById("punishment-completed").style.display = "none";

  } catch (error) {
    console.error("Error completing punishment:", error);
    showPunishmentNotification("❌ Error completing punishment");
  }
}

function showPunishmentNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #ff4081, #ff9ec6);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(255, 64, 129, 0.4);
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Telegram bot configuration
const TELEGRAM_BOT_TOKEN = "7205768597:AAFDJi75VVBgWUVxuY02MmlElXeAPGjmqeU";

// Get pair-specific Telegram chat IDs from Firestore
async function getPairTelegramData() {
  if (!currentPairId) return null;

  try {
    const pairDoc = await db.collection("pairs").doc(currentPairId).get();
    if (pairDoc.exists) {
      return pairDoc.data().telegramData || {};
    }
  } catch (error) {
    console.error("Error getting pair Telegram data:", error);
  }
  return {};
}

// Update pair with Telegram chat IDs
async function updatePairTelegramData(telegramData) {
  if (!currentPairId) return;

  try {
    await db.collection("pairs").doc(currentPairId).update({
      telegramData: telegramData
    });
  } catch (error) {
    console.error("Error updating pair Telegram data:", error);
  }
}

// User authorization state
let currentUser = localStorage.getItem('currentUser') || null;
let isAuthorized = currentUser !== null;
let currentPairId = localStorage.getItem('currentPairId') || null;
let userUID = localStorage.getItem('userUID') || null;

// Initialize app function
function initializeApp() {
  if (!currentPairId) {
    showAuthorizationModal();
    return;
  }

  // Update UI based on user type
  if (currentUser) {
    updateUIForUser(currentUser);
  }

  // Real-time listener for history updates
  const counterDocRef = getDocRef();
  if (counterDocRef) {
    counterDocRef.onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        counter = data.count || 0;
        incrementHistory = data.history || [];
        if (data.lastTimestamp) {
          document.getElementById("last-timestamp").textContent = `Последнее: ${data.lastTimestamp}`;
        }
        updateDisplay();
      }
    });
  }

  // Load initial stats
  loadStats();
}

// Send message to Telegram bot
async function sendTelegramMessage(message, inlineKeyboard = null, targetUser = null, chatId = null) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    let targetChatId = chatId;

    if (!targetChatId) {
      const telegramData = await getPairTelegramData();

      if (targetUser) {
        // Send to specific user type
        targetChatId = telegramData[`${targetUser}_chat_id`];
      } else {
        // Send to current user's partner
        const partnerType = currentUser === 'he' ? 'she' : 'he';
        targetChatId = telegramData[`${partnerType}_chat_id`];
      }

      if (!targetChatId) {
        console.warn("No Telegram chat ID found for target user");
        return null;
      }
    }

    const payload = {
      chat_id: targetChatId,
      text: message,
      parse_mode: "HTML"
    };

    if (inlineKeyboard) {
      payload.reply_markup = {
        inline_keyboard: inlineKeyboard
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    throw error;
  }
}

// Orgasm Request functionality
let lastUpdateId = 0;
let isPollingActive = false;

async function saveOrgasmRequest() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString();

    const orgasmRequestData = {
      date: today,
      timestamp: timestamp,
      type: "orgasm_request",
      status: "pending",
      requestedBy: currentUser === 'she' ? "Karina" : "User",
      message: "Карина просит разрешения на оргазм"
    };

    const orgasmRequestsRef = getOrgasmRequestsRef();
    if (orgasmRequestsRef) {
      await orgasmRequestsRef.collection("requests").add(orgasmRequestData);
    }

    if (currentUser === 'she') {
      // Send request to dominant
      const message = "🧎‍♀️ <b>Ваш партнёр просит разрешения на оргазм</b>";
      const inlineKeyboard = [
        [
          { text: "✅ Разрешить", callback_data: "orgasm_allow" },
          { text: "❌ Отказать", callback_data: "orgasm_deny" }
        ]
      ];

      await sendTelegramMessage(message, inlineKeyboard, 'he');

      // Start polling for bot updates if not already active
      if (!isPollingActive) {
        startTelegramPolling();
      }

      showOrgasmRequestNotification("🧎‍♀️ Запрос отправлен доминанту!");
    } else {
      // If dominant is making request, auto-approve
      showOrgasmResponseNotification("✅ Автоматически разрешено", "success");
    }

    return true;
  } catch (error) {
    console.error("Error saving orgasm request:", error);
    showOrgasmRequestNotification("❌ Ошибка отправки запроса");
    return false;
  }
}

async function sendCumCommand() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString();

    const cumCommandData = {
      date: today,
      timestamp: timestamp,
      type: "cum_command",
      status: "pending",
      commandedBy: "Dominant",
      message: "Карина, кончай, сучка!"
    };

    const orgasmRequestsRef = getOrgasmRequestsRef();
    if (!orgasmRequestsRef) return false;

    const docRef = orgasmRequestsRef.collection("commands");
    await docRef.add(cumCommandData);

    // Send command to submissive
    const message = "🔥 <b>Ваш доминант приказывает вам кончить!</b>";
    const inlineKeyboard = [
      [
        { text: "Да, господин", callback_data: "cum_yes_sir" }
      ]
    ];

    await sendTelegramMessage(message, inlineKeyboard, 'she');

    // Start polling for bot updates if not already active
    if (!isPollingActive) {
      startTelegramPolling();
    }

    showCumCommandNotification("🔥 Команда отправлена!");

    return true;
  } catch (error) {
    console.error("Error sending cum command:", error);
    showCumCommandNotification("❌ Ошибка отправки команды");
    return false;
  }
}

// Update orgasm request status in Firestore
async function updateOrgasmRequestStatus(status, approvedBy) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString();

    const orgasmRequestsRef = getOrgasmRequestsRef();
    if (!orgasmRequestsRef) return;

    const docRef = orgasmRequestsRef.collection("requests");
    await docRef.add({
      date: today,
      timestamp: timestamp,
      type: "orgasm",
      status: status,
      by: approvedBy
    });
  } catch (error) {
    console.error("Error updating orgasm request status:", error);
  }
}

// Telegram bot polling for callback responses
async function getTelegramUpdates() {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=3`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 second timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 409) {
        // Conflict - another bot instance is polling
        isPollingActive = false;
        return;
      }
      if (response.status === 401) {
        console.error("Telegram bot token is invalid");
        isPollingActive = false;
        return;
      }
      return; // Don't throw for other HTTP errors
    }

    const data = await response.json();

    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;

        // Check for callback query (button press)
        if (update.callback_query) {
          await handleCallbackQuery(update.callback_query);
        }
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      // Timeout is normal for long polling, don't log as error
      return;
    }

    // Reduce error logging frequency
    if (Math.random() < 0.1) { // Only log 10% of errors
      console.warn("Telegram polling issue:", error.message);
    }

    // Stop polling on persistent errors
    if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
      isPollingActive = false;
    }
  }
}

// Handle callback queries from Telegram
async function handleCallbackQuery(callbackQuery) {
  const callbackData = callbackQuery.data;

  if (callbackData === "orgasm_allow") {
    showOrgasmResponseNotification("✅ Разрешение предоставлено", "success");

    // Send confirmation to submissive
    await sendTelegramMessage("✅ <b>Разрешение на оргазм предоставлено</b>\n\nВаш доминант разрешил вам кончить.", null, 'she');

    // Answer the callback query
    await answerCallbackQuery(callbackQuery.id, "Разрешение предоставлено");

    // Update request status in Firestore
    await updateOrgasmRequestStatus("allowed", "Dominant");

    // Stop polling after successful response
    isPollingActive = false;

  } else if (callbackData === "orgasm_deny") {
    showOrgasmResponseNotification("❌ В разрешении отказано", "denied");

    // Send denial to submissive
    await sendTelegramMessage("❌ <b>В разрешении на оргазм отказано</b>\n\nВаш доминант отклонил ваш запрос.", null, 'she');

    // Answer the callback query
    await answerCallbackQuery(callbackQuery.id, "В разрешении отказано");

    // Update request status in Firestore
    await updateOrgasmRequestStatus("denied", "Dominant");

    // Stop polling after successful response
    isPollingActive = false;
  } else if (callbackData === "cum_yes_sir") {
    showCumCommandResponseNotification("✅ Команда принята", "success");

    // Send confirmation to dominant
    await sendTelegramMessage("✅ <b>Команда принята</b>\n\nВаш партнёр готов выполнить.", null, 'he');

    // Answer the callback query
    await answerCallbackQuery(callbackQuery.id, "Команда принята");

     // Send notification to dominant's app
    showDominantCumNotification("Партнёр готов выполнить.");

    // Stop polling after successful response
    isPollingActive = false;
  }
}

async function answerCallbackQuery(callbackQueryId, text) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text,
        show_alert: false
      })
    });
  } catch (error) {
    console.error("Error answering callback query:", error);
  }
}

let pollInterval = null;
let pollRetryCount = 0;
const MAX_POLL_RETRIES = 3;

function startTelegramPolling() {
  if (isPollingActive) return;

  isPollingActive = true;
  pollRetryCount = 0;

  const poll = async () => {
    if (!isPollingActive) {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      return;
    }

    try {
      await getTelegramUpdates();
      pollRetryCount = 0; // Reset retry count on success
    } catch (error) {
      pollRetryCount++;
      if (pollRetryCount >= MAX_POLL_RETRIES) {
        console.warn("Max polling retries reached, stopping polling");
        stopTelegramPolling();
        return;
      }
    }
  };

  // Start polling immediately, then every 4 seconds
  poll();
  pollInterval = setInterval(poll, 4000);

  // Stop polling after 3 minutes to prevent excessive requests
  setTimeout(() => {
    stopTelegramPolling();
  }, 180000); // 3 minutes
}

function stopTelegramPolling() {
  isPollingActive = false;
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

function showOrgasmResponseNotification(message, type) {
  const notification = document.createElement("div");

  const bgColor = type === "success" ? 
    "linear-gradient(45deg, #4CAF50, #66BB6A)" : 
    "linear-gradient(45deg, #f44336, #ef5350)";

  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${bgColor};
    color: white;
    padding: 30px 40px;
    border-radius: 20px;
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    z-index: 10001;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    text-align: center;
    animation: bounceIn 0.5s ease-out;
    border: 3px solid white;
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // Add bounceIn animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes bounceIn {
      0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.05); }
      70% { transform: translate(-50%, -50%) scale(0.9); }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Add celebration hearts for approval
  if (type === "success") {
    for(let i = 0; i < 8; i++) {
      setTimeout(createFloatingHeart, i * 100);
    }
  }

  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 300);
  }, 4000);
}

function showOrgasmRequestNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #ff4081, #ff9ec6);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(255, 64, 129, 0.4);
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function showCumCommandNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #4081ff, #6b9eff);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(64, 129, 255, 0.4);
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function showCumCommandResponseNotification(message, type) {
  const notification = document.createElement("div");

  const bgColor = type === "success" ? 
    "linear-gradient(45deg, #4CAF50, #66BB6A)" : 
    "linear-gradient(45deg, #f44336, #ef5350)";

  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${bgColor};
    color: white;
    padding: 30px 40px;
    border-radius: 20px;
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    z-index: 10001;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    text-align: center;
    animation: bounceIn 0.5s ease-out;
    border: 3px solid white;
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // Add bounceIn animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes bounceIn {
      0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.05); }
      70% { transform: translate(-50%, -50%) scale(0.9); }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Add celebration hearts for approval
  if (type === "success") {
    for(let i = 0; i < 8; i++) {
      setTimeout(createFloatingHeart, i * 100);
    }
  }

  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 300);
  }, 4000);
}

function showDominantCumNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(45deg, #4081ff, #6b9eff);
    color: white;
    padding: 15px 25px;
    border-radius: 12px;
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Authorization functions
async function generatePairId() {
  // Generate a unique 6-character code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pairId = '';
  for (let i = 0; i < 6; i++) {
    pairId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Check if this ID already exists
  const pairDoc = await db.collection("pairs").doc(pairId).get();
  if (pairDoc.exists) {
    // If it exists, generate a new one
    return generatePairId();
  }

  return pairId;
}

async function createPair(userType) {
  try {
    const pairId = await generatePairId();
    const uid = generateUID();

    // Create pair document
    await db.collection("pairs").doc(pairId).set({
      createdAt: new Date().toISOString(),
      createdBy: uid,
      users: [uid],
      userTypes: {
        [uid]: userType
      }
    });

    // Initialize pair data
    await db.collection("pairs").doc(pairId).collection("data").doc("counter").set({
      count: 0,
      history: [],
      lastTimestamp: ""
    });

    await db.collection("pairs").doc(pairId).collection("data").doc("stats").set({
      today: 0,
      week: 0,
      month: 0,
      record: 0,
      streak: 0,
      lastUpdated: new Date().toISOString().slice(0, 10)
    });

    // Store user info
    currentPairId = pairId;
    userUID = uid;
    localStorage.setItem('currentPairId', pairId);
    localStorage.setItem('userUID', uid);

    showPairCodeModal(pairId);
    return pairId;
  } catch (error) {
    console.error("Error creating pair:", error);
    showPairNotification("❌ Error creating pair");
    return null;
  }
}

async function joinPair(pairId, userType) {
  try {
    const pairDoc = await db.collection("pairs").doc(pairId).get();

    if (!pairDoc.exists) {
      showPairNotification("❌ Код пары не найден. Пожалуйста, проверьте код и попробуйте снова.");
      return false;
    }

    const pairData = pairDoc.data();

    if (pairData.users.length >= 2) {
      showPairNotification("❌ Эта пара уже заполнена (максимум 2 пользователя)");
      return false;
    }

    // Check if user is trying to join with the same role as creator
    const creatorUID = pairData.createdBy;
    const creatorRole = pairData.userTypes[creatorUID];

    if (creatorRole === userType) {
      const roleNames = { 'he': 'Доминант', 'she': 'Сабмиссив' };
      showPairNotification(`❌ В этой паре уже есть ${roleNames[userType]}. Пожалуйста, выберите противоположную роль.`);
      return false;
    }

    const uid = generateUID();

    // Add user to pair
    await db.collection("pairs").doc(pairId).update({
      users: firebase.firestore.FieldValue.arrayUnion(uid),
      [`userTypes.${uid}`]: userType,
      joinedAt: new Date().toISOString()
    });

    // Store user info
    currentPairId = pairId;
    userUID = uid;
    localStorage.setItem('currentPairId', pairId);
    localStorage.setItem('userUID', uid);

    showPairNotification("✅ Успешно присоединились к паре! Ваше соединение теперь приватное и безопасное.");
    return true;
  } catch (error) {
    console.error("Error joining pair:", error);
    if (error.code === 'permission-denied') {
      showPairNotification("❌ Доступ запрещён. Пожалуйста, проверьте интернет-соединение.");
    } else {
      showPairNotification("❌ Ошибка сети. Пожалуйста, попробуйте снова.");
    }
    return false;
  }
}

function generateUID() {
  return 'user_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
}

function showPairCodeModal(pairId) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content" style="width: 400px; max-width: 95%; text-align: center;">
      <div style="font-size: 16px; color: #4CAF50; margin-bottom: 20px;">
        ✅ Pair Created Successfully!
      </div>

      <div style="background: rgba(76, 175, 80, 0.1); padding: 20px; border-radius: 12px; 
                  border: 2px solid #4CAF50; margin: 20px 0;">
        <div style="font-size: 12px; color: #ffb6d5; margin-bottom: 10px;">Your Pair Code:</div>
        <div style="font-size: 24px; color: #4CAF50; letter-spacing: 3px; margin: 15px 0; 
                    text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);">${pairId}</div>
        <div style="font-size: 10px; color: #ffe6eb;">Share this code with your partner</div>
      </div>

      <div style="background: rgba(33, 150, 243, 0.1); padding: 15px; border-radius: 12px; 
                  border: 2px solid #2196F3; margin: 20px 0;">
        <div style="font-size: 12px; color: #ffb6d5; margin-bottom: 10px;">📱 Enable Telegram Notifications</div>
        <div style="font-size: 10px; color: #ffe6eb; margin-bottom: 10px;">
          To receive notifications, start a chat with our bot and click the button below:
        </div>
        <button onclick="window.open('https://t.me/iloveyoukarina_bot', '_blank')" 
                style="background: linear-gradient(145deg, #0088cc, #0099dd); margin: 5px 0; width: 100%;">
          📱 OPEN TELEGRAM BOT
        </button>
        <button onclick="setupTelegram('${pairId}')" 
                style="background: linear-gradient(145deg, #ff9800, #ffb74d); margin: 5px 0; width: 100%;">
          🔗 SETUP NOTIFICATIONS
        </button>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button onclick="copyToClipboard('${pairId}')" style="flex: 1; background: linear-gradient(145deg, #2196F3, #42A5F5);">
          📋 COPY CODE
        </button>
        <button onclick="this.closest('.modal-overlay').remove()" style="flex: 1; background: linear-gradient(145deg, #4CAF50, #66BB6A);">
          ✅ CONTINUE
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = "flex";
}

async function setupTelegram(pairId) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content" style="width: 380px; max-width: 95%; text-align: center;">
      <div style="font-size: 16px; color: #2196F3; margin-bottom: 20px;">
        📱 Telegram Setup
      </div>

      <div style="font-size: 11px; color: #ffb6d5; margin-bottom: 20px; line-height: 1.4;">
        1. Open the Telegram bot by clicking the button above<br>
        2. Send the command: <code>/setup ${pairId}</code><br>
        3. The bot will automatically connect to your pair
      </div>

      <div style="background: rgba(255, 152, 0, 0.1); padding: 15px; border-radius: 12px; 
                  border: 2px solid #ff9800; margin: 20px 0;">
        <div style="font-size: 10px; color: #ffe6eb;">
          💡 Both partners need to setup Telegram individually to receive notifications
        </div>
      </div>

      <button onclick="this.closest('.modal-overlay').remove()" 
              style="background: linear-gradient(145deg, #4CAF50, #66BB6A); width: 100%;">
        ✅ GOT IT
      </button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = "flex";
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showPairNotification("📋 Code copied to clipboard!");
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showPairNotification("📋 Code copied to clipboard!");
  });
}

function showPairNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(45deg, #4CAF50, #66BB6A);
    color: white;
    padding: 15px 25px;
    border-radius: 12px;
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function showPairingModal() {
  const pairingModal = document.createElement("div");
  pairingModal.id = "pairing-modal";
  pairingModal.className = "modal-overlay show";
  pairingModal.innerHTML = `
    <div class="modal-content" style="width: 380px; max-width: 95%;">
      <div class="modal-header">
        <span>💕 СОЗДАНИЕ ПАРЫ</span>
      </div>
      <div style="text-align: center; color: #ffb6d5; font-size: 11px; line-height: 1.4; margin: 20px 0;">
        <div style="font-size: 16px; color: #ff4081; margin-bottom: 15px; text-shadow: 0 0 10px rgba(255, 64, 129, 0.5);">
          🔗 Создать или присоединиться к паре
        </div>
        <div style="color: #ffe6eb; margin-bottom: 20px;">
          Каждая пара получает приватное общее пространство для интимных данных
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <label style="display: block; color: #ffb6d5; font-size: 11px; margin-bottom: 12px; text-align: left;">
          👤 Выберите вашу роль:
        </label>
        <div style="display: flex; gap: 12px; margin-bottom: 15px;">
          <button id="role-he" class="role-btn" style="flex: 1; padding: 12px; font-size: 10px; 
                  background: linear-gradient(145deg, #4081ff, #6b9eff); border: 2px solid transparent;
                  transition: all 0.3s ease;">
            👨 ОН (ДОМИНАНТ)
          </button>
          <button id="role-she" class="role-btn" style="flex: 1; padding: 12px; font-size: 10px; 
                  background: linear-gradient(145deg, #ff4081, #ff6b9e); border: 2px solid transparent;
                  transition: all 0.3s ease;">
            👩 ОНА (САБМИССИВ)
          </button>
        </div>
        <div id="role-description" style="font-size: 9px; color: #ffe6eb; text-align: center; margin-bottom: 8px; min-height: 20px;">
          Выберите вашу роль в отношениях
        </div>
      </div>

      <div id="action-section" style="opacity: 0.5; transition: opacity 0.3s ease; pointer-events: none;">
        <div style="display: flex; justify-content: center; margin-bottom: 25px;">
          <button id="create-pair" style="width: 90%; padding: 15px; font-size: 11px;
                  background: linear-gradient(145deg, #4CAF50, #66BB6A); border: 2px solid #4CAF50; 
                  border-radius: 10px; color: white; cursor: pointer; font-family: 'Press Start 2P', monospace;
                  transition: all 0.3s ease; position: relative; overflow: hidden;">
            <span style="position: relative; z-index: 1;">✨ СОЗДАТЬ НОВУЮ ПАРУ</span>
          </button>
        </div>

        <div style="margin: 20px 0 15px 0; text-align: center; color: #ffb6d5; font-size: 10px; 
                    border-top: 1px solid rgba(255, 64, 129, 0.5); padding-top: 15px; line-height: 1.4;
                    text-shadow: 0 0 5px rgba(255, 182, 213, 0.3);">
          ИЛИ ПРИСОЕДИНИТЬСЯ К СУЩЕСТВУЮЩЕЙ<br>ПАРЕ
        </div>

        <div style="margin-bottom: 20px; position: relative;">
          <input id="pair-code-input" type="text" placeholder="ВВЕДИТЕ 6-ЗНАЧНЫЙ КОД" 
                 style="width: calc(100% - 24px); padding: 12px; font-family: 'Press Start 2P', monospace; font-size: 11px; 
                        background: #1f2235; border: 2px solid #ff4081; border-radius: 10px; color: #ffb6d5;
                        text-align: center; text-transform: uppercase; letter-spacing: 2px;
                        transition: border-color 0.3s ease; box-sizing: border-box; margin: 0 auto; display: block;" maxlength="6">
          <div id="code-validation" style="font-size: 9px; color: #f44336; text-align: center; margin-top: 8px; min-height: 18px;"></div>
        </div>

        <div style="display: flex; justify-content: center; margin-top: 15px;">
          <button id="join-pair" style="width: 90%; padding: 12px; font-size: 11px; 
                  background: linear-gradient(145deg, #ff9800, #ffb74d); border: 2px solid #ff9800;
                  border-radius: 10px; color: white; cursor: pointer; font-family: 'Press Start 2P', monospace;
                  transition: all 0.3s ease;">
            🤝 ПРИСОЕДИНИТЬСЯ К ПАРЕ
          </button>
        </div>
      </div>

      <div style="margin-top: 20px; font-size: 9px; color: #ffe6eb; text-align: center; line-height: 1.3;">
        💡 Подсказка: Поделитесь 6-значным кодом с партнёром, чтобы соединить ваши аккаунты
      </div>
    </div>
  `;

  document.body.appendChild(pairingModal);
  pairingModal.style.display = "flex";

  let selectedRole = null;
  const actionSection = document.getElementById("action-section");
  const roleDescription = document.getElementById("role-description");
  const codeInput = document.getElementById("pair-code-input");
  const codeValidation = document.getElementById("code-validation");

  // Role descriptions
  const roleDescriptions = {
    'he': '👨 Роль доминанта - Полный контроль над командами и разрешениями',
    'she': '👩 Роль сабмиссива - Получает команды и запрашивает разрешения'
  };

  // Role selection with improved UX
  function selectRole(role) {
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.style.opacity = '0.5';
      btn.style.border = '2px solid transparent';
    });
    const selectedBtn = document.getElementById(`role-${role}`);
    selectedBtn.style.opacity = '1';
    selectedBtn.style.border = '2px solid #fff';
    selectedBtn.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3)';

    // Update description and enable actions
    roleDescription.textContent = roleDescriptions[role];
    roleDescription.style.color = '#4CAF50';
    actionSection.style.opacity = '1';
    actionSection.style.pointerEvents = 'auto';
  }

  document.getElementById("role-he").addEventListener("click", () => selectRole('he'));
  document.getElementById("role-she").addEventListener("click", () => selectRole('she'));

  // Input validation for pair code
  codeInput.addEventListener('input', (e) => {
    const value = e.target.value.toUpperCase();
    e.target.value = value;

    if (value.length === 0) {
      codeValidation.textContent = '';
      e.target.style.borderColor = '#ff4081';
    } else if (value.length < 6) {
      codeValidation.textContent = 'Код должен содержать 6 символов';
      codeValidation.style.color = '#ff9800';
      e.target.style.borderColor = '#ff9800';
    } else if (value.length === 6) {
      codeValidation.textContent = '✓ Правильный формат';
      codeValidation.style.color = '#4CAF50';
      e.target.style.borderColor = '#4CAF50';
    }
  });

  // Create pair with loading state
  document.getElementById("create-pair").addEventListener("click", async () => {
    if (!selectedRole) {
      showPairNotification("⚠️ Пожалуйста, сначала выберите вашу роль");
      return;
    }

    const createBtn = document.getElementById("create-pair");
    const originalText = createBtn.innerHTML;
    createBtn.innerHTML = '<span style="position: relative; z-index: 1;">🔄 СОЗДАНИЕ...</span>';
    createBtn.disabled = true;

    try {
      const pairId = await createPair(selectedRole);
      if (pairId) {
        currentUser = selectedRole;
        localStorage.setItem('currentUser', selectedRole);
        showPairCodeModal(pairId);
        pairingModal.classList.remove('show');
        setTimeout(() => pairingModal.remove(), 300);
        initializeApp();
      }
    } finally {
      createBtn.innerHTML = originalText;
      createBtn.disabled = false;
    }
  });

  // Join pair with validation
  document.getElementById("join-pair").addEventListener("click", async () => {
    if (!selectedRole) {
      showPairNotification("⚠️ Пожалуйста, сначала выберите вашу роль");
      return;
    }

    const pairCode = codeInput.value.trim().toUpperCase();
    if (!pairCode) {
      showPairNotification("⚠️ Пожалуйста, введите код пары");
      codeInput.focus();
      return;
    }

    if (pairCode.length !== 6) {
      showPairNotification("⚠️ Код пары должен содержать 6 символов");
      codeInput.focus();
      return;
    }

    const joinBtn = document.getElementById("join-pair");
    const originalText = joinBtn.innerHTML;
    joinBtn.innerHTML = '🔄 ПРИСОЕДИНЕНИЕ...';
    joinBtn.disabled = true;

    try {
      const success = await joinPair(pairCode, selectedRole);
      if (success) {
        currentUser = selectedRole;
        localStorage.setItem('currentUser', selectedRole);
        pairingModal.classList.remove('show');
        setTimeout(() => pairingModal.remove(), 300);
        initializeApp();
      }
    } finally {
      joinBtn.innerHTML = originalText;
      joinBtn.disabled = false;
    }
  });
}

function showAuthorizationModal() {
  // Check if user already has a pair
  if (currentPairId && userUID) {
    // Try to restore session
    initializeApp();
    return;
  }

  showPairingModal();
}

function authorizeUser(userType) {
  currentUser = userType;
  isAuthorized = true;
  localStorage.setItem('currentUser', userType);

  // Update UI based on user type
  updateUIForUser(userType);

  // Show authorization success
  const message = userType === 'he' ? "👨 Authorized as Dominant" : "👩 Authorized as Submissive";
  showAuthNotification(message);
}

function updateUIForUser(userType) {
  // Update title and styling based on user
  const titleElement = document.querySelector('.title');
  const titleText = titleElement.firstChild;
  if (userType === 'he') {
    titleText.textContent = "ПАНЕЛЬ УПРАВЛЕНИЯ ДОМИНАНТА";
    document.body.style.setProperty('--primary-color', '#4081ff');
  } else {
    titleText.textContent = "КАРИНА ОРГАЗМ-О-МАТИК";
    document.body.style.setProperty('--primary-color', '#ff4081');
  }

  // Show user info
  const userInfo = document.getElementById("user-info");
  const userDisplay = document.getElementById("current-user-display");
  if (userInfo && userDisplay) {
    userDisplay.textContent = userType === 'he' ? '👨 Режим доминанта' : '👩 Режим сабмиссива';
    userInfo.style.display = 'block';
  }

  // Show/hide certain buttons based on user type
  const orgasmBtn = document.getElementById("orgasm-request-btn");
  const cumCommandBtn = document.getElementById("cum-command-btn");

  if (orgasmBtn) {
    // Only show orgasm request for submissive user
    orgasmBtn.style.display = userType === 'she' ? 'inline-block' : 'none';
  }

  if (cumCommandBtn) {
    // Only show cum command for dominant user
    cumCommandBtn.style.display = userType === 'he' ? 'inline-block' : 'none';
  }
}

function logout() {
  currentUser = null;
  isAuthorized = false;
  localStorage.removeItem('currentUser');

  // Hide user info
  const userInfo = document.getElementById("user-info");
  if (userInfo) {
    userInfo.style.display = 'none';
  }

  // Reset title
  const titleElement = document.querySelector('.title');
  const titleText = titleElement.firstChild;
  titleText.textContent = "KARINA'S ORGASM-O-MATIC";

  // Show authorization modal
  showAuthorizationModal();
}

function showAuthNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(45deg, #4CAF50, #66BB6A);
    color: white;
    padding: 15px 25px;
    border-radius: 12px;
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function checkAuthorization() {
  if (!isAuthorized) {
    showAuthorizationModal();
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  // Add Telegram Web App class if running in Telegram
  if (window.Telegram && window.Telegram.WebApp) {
    document.body.classList.add('tg-webapp');
  }
  const statsBox = document.getElementById("stats-display");
  const body = document.body;
  const toggleStats = () => {
    statsBox.classList.toggle("show");
    if (statsBox.classList.contains("show")) {
      body.classList.remove("lock-scroll");
    } else {
      body.classList.add("lock-scroll");
    }
    loadStats();
  };
  body.classList.add("lock-scroll");

  // Start heart animations
  setInterval(createFloatingHeart, 600);
  for(let i = 0; i < 5; i++) {
    setTimeout(createFloatingHeart, i * 200);
  }

  // Punishment modal handling
  const punishmentBtn = document.getElementById("punishment-btn");
  const punishmentModal = document.getElementById("punishment-modal");
  const closePunishment = document.getElementById("close-punishment");
  const punishmentAccept = document.getElementById("punishment-accept");
  const punishmentNew = document.getElementById("punishment-new");
  const punishmentDone = document.getElementById("punishment-done");

  if (punishmentBtn && punishmentModal) {
    punishmentBtn.addEventListener("click", () => {
      if (!checkAuthorization()) return;
      const punishment = getRandomPunishment();
      displayPunishment(punishment);
      document.getElementById("punishment-completed").style.display = "none";
      punishmentModal.classList.add('show');
    });
  }

  if (closePunishment && punishmentModal) {
    closePunishment.addEventListener("click", () => {
      punishmentModal.classList.remove('show');
    });
  }

  if (punishmentNew) {
    punishmentNew.addEventListener("click", () => {
      const punishment = getRandomPunishment();
      displayPunishment(punishment);
      document.getElementById("punishment-completed").style.display = "none";
    });
  }

  if (punishmentAccept && punishmentModal) {
    punishmentAccept.addEventListener("click", async () => {
      if (currentPunishment) {
        await savePunishment(currentPunishment);

        // Add some hearts for acceptance
        for(let i = 0; i < 3; i++) {
          setTimeout(createFloatingHeart, i * 200);
        }
      }
    });
  }

  if (punishmentDone && punishmentModal) {
    punishmentDone.addEventListener("click", async () => {
      await completePunishment();
      punishmentModal.classList.remove('show');

      // Add celebration hearts
      for(let i = 0; i < 5; i++) {
        setTimeout(createFloatingHeart, i * 150);
      }
    });
  }

  // Photo Game modal handling
  const photoGameBtn = document.getElementById("photo-game-btn");
  const photoGameModal = document.getElementById("photo-game-modal");
  const closePhotoGame = document.getElementById("close-photo-game");
  const photoGameAccept = document.getElementById("photo-game-accept");
  const photoGameNew = document.getElementById("photo-game-new");

  if (photoGameBtn && photoGameModal) {
    photoGameBtn.addEventListener("click", () => {
      if (!checkAuthorization()) return;
      const task = getRandomPhotoTask();
      displayPhotoTask(task);
      photoGameModal.classList.add('show');
    });
  }

  if (closePhotoGame && photoGameModal) {
    closePhotoGame.addEventListener("click", () => {
      photoGameModal.classList.remove('show');
    });
  }

  if (photoGameNew) {
    photoGameNew.addEventListener("click", () => {
      const task = getRandomPhotoTask();
      displayPhotoTask(task);
    });
  }

  if (photoGameAccept && photoGameModal) {
    photoGameAccept.addEventListener("click", async () => {
      if (currentPhotoTask) {
        await savePhotoGameTask(currentPhotoTask);
        photoGameModal.classList.remove('show');

        // Add some hearts for celebration
        for(let i = 0; i < 3; i++) {
          setTimeout(createFloatingHeart, i * 200);
        }
      }
    });
  }

  // Initialize the app first, then check authorization

  // Orgasm Request modal handling
  const orgasmRequestBtn = document.getElementById("orgasm-request-btn");
  const orgasmRequestModal = document.getElementById("orgasm-request-modal");
  const closeOrgasmRequest = document.getElementById("close-orgasm-request");
  const orgasmRequestSend = document.getElementById("orgasm-request-send");
  const orgasmRequestCancel = document.getElementById("orgasm-request-cancel");

  if (orgasmRequestBtn && orgasmRequestModal) {
    orgasmRequestBtn.addEventListener("click", () => {
      if (!checkAuthorization()) return;
      orgasmRequestModal.classList.add('show');
    });
  }

  if (closeOrgasmRequest && orgasmRequestModal) {
    closeOrgasmRequest.addEventListener("click", () => {
      orgasmRequestModal.classList.remove('show');
    });
  }

  if (orgasmRequestCancel && orgasmRequestModal) {
    orgasmRequestCancel.addEventListener("click", () => {
      orgasmRequestModal.classList.remove('show');
    });
  }

  if (orgasmRequestSend && orgasmRequestModal) {
    orgasmRequestSend.addEventListener("click", async () => {
      const success = await saveOrgasmRequest();
      if (success) {
        orgasmRequestModal.classList.remove('show');

        // Add some hearts for celebration
        for(let i = 0; i < 5; i++) {
          setTimeout(createFloatingHeart, i * 150);
        }
      }
    });
  }

   // Cum Command modal handling
  const cumCommandBtn = document.getElementById("cum-command-btn");
  const cumCommandModal = document.getElementById("cum-command-modal");
  const closeCumCommand = document.getElementById("close-cum-command");
  const cumCommandSend = document.getElementById("cum-command-send");
  const cumCommandCancel = document.getElementById("cum-command-cancel");

  if (cumCommandBtn && cumCommandModal) {
    cumCommandBtn.addEventListener("click", () => {
      if (!checkAuthorization()) return;
      cumCommandModal.classList.add('show');
    });
  }

  if (closeCumCommand && cumCommandModal) {
    closeCumCommand.addEventListener("click", () => {
      cumCommandModal.classList.remove('show');
    });
  }

  if (cumCommandCancel && cumCommandModal) {
    cumCommandCancel.addEventListener("click", () => {
      cumCommandModal.classList.remove('show');
    });
  }

  if (cumCommandSend && cumCommandModal) {
    cumCommandSend.addEventListener("click", async () => {
      const success = await sendCumCommand();
      if (success) {
        cumCommandModal.classList.remove('show');

        // Add some hearts for celebration
        for (let i = 0; i < 5; i++) {
          setTimeout(createFloatingHeart, i * 150);
        }
      }
    });
  }

  // Location modal handling
  const locationBtn = document.getElementById("location-btn");
  const locationModal = document.getElementById("location-modal");
  const closeModal = document.getElementById("close-location");

  locationBtn.addEventListener("click", () => {
    locationModal.classList.add('show');
  });

  closeModal.addEventListener("click", () => {
    locationModal.classList.remove('show');
  });

  // Location bonus handling
  const locationBonuses = {
    "location-taxi": 2,
    "location-subway": 3,
    "location-cafe": 4,
    "location-guest": 5,
    "location-bonus": 1
  };

  Object.keys(locationBonuses).forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", async () => {
        try {
          await handleIncrement(locationBonuses[id]);
          locationModal.classList.remove('show');
          for(let i = 0; i < 3; i++) {
            createFloatingHeart();
          }
        } catch (e) {
          console.error("Location bonus error:", e);
        }
      });
    }
  });

  // Function to create water drops
  function createWaterDrop() {
    const waterDrop = document.createElement('div');
    waterDrop.className = 'water-drop';
    waterDrop.textContent = '💧';
    waterDrop.style.left = Math.random() * 100 + '%';

    // Add to water container if it exists
    const waterContainer = document.getElementById('water-container');
    if (waterContainer) {
      waterContainer.appendChild(waterDrop);
    } else {
      // Create water container if it doesn't exist
      const newContainer = document.createElement('div');
      newContainer.id = 'water-container';
      newContainer.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
      `;
      document.body.appendChild(newContainer);
      newContainer.appendChild(waterDrop);
    }
  }

  const achievements = {
    10: { title: "Начинаем! 🌟", unlocked: false },
    25: { title: "Четверть века! 🎯", unlocked: false },
    50: { title: "На полпути! 🎊", unlocked: false },
    69: { title: "Красиво! 😏", unlocked: false },
    100: { title: "Клуб века! 🏆", unlocked: false },
    200: { title: "Двойные неприятности! 🌈", unlocked: false },
    500: { title: "Высокие достижения! 👑", unlocked: false },
    1000: { title: "Легендарный статус! 🔥", unlocked: false }
  };

  function showAchievement(title) {
    const notification = document.getElementById("achievement-notification");
    const text = document.getElementById("achievement-text");
    text.textContent = title;
    notification.style.display = "block";

    // Play achievement sound
    playSound('achievement');

    // Add sparkle animation
    for(let i = 0; i < 5; i++) {
      createFloatingHeart();
    }

    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }

  function showSavedIndicator() {
    const indicator = document.getElementById("saved-indicator");
    indicator.classList.add("show");
    setTimeout(() => {
      indicator.classList.remove("show");
    }, 1000);
  }

  // Sound toggle functionality
  function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    const soundBtn = document.getElementById("sound-toggle-btn");
    soundBtn.textContent = soundEnabled ? "🔊 ЗВУК" : "🔇 ЗВУК";

    // Play test sound when enabling
    if (soundEnabled) {
      playSound('success');
    }
  }

  function checkAchievements(count) {
    Object.entries(achievements).forEach(([threshold, achievement]) => {
      if (!achievement.unlocked && count >= parseInt(threshold)) {
        achievement.unlocked = true;
        showAchievement(achievement.title);
      }
    });
  }

  async function handleIncrement(increment) {
    if (!currentPairId) return;

    try {
      // Add haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50]); // Pattern: vibrate, pause, vibrate
      }
      
      // Telegram haptic feedback
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }

      // Play sound effect
      playSound('increment');

      const counterDocRef = getDocRef();
      if (!counterDocRef) return;

      const snapshot = await counterDocRef.get();
      const currentCount = snapshot.exists ? snapshot.data().count : 0;
      counter = currentCount + increment;
      incrementHistory.push(increment);
      checkAchievements(counter);
      if (incrementHistory.length > MAX_HISTORY) {
        incrementHistory.shift();
      }
      updateDisplay();
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      document.getElementById("last-timestamp").textContent = `Last: ${timeStr}`;

      if (counterDocRef) {
        await counterDocRef.set({ 
          count: counter,
          lastTimestamp: timeStr,
          history: incrementHistory
        }, { merge: true });
      }
      await updateFirestoreStats(increment);

      // Show temporary feedback
      showSavedIndicator();
    } catch (e) {
      console.error("Increment error:", e);
      playSound('error');
    }
  }

  document.getElementById("undo-btn").addEventListener("click", async () => {
    if (counter > 0 && incrementHistory.length > 0) {
      try {
        const lastIncrement = incrementHistory[incrementHistory.length - 1];
        counter -= lastIncrement;
        incrementHistory.pop();
        updateDisplay();

        // Update Last table if it's visible
        if (lastResults.style.display === "block") {
          const last5 = incrementHistory.slice(-5).reverse();
          lastResults.innerHTML = last5.map(increment => 
            `<div>${getLocationName(increment)}: +${increment}</div>`
          ).join('');
        }

        const undoDocRef = getDocRef();
        if (undoDocRef) {
          await undoDocRef.set({ 
            count: counter,
            history: incrementHistory 
          }, { merge: true });
        }
        await updateFirestoreStats(-lastIncrement);
      } catch (e) {
        console.error("Undo error:", e);
      }
    }
  });

  document.getElementById("increment-btn").addEventListener("click", async () => {
    await handleIncrement(1);
    createFloatingHeart();
  });

  document.getElementById("reset-btn").addEventListener("click", async () => {
    counter = 0;
    updateDisplay();
    const resetCounterRef = getDocRef();
    const statsRef = getStatsRef();

    if (resetCounterRef) {
      await resetCounterRef.set({ count: 0 }, { merge: true });
    }
    if (statsRef) {
      await statsRef.set({
        today: 0,
        week: 0,
        month: 0,
        record: 0,
        lastUpdated: new Date().toISOString().slice(0, 10)
      });
    }
    updateStatsDisplay({ today: 0, week: 0, month: 0, record: 0 });
  });

  // Correct placement for the lastBtn and lastResults elements and getLocationName
  document.getElementById("stats-btn").addEventListener("click", () => {
    if (lastResults && lastResults.style.display === "block") {
      lastResults.style.display = "none";
      lastResults.style.opacity = "0";
    }
    statsBox.classList.toggle("show");
    if (statsBox.classList.contains("show")) {
      loadStats();
    }
  });

  const lastBtn = document.getElementById("last-btn");
  const lastResults = document.getElementById("last-results");

  function getLocationName(increment) {
    switch(increment) {
      case 1: return "Добавить";
      case 2: return "Такси";
      case 3: return "Метро";
      case 4: return "Кафе";
      case 5: return "В гостях";
      default: return "Бонус";
    }
  }

  if (lastBtn && lastResults) {
    lastBtn.addEventListener("click", () => {
      const last5 = incrementHistory.slice(-5).reverse();
      lastResults.innerHTML = last5.map(increment => 
        `<div>${getLocationName(increment)}: +${increment}</div>`
      ).join('');

      if (statsBox.classList.contains("show")) {
        statsBox.classList.remove("show");
      }

      lastResults.style.display = lastResults.style.display === "block" ? "none" : "block";
      lastResults.style.opacity = lastResults.style.display === "block" ? "1" : "0";
    });
  }

  // Theme toggle functionality
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.textContent = newTheme === 'light' ? "☀️ СВЕТЛАЯ" : "🌙 ТЁМНАЯ";
    }
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Sound toggle button
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  if (soundToggleBtn) {
    soundToggleBtn.textContent = soundEnabled ? "🔊 ЗВУК" : "🔇 ЗВУК";
    soundToggleBtn.addEventListener("click", toggleSound);
  }

  // Theme toggle button
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.textContent = savedTheme === 'light' ? "☀️ СВЕТЛАЯ" : "🌙 ТЁМНАЯ";
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // Logout button handler
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Load initial streak data
  loadStats();

  // Initialize the app after all event listeners are set up
  initializeApp();
});