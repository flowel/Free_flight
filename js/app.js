(function () {
  "use strict";

  /* ===== 情绪配置 ===== */
  var EMOTION_MAP = {
    default: {
      icon: "✈️",
      desc: "小飞机正在自由飞行，等待手表数据或手动选择情绪状态。",
      pagDir: "正常轨迹",
      audioDir: "默认"
    },
    tired: {
      icon: "😴",
      desc: "此刻的你有些疲倦，身体像是在提醒你慢下来，给自己一点恢复的空间。",
      pagDir: "疲惫悲伤",
      audioDir: "疲惫悲伤"
    },
    calm: {
      icon: "😌",
      desc: "此刻的你平静而放松，呼吸和节奏都比较稳定，适合保持当下的舒适状态。",
      pagDir: "平静专注",
      audioDir: "平静专注"
    },
    satisfied: {
      icon: "☺️",
      desc: "此刻的你感到满足而安稳，内在状态柔和，适合让这份舒适自然延续。",
      pagDir: "平静专注",
      audioDir: "平静专注"
    },
    happy: {
      icon: "😊",
      desc: "此刻的你心情愉悦，状态轻快明亮，像小飞机正轻盈地穿过云层。",
      pagDir: "兴奋高兴",
      audioDir: "兴奋高兴"
    },
    excited: {
      icon: "😆",
      desc: "此刻的你比较兴奋，能量更高、节奏更快，可以通过呼吸让身体慢慢回到稳定。",
      pagDir: "兴奋高兴",
      audioDir: "兴奋高兴"
    },
    tense: {
      icon: "😬",
      desc: "此刻的你有些紧张，身体可能处在绷紧状态，适合放慢呼吸、逐步松开压力。",
      pagDir: "焦虑紧张",
      audioDir: "焦虑紧张"
    },
    anxious: {
      icon: "😟",
      desc: "此刻的你有些焦虑，思绪可能变得密集，可以先跟随节奏稳定呼吸。",
      pagDir: "焦虑紧张",
      audioDir: "焦虑紧张"
    },
    depressed: {
      icon: "😔",
      desc: "此刻的你可能有些沮丧或低落，可以先允许自己停一停，再慢慢找回稳定感。",
      pagDir: "疲惫悲伤",
      audioDir: "疲惫悲伤"
    }
  };

  /* ===== PAG 文件清单 ===== */
  var PAG_FILES = {
    "兴奋高兴": ["1.pag", "11.pag", "12.pag", "22.pag", "29.pag", "30.pag", "6.pag"],
    "平静专注": ["15.pag", "16.pag", "17.pag", "19.pag", "24.pag"],
    "焦虑紧张": ["21.pag", "23.pag", "32.pag", "33.pag"],
    "疲惫悲伤": ["13.pag", "14.pag", "2.pag", "20.pag", "28.pag"],
    "特殊轨迹": ["31.pag", "36.pag", "37.pag", "5.pag", "8.pag", "9.pag", "怼脸.pag"],
    "正常轨迹": ["10.pag", "15-2.pag", "18.pag", "25.pag", "26.pag", "27.pag", "3.pag", "34.pag", "35.pag", "38.pag", "39.pag", "4.pag", "40.pag", "7.pag"]
  };

  /* ===== 时间段定义 ===== */
  var TIME_PERIODS = [
    { start: 4, end: 5, label: "凌晨时" },
    { start: 5, end: 9, label: "拂晓时" },
    { start: 9, end: 13, label: "早上好" },
    { start: 13, end: 17, label: "下午好" },
    { start: 17, end: 18, label: "黄昏时" },
    { start: 18, end: 19, label: "暮光里" },
    { start: 19, end: 23, label: "晚上好" },
    { start: 23, end: 4, label: "星空下" }   // 跨午夜
  ];

  /* ===== 背景图配置（每个时段对应的背景图列表）===== */
  var BG_IMAGES = {
    "凌晨时": ["img/bg3.jpg"],
    "拂晓时": ["img/bg1.png"],
    "早上好": ["img/bg2.png"],
    "下午好": ["img/bg2.png"],
    "黄昏时": ["img/bg2.png"],
    "暮光里": ["img/bg2.png"],
    "晚上好": ["img/bg4.png"],
    "星空下": ["img/bg4.png"]
  };

  /* ===== 音频文件列表：demo 每类最多保留 2 首，真实 App 每类仅内置 1 首兜底 ===== */
  var AUDIO_FILE_MAP = {
    "默认": ["Dreaming Softly.mp3", "夜的摇篮曲.mp3"],
    "平静专注": ["Moss Window.mp3", "静谧心海.mp3"],
    "兴奋高兴": ["清晨出发.mp3", "飞翔的心.mp3"],
    "焦虑紧张": ["Drifting Keys.mp3", "静心之歌.mp3"],
    "疲惫悲伤": ["夜雨独白.mp3", "深夜缓缓落下.mp3"]
  };

  /* ===== DOM 引用 ===== */
  var canvas = document.getElementById("pag-canvas");
  var fallback = document.getElementById("pag-fallback");
  var bgA = document.getElementById("bg-a");
  var bgB = document.getElementById("bg-b");
  var audioA = document.getElementById("audio-a");
  var audioB = document.getElementById("audio-b");
  var emotionSelect = document.getElementById("emotion-select");
  var emotionIcon = document.getElementById("emotion-icon");
  var insightButton = document.getElementById("btn-insight");
  var insightIcon = document.getElementById("btn-insight-icon");
  var statusDesc = document.getElementById("status-desc");
  var breathingToast = document.getElementById("breathing-toast");
  var periodSelect = document.getElementById("period-select");
  var greetingText = document.getElementById("greeting-text");
  var greetingDate = document.getElementById("greeting-date");
  var greetingWeather = document.getElementById("greeting-weather");

  /* ===== 状态 ===== */
  var pagView = null;
  var PAGConstructor = null;
  var currentPAGUrl = null;
  var currentEmotion = emotionSelect.value;
  var pagSwitchTimer = null;

  // 背景图双缓冲
  var activeBgLayer = "a"; // 当前显示的是哪层
  var currentBgUrl = null;

  // 音频双缓冲 + 交叉淡入淡出
  var activeAudio = "a"; // 当前播放的是哪个 audio 元素
  var isPlaying = false;
  var currentAudioIndex = {};
  var crossfadeTimer = null;
  var currentAudioDir = null;
  var currentAudioUrl = null;
  var breathingToastTimer = null;

  var BREATHING_PROMPTS = {
    day: {
      prompts: {
        tired: "你似乎有些疲惫，来一起放松一会儿",
        excited: "你似乎有些亢奋，来一起慢慢平静下来",
        tense: "你似乎有些紧绷，来一起松一松",
        anxious: "你似乎有些不安，来一起缓一缓",
        depressed: "你似乎有些低落，来一起安顿一下心情"
      }
    },
    sleep: {
      prompts: {
        excited: "你似乎还有些清醒，来一起慢慢安静下来",
        tense: "你似乎有些紧绷，来一起放松入眠",
        anxious: "你似乎有些不安，来一起慢慢放下",
        depressed: "你似乎有些沉重，来一起轻轻安顿下来"
      }
    }
  };

  /* ===== 工具函数 ===== */
  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  /* ===== 获取当前时间段 ===== */
  function getCurrentPeriod() {
    var h = new Date().getHours();
    for (var i = 0; i < TIME_PERIODS.length; i++) {
      var p = TIME_PERIODS[i];
      if (p.start < p.end) {
        // 正常时段（不跨午夜）
        if (h >= p.start && h < p.end) return p.label;
      } else {
        // 跨午夜时段（如 23:00-04:00）
        if (h >= p.start || h < p.end) return p.label;
      }
    }
    return TIME_PERIODS[0].label;
  }

  /* ===== 根据情绪获取音频目录 ===== */
  function getAudioDirForEmotion(emotionKey) {
    var emotion = EMOTION_MAP[emotionKey];
    return emotion && emotion.audioDir ? emotion.audioDir : "默认";
  }

  function syncPeriodSelect() {
    periodSelect.value = getCurrentPeriod();
  }

  function getPracticeScene() {
    var selected = document.querySelector('input[name="practice-scene"]:checked');
    return selected ? selected.value : "day";
  }

  function hideBreathingToast() {
    if (!breathingToast) return;
    breathingToast.classList.remove("is-visible");
    if (breathingToastTimer) {
      clearTimeout(breathingToastTimer);
      breathingToastTimer = null;
    }
    setTimeout(function () {
    if (!breathingToast.classList.contains("is-visible")) {
      breathingToast.hidden = true;
    }
    }, 820);
  }

  function showCenterToast(message) {
    if (!breathingToast) return;

    if (breathingToastTimer) clearTimeout(breathingToastTimer);
    breathingToast.textContent = message;
    breathingToast.hidden = false;

    requestAnimationFrame(function () {
      breathingToast.classList.add("is-visible");
    });

    breathingToastTimer = setTimeout(function () {
      hideBreathingToast();
    }, 3000);
  }

  function updateBreathingPrompt(emotionKey) {
    if (!breathingToast) return;

    var scene = getPracticeScene();
    var config = BREATHING_PROMPTS[scene];
    var prompt = config && config.prompts[emotionKey];

    if (!prompt) {
      hideBreathingToast();
      return;
    }

    showCenterToast(prompt);
  }

  /* ================================================================
     背景图切换（双缓冲交叉淡入）
     ================================================================ */
  function switchBackground(period) {
    var images = BG_IMAGES[period];
    if (!images || images.length === 0) return;

    var url = rand(images);
    if (url === currentBgUrl) {
      url = images[(images.indexOf(url) + 1) % images.length];
    }
    currentBgUrl = url;

    if (activeBgLayer === "a") {
      // 当前 A 可见，把新图设到 B，然后淡入 B
      bgB.style.backgroundImage = "url('" + url + "')";
      bgB.classList.add("active");
      bgA.classList.remove("active");
      activeBgLayer = "b";
    } else {
      // 当前 B 可见，把新图设到 A，然后淡入 A
      bgA.style.backgroundImage = "url('" + url + "')";
      bgA.classList.add("active");
      bgB.classList.remove("active");
      activeBgLayer = "a";
    }
  }

  /* ================================================================
     PAG 动画
     ================================================================ */
  function encodePAGUrl(dir, file) {
    return "pag/" + encodeURIComponent(dir) + "/" + encodeURIComponent(file);
  }

  function sizeCanvas() {
    var w = canvas.parentElement.clientWidth || window.innerWidth;
    var h = canvas.parentElement.clientHeight || window.innerHeight;
    canvas.width = w * (window.devicePixelRatio || 1);
    canvas.height = h * (window.devicePixelRatio || 1);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
  }

  function loadPAG(dir, file) {
    var url = encodePAGUrl(dir, file);
    var key = dir + "/" + file;
    if (currentPAGUrl === key && pagView) return;
    currentPAGUrl = key;

    if (!PAGConstructor) {
      console.warn("PAGConstructor 未初始化，跳过加载");
      return;
    }

    console.log("加载 PAG:", url);
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("PAG 文件未找到: " + url + " (status: " + res.status + ")");
        console.log("PAG 文件 fetch 成功");
        return res.arrayBuffer();
      })
      .then(function (buffer) {
        console.log("PAG 文件大小:", buffer.byteLength, "bytes");
        return PAGConstructor.PAGFile.load(buffer);
      })
      .then(function (pagFile) {
        console.log("PAGFile 加载成功, 尺寸:", pagFile.width(), "x", pagFile.height(), ", 帧数:", pagFile.numFrames ? pagFile.numFrames() : "unknown");
        fallback.style.display = "none";
        canvas.style.display = "block";
        // 先设置 canvas 像素尺寸
        sizeCanvas();
        if (pagView) {
          try { pagView.destroy(); } catch (e) { console.warn("销毁旧 PAGView 失败:", e); }
          pagView = null;
        }
        console.log("开始初始化 PAGView...");
        return PAGConstructor.PAGView.init(pagFile, canvas);
      })
      .then(function (view) {
        console.log("PAGView 初始化成功, view:", view ? "有效" : "无效");
        pagView = view;
        // 播放一次，不循环
        pagView.setRepeatCount(0);
        // 监听播放结束，自动切换下一个
        pagView.addListener("onAnimationEnd", function () {
          console.log("PAG 动画播放结束，切换下一个");
          switchPAGForEmotion(currentEmotion);
        });
        console.log("开始播放 PAG...");
        return pagView.play();
      })
      .then(function () {
        console.log("PAG 播放中 ✓");
      })
      .catch(function (err) {
        console.error("PAG 加载失败:", err.message || err, err.stack || "");
      });
  }

  function switchPAGForEmotion(emotionKey) {
    var config = EMOTION_MAP[emotionKey];
    if (!config) return;

    var dirs = [config.pagDir];
    if (Math.random() < 0.3) dirs.push("特殊轨迹");
    if (Math.random() < 0.2) dirs.push("正常轨迹");

    var dir = rand(dirs);
    var files = PAG_FILES[dir];
    if (!files || files.length === 0) {
      dir = config.pagDir;
      files = PAG_FILES[dir];
    }
    if (!files || files.length === 0) return;

    var file = rand(files);
    loadPAG(dir, file);
  }

  function startPAGSwitcher() {
    stopPAGSwitcher();
    var interval = 15000 + Math.random() * 10000;
    pagSwitchTimer = setTimeout(function () {
      switchPAGForEmotion(currentEmotion);
      startPAGSwitcher();
    }, interval);
  }

  function stopPAGSwitcher() {
    if (pagSwitchTimer) {
      clearTimeout(pagSwitchTimer);
      pagSwitchTimer = null;
    }
  }

  function initPAG() {
    // 等待 libpag 加载完成（async 脚本可能还未就绪）
    function tryInit(retries) {
      if (typeof libpag !== "undefined") {
        console.log("libpag 已找到，开始初始化...");
        // 指定 WASM 文件的 CDN 路径，避免加载失败
        libpag.PAGInit({
          locateFile: function (file) {
            console.log("定位 WASM 文件:", file);
            return "vendor/libpag/" + file;
          }
        }).then(function (PAG) {
          console.log("PAG 初始化成功", PAG ? "PAG 对象有效" : "PAG 对象无效");
          PAGConstructor = PAG;
          // 显示 canvas 并设置正确尺寸
          canvas.style.display = "block";
          sizeCanvas();
          console.log("Canvas 尺寸:", canvas.width, "x", canvas.height);
          // 加载初始 PAG 动画（动画结束后会自动切换下一个）
          switchPAGForEmotion(currentEmotion);
        }).catch(function (err) {
          console.error("PAG 初始化失败:", err.message || err, err.stack || "");
          canvas.style.display = "none";
        });
      } else if (retries > 0) {
        console.log("等待 libpag 加载... 剩余重试:", retries);
        setTimeout(function () { tryInit(retries - 1); }, 300);
      } else {
        console.warn("libpag 未加载，使用静态背景");
        canvas.style.display = "none";
      }
    }
    tryInit(30); // 最多等 9 秒
  }

  /* ================================================================
     音频：交叉淡入淡出（3 秒渐变）
     ================================================================ */
  var FADE_DURATION = 3000; // 3 秒
  var FADE_STEPS = 60;
  var FADE_INTERVAL = FADE_DURATION / FADE_STEPS;

  function getActiveAudio() {
    return activeAudio === "a" ? audioA : audioB;
  }

  function getInactiveAudio() {
    return activeAudio === "a" ? audioB : audioA;
  }

  /**
   * 交叉淡入淡出：旧音频 3 秒减弱结束，新音频 3 秒渐强开始
   * @param {string} url - 新音频 URL
   */
  function crossfadeTo(url) {
    var oldAudio = getActiveAudio();
    var newAudio = getInactiveAudio();

    // 设置新音频源
    newAudio.src = url;
    newAudio.volume = 0;
    newAudio.load();

    var newReady = false;
    var oldVol = oldAudio.volume;

    // 等新音频可播放后开始交叉淡入淡出
    function startCrossfade() {
      if (newReady) return;
      newReady = true;

      newAudio.play().catch(function () {});

      var step = 0;
      if (crossfadeTimer) clearInterval(crossfadeTimer);

      crossfadeTimer = setInterval(function () {
        step++;
        var progress = step / FADE_STEPS;

        // 旧音频减弱
        var oldVolume = Math.max(0, oldVol * (1 - progress));
        oldAudio.volume = oldVolume;

        // 新音频渐强
        newAudio.volume = Math.min(1, progress);

        if (step >= FADE_STEPS) {
          clearInterval(crossfadeTimer);
          crossfadeTimer = null;

          // 停止旧音频
          oldAudio.pause();
          oldAudio.volume = 1;

          // 切换活跃音频
          activeAudio = activeAudio === "a" ? "b" : "a";
        }
      }, FADE_INTERVAL);
    }

    // 监听新音频就绪
    newAudio.addEventListener("canplaythrough", function onReady() {
      newAudio.removeEventListener("canplaythrough", onReady);
      startCrossfade();
    });

    // 如果旧音频没有在播放，直接播放新的
    if (oldAudio.paused) {
      newAudio.volume = 1;
      newAudio.play().catch(function () {});
      activeAudio = activeAudio === "a" ? "b" : "a";
      return;
    }

    // 超时保护：2 秒后强制开始
    setTimeout(function () {
      if (!newReady) startCrossfade();
    }, 2000);
  }

  function getNextAudioUrl(audioDir, avoidUrl) {
    if (!AUDIO_FILE_MAP[audioDir] || AUDIO_FILE_MAP[audioDir].length === 0) {
      console.warn("未找到音频:", audioDir);
      return "";
    }

    if (!currentAudioIndex[audioDir]) currentAudioIndex[audioDir] = 0;
    var idx = currentAudioIndex[audioDir] % AUDIO_FILE_MAP[audioDir].length;
    var file = AUDIO_FILE_MAP[audioDir][idx];
    currentAudioIndex[audioDir] = idx + 1;
    var url = "audio/" + audioDir + "/" + encodeURIComponent(file);

    if (url === avoidUrl && AUDIO_FILE_MAP[audioDir].length > 1) {
      return getNextAudioUrl(audioDir, avoidUrl);
    }

    return url;
  }

  /* ===== 播放默认音频（初始、无状态、无手表时使用）===== */
  function playDefaultAudio() {
    var audioDir = "默认";
    var url = getNextAudioUrl(audioDir);
    if (!url) return;

    var activeAudioEl = getActiveAudio();

    if (isPlaying) {
      crossfadeTo(url);
    } else {
      activeAudioEl.src = url;
      activeAudioEl.load();
    }
    currentAudioDir = audioDir;
    currentAudioUrl = url;
  }

  /* ===== 情绪切换 → 使用两个 audio 元素做 3 秒交叉淡入淡出 ===== */
  function switchAudioForEmotion(emotionKey) {
    var audioDir = getAudioDirForEmotion(emotionKey);
    var url = getNextAudioUrl(audioDir, currentAudioUrl);
    if (!url) return;

    if (isPlaying) {
      crossfadeTo(url);
      currentAudioDir = audioDir;
      currentAudioUrl = url;
    } else {
      var activeAudioEl = getActiveAudio();
      activeAudioEl.src = url;
      activeAudioEl.load();
      currentAudioDir = audioDir;
      currentAudioUrl = url;
    }
  }

  /* ===== 音频 UI ===== */
  function setAudioUI(playing) {
    isPlaying = playing;
  }

  /* ================================================================
     更新情绪
     ================================================================ */
  function updateEmotion(value) {
    var emotion = EMOTION_MAP[value];
    if (!emotion) return;

    currentEmotion = value;
    emotionIcon.textContent = emotion.icon;
    if (insightIcon) insightIcon.textContent = emotion.icon;
    statusDesc.classList.add("updating");
    setTimeout(function () {
      statusDesc.textContent = emotion.desc;
      statusDesc.classList.remove("updating");
    }, 150);

    // 切换 PAG 动画（动画结束后自动切换下一个）
    switchPAGForEmotion(value);
    stopPAGSwitcher();

    // 切换音频（3 秒交叉淡入淡出）
    switchAudioForEmotion(value);

    // 根据当前场景和情绪，触发呼吸练习提示
    updateBreathingPrompt(value);
  }

  /* ================================================================
     时间段切换
     ================================================================ */
  function switchPeriod(period) {
    // 切换背景图
    switchBackground(period);
  }

  /* ===== 事件绑定 ===== */
  emotionSelect.addEventListener("change", function () {
    updateEmotion(this.value);
  });

  if (insightButton) {
    insightButton.addEventListener("click", function () {
      if (currentEmotion === "default") {
        showCenterToast("暂无有效数据");
      }
    });
  }

  document.querySelectorAll('input[name="practice-scene"]').forEach(function (input) {
    input.addEventListener("change", function () {
      updateBreathingPrompt(currentEmotion);
    });
  });

  // 监听两个 audio 元素的 ended 事件
  audioA.addEventListener("ended", function () {
    setAudioUI(false);
  });
  audioB.addEventListener("ended", function () {
    setAudioUI(false);
  });

  audioA.addEventListener("error", function () {
    console.warn("音频 A 加载失败");
  });
  audioB.addEventListener("error", function () {
    console.warn("音频 B 加载失败");
  });

  periodSelect.addEventListener("change", function () {
    switchPeriod(this.value);
    // 手动切换时段时同步更新问候语
    if (greetingText) greetingText.textContent = this.value;
  });

  // 每分钟自动同步当前时段到下拉菜单 + 更新问候语/日期
  var lastPeriod = getCurrentPeriod();
  setInterval(function () {
    var period = getCurrentPeriod();
    if (period !== lastPeriod) {
      lastPeriod = period;
      syncPeriodSelect();
      switchPeriod(period);
      updateGreeting();
    }
    updateDate();
  }, 60000);

  /* ===== 问候语 / 日期 / 天气 ===== */
  var WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

  function updateGreeting() {
    var periodLabel = getCurrentPeriod();
    if (greetingText) greetingText.textContent = periodLabel;
  }

  function updateDate() {
    if (!greetingDate) return;
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var w = WEEKDAYS[now.getDay()];
    greetingDate.textContent = y + "年" + m + "月" + d + "日 星期" + w;
  }

  function updateWeather() {
    if (!greetingWeather) return;
    // 尝试使用浏览器地理定位 + 免费天气 API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        // 使用 Open-Meteo 免费天气 API（无需 key）
        var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=weather_code,temperature_2m&timezone=auto";
        fetch(url).then(function (r) { return r.json(); }).then(function (data) {
          var code = data.current && data.current.weather_code;
          var temp = data.current && data.current.temperature_2m;
          var info = weatherCodeToInfo(code);
          var text = info.icon + " " + info.desc;
          if (typeof temp === "number") {
            text += " " + temp + "°C";
          }
          greetingWeather.textContent = text;
        }).catch(function () {
          greetingWeather.textContent = "⛅ 多云";
        });
      }, function () {
        greetingWeather.textContent = "⛅ 多云";
      }, { timeout: 5000 });
    } else {
      greetingWeather.textContent = "⛅ 多云";
    }
  }

  function weatherCodeToInfo(code) {
    if (code === 0) return { icon: "☀️", desc: "晴" };
    if (code === 1) return { icon: "🌤️", desc: "大部晴" };
    if (code <= 3) return { icon: "⛅", desc: "多云" };
    if (code <= 48) return { icon: "🌫️", desc: "雾" };
    if (code <= 57) return { icon: "🌦️", desc: "毛毛雨" };
    if (code <= 61) return { icon: "🌧️", desc: "小雨" };
    if (code <= 67) return { icon: "🌧️", desc: "雨" };
    if (code <= 71) return { icon: "🌨️", desc: "小雪" };
    if (code <= 77) return { icon: "❄️", desc: "雪" };
    if (code <= 82) return { icon: "🌧️", desc: "阵雨" };
    if (code <= 86) return { icon: "🌨️", desc: "阵雪" };
    if (code <= 99) return { icon: "⛈️", desc: "雷阵雨" };
    return { icon: "⛅", desc: "多云" };
  }

  /* ===== 初始化 ===== */
  updateEmotion(emotionSelect.value);
  initPAG();
  syncPeriodSelect();
  updateGreeting();
  updateDate();
  updateWeather();

  // 设置初始背景图
  switchBackground(getCurrentPeriod());

  // 自动播放音频
  function autoPlayAudio() {
    playDefaultAudio();
    var activeAudioEl = getActiveAudio();
    return activeAudioEl.play().then(function () {
      setAudioUI(true);
      console.log("自动播放音频成功");
      return true;
    }).catch(function (err) {
      console.warn("自动播放被阻止，等待用户交互后播放:", err.message);
      setAudioUI(false);
      return false;
    });
  }

  // 尝试自动播放
  autoPlayAudio();

  // 如果自动播放被阻止，监听第一次用户交互后播放
  document.addEventListener("click", function onFirstClick() {
    if (isPlaying) {
      document.removeEventListener("click", onFirstClick);
      return;
    }

    autoPlayAudio().then(function (played) {
      if (played) document.removeEventListener("click", onFirstClick);
    });
  });

})();
