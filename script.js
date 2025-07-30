
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
  }
];

let counter = 0;
let incrementHistory = [];
let currentPhotoTask = null;
const MAX_HISTORY = 100;

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

async function updateFirestoreStats(increment = 1) {
  const todayKey = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await statsRef.get();
    let data = snapshot.exists ? snapshot.data() : {
      today: 0, week: 0, month: 0, record: 0, lastUpdated: todayKey
    };

    if (increment < 0) {
      if (data.today <= 0 && data.week <= 0 && data.month <= 0) return;
      data.today = Math.max(0, (data.today || 0) + increment);
      data.week = Math.max(0, (data.week || 0) + increment);
      data.month = Math.max(0, (data.month || 0) + increment);
    } else {
      data.today = data.lastUpdated === todayKey ? (data.today || 0) + increment : increment;
      data.week = (data.week || 0) + increment;
      data.month = (data.month || 0) + increment;
      data.record = Math.max(data.record || 0, counter);
      data.lastUpdated = todayKey;
    }

    await statsRef.set(data);
    updateStatsDisplay(data);
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
      updateStatsDisplay(snapshot.data());
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
    
    // Show success notification
    showPhotoGameNotification("📷 Task sent successfully!");
    
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

// Orgasm Request functionality
async function saveOrgasmRequest() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString();
    
    const orgasmRequestData = {
      date: today,
      timestamp: timestamp,
      type: "orgasm_request",
      status: "pending",
      requestedBy: "Karina",
      message: "Карина просит разрешения на оргазм"
    };

    await orgasmRequestsRef.collection("requests").add(orgasmRequestData);
    
    // Show success notification
    showOrgasmRequestNotification("🧎‍♀️ Запрос отправлен!");
    
    // TODO: In a real implementation, this would trigger a Telegram bot message
    // to the dominant with inline buttons for approval/denial
    
    return true;
  } catch (error) {
    console.error("Error saving orgasm request:", error);
    showOrgasmRequestNotification("❌ Ошибка отправки запроса");
    return false;
  }
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

  // Photo Game modal handling
  const photoGameBtn = document.getElementById("photo-game-btn");
  const photoGameModal = document.getElementById("photo-game-modal");
  const closePhotoGame = document.getElementById("close-photo-game");
  const photoGameAccept = document.getElementById("photo-game-accept");
  const photoGameNew = document.getElementById("photo-game-new");

  if (photoGameBtn) {
    photoGameBtn.addEventListener("click", () => {
      const task = getRandomPhotoTask();
      displayPhotoTask(task);
      photoGameModal.style.display = "flex";
    });
  }

  if (closePhotoGame) {
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

  if (photoGameAccept) {
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

  // Orgasm Request modal handling
  const orgasmRequestBtn = document.getElementById("orgasm-request-btn");
  const orgasmRequestModal = document.getElementById("orgasm-request-modal");
  const closeOrgasmRequest = document.getElementById("close-orgasm-request");
  const orgasmRequestSend = document.getElementById("orgasm-request-send");
  const orgasmRequestCancel = document.getElementById("orgasm-request-cancel");

  if (orgasmRequestBtn) {
    orgasmRequestBtn.addEventListener("click", () => {
      orgasmRequestModal.style.display = "flex";
    });
  }

  if (closeOrgasmRequest) {
    closeOrgasmRequest.addEventListener("click", () => {
      orgasmRequestModal.style.display = "none";
    });
  }

  if (orgasmRequestCancel) {
    orgasmRequestCancel.addEventListener("click", () => {
      orgasmRequestModal.style.display = "none";
    });
  }

  if (orgasmRequestSend) {
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

    // Add sparkle animation
    for(let i = 0; i < 5; i++) {
      createFloatingHeart();
    }

    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
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
    } catch (e) {
      console.error("Increment error:", e);
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

  // Listen for counter updates
  docRef.onSnapshot((doc) => {
    if (doc.exists) {
      counter = doc.data().count || 0;
      updateDisplay();
    }
  });
});
