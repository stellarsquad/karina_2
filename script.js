
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
const docRef = db.collection("users").doc("karina");
const statsRef = db.collection("users").doc("karina_stats");
const photoGamesRef = db.collection("users").doc("karina_photo_games");
const orgasmRequestsRef = db.collection("users").doc("karina_orgasm_requests");
const punishmentsRef = db.collection("users").doc("karina_punishments");

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
  document.getElementById("stat-today").textContent = `Today: ${data.today || 0}`;
  document.getElementById("stat-week").textContent = `This Week: ${data.week || 0}`;
  document.getElementById("stat-month").textContent = `This Month: ${data.month || 0}`;
  document.getElementById("stat-record").textContent = `Record: ${data.record || 0}`;
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
  const todayKey = new Date().toISOString().slice(0, 10);
  const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  
  try {
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
  const statsBox = document.getElementById("stats-display");
  statsBox.classList.add("loading");
  try {
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

    await photoGamesRef.collection("tasks").add(photoGameData);
    
    // Send task to Telegram bot
    const message = `📷 <b>Photo Game Task for Karina</b>\n\n<b>${task.title}</b>\n\n${task.description}`;
    await sendTelegramMessage(message);
    
    // Show success notification
    showPhotoGameNotification("📷 Task sent to Telegram!");
    
  } catch (error) {
    console.error("Error saving photo game task:", error);
    showPhotoGameNotification("❌ Error saving task");
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

    const docRef = await punishmentsRef.collection("tasks").add(punishmentData);
    currentPunishmentId = docRef.id;
    
    if (currentUser === 'she') {
      // Send notification to submissive (herself)
      const subMessage = `🩸 <b>Punishment for Karina</b>\n\n${punishment.description}\n\n<i>Status: Pending</i>`;
      await sendTelegramMessage(subMessage, null, SUBMISSIVE_CHAT_ID);
      
      // Send notification to dominant
      const domMessage = `🩸 <b>Karina has chosen the following punishment:</b>\n\n${punishment.description}`;
      await sendTelegramMessage(domMessage, null, DOMINANT_CHAT_ID);
      
      showPunishmentNotification("🩸 Punishment selected and reported!");
    } else {
      // Dominant assigning punishment
      const message = `🩸 <b>Punishment assigned to Karina</b>\n\n${punishment.description}\n\n<i>Status: Pending</i>`;
      await sendTelegramMessage(message, null, SUBMISSIVE_CHAT_ID);
      
      showPunishmentNotification("🩸 Punishment assigned to Karina!");
    }
    
    document.getElementById("punishment-completed").style.display = "block";
    
  } catch (error) {
    console.error("Error saving punishment:", error);
    showPunishmentNotification("❌ Error saving punishment");
  }
}

async function completePunishment() {
  if (!currentPunishmentId) return;
  
  try {
    await punishmentsRef.collection("tasks").doc(currentPunishmentId).update({
      status: "done",
      completedAt: new Date().toISOString()
    });
    
    // Send completion notification to Telegram
    const message = `✅ <b>Punishment Completed</b>\n\nКарина выполнила наказание:\n${currentPunishment.description}`;
    await sendTelegramMessage(message);
    
    showPunishmentNotification("✅ Punishment completed!");
    
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
const TELEGRAM_CHAT_ID = "1221598";
const DOMINANT_CHAT_ID = "1221598"; // Anton's chat ID
const SUBMISSIVE_CHAT_ID = "1221598"; // Karina's chat ID (update when known)

// User authorization state
let currentUser = localStorage.getItem('currentUser') || null;
let isAuthorized = currentUser !== null;

// Send message to Telegram bot
async function sendTelegramMessage(message, inlineKeyboard = null, chatId = null) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const targetChatId = chatId || (currentUser === 'he' ? DOMINANT_CHAT_ID : SUBMISSIVE_CHAT_ID);
    
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

    await orgasmRequestsRef.collection("requests").add(orgasmRequestData);
    
    if (currentUser === 'she') {
      // Send request to dominant
      const message = "🧎‍♀️ <b>Карина просит разрешения на оргазм</b>";
      const inlineKeyboard = [
        [
          { text: "✅ Разрешить", callback_data: "orgasm_allow" },
          { text: "❌ Запретить", callback_data: "orgasm_deny" }
        ]
      ];

      await sendTelegramMessage(message, inlineKeyboard, DOMINANT_CHAT_ID);
      
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

// Update orgasm request status in Firestore
async function updateOrgasmRequestStatus(status, approvedBy) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString();
    
    await orgasmRequestsRef.collection("requests").add({
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
    showOrgasmResponseNotification("✅ Разрешаю", "success");
    
    // Send confirmation to both chats
    await sendTelegramMessage("✅ <b>Orgasm Allowed</b>\n\nKarina has been granted permission.", null, DOMINANT_CHAT_ID);
    
    // Answer the callback query
    await answerCallbackQuery(callbackQuery.id, "Разрешение отправлено Карине");
    
    // Update request status in Firestore
    await updateOrgasmRequestStatus("allowed", "Anton");
    
    // Stop polling after successful response
    isPollingActive = false;
    
  } else if (callbackData === "orgasm_deny") {
    showOrgasmResponseNotification("❌ Запрещаю", "denied");
    
    // Send confirmation to both chats
    await sendTelegramMessage("❌ <b>Orgasm Denied</b>\n\nKarina's request has been denied.", null, DOMINANT_CHAT_ID);
    
    // Answer the callback query
    await answerCallbackQuery(callbackQuery.id, "Отказ отправлен Карине");
    
    // Update request status in Firestore
    await updateOrgasmRequestStatus("denied", "Anton");
    
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

// Authorization functions
function showAuthorizationModal() {
  const authModal = document.createElement("div");
  authModal.id = "auth-modal";
  authModal.className = "modal-overlay";
  authModal.innerHTML = `
    <div class="modal-content" style="width: 300px; max-width: 95%;">
      <div class="modal-header">
        <span>🔐 TELEGRAM AUTHORIZATION</span>
      </div>
      <div style="text-align: center; color: #ffb6d5; font-size: 11px; line-height: 1.4; margin: 20px 0;">
        <div style="font-size: 14px; color: #ff4081; margin-bottom: 15px;">
          Choose your role:
        </div>
        <div style="color: #ffe6eb; margin-bottom: 20px;">
          Select who you are to continue
        </div>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 15px;">
        <button id="auth-he" class="full-width" style="background: linear-gradient(145deg, #4081ff, #6b9eff);">
          👨 HE (DOMINANT)
        </button>
        <button id="auth-she" class="full-width" style="background: linear-gradient(145deg, #ff4081, #ff6b9e);">
          👩 SHE (SUBMISSIVE)
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(authModal);
  authModal.style.display = "flex";
  
  // Add event listeners
  document.getElementById("auth-he").addEventListener("click", () => {
    authorizeUser('he');
    authModal.remove();
  });
  
  document.getElementById("auth-she").addEventListener("click", () => {
    authorizeUser('she');
    authModal.remove();
  });
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
    titleText.textContent = "DOMINANT CONTROL PANEL";
    document.body.style.setProperty('--primary-color', '#4081ff');
  } else {
    titleText.textContent = "KARINA'S ORGASM-O-MATIC";
    document.body.style.setProperty('--primary-color', '#ff4081');
  }
  
  // Show user info
  const userInfo = document.getElementById("user-info");
  const userDisplay = document.getElementById("current-user-display");
  if (userInfo && userDisplay) {
    userDisplay.textContent = userType === 'he' ? '👨 Dominant Mode' : '👩 Submissive Mode';
    userInfo.style.display = 'block';
  }
  
  // Show/hide certain buttons based on user type
  const orgasmBtn = document.getElementById("orgasm-request-btn");
  if (orgasmBtn) {
    orgasmBtn.style.display = userType === 'she' ? 'block' : 'none';
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
      punishmentModal.style.display = "flex";
    });
  }

  if (closePunishment && punishmentModal) {
    closePunishment.addEventListener("click", () => {
      punishmentModal.style.display = "none";
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
      punishmentModal.style.display = "none";
      
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
      photoGameModal.style.display = "flex";
    });
  }

  if (closePhotoGame && photoGameModal) {
    closePhotoGame.addEventListener("click", () => {
      photoGameModal.style.display = "none";
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
        photoGameModal.style.display = "none";
        
        // Add some hearts for celebration
        for(let i = 0; i < 3; i++) {
          setTimeout(createFloatingHeart, i * 200);
        }
      }
    });
  }

  // Check authorization on load
  if (!checkAuthorization()) {
    return; // Don't initialize app until authorized
  }
  
  // Update UI for current user
  if (currentUser) {
    updateUIForUser(currentUser);
  }

  // Orgasm Request modal handling
  const orgasmRequestBtn = document.getElementById("orgasm-request-btn");
  const orgasmRequestModal = document.getElementById("orgasm-request-modal");
  const closeOrgasmRequest = document.getElementById("close-orgasm-request");
  const orgasmRequestSend = document.getElementById("orgasm-request-send");
  const orgasmRequestCancel = document.getElementById("orgasm-request-cancel");

  if (orgasmRequestBtn && orgasmRequestModal) {
    orgasmRequestBtn.addEventListener("click", () => {
      if (!checkAuthorization()) return;
      orgasmRequestModal.style.display = "flex";
    });
  }

  if (closeOrgasmRequest && orgasmRequestModal) {
    closeOrgasmRequest.addEventListener("click", () => {
      orgasmRequestModal.style.display = "none";
    });
  }

  if (orgasmRequestCancel && orgasmRequestModal) {
    orgasmRequestCancel.addEventListener("click", () => {
      orgasmRequestModal.style.display = "none";
    });
  }

  if (orgasmRequestSend && orgasmRequestModal) {
    orgasmRequestSend.addEventListener("click", async () => {
      const success = await saveOrgasmRequest();
      if (success) {
        orgasmRequestModal.style.display = "none";
        
        // Add some hearts for celebration
        for(let i = 0; i < 5; i++) {
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
    locationModal.style.display = "flex";
  });

  closeModal.addEventListener("click", () => {
    locationModal.style.display = "none";
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
          locationModal.style.display = "none";
          for(let i = 0; i < 3; i++) {
            createFloatingHeart();
          }
        } catch (e) {
          console.error("Location bonus error:", e);
        }
      });
    }
  });

  // Real-time listener for history updates
  docRef.onSnapshot(doc => {
    if (doc.exists) {
      const data = doc.data();
      counter = data.count || 0;
      incrementHistory = data.history || [];
      if (data.lastTimestamp) {
        document.getElementById("last-timestamp").textContent = `Last: ${data.lastTimestamp}`;
      }
      updateDisplay();
    }
  });

  const achievements = {
    10: { title: "Getting Started! 🌟", unlocked: false },
    25: { title: "Quarter Century! 🎯", unlocked: false },
    50: { title: "Halfway There! 🎊", unlocked: false },
    69: { title: "Nice! 😏", unlocked: false },
    100: { title: "Century Club! 🏆", unlocked: false },
    200: { title: "Double Trouble! 🌈", unlocked: false },
    500: { title: "High Achiever! 👑", unlocked: false },
    1000: { title: "Legendary Status! 🔥", unlocked: false }
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
    soundBtn.textContent = soundEnabled ? "🔊 SOUND" : "🔇 SOUND";
    
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
    try {
      // Add vibration feedback if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Play sound effect
      playSound('increment');
      
      const snapshot = await docRef.get();
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
      await docRef.set({ 
        count: counter,
        lastTimestamp: timeStr,
        history: incrementHistory
      }, { merge: true });
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

        await docRef.set({ 
          count: counter,
          history: incrementHistory 
        }, { merge: true });
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
    await docRef.set({ count: 0 }, { merge: true });
    await statsRef.set({
      today: 0,
      week: 0,
      month: 0,
      record: 0,
      lastUpdated: new Date().toISOString().slice(0, 10)
    });
    updateStatsDisplay({ today: 0, week: 0, month: 0, record: 0 });
  });

  document.getElementById("stats-btn").addEventListener("click", () => {
    if (lastResults.style.display === "block") {
      lastResults.style.display = "none";
      lastResults.style.opacity = "0";
    }
    statsBox.classList.toggle("show");
    if (statsBox.classList.contains("show")) {
      loadStats();
    }
  });

  // Last results modal handling
  const lastBtn = document.getElementById("last-btn");
  const lastResults = document.getElementById("last-results");

  function getLocationName(increment) {
    switch(increment) {
      case 1: return "Add one";
      case 2: return "Taxi";
      case 3: return "Subway";
      case 4: return "Cafe";
      case 5: return "Guest";
      default: return "Bonus";
    }
  }

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

  // Sound toggle button
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  if (soundToggleBtn) {
    soundToggleBtn.textContent = soundEnabled ? "🔊 SOUND" : "🔇 SOUND";
    soundToggleBtn.addEventListener("click", toggleSound);
  }

  // Logout button handler
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Load initial streak data
  loadStats();

  // Listen for counter updates
  docRef.onSnapshot((doc) => {
    if (doc.exists) {
      counter = doc.data().count || 0;
      updateDisplay();
    }
  });
});
