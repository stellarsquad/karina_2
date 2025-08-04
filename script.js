// Firebase Configuration
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

// Application version and cache management
const APP_VERSION = "2.0.0";
const BUILD_TIMESTAMP = "1754315809466";

// Clear cache if version changed
function clearCacheIfNeeded() {
  const storedVersion = localStorage.getItem('app_version');
  const storedTimestamp = localStorage.getItem('build_timestamp');
  
  if (storedVersion !== APP_VERSION || storedTimestamp !== BUILD_TIMESTAMP) {
    console.log('Version changed, clearing cache...');
    
    // Clear localStorage cache markers
    localStorage.setItem('app_version', APP_VERSION);
    localStorage.setItem('build_timestamp', BUILD_TIMESTAMP);
    
    // Clear service worker cache if available
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) {
          caches.delete(name);
        }
      });
    }
    
    // Force reload from server (without cache)
    if (storedVersion && storedVersion !== APP_VERSION) {
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    }
  }
}

// Constants
const TELEGRAM_BOT_TOKEN = "7205768597:AAFDJi75VVBgWUVxuY02MmlElXeAPGjmqeU";
const TELEGRAM_BOT_USERNAME = "iloveyoukarina_bot";
const MAX_HISTORY = 100;
const MAX_POLL_RETRIES = 3;

// Global State Management
class AppState {
  constructor() {
    this.counter = 0;
    this.incrementHistory = [];
    this.currentUser = localStorage.getItem('currentUser') || null;
    this.currentPairId = localStorage.getItem('currentPairId') || null;
    this.userUID = localStorage.getItem('userUID') || null;
    this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    this.isPollingActive = false;
    this.lastUpdateId = 0;
    this.pollRetryCount = 0;
    this.pollInterval = null;
    this.telegramSetupInterval = null;
    this.currentPhotoTask = null;
    this.currentPunishment = null;
    this.currentPunishmentId = null;
    this.punishmentAccepted = false;
  }

  updateUser(user, pairId, uid) {
    this.currentUser = user;
    this.currentPairId = pairId;
    this.userUID = uid;
    localStorage.setItem('currentUser', user);
    localStorage.setItem('currentPairId', pairId);
    localStorage.setItem('userUID', uid);
  }

  clearUser() {
    this.currentUser = null;
    this.currentPairId = null;
    this.userUID = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentPairId');
    localStorage.removeItem('userUID');
  }

  isAuthorized() {
    return this.currentPairId && this.currentUser;
  }
}

const appState = new AppState();

// Database Reference Manager
class DatabaseManager {
  static getDocRef() {
    if (!appState.currentPairId) return null;
    return db.collection("pairs").doc(appState.currentPairId).collection("data").doc("counter");
  }

  static getStatsRef() {
    if (!appState.currentPairId) return null;
    return db.collection("pairs").doc(appState.currentPairId).collection("data").doc("stats");
  }

  static getPhotoGamesRef() {
    if (!appState.currentPairId) return null;
    return db.collection("pairs").doc(appState.currentPairId).collection("data").doc("photo_games");
  }

  static getOrgasmRequestsRef() {
    if (!appState.currentPairId) return null;
    return db.collection("pairs").doc(appState.currentPairId).collection("data").doc("orgasm_requests");
  }

  static getPunishmentsRef() {
    if (!appState.currentPairId) return null;
    return db.collection("pairs").doc(appState.currentPairId).collection("data").doc("punishments");
  }
}

// Notification System
class NotificationManager {
  static show(message, type = 'default', duration = 3000) {
    const notification = document.createElement("div");
    const colors = {
      success: "linear-gradient(45deg, #4CAF50, #66BB6A)",
      error: "linear-gradient(45deg, #f44336, #ef5350)",
      warning: "linear-gradient(45deg, #ff9800, #ffb74d)",
      info: "linear-gradient(45deg, #2196F3, #42A5F5)",
      default: "linear-gradient(45deg, #ff4081, #ff9ec6)"
    };

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type] || colors.default};
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
      z-index: 10000;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
      word-wrap: break-word;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Add CSS animation if not exists
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out forwards";
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  static showConfirmation(message, onConfirm, onCancel = null) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content" style="width: 350px; max-width: 95%; text-align: center;">
        <div style="font-size: 14px; color: #ff4081; margin-bottom: 20px;">
          ⚠️ Confirmation Required
        </div>
        <div style="font-size: 11px; color: #ffb6d5; margin-bottom: 25px; line-height: 1.4;">
          ${message}
        </div>
        <div style="display: flex; gap: 10px;">
          <button id="confirm-yes" style="flex: 1; background: linear-gradient(145deg, #4CAF50, #66BB6A);">
            ✅ YES
          </button>
          <button id="confirm-no" style="flex: 1; background: linear-gradient(145deg, #f44336, #ef5350);">
            ❌ NO
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    const yesBtn = modal.querySelector('#confirm-yes');
    const noBtn = modal.querySelector('#confirm-no');

    yesBtn.addEventListener('click', () => {
      modal.remove();
      if (onConfirm) onConfirm();
    });

    noBtn.addEventListener('click', () => {
      modal.remove();
      if (onCancel) onCancel();
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        if (onCancel) onCancel();
      }
    });
  }

  static showLargeNotification(message, type = 'success') {
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
    if (!document.getElementById('bounce-styles')) {
      const style = document.createElement("style");
      style.id = 'bounce-styles';
      style.textContent = `
        @keyframes bounceIn {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.05); }
          70% { transform: translate(-50%, -50%) scale(0.9); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    // Add celebration hearts for success
    if (type === "success") {
      for(let i = 0; i < 8; i++) {
        setTimeout(() => AnimationManager.createFloatingHeart(), i * 100);
      }
    }

    setTimeout(() => {
      notification.style.animation = "fadeOut 0.3s ease-out forwards";
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }
}

// Sound Manager
class SoundManager {
  static playSound(type) {
    if (!appState.soundEnabled) return;

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

  static toggle() {
    appState.soundEnabled = !appState.soundEnabled;
    localStorage.setItem('soundEnabled', appState.soundEnabled);
    const soundBtn = document.getElementById("sound-toggle-btn");
    if (soundBtn) {
      soundBtn.textContent = appState.soundEnabled ? "🔊 SOUND" : "🔇 SOUND";
    }

    if (appState.soundEnabled) {
      SoundManager.playSound('success');
    }
  }
}

// Animation Manager
class AnimationManager {
  static createFloatingHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerText = ["💖", "💗", "💝", "💕"][Math.floor(Math.random() * 4)];
    heart.style.left = (10 + Math.random() * 80) + "%";
    heart.style.fontSize = (12 + Math.random() * 8) + "px";
    heart.style.animation = `float-up ${2.5 + Math.random() * 2}s ease-in-out forwards`;

    const container = document.getElementById("heart-container");
    if (container) {
      container.appendChild(heart);
      setTimeout(() => heart.remove(), 4500);
    }
  }

  static showSavedIndicator() {
    const indicator = document.getElementById("saved-indicator");
    if (indicator) {
      indicator.classList.add("show");
      setTimeout(() => indicator.classList.remove("show"), 1000);
    }
  }

  static addVibration() {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }
}

// Task Data Manager
class TaskDataManager {
  static getPunishmentTasks() {
    return [
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
  }

  static getPhotoGameTasks() {
    return [
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
  }

  static getRandomTask(taskArray) {
    const randomIndex = Math.floor(Math.random() * taskArray.length);
    return taskArray[randomIndex];
  }
}

// UI Manager
class UIManager {
  static updateDisplay() {
    const percent = Math.min(appState.counter / 100, 1) * 100;
    const counterDisplay = document.getElementById("counter-display");
    const progressBar = document.getElementById("progress-bar");

    if (counterDisplay) counterDisplay.textContent = appState.counter;
    if (progressBar) progressBar.style.width = percent + "%";
  }

  static updateStatsDisplay(data) {
    const elements = {
      "stat-today": `Today: ${data.today || 0}`,
      "stat-week": `This Week: ${data.week || 0}`,
      "stat-month": `This Month: ${data.month || 0}`,
      "stat-record": `Record: ${data.record || 0}`
    };

    Object.entries(elements).forEach(([id, text]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = text;
    });
  }

  static updateStreakDisplay(data) {
    const streakCount = document.getElementById("streak-count");
    const dailyProgress = document.getElementById("daily-progress");

    if (streakCount) streakCount.textContent = data.streak || 0;
    if (dailyProgress) {
      dailyProgress.textContent = data.today || 0;

      const streakInfo = document.getElementById("streak-info");
      if (streakInfo) {
        const today = data.today || 0;
        if (today >= 10) {
          streakInfo.style.color = "#4CAF50";
        } else if (today >= 7) {
          streakInfo.style.color = "#ff9ec6";
        } else {
          streakInfo.style.color = "#ffb6d5";
        }
      }
    }
  }

  static updateUIForUser(userType) {
    const titleElement = document.querySelector('.title');
    const titleText = titleElement.firstChild;

    if (userType === 'he') {
      titleText.textContent = "DOMINANT CONTROL PANEL";
      document.body.style.setProperty('--primary-color', '#4081ff');
    } else {
      titleText.textContent = "KARINA'S ORGASM-O-MATIC";
      document.body.style.setProperty('--primary-color', '#ff4081');
    }

    const userInfo = document.getElementById("user-info");
    const userDisplay = document.getElementById("current-user-display");
    if (userInfo && userDisplay) {
      userDisplay.textContent = userType === 'he' ? '👨 Dominant Mode' : '👩 Submissive Mode';
      userInfo.style.display = 'block';
    }

    // Show/hide buttons based on user type```text
    const orgasmBtn = document.getElementById("orgasm-request-btn");
    const cumCommandBtn = document.getElementById("cum-command-btn");

    if (orgasmBtn) orgasmBtn.style.display = userType === 'she' ? 'inline-block' : 'none';
    if (cumCommandBtn) cumCommandBtn.style.display = userType === 'he' ? 'inline-block' : 'none';
  }

  static getLocationName(increment) {
    const names = {
      1: "Add one",
      2: "Taxi", 
      3: "Subway",
      4: "Cafe",
      5: "Guest"
    };
    return names[increment] || "Bonus";
  }
}

// Stats Manager
class StatsManager {
  static async updateFirestoreStats(increment = 1) {
    if (!appState.currentPairId) return;

    const todayKey = new Date().toISOString().slice(0, 10);
    const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    try {
      const statsRef = DatabaseManager.getStatsRef();
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
        if (data.lastUpdated !== todayKey) {
          if (data.lastStreakUpdate === yesterdayKey && (data.today || 0) >= 10) {
            data.streak = (data.streak || 0) + 1;
          } else if (data.lastStreakUpdate !== yesterdayKey && data.lastStreakUpdate !== todayKey) {
            data.streak = 0;
          }
          data.today = increment;
          data.lastStreakUpdate = todayKey;
        } else {
          data.today = (data.today || 0) + increment;
        }

        if (data.today >= 10 && data.lastStreakUpdate !== todayKey) {
          data.streak = (data.streak || 0) + 1;
          data.lastStreakUpdate = todayKey;
        }

        data.week = (data.week || 0) + increment;
        data.month = (data.month || 0) + increment;
        data.record = Math.max(data.record || 0, appState.counter);
        data.lastUpdated = todayKey;
      }

      await statsRef.set(data);
      UIManager.updateStatsDisplay(data);
      UIManager.updateStreakDisplay(data);
    } catch (e) {
      console.error("Error updating stats:", e);
    }
  }

  static async loadStats() {
    if (!appState.currentPairId) return;

    const statsBox = document.getElementById("stats-display");
    if (statsBox) statsBox.classList.add("loading");

    try {
      const statsRef = DatabaseManager.getStatsRef();
      if (!statsRef) return;

      const snapshot = await statsRef.get();
      if (snapshot.exists) {
        const data = snapshot.data();
        UIManager.updateStatsDisplay(data);
        UIManager.updateStreakDisplay(data);
      }
    } catch (e) {
      console.error("Failed to load stats:", e);
    } finally {
      if (statsBox) statsBox.classList.remove("loading");
    }
  }
}

// Achievement Manager
class AchievementManager {
  constructor() {
    this.achievements = {
      10: { title: "Getting Started! 🌟", unlocked: false },
      25: { title: "Quarter Century! 🎯", unlocked: false },
      50: { title: "Halfway There! 🎊", unlocked: false },
      69: { title: "Nice! 😏", unlocked: false },
      100: { title: "Century Club! 🏆", unlocked: false },
      200: { title: "Double Trouble! 🌈", unlocked: false },
      500: { title: "High Achiever! 👑", unlocked: false },
      1000: { title: "Legendary Status! 🔥", unlocked: false }
    };
  }

  checkAchievements(count) {
    Object.entries(this.achievements).forEach(([threshold, achievement]) => {
      if (!achievement.unlocked && count >= parseInt(threshold)) {
        achievement.unlocked = true;
        this.showAchievement(achievement.title);
      }
    });
  }

  showAchievement(title) {
    const notification = document.getElementById("achievement-notification");
    const text = document.getElementById("achievement-text");
    if (notification && text) {
      text.textContent = title;
      notification.style.display = "block";

      SoundManager.playSound('achievement');

      for(let i = 0; i < 5; i++) {
        setTimeout(() => AnimationManager.createFloatingHeart(), i * 100);
      }

      setTimeout(() => {
        notification.style.display = "none";
      }, 3000);
    }
  }
}

const achievementManager = new AchievementManager();

// Counter Manager
class CounterManager {
  static async handleIncrement(increment) {
    try {
      if (!appState.isAuthorized()) {
        NotificationManager.show("❌ Please authorize first", 'error');
        return;
      }

      AnimationManager.addVibration();
      SoundManager.playSound('increment');

      const counterDocRef = DatabaseManager.getDocRef();
      if (!counterDocRef) {
        NotificationManager.show("❌ Database not available", 'error');
        return;
      }

      const snapshot = await counterDocRef.get();
      const currentCount = snapshot.exists ? snapshot.data().count : 0;
      appState.counter = currentCount + increment;
      appState.incrementHistory.push(increment);

      achievementManager.checkAchievements(appState.counter);

      if (appState.incrementHistory.length > MAX_HISTORY) {
        appState.incrementHistory.shift();
      }

      UIManager.updateDisplay();

      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      const timestampElement = document.getElementById("last-timestamp");
      if (timestampElement) {
        timestampElement.textContent = `Last: ${timeStr}`;
      }

      await counterDocRef.set({ 
        count: appState.counter,
        lastTimestamp: timeStr,
        history: appState.incrementHistory
      }, { merge: true });

      await StatsManager.updateFirestoreStats(increment);
      AnimationManager.showSavedIndicator();

    } catch (e) {
      console.error("Increment error:", e);
      SoundManager.playSound('error');
      NotificationManager.show("❌ Error saving increment", 'error');
    }
  }

  static async handleUndo() {
    if (!appState.isAuthorized()) {
      NotificationManager.show("❌ Please authorize first", 'error');
      return;
    }

    if (appState.counter <= 0 || appState.incrementHistory.length === 0) {
      NotificationManager.show("⚠️ Nothing to undo", 'warning');
      return;
    }

    NotificationManager.showConfirmation(
      "Are you sure you want to undo the last increment?",
      async () => {
        try {
          const lastIncrement = appState.incrementHistory[appState.incrementHistory.length - 1];
          appState.counter -= lastIncrement;
          appState.incrementHistory.pop();
          UIManager.updateDisplay();

          const undoDocRef = DatabaseManager.getDocRef();
          if (undoDocRef) {
            await undoDocRef.set({ 
              count: appState.counter,
              history: appState.incrementHistory 
            }, { merge: true });
          }

          await StatsManager.updateFirestoreStats(-lastIncrement);
          NotificationManager.show("✅ Increment undone", 'success');
        } catch (e) {
          console.error("Undo error:", e);
          NotificationManager.show("❌ Error undoing increment", 'error');
        }
      }
    );
  }

  static async handleReset() {
    if (!appState.isAuthorized()) {
      NotificationManager.show("❌ Please authorize first", 'error');
      return;
    }

    NotificationManager.showConfirmation(
      "Are you sure you want to reset ALL data? This cannot be undone!",
      async () => {
        try {
          appState.counter = 0;
          appState.incrementHistory = [];
          UIManager.updateDisplay();

          const resetCounterRef = DatabaseManager.getDocRef();
          const statsRef = DatabaseManager.getStatsRef();

          if (resetCounterRef) {
            await resetCounterRef.set({ count: 0, history: [] }, { merge: true });
          }
          if (statsRef) {
            await statsRef.set({
              today: 0, week: 0, month: 0, record: 0,
              lastUpdated: new Date().toISOString().slice(0, 10)
            });
          }

          UIManager.updateStatsDisplay({ today: 0, week: 0, month: 0, record: 0 });
          NotificationManager.show("✅ All data reset", 'success');
        } catch (e) {
          console.error("Reset error:", e);
          NotificationManager.show("❌ Error resetting data", 'error');
        }
      }
    );
  }
}

// Telegram Manager
class TelegramManager {
  static async sendMessage(message, inlineKeyboard = null, targetUser = null, chatId = null) {
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      let targetChatId = chatId;

      if (!targetChatId) {
        const telegramData = await TelegramManager.getPairTelegramData();
        if (targetUser) {
          targetChatId = telegramData[`${targetUser}_chat_id`];
        } else {
          const partnerType = appState.currentUser === 'he' ? 'she' : 'he';
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
        payload.reply_markup = { inline_keyboard: inlineKeyboard };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  static async getPairTelegramData() {
    if (!appState.currentPairId) return null;

    try {
      const pairDoc = await db.collection("pairs").doc(appState.currentPairId).get();
      if (pairDoc.exists) {
        return pairDoc.data().telegramData || {};
      }
    } catch (error) {
      console.error("Error getting pair Telegram data:", error);
    }
    return {};
  }

  static async setupTelegramAuth() {
    if (!appState.currentPairId || !appState.currentUser) {
      NotificationManager.show("Please authorize the app first", "error");
      return;
    }

    const authCode = Math.random().toString(36).substr(2, 8).toUpperCase();

    try {
      // Store auth code in Firebase
      await db.collection("pairs").doc(appState.currentPairId).set({
        telegramAuth: {
          [`${appState.currentUser}_auth_code`]: authCode,
          [`${appState.currentUser}_auth_timestamp`]: Date.now()
        }
      }, { merge: true });

      const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${authCode}`;

      const modal = document.createElement("div");
      modal.className = "modal-overlay";
      modal.innerHTML = `
        <div class="modal-content" style="width: 400px; max-width: 95%; text-align: center;">
          <div style="font-size: 16px; color: #ff4081; margin-bottom: 20px;">
            📱 TELEGRAM AUTHORIZATION
          </div>
          <div style="font-size: 12px; color: #ffb6d5; margin-bottom: 25px; line-height: 1.6;">
            To receive notifications, you need to connect your Telegram account:
          </div>
          <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 15px; margin-bottom: 20px;">
            <div style="font-size: 11px; color: #ffe6eb; margin-bottom: 10px;">
              Step 1: Click the button below to open Telegram
            </div>
            <button id="open-telegram" style="width: 100%; background: linear-gradient(145deg, #0088cc, #00aaff); margin-bottom: 15px;">
              📱 OPEN TELEGRAM BOT
            </button>
            <div style="font-size: 11px; color: #ffe6eb; margin-bottom: 10px;">
              Step 2: Send this code to the bot:
            </div>
            <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 8px; font-size: 16px; font-weight: bold; color: #4CAF50; margin-bottom: 10px; font-family: monospace;">
              ${authCode}
            </div>
            <button id="copy-code" style="width: 100%; background: linear-gradient(145deg, #4CAF50, #66BB6A); font-size: 10px;">
              📋 COPY CODE
            </button>
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="check-auth" style="flex: 1; background: linear-gradient(145deg, #ff9800, #ffb74d);">
              🔄 CHECK STATUS
            </button>
            <button id="close-telegram-auth" style="flex: 1; background: linear-gradient(145deg, #666, #888);">
              ❌ CLOSE
            </button>
          </div>
          <div id="auth-status" style="margin-top: 15px; font-size: 10px; color: #ffe6eb;"></div>
        </div>
      `;

      document.body.appendChild(modal);
      modal.style.display = "flex";

      // Event handlers
      document.getElementById('open-telegram').addEventListener('click', () => {
        window.open(telegramUrl, '_blank');
      });

      document.getElementById('copy-code').addEventListener('click', async () => {
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(authCode);
            NotificationManager.show("Code copied to clipboard!", "success");
          } else {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = authCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            NotificationManager.show("Code copied!", "success");
          }
        } catch (err) {
          NotificationManager.show("Failed to copy code", "error");
        }
      });

      document.getElementById('check-auth').addEventListener('click', async () => {
        const status = await TelegramManager.checkAuthStatus();
        const statusDiv = document.getElementById('auth-status');
        if (status.success) {
          statusDiv.innerHTML = `<div style="color: #4CAF50;">✅ Connected successfully!</div>`;
          setTimeout(() => {
            modal.remove();
            NotificationManager.show("Telegram connected successfully!", "success");
          }, 2000);
        } else {
          statusDiv.innerHTML = `<div style="color: #ff9800;">⏳ Not connected yet. Please send the code to the bot.</div>`;
        }
      });

      document.getElementById('close-telegram-auth').addEventListener('click', () => {
        modal.remove();
      });

      // Auto-check status every 5 seconds
      const checkInterval = setInterval(async () => {
        const status = await TelegramManager.checkAuthStatus();
        if (status.success) {
          clearInterval(checkInterval);
          modal.remove();
          NotificationManager.show("Telegram connected successfully!", "success");
        }
      }, 5000);

      // Clear interval when modal is closed
      modal.addEventListener('DOMNodeRemoved', () => {
        clearInterval(checkInterval);
      });

    } catch (error) {
      console.error("Error setting up Telegram auth:", error);
      NotificationManager.show("Error setting up Telegram authorization", "error");
    }
  }

  static async checkAuthStatus() {
    if (!appState.currentPairId || !appState.currentUser) return { success: false };

    try {
      const pairDoc = await db.collection("pairs").doc(appState.currentPairId).get();
      if (pairDoc.exists) {
        const data = pairDoc.data();
        const telegramData = data.telegramData || {};
        const chatId = telegramData[`${appState.currentUser}_chat_id`];
        return { success: !!chatId, chatId };
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
    return { success: false };
  }

  static async sendNotificationToPartner(message, type = "info") {
    if (!appState.isAuthorized()) return false;

    try {
      const partnerType = appState.currentUser === 'he' ? 'she' : 'he';
      const userRole = appState.currentUser === 'he' ? '👨 Dominant' : '👩 Submissive';

      const fullMessage = `🔔 <b>Notification from ${userRole}</b>\n\n${message}`;

      // Check if partner has Telegram connected
      const telegramData = await TelegramManager.getPairTelegramData();
      const partnerChatId = telegramData[`${partnerType}_chat_id`];
      
      if (!partnerChatId) {
        console.warn("Partner doesn't have Telegram connected yet");
        return false;
      }

      await TelegramManager.sendMessage(fullMessage, null, partnerType);
      console.log("Notification sent to partner successfully");
      return true;
    } catch (error) {
      console.error("Error sending notification to partner:", error);
      return false;
    }
  }

  static async getTelegramBotInfo() {
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`;
      const response = await fetch(url);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Error getting bot info:", error);
      return null;
    }
  }

  static async setupWebhook() {
    try {
      // Set webhook for receiving messages
      const webhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: `${window.location.origin}/webhook`,
          allowed_updates: ["message", "callback_query"]
        })
      });
      return await response.json();
    } catch (error) {
      console.error("Error setting up webhook:", error);
      return null;
    }
  }

  static async startPolling() {
    if (appState.isPollingActive) return;

    appState.isPollingActive = true;
    console.log("Starting Telegram polling...");

    const poll = async () => {
      if (!appState.isPollingActive) return;

      try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            offset: appState.lastUpdateId + 1,
            timeout: 10,
            allowed_updates: ["message", "callback_query"]
          })
        });

        const data = await response.json();

        if (data.ok && data.result.length > 0) {
          for (const update of data.result) {
            await TelegramManager.processUpdate(update);
            appState.lastUpdateId = Math.max(appState.lastUpdateId, update.update_id);
          }
        }

        appState.pollRetryCount = 0;
        setTimeout(poll, 1000);

      } catch (error) {
        console.error("Polling error:", error);
        appState.pollRetryCount++;

        if (appState.pollRetryCount < MAX_POLL_RETRIES) {
          setTimeout(poll, 5000 * appState.pollRetryCount);
        } else {
          console.error("Max polling retries reached");
          appState.isPollingActive = false;
        }
      }
    };

    poll();
  }

  static async processUpdate(update) {
    try {
      if (update.message) {
        await TelegramManager.handleMessage(update.message);
      } else if (update.callback_query) {
        await TelegramManager.handleCallbackQuery(update.callback_query);
      }
    } catch (error) {
      console.error("Error processing update:", error);
    }
  }

  static async handleMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id;

    // Handle /start command with auth code
    if (text && text.startsWith('/start ')) {
      const authCode = text.split(' ')[1];
      await TelegramManager.handleAuthCode(authCode, chatId, userId, message);
      return;
    }

    // Handle other commands
    if (text === '/help') {
      await TelegramManager.sendMessage(
        "🤖 <b>Karina Bot Commands:</b>\n\n" +
        "• Send your auth code to connect\n" +
        "• Receive notifications from your partner\n" +
        "• Get updates about app activity",
        null, null, chatId
      );
    }
  }

  static async handleAuthCode(authCode, chatId, userId, messageObj = null) {
    try {
      // Find pair with this auth code
      const pairsSnapshot = await db.collection("pairs").get();
      let foundPair = null;
      let userType = null;

      for (const pairDoc of pairsSnapshot.docs) {
        const pairData = pairDoc.data();
        const telegramAuth = pairData.telegramAuth || {};

        if (telegramAuth.he_auth_code === authCode) {
          foundPair = pairDoc.id;
          userType = 'he';
          break;
        } else if (telegramAuth.she_auth_code === authCode) {
          foundPair = pairDoc.id;
          userType = 'she';
          break;
        }
      }

      if (foundPair && userType) {
        // Save chat ID to Firebase
        await db.collection("pairs").doc(foundPair).set({
          telegramData: {
            [`${userType}_chat_id`]: chatId,
            [`${userType}_user_id`]: userId,
            [`${userType}_username`]: (messageObj && messageObj.from && messageObj.from.username) ? messageObj.from.username : '',
            [`${userType}_connected_at`]: new Date()
          }
        }, { merge: true });

        const roleName = userType === 'he' ? 'Dominant' : 'Submissive';
        await TelegramManager.sendMessage(
          `✅ <b>Successfully connected!</b>\n\n` +
          `You are now connected as: <b>${roleName}</b>\n` +
          `Pair Code: <code>${foundPair}</code>\n\n` +
          `You will now receive notifications from your partner.`,
          null, null, chatId
        );
      } else {
        await TelegramManager.sendMessage(
          "❌ <b>Invalid or expired auth code.</b>\n\n" +
          "Please get a new auth code from the app and try again.",
          null, null, chatId
        );
      }
    } catch (error) {
      console.error("Error handling auth code:", error);
      if (chatId) {
        try {
          await TelegramManager.sendMessage(
            "❌ <b>Error processing auth code.</b>\n\n" +
            "Please try again later.",
            null, null, chatId
          );
        } catch (sendError) {
          console.error("Failed to send error message:", sendError);
        }
      }
    }
  }

  static async handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    // Handle callback queries (button presses)
    if (data.startsWith('orgasm_')) {
      await TelegramManager.handleOrgasmResponse(callbackQuery);
    }
  }

  static async handleOrgasmResponse(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    console.log("Callback data received:", data);
    
    // Parse callback data: orgasm_requestId_approve or orgasm_requestId_deny
    const parts = data.split('_');
    // The data format is: orgasm_[timestamp]_[randomString]_[action]
    // So we need to get the last part as the response
    const response = parts[parts.length - 1]; // Get the last part which is "approve" or "deny"
    const requestId = parts.slice(1, -1).join('_'); // Get everything between first and last as requestId
    
    console.log("Parsed response:", response);
    console.log("Request ID:", requestId);

    try {
      // Find the pair this user belongs to
      const pairsSnapshot = await db.collection("pairs").get();
      let userPairId = null;
      
      for (const pairDoc of pairsSnapshot.docs) {
        const pairData = pairDoc.data();
        const telegramData = pairData.telegramData || {};
        
        if (telegramData.he_chat_id === chatId || telegramData.she_chat_id === chatId) {
          userPairId = pairDoc.id;
          break;
        }
      }
      
      if (!userPairId) {
        await TelegramManager.sendMessage(
          "❌ <b>Error:</b> Could not find your pair information.",
          null, null, chatId
        );
        return;
      }

      // Update request status in Firebase
      const orgasmRequestsRef = db.collection("pairs").doc(userPairId).collection("data").doc("orgasm_requests");
      await orgasmRequestsRef.set({
        status: response === 'approve' ? 'approved' : 'denied',
        respondedAt: new Date(),
        respondedBy: callbackQuery.from.id,
        responseId: requestId
      }, { merge: true });

      if (response === 'approve') {
        // Send approval to dominant
        await TelegramManager.sendMessage(
          "✅ <b>Orgasm request approved!</b>\n\n" +
          "The submissive has been notified and is allowed to orgasm.",
          null, null, chatId
        );
        
        // Send approval notification to submissive
        const pairDoc = await db.collection("pairs").doc(userPairId).get();
        const telegramData = pairDoc.data().telegramData || {};
        const submissiveChatId = telegramData.she_chat_id;
        
        if (submissiveChatId) {
          await TelegramManager.sendMessage(
            "✅ <b>ORGASM APPROVED!</b>\n\n" +
            "🔥 Your dominant has granted you permission to orgasm.\n\n" +
            "💦 You may cum now!",
            null, null, submissiveChatId
          );
        }
      } else {
        // Send denial to dominant
        await TelegramManager.sendMessage(
          "❌ <b>Orgasm request denied.</b>\n\n" +
          "The submissive has been notified of the denial.",
          null, null, chatId
        );
        
        // Send denial notification to submissive
        const pairDoc = await db.collection("pairs").doc(userPairId).get();
        const telegramData = pairDoc.data().telegramData || {};
        const submissiveChatId = telegramData.she_chat_id;
        
        if (submissiveChatId) {
          await TelegramManager.sendMessage(
            "❌ <b>ORGASM DENIED</b>\n\n" +
            "🚫 Your dominant has denied your request to orgasm.\n\n" +
            "⏰ You must wait for permission.",
            null, null, submissiveChatId
          );
        }
      }
      
      // Answer the callback query to remove loading state
      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: response === 'approve' ? "✅ Request approved!" : "❌ Request denied!"
          })
        });
      } catch (answerError) {
        console.error("Error answering callback query:", answerError);
      }
      
    } catch (error) {
      console.error("Error handling orgasm response:", error);
      await TelegramManager.sendMessage(
        "❌ <b>Error processing response.</b>\n\n" +
        "Please try again.",
        null, null, chatId
      );
    }
  }
}

// App Initialization
class AppInitializer {
  static initializeApp() {
    if (!appState.isAuthorized()) {
      AuthManager.showAuthorizationModal();
      return;
    }

    UIManager.updateUIForUser(appState.currentUser);

    // Real-time listener for history updates
    const counterDocRef = DatabaseManager.getDocRef();
    if (counterDocRef) {
      counterDocRef.onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          appState.counter = data.count || 0;
          appState.incrementHistory = data.history || [];
          if (data.lastTimestamp) {
            const timestampElement = document.getElementById("last-timestamp");
            if (timestampElement) {
              timestampElement.textContent = `Last: ${data.lastTimestamp}`;
            }
          }
          UIManager.updateDisplay();
        }
      });
    }

    StatsManager.loadStats();

    // Start Telegram polling
    TelegramManager.startPolling();
  }

  static setupEventListeners() {
    // Button event listeners
    const buttonMap = {
      "increment-btn": async () => {
        await CounterManager.handleIncrement(1);
        AnimationManager.createFloatingHeart();
        // Send comprehensive notification to partner
        try {
          const locationName = UIManager.getLocationName(1);
          const userRole = appState.currentUser === 'he' ? 'Dominant' : 'Submissive';
          const timeStr = new Date().toLocaleTimeString();
          const sent = await TelegramManager.sendNotificationToPartner(
            `🔥 <b>${userRole}</b> added <b>+1</b> (${locationName})\n\n📊 Total count: <b>${appState.counter}</b>\n⏰ Time: ${timeStr}`
          );
          if (!sent) {
            console.log("Partner notification not sent - Telegram not connected");
          }
        } catch (error) {
          console.error("Failed to send partner notification:", error);
        }
      },
      "undo-btn": () => CounterManager.handleUndo(),
      "reset-btn": () => CounterManager.handleReset(),
      "sound-toggle-btn": () => SoundManager.toggle(),
      "logout-btn": () => AuthManager.logout(),
      "telegram-auth-btn": () => TelegramManager.setupTelegramAuth(),
      "stats-btn": () => {
        const statsBox = document.getElementById("stats-display");
        const lastResults = document.getElementById("last-results");

        if (lastResults && lastResults.style.display === "block") {
          lastResults.style.display = "none";
          lastResults.style.opacity = "0";
        }

        if (statsBox) {
          statsBox.classList.toggle("show");
          if (statsBox.classList.contains("show")) {
            StatsManager.loadStats();
          }
        }
      },
      "last-btn": () => {
        const lastResults = document.getElementById("last-results");
        const statsBox = document.getElementById("stats-display");

        if (lastResults) {
          const last5 = appState.incrementHistory.slice(-5).reverse();
          lastResults.innerHTML = last5.map(increment => 
            `<div>${UIManager.getLocationName(increment)}: +${increment}</div>`
          ).join('');

          if (statsBox && statsBox.classList.contains("show")) {
            statsBox.classList.remove("show");
          }

          lastResults.style.display = lastResults.style.display === "block" ? "none" : "block";
          lastResults.style.opacity = lastResults.style.display === "block" ? "1" : "0";
        }
      }
    };

    Object.entries(buttonMap).forEach(([id, handler]) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("click", handler);
      }
    });

    // Location button handler
    const locationBtn = document.getElementById("location-btn");
    if (locationBtn) {
      locationBtn.addEventListener("click", () => {
        if (!appState.isAuthorized()) {
          NotificationManager.show("❌ Please authorize first", 'error');
          return;
        }
        const modal = document.getElementById("location-modal");
        if (modal) modal.style.display = "flex";
      });
    }

    // Photo Game button handler
    const photoGameBtn = document.getElementById("photo-game-btn");
    if (photoGameBtn) {
      photoGameBtn.addEventListener("click", () => {
        if (!appState.isAuthorized()) {
          NotificationManager.show("❌ Please authorize first", 'error');
          return;
        }
        PhotoGameManager.showPhotoGame();
      });
    }

    // Punishment button handler
    const punishmentBtn = document.getElementById("punishment-btn");
    if (punishmentBtn) {
      punishmentBtn.addEventListener("click", () => {
        if (!appState.isAuthorized()) {
          NotificationManager.show("❌ Please authorize first", 'error');
          return;
        }
        PunishmentManager.showPunishment();
      });
    }

    // Orgasm Request button handler
    const orgasmRequestBtn = document.getElementById("orgasm-request-btn");
    if (orgasmRequestBtn) {
      orgasmRequestBtn.addEventListener("click", () => {
        if (!appState.isAuthorized()) {
          NotificationManager.show("❌ Please authorize first", 'error');
          return;
        }
        if (appState.currentUser !== 'she') {
          NotificationManager.show("❌ Only submissive can request orgasm", 'error');
          return;
        }
        OrgasmManager.showOrgasmRequest();
      });
    }

    // Cum Command button handler
    const cumCommandBtn = document.getElementById("cum-command-btn");
    if (cumCommandBtn) {
      cumCommandBtn.addEventListener("click", () => {
        if (!appState.isAuthorized()) {
          NotificationManager.show("❌ Please authorize first", 'error');
          return;
        }
        if (appState.currentUser !== 'he') {
          NotificationManager.show("❌ Only dominant can send cum command", 'error');
          return;
        }
        OrgasmManager.showCumCommand();
      });
    }

    // Location bonus handling
    const locationBonuses = {
      "location-taxi": 2,
      "location-subway": 3,
      "location-cafe": 4,
      "location-guest": 5,
      "location-bonus": 1
    };

    Object.entries(locationBonuses).forEach(([id, bonus]) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("click", async () => {
          await CounterManager.handleIncrement(bonus);
          const modal = document.getElementById("location-modal");
          if (modal) modal.style.display = "none";
          
          // Send notification to partner
          const locationName = UIManager.getLocationName(bonus);
          try {
            await TelegramManager.sendNotificationToPartner(
              `📍 <b>${locationName}</b> location bonus: +${bonus}\n🔥 Total count: <b>${appState.counter}</b>`
            );
          } catch (error) {
            console.error("Failed to send location notification:", error);
          }
          
          for(let i = 0; i < 3; i++) {
            setTimeout(() => AnimationManager.createFloatingHeart(), i * 100);
          }
        });
      }
    });

    // Modal close handlers
    const modals = ['location-modal', 'photo-game-modal', 'punishment-modal', 'orgasm-request-modal', 'cum-command-modal'];
    modals.forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (modal) {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
          });
        }

        // Close on outside click
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.style.display = 'none';
          }
        });
      }
    });
  }
}

// Photo Game Manager
class PhotoGameManager {
  static showPhotoGame() {
    const tasks = TaskDataManager.getPhotoGameTasks();
    const randomTask = TaskDataManager.getRandomTask(tasks);
    
    appState.currentPhotoTask = randomTask;
    
    const modal = document.getElementById("photo-game-modal");
    const titleElement = document.getElementById("photo-game-title");
    const descriptionElement = document.getElementById("photo-game-description");
    
    if (titleElement) titleElement.textContent = randomTask.title;
    if (descriptionElement) descriptionElement.textContent = randomTask.description;
    if (modal) modal.style.display = "flex";
    
    // Setup button handlers
    PhotoGameManager.setupPhotoGameHandlers();
  }
  
  static setupPhotoGameHandlers() {
    const acceptBtn = document.getElementById("photo-game-accept");
    const newBtn = document.getElementById("photo-game-new");
    
    // Remove existing listeners
    const newAcceptBtn = acceptBtn?.cloneNode(true);
    const newNewBtn = newBtn?.cloneNode(true);
    if (acceptBtn && newAcceptBtn) acceptBtn.parentNode.replaceChild(newAcceptBtn, acceptBtn);
    if (newBtn && newNewBtn) newBtn.parentNode.replaceChild(newNewBtn, newBtn);
    
    // Add new listeners
    if (newAcceptBtn) {
      newAcceptBtn.addEventListener("click", async () => {
        const modal = document.getElementById("photo-game-modal");
        if (modal) modal.style.display = "none";
        
        await PhotoGameManager.acceptPhotoGame();
      });
    }
    
    if (newNewBtn) {
      newNewBtn.addEventListener("click", () => {
        PhotoGameManager.showPhotoGame();
      });
    }
  }
  
  static async acceptPhotoGame() {
    if (!appState.currentPhotoTask) return;
    
    try {
      // Send notification to partner
      const userRole = appState.currentUser === 'he' ? 'Dominant' : 'Submissive';
      const message = `📷 <b>Photo Game Accepted!</b>\n\n` +
        `<b>${userRole}</b> accepted photo task:\n\n` +
        `<b>"${appState.currentPhotoTask.title}"</b>\n\n` +
        `${appState.currentPhotoTask.description}`;
      
      await TelegramManager.sendNotificationToPartner(message);
      
      NotificationManager.show("✅ Photo game task accepted! Check Telegram for details.", 'success');
      
      // Store in Firebase for history
      if (appState.currentPairId) {
        const photoGamesRef = DatabaseManager.getPhotoGamesRef();
        if (photoGamesRef) {
          await photoGamesRef.set({
            currentTask: appState.currentPhotoTask,
            acceptedAt: new Date(),
            acceptedBy: appState.currentUser,
            status: 'accepted'
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error("Error accepting photo game:", error);
      NotificationManager.show("❌ Error sending photo game notification", 'error');
    }
  }
}

// Punishment Manager
class PunishmentManager {
  static showPunishment() {
    const modal = document.getElementById("punishment-modal");
    const descriptionElement = document.getElementById("punishment-description");
    const completedSection = document.getElementById("punishment-completed");
    const punishmentContent = document.getElementById("punishment-content");
    
    // Check if there's an accepted punishment
    if (appState.punishmentAccepted && appState.currentPunishment) {
      // Show only completion button for accepted punishment
      if (descriptionElement) descriptionElement.textContent = appState.currentPunishment.description;
      if (completedSection) completedSection.style.display = "block";
      if (punishmentContent) punishmentContent.style.display = "none";
    } else {
      // Show new punishment selection
      const tasks = TaskDataManager.getPunishmentTasks();
      const randomTask = TaskDataManager.getRandomTask(tasks);
      
      appState.currentPunishment = randomTask;
      
      if (descriptionElement) descriptionElement.textContent = randomTask.description;
      if (completedSection) completedSection.style.display = "none";
      if (punishmentContent) punishmentContent.style.display = "block";
    }
    
    if (modal) modal.style.display = "flex";
    
    // Setup button handlers
    PunishmentManager.setupPunishmentHandlers();
  }
  
  static setupPunishmentHandlers() {
    const acceptBtn = document.getElementById("punishment-accept");
    const newBtn = document.getElementById("punishment-new");
    const doneBtn = document.getElementById("punishment-done");
    
    // Remove existing listeners
    const newAcceptBtn = acceptBtn?.cloneNode(true);
    const newNewBtn = newBtn?.cloneNode(true);
    const newDoneBtn = doneBtn?.cloneNode(true);
    
    if (acceptBtn && newAcceptBtn) acceptBtn.parentNode.replaceChild(newAcceptBtn, acceptBtn);
    if (newBtn && newNewBtn) newBtn.parentNode.replaceChild(newNewBtn, newBtn);
    if (doneBtn && newDoneBtn) doneBtn.parentNode.replaceChild(newDoneBtn, doneBtn);
    
    // Add new listeners
    if (newAcceptBtn) {
      newAcceptBtn.addEventListener("click", async () => {
        await PunishmentManager.acceptPunishment();
      });
    }
    
    if (newNewBtn) {
      newNewBtn.addEventListener("click", () => {
        PunishmentManager.showPunishment();
      });
    }
    
    if (newDoneBtn) {
      newDoneBtn.addEventListener("click", async () => {
        const modal = document.getElementById("punishment-modal");
        if (modal) modal.style.display = "none";
        
        await PunishmentManager.completePunishment();
      });
    }
  }
  
  static async acceptPunishment() {
    if (!appState.currentPunishment) return;
    
    try {
      // Generate punishment ID
      appState.currentPunishmentId = 'pun_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      
      // Send notification to partner
      const userRole = appState.currentUser === 'he' ? 'Dominant' : 'Submissive';
      const message = `🩸 <b>Punishment Accepted!</b>\n\n` +
        `<b>${userRole}</b> accepted punishment:\n\n` +
        `${appState.currentPunishment.description}\n\n` +
        `⏰ Waiting for completion confirmation...`;
      
      await TelegramManager.sendNotificationToPartner(message);
      
      // Hide the modal after acceptance
      const modal = document.getElementById("punishment-modal");
      if (modal) modal.style.display = "none";
      
      // Mark punishment as accepted in app state
      appState.punishmentAccepted = true;
      
      NotificationManager.show("✅ Punishment accepted! Click 'Punish Me' again when completed.", 'success');
      
      // Store in Firebase
      if (appState.currentPairId) {
        const punishmentsRef = DatabaseManager.getPunishmentsRef();
        if (punishmentsRef) {
          await punishmentsRef.set({
            currentPunishment: appState.currentPunishment,
            punishmentId: appState.currentPunishmentId,
            acceptedAt: new Date(),
            acceptedBy: appState.currentUser,
            status: 'accepted'
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error("Error accepting punishment:", error);
      NotificationManager.show("❌ Error sending punishment notification", 'error');
    }
  }
  
  static async completePunishment() {
    if (!appState.currentPunishment || !appState.currentPunishmentId) return;
    
    try {
      // Send completion notification to partner
      const userRole = appState.currentUser === 'he' ? 'Dominant' : 'Submissive';
      const message = `✅ <b>Punishment Completed!</b>\n\n` +
        `<b>${userRole}</b> completed punishment:\n\n` +
        `${appState.currentPunishment.description}\n\n` +
        `🎯 Punishment ID: ${appState.currentPunishmentId}`;
      
      await TelegramManager.sendNotificationToPartner(message);
      
      NotificationManager.show("✅ Punishment completed! Partner has been notified.", 'success');
      
      // Update Firebase
      if (appState.currentPairId) {
        const punishmentsRef = DatabaseManager.getPunishmentsRef();
        if (punishmentsRef) {
          await punishmentsRef.set({
            completedAt: new Date(),
            status: 'completed'
          }, { merge: true });
        }
      }
      
      // Clear current punishment
      appState.currentPunishment = null;
      appState.currentPunishmentId = null;
      appState.punishmentAccepted = false;
      
    } catch (error) {
      console.error("Error completing punishment:", error);
      NotificationManager.show("❌ Error sending completion notification", 'error');
    }
  }
}

// Orgasm Manager
class OrgasmManager {
  static showOrgasmRequest() {
    const modal = document.getElementById("orgasm-request-modal");
    if (modal) modal.style.display = "flex";
    
    // Setup button handlers
    OrgasmManager.setupOrgasmRequestHandlers();
  }
  
  static showCumCommand() {
    const modal = document.getElementById("cum-command-modal");
    if (modal) modal.style.display = "flex";
    
    // Setup button handlers
    OrgasmManager.setupCumCommandHandlers();
  }
  
  static setupOrgasmRequestHandlers() {
    const sendBtn = document.getElementById("orgasm-request-send");
    const cancelBtn = document.getElementById("orgasm-request-cancel");
    
    // Remove existing listeners
    const newSendBtn = sendBtn?.cloneNode(true);
    const newCancelBtn = cancelBtn?.cloneNode(true);
    
    if (sendBtn && newSendBtn) sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
    if (cancelBtn && newCancelBtn) cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    // Add new listeners
    if (newSendBtn) {
      newSendBtn.addEventListener("click", async () => {
        const modal = document.getElementById("orgasm-request-modal");
        if (modal) modal.style.display = "none";
        
        await OrgasmManager.sendOrgasmRequest();
      });
    }
    
    if (newCancelBtn) {
      newCancelBtn.addEventListener("click", () => {
        const modal = document.getElementById("orgasm-request-modal");
        if (modal) modal.style.display = "none";
      });
    }
  }
  
  static setupCumCommandHandlers() {
    const sendBtn = document.getElementById("cum-command-send");
    const cancelBtn = document.getElementById("cum-command-cancel");
    
    // Remove existing listeners
    const newSendBtn = sendBtn?.cloneNode(true);
    const newCancelBtn = cancelBtn?.cloneNode(true);
    
    if (sendBtn && newSendBtn) sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
    if (cancelBtn && newCancelBtn) cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    // Add new listeners
    if (newSendBtn) {
      newSendBtn.addEventListener("click", async () => {
        const modal = document.getElementById("cum-command-modal");
        if (modal) modal.style.display = "none";
        
        await OrgasmManager.sendCumCommand();
      });
    }
    
    if (newCancelBtn) {
      newCancelBtn.addEventListener("click", () => {
        const modal = document.getElementById("cum-command-modal");
        if (modal) modal.style.display = "none";
      });
    }
  }
  
  static async sendOrgasmRequest() {
    try {
      const requestId = 'orgasm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      
      // Send request to dominant with approval buttons
      const keyboard = [
        [
          { text: "✅ ALLOW", callback_data: `orgasm_${requestId}_approve` },
          { text: "❌ DENY", callback_data: `orgasm_${requestId}_deny` }
        ]
      ];
      
      const message = `🧎‍♀️ <b>ORGASM REQUEST</b>\n\n` +
        `The submissive is requesting permission to orgasm.\n\n` +
        `Please choose your response:`;
      
      await TelegramManager.sendMessage(message, keyboard, 'he');
      
      NotificationManager.show("✅ Orgasm request sent to dominant!", 'success');
      
      // Store request in Firebase
      if (appState.currentPairId) {
        const orgasmRequestsRef = DatabaseManager.getOrgasmRequestsRef();
        if (orgasmRequestsRef) {
          await orgasmRequestsRef.set({
            requestId: requestId,
            requestedAt: new Date(),
            requestedBy: appState.currentUser,
            status: 'pending'
          }, { merge: true });
        }
      }
      
    } catch (error) {
      console.error("Error sending orgasm request:", error);
      NotificationManager.show("❌ Error sending orgasm request", 'error');
    }
  }
  
  static async sendCumCommand() {
    try {
      const commandId = 'cum_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      
      // Send direct command to submissive
      const message = `💦 <b>CUM COMMAND</b>\n\n` +
        `🔥 <b>The Dominant commands you to orgasm NOW!</b>\n\n` +
        `This is a direct order. Comply immediately.\n\n` +
        `Command ID: ${commandId}`;
      
      await TelegramManager.sendMessage(message, null, 'she');
      
      NotificationManager.show("✅ Cum command sent to submissive!", 'success');
      
      // Store command in Firebase
      if (appState.currentPairId) {
        const orgasmRequestsRef = DatabaseManager.getOrgasmRequestsRef();
        if (orgasmRequestsRef) {
          await orgasmRequestsRef.set({
            commandId: commandId,
            commandedAt: new Date(),
            commandedBy: appState.currentUser,
            type: 'command',
            status: 'sent'
          }, { merge: true });
        }
      }
      
    } catch (error) {
      console.error("Error sending cum command:", error);
      NotificationManager.show("❌ Error sending cum command", 'error');
    }
  }
}

// Auth Manager
class AuthManager {
  static showAuthorizationModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.id = "auth-modal";
    modal.innerHTML = `
      <div class="modal-content" style="width: 350px; max-width: 95%; text-align: center;">
        <div style="font-size: 16px; color: #ff4081; margin-bottom: 20px;">
          💕 WELCOME TO KARINA'S APP
        </div>
        <div style="font-size: 12px; color: #ffb6d5; margin-bottom: 25px; line-height: 1.4;">
          Choose your role to get started:
        </div>
        <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
          <button id="role-he" class="role-btn" style="background: linear-gradient(145deg, #4081ff, #6b9eff); min-height: 60px;">
            👨 DOMINANT MODE
          </button>
          <button id="role-she" class="role-btn" style="background: linear-gradient(145deg, #ff4081, #ff6b9e); min-height: 60px;">
            👩 SUBMISSIVE MODE
          </button>
        </div>
        <div id="pair-options" style="display: none;">
          <div style="font-size: 11px; color: #ffb6d5; margin-bottom: 15px;">
            Now choose an option:
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button id="create-pair-auth" style="background: linear-gradient(145deg, #4CAF50, #66BB6A);">
              ➕ CREATE NEW PAIR
            </button>
            <button id="join-pair-auth" style="background: linear-gradient(145deg, #FF9800, #FFB74D);">
              🔗 JOIN EXISTING PAIR
            </button>
          </div>
        </div>
        <div id="join-pair-section" style="display: none;">
          <div style="font-size: 11px; color: #ffb6d5; margin: 15px 0;">
            Enter the 6-digit pair code:
          </div>
          <input type="text" id="auth-pair-code" placeholder="ABC123" maxlength="6" style="width: 100%; margin-bottom: 15px; background: rgba(255, 255, 255, 0.9); color: #333; border: 2px solid #ff9ec6; border-radius: 8px; padding: 12px; font-family: 'Press Start 2P', monospace; font-size: 12px;">
          <div style="display: flex; gap: 10px;">
            <button id="confirm-join-auth" style="flex: 1; background: linear-gradient(145deg, #4CAF50, #66BB6A);">
              JOIN
            </button>
            <button id="back-to-options" style="flex: 1; background: linear-gradient(145deg, #757575, #9E9E9E);">
              BACK
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";
    document.body.classList.add('lock-scroll');

    let selectedRole = null;

    // Role selection handlers
    document.getElementById('role-he').addEventListener('click', () => {
      selectedRole = 'he';
      document.getElementById('pair-options').style.display = 'block';
      // Highlight selected role
      document.getElementById('role-he').style.border = '3px solid #4081ff';
      document.getElementById('role-she').style.border = '2px solid rgba(255, 255, 255, 0.2)';
    });

    document.getElementById('role-she').addEventListener('click', () => {
      selectedRole = 'she';
      document.getElementById('pair-options').style.display = 'block';
      // Highlight selected role
      document.getElementById('role-she').style.border = '3px solid #ff4081';
      document.getElementById('role-he').style.border = '2px solid rgba(255, 255, 255, 0.2)';
    });

    // Create pair handler
    document.getElementById('create-pair-auth').addEventListener('click', async () => {
      if (!selectedRole) return;

      try {
        const pairCode = Math.random().toString(36).substr(2, 6).toUpperCase();
        const userUID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

        await db.collection("pairs").doc(pairCode).set({
          createdAt: new Date(),
          createdBy: selectedRole,
          users: [selectedRole]
        });

        appState.updateUser(selectedRole, pairCode, userUID);

        modal.remove();
        document.body.classList.remove('lock-scroll');

        UIManager.updateUIForUser(selectedRole);
        AppInitializer.initializeApp();

        // Copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(pairCode).then(() => {
            NotificationManager.showLargeNotification(`Pair created! Code ${pairCode} copied to clipboard!`, 'success');
          }).catch(() => {
            NotificationManager.showLargeNotification(`Pair created! Share this code: ${pairCode}`, 'success');
          });
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = pairCode;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            NotificationManager.showLargeNotification(`Pair created! Code ${pairCode} copied to clipboard!`, 'success');
          } catch (err) {
            NotificationManager.showLargeNotification(`Pair created! Share this code: ${pairCode}`, 'success');
          }
          document.body.removeChild(textArea);
        }
      } catch (error) {
        NotificationManager.show('Error creating pair', 'error');
      }
    });

    // Join pair handler
    document.getElementById('join-pair-auth').addEventListener('click', () => {
      if (!selectedRole) return;
      document.getElementById('pair-options').style.display = 'none';
      document.getElementById('join-pair-section').style.display = 'block';
    });

    // Confirm join handler
    document.getElementById('confirm-join-auth').addEventListener('click', async () => {
      if (!selectedRole) return;

      const pairCode = document.getElementById('auth-pair-code').value.trim().toUpperCase();
      if (pairCode.length !== 6) {
        NotificationManager.show('Please enter a 6-digit code', 'error');
        return;
      }

      try {
        const pairDoc = await db.collection("pairs").doc(pairCode).get();
        if (!pairDoc.exists) {
          NotificationManager.show('Pair code not found', 'error');
          return;
        }

        const userUID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

        appState.updateUser(selectedRole, pairCode, userUID);

        modal.remove();
        document.body.classList.remove('lock-scroll');

        UIManager.updateUIForUser(selectedRole);
        AppInitializer.initializeApp();

        NotificationManager.showLargeNotification('Successfully joined pair!', 'success');
      } catch (error) {
        NotificationManager.show('Error joining pair', 'error');
      }
    });

    // Back button handler
    document.getElementById('back-to-options').addEventListener('click', () => {
      document.getElementById('join-pair-section').style.display = 'none';
      document.getElementById('pair-options').style.display = 'block';
    });

    // Close on outside click (disabled for auth modal)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        // Don't allow closing auth modal by clicking outside
        return;
      }
    });
  }

  static logout() {
    NotificationManager.showConfirmation(
      "Are you sure you want to logout? You'll need to re-pair with your partner.",
      () => {
        appState.clearUser();

        const userInfo = document.getElementById("user-info");
        if (userInfo) userInfo.style.display = 'none';

        const titleElement = document.querySelector('.title');
        if (titleElement) {
          titleElement.firstChild.textContent = "KARINA'S ORGASM-O-MATIC";
        }

        AuthManager.showAuthorizationModal();
        NotificationManager.show("✅ Logged out successfully", 'success');
      }
    );
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Clear cache if version changed
  clearCacheIfNeeded();
  
  // Start heart animations
  setInterval(() => AnimationManager.createFloatingHeart(), 600);
  for(let i = 0; i < 5; i++) {
    setTimeout(() => AnimationManager.createFloatingHeart(), i * 200);
  }

  // Initialize sound toggle
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  if (soundToggleBtn) {
    soundToggleBtn.textContent = appState.soundEnabled ? "🔊 SOUND" : "🔇 SOUND";
  }

  // Setup all event listeners
  AppInitializer.setupEventListeners();

  // Initialize the app
  AppInitializer.initializeApp();
});