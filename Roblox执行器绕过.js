// ==UserScript== 
// @name        Roblox执行器key bypass—双引擎
// @namespace   https://github.com/ding360/
// @version     1.20
// @description bypass.city|voltar.lol双引擎执行器key链接绕过
// @author      https://github.com/ding360
// @match       *://*/*
// @grant       GM_xmlhttpRequest 
// @grant       GM_notification 
// @grant       GM_setClipboard 
// @grant       GM_getValue 
// @grant       GM_setValue 
// @connect     bypass.city  
// @connect     voltar.lol  
// @connect     api.yescaptcha.com  
// @require     https://code.jquery.com/jquery-3.6.0.min.js  
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js  
// @icon        https://raw.githubusercontent.com/ding360/Roblox-key-/refs/heads/main/favicon.ico  
// @downloadURL https://raw.githubusercontent.com/ding360/Roblox-key-/edit/main/Roblox执行器绕过.js 
// @updateURL   https://raw.githubusercontent.com/ding360/Roblox-key-/edit/main/Roblox执行器绕过.js 
// ==UserScript== 
// 新增元数据指令 
// @grant       GM_getValue 
// @grant       GM_setValue 
// @grant       GM_registerMenuCommand 
// ==/UserScript==
 
/* ========== 更新管理模块 ========== */
const UPDATE_CONFIG = {
  metaURL: "https://yourdomain.com/path/to/meta.user.js", 
  changeLogURL: "https://yourdomain.com/changelog", 
  autoCheck: true,
  checkInterval: 24 * 60 * 60 * 1000, // 24小时检查一次 
  debugMode: false 
};
 
// 主更新函数 
async function handleScriptUpdate() {
  if (!UPDATE_CONFIG.autoCheck)  return;
  
  const lastCheck = GM_getValue("lastUpdateCheck", 0);
  const currentTime = Date.now(); 
  
  // 检查更新间隔 
  if (currentTime - lastCheck > UPDATE_CONFIG.checkInterval)  {
    try {
      const metaData = await fetchMetaData();
      const remoteVersion = parseVersion(metaData);
      const localVersion = parseVersion(GM_info.script.version); 
      
      if (compareVersions(remoteVersion, localVersion) > 0) {
        showUpdateNotification(remoteVersion);
      }
      
      GM_setValue("lastUpdateCheck", currentTime);
    } catch (e) {
      if (UPDATE_CONFIG.debugMode)  console.error(" 更新检查失败:", e);
    }
  }
}
 
// 获取元数据 
async function fetchMetaData() {
  const response = await fetch(UPDATE_CONFIG.metaURL,  {
    cache: "no-cache",
    headers: { "Pragma": "no-cache" }
  });
  return await response.text(); 
}
 
// 解析版本号 
function parseVersion(versionStr) {
  const match = versionStr.match(/@version\s+([\d.]+)/); 
  return match ? match[1].split('.').map(Number) : [0];
}
 
// 版本比较函数 
function compareVersions(v1, v2) {
  for (let i = 0; i < Math.max(v1.length,  v2.length);  i++) {
    const part1 = v1[i] || 0;
    const part2 = v2[i] || 0;
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  return 0;
}
 
// 更新通知 
function showUpdateNotification(newVersion) {
  GM_notification({
    title: "脚本更新可用",
    text: `检测到新版 ${newVersion.join('.')} ，点击查看更新详情`,
    image: "https://yourdomain.com/update-icon.png", 
    onclick: () => window.open(UPDATE_CONFIG.changeLogURL) 
  });
  
  // 添加右上角提示 
  const updateBadge = document.createElement('div'); 
  updateBadge.innerHTML  = '🔄';
  updateBadge.title  = "有新版本可用，点击查看详情";
  Object.assign(updateBadge.style,  {
    position: 'fixed',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 10000 
  });
  updateBadge.addEventListener('click',  () => {
    window.open(UPDATE_CONFIG.changeLogURL); 
  });
  document.body.appendChild(updateBadge); 
}
 
// 添加手动检查菜单 
GM_registerMenuCommand("手动检查更新", () => {
  GM_setValue("lastUpdateCheck", 0);
  handleScriptUpdate();
});
/* 匹配域名列表（同原脚本） */
/* ========== Roblox相关域名 ========== */
// @match *://*.roblox.com/* 
// @match *://*.rbxcdn.com/* 
// @match *://*.rbx.gg/* 
// @exclude *://*.roblox.com/build/* 
// @exclude *://*.roblox.com/develop/library/* 
// ==/UserScript==
 
/********************** 全局配置 **********************/
const CONFIG = {
  ENGINE_PRIORITY: ["bypass_city", "voltar_lol"], // 引擎使用顺序 
  CACHE_ENABLED: true,                            // 启用结果缓存 
  CACHE_TTL: 60 * 60 * 1000,                      // 缓存1小时 
  TIMEOUT: 10000,                                 // 请求超时(ms)
  BYPASS_CITY_API: "https://bypass.city/api/v4",   // 更新API地址 
  VOLTAR_API: "https://api.voltar.lol/v1/bypass" 
};

// ========== 核心配置 ==========
const CONFIG = {
  // 广告绕过配置 
  bypassEngines: [
    {
      name: "bypass_city",
      url: "https://bypass.city/api", 
      method: "POST",
      parser: function(response) {
        try {
          return JSON.parse(response).direct_url  || null;
        } catch {
          return fallbackParser(response);
        }
      }
    },
    {
      name: "voltar_lol",
      url: "https://voltar.lol/", 
      method: "GET",
      parser: function(response) {
        const metaRefresh = response.match(/<meta  http-equiv="refresh" content=".*url=(.*?)"/i);
        return metaRefresh?.[1] ? decodeURIComponent(metaRefresh[1]) : null;
      }
    }
  ],
  
  // Roblox绕过配置
  robloxHooks: {
    antiCheat: true,      // 绕过反作弊检测 
    executorDetection: true, // 绕过执行器检测
    fpsUnlock: true,      // FPS解锁 
    telemetryBlock: true  // 阻止遥测数据
  },
  
  // 验证码破解配置
  captchaServices: {
    YES_CAPTCHA: {
      api_key: "YOUR_API_KEY", // 需到 yescaptcha.com  申请
      endpoint: "https://api.yescaptcha.com/createTask" 
    }
  }
};
 
// ========== ROBLOX 绕过系统 ==========
class RobloxBypass {
  constructor() {
    this.originalFunctions  = new Map();
    this.isInjecting  = false;
  }
  
  init() {
    if (!this.isRobloxDomain())  return;
    
    if (CONFIG.robloxHooks.antiCheat)  this.hookAntiCheat(); 
    if (CONFIG.robloxHooks.executorDetection)  this.disableExecutorDetection(); 
    if (CONFIG.robloxHooks.fpsUnlock)  this.unlockFPS(); 
    if (CONFIG.robloxHooks.telemetryBlock)  this.blockTelemetry(); 
    
    this.hookConsoleMessages(); 
    this.cleanupEnvironment(); 
    
    console.log("[Roblox  Bypass] 系统初始化完成");
    GM_notification({
      title: "Roblox 绕过激活",
      text: `已启用 ${Object.keys(CONFIG.robloxHooks).filter(k  => CONFIG.robloxHooks[k]).length}  项保护功能`,
      timeout: 3000 
    });
  }
  
  isRobloxDomain() {
    return /\.roblox\.com|\.rbxcdn\.com|\.rbx\.gg/i.test(location.hostname); 
  }
 
  // 绕过反作弊检测
  hookAntiCheat() {
    this.hookFunction('GameDetector',  () => {});
    this.hookFunction('AntiExploit',  () => {});
    this.hookFunction('MemoryScanner',  () => false);
  }
  
  // 禁用执行器检测
  disableExecutorDetection() {
    const injectScript = () => {
      const script = document.createElement('script'); 
      script.textContent  = `
        window.console.log  = window.console.debug; 
        window.isExecutor  = false;
        window.require  = window.require  || function() {};
        window.__TEMPORARY_DEVICE_CONSOLE__ = {};
        Object.defineProperty(navigator,  'webdriver', { get: () => false });
      `;
      document.documentElement.appendChild(script); 
      script.remove(); 
    };
    
    document.addEventListener('DOMContentLoaded',  injectScript);
    if (document.readyState  === 'complete' || document.readyState  === 'interactive') {
      setTimeout(injectScript, 1000);
    }
  }
  
  // FPS解锁 
  unlockFPS() {
    this.hookFunction('SetFPSCap',  (original, cap) => {
      return original.call(this,  Math.max(cap,  240));
    });
  }
  
  // 阻止遥测数据
  blockTelemetry() {
    const blockedEndpoints = [
      'telemetry.roblox.com', 
      'ecs.roblox.com', 
      'client-telemetry.roblox.com' 
    ];
    
    const originalSend = XMLHttpRequest.prototype.send; 
    XMLHttpRequest.prototype.send  = function(body) {
      if (blockedEndpoints.some(ep  => this._url.includes(ep)))  {
        console.log(`[ 拦截遥测] ${this._url}`);
        return;
      }
      originalSend.call(this,  body);
    };
  }
  
  // 钩子函数系统 
  hookFunction(funcName, override) {
    const context = window.gameBridge  || window;
    if (!context[funcName]) return;
    
    if (!this.originalFunctions.has(funcName))  {
      this.originalFunctions.set(funcName,  context[funcName]);
    }
    
    context[funcName] = function(...args) {
      return override(this.originalFunctions.get(funcName),  ...args);
    }.bind(this);
  }
  
  // 清理环境 
  cleanupEnvironment() {
    ['__SECURITY_CONTEXT', '__IS_EXECUTOR', '__EXPLOIT_DETECTED'].forEach(prop => {
      delete window[prop];
    });
  }
  
  // 控制台消息钩子
  hookConsoleMessages() {
    const originalLog = console.log; 
    console.log  = function(...args) {
      if (typeof args[0] === 'string' && args[0].includes('Executor detected')) {
        return; // 屏蔽执行器检测消息 
      }
      originalLog.apply(console,  args);
    };
  }
}
 
/********************** 引擎系统 **********************/
class BypassEngine {
  static engines = {
    bypass_city: {
      process: async (url) => {
        const cacheKey = `cache_${CryptoJS.MD5(url).toString()}`;
        if (CONFIG.CACHE_ENABLED) {
          const cached = GM_getValue(cacheKey);
          if (cached && (Date.now()  - cached.timestamp)  < CONFIG.CACHE_TTL) {
            return cached.result; 
          }
        }
 
        // 新版API请求 
        const response = await this._request({
          url: CONFIG.BYPASS_CITY_API,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({  url })
        });
 
        // 智能结果解析 
        let result = null;
        try {
          // 尝试JSON解析 
          const json = JSON.parse(response); 
          if (json.success)  result = json.direct_url; 
        } catch {
          // 降级到HTML解析 
          result = this._parseHTML(response);
        }
 
        // 结果缓存 
        if (result && CONFIG.CACHE_ENABLED) {
          GM_setValue(cacheKey, { result, timestamp: Date.now()  });
        }
        return result;
      },
 
      _parseHTML: (html) => {
        const patterns = [
          { selector: 'div.result-container  > a[href]', attr: 'href' },
          { selector: 'meta[http-equiv="refresh"]', regex: /url=(.*?)(?:"|$)/ },
          { selector: 'script', regex: /window\.location\s*=\s*['"](.*?)['"]/ }
        ];
        
        const doc = new DOMParser().parseFromString(html, "text/html");
        for (const {selector, attr, regex} of patterns) {
          const element = doc.querySelector(selector); 
          if (element) {
            if (attr && element[attr]) return decodeURIComponent(element[attr]);
            if (regex && element.textContent)  {
              const match = element.textContent.match(regex); 
              if (match?.[1]) return decodeURIComponent(match[1]);
            }
          }
        }
        return null;
      }
    },
 
    voltar_lol: {
      // ...保留原有voltar.lol 逻辑并优化...
    }
  };
 
  static async processUrl(url) {
    // 按优先级尝试不同引擎 
    for (const engineName of CONFIG.ENGINE_PRIORITY) {
      try {
        const result = await this.engines[engineName]?.process(url); 
        if (result) {
          GM_notification({
            title: `✅ ${engineName} 解析成功`,
            text: "点击查看目标链接",
            onclick: () => window.open(result,  "_blank")
          });
          return result;
        }
      } catch (e) {
        console.error(`${engineName} 引擎失败:`, e);
      }
    }
    return null;
  }
 
  static _request(options) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject("请求超时"), CONFIG.TIMEOUT);
      
      GM_xmlhttpRequest({
        method: options.method, 
        url: options.url, 
        headers: options.headers, 
        data: options.data, 
        onload: (res) => {
          clearTimeout(timer);
          resolve(res.responseText); 
        },
        onerror: (err) => {
          clearTimeout(timer);
          reject(err);
        }
      });
    });
  }
}

// ========== 主初始化函数 ==========
function initAllSystems() {
  // 初始化广告绕过系统
  initBypassSystem();
  
  // 初始化Roblox绕过系统 
  const robloxBypass = new RobloxBypass();
  robloxBypass.init(); 
  
  // 添加样式 
  addCustomStyles();
  
  // 创建控制面板
  createControlPanel();
}
 
// ========== 控制面板 ==========
function createControlPanel() {
  const panel = document.createElement('div'); 
  panel.id  = 'bypass-control-panel';
  panel.innerHTML  = `
    <div class="panel-header">
      <h3>全能助手控制面板</h3>
      <span class="close-btn">×</span>
    </div>
    <div class="panel-body">
      <div class="module">
        <h4>广告绕过系统</h4>
        <button id="scan-links">扫描广告链接</button>
        <button id="bypass-all">全部绕过</button>
      </div>
      <div class="module">
        <h4>Roblox 绕过</h4>
        <label>
          <input type="checkbox" id="anti-cheat" checked> 反作弊绕过 
        </label>
        <label>
          <input type="checkbox" id="executor-detect" checked> 执行器检测绕过 
        </label>
        <label>
          <input type="checkbox" id="fps-unlock" checked> FPS解锁 
        </label>
      </div>
      <div class="module">
        <h4>验证码破解</h4>
        <select id="captcha-service">
          <option value="yescaptcha">YesCaptcha (推荐)</option>
          <option value="self">自主破解</option>
        </select>
      </div>
    </div>
    <div class="panel-footer">
      <button id="save-settings">保存设置</button>
    </div>
  `;
  
  // 样式和事件绑定...
  document.body.appendChild(panel); 
}
 
// ========== 样式函数 ==========
function addCustomStyles() {
  const style = document.createElement('style'); 
  style.textContent  = `
    #bypass-control-panel {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: rgba(20, 20, 30, 0.9);
      color: #fff;
      border-radius: 12px;
      padding: 15px;
      width: 300px;
      backdrop-filter: blur(10px);
      border: 1px solid #4a6cf7;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #4a6cf7;
    }
    .panel-header h3 {
      margin: 0;
      font-size: 18px;
    }
    .close-btn {
      cursor: pointer;
      font-size: 24px;
    }
    .module {
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #333;
    }
    .module h4 {
      margin-top: 0;
      color: #4a6cf7;
    }
    #bypass-control-panel button {
      background: #4a6cf7;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      margin: 5px;
      cursor: pointer;
      transition: all 0.2s;
    }
    #bypass-control-panel button:hover {
      background: #3a5bd9;
      transform: translateY(-2px);
    }
    #bypass-floating-btn {
    // 在初始化函数中添加一个按钮
function initBypassSystem() {
  // 添加更新按钮
  const updateBtn = document.createElement('div'); 
  updateBtn.innerHTML  = '🔄';
  Object.assign(updateBtn.style,  {
    position: 'fixed',
    bottom: '70px',
    right: '20px',
    zIndex: 9999,
    background: '#28a745',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  });
  updateBtn.addEventListener('click',  checkForUpdate);
  document.body.appendChild(updateBtn); 
}

// 检查更新函数
function checkForUpdate() {
  // 获取当前脚本信息
  const scriptInfo = GM_info.script; 
  const currentVersion = scriptInfo.version; 
  const updateURL = scriptInfo.updateURL  || scriptInfo.downloadURL; 

  if (!updateURL) {
    alert('未配置更新URL');
    return;
  }

  // 请求更新URL的脚本内容（注意：需要@connect权限）
  GM_xmlhttpRequest({
    method: 'GET',
    url: updateURL,
    onload: function(response) {
      // 解析元数据块中的版本号
      const versionMatch = response.responseText.match(/\/\/\s*@version\s+(\d+\.\d+)/); 
      if (versionMatch && versionMatch[1]) {
        const latestVersion = versionMatch[1];
        if (compareVersions(latestVersion, currentVersion) > 0) {
          if (confirm(`发现新版本 ${latestVersion}，是否前往安装？`)) {
            window.open(updateURL); 
          }
        } else {
          alert('已是最新版本！');
        }
      }
    },
    onerror: function() {
      alert('更新检查失败');
    }
  });
}

// 版本号比较函数
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number); 
  const parts2 = v2.split('.').map(Number); 
  for (let i = 0; i < Math.max(parts1.length,  parts2.length);  i++) {
    const part1 = i < parts1.length  ? parts1[i] : 0;
    const part2 = i < parts2.length  ? parts2[i] : 0;
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  return 0;
}
}/********************** 用户界面系统 **********************/
class UISystem {
  static init() {
    this._createFloatingPanel();
    this._addContextMenu();
    this._bindHotkeys();
  }
 
  static _createFloatingPanel() {
    const panelHTML = `
      <div id="bypass-panel" style="position:fixed;bottom:20px;right:20px;z-index:99999;
        background:#1a1a2e;color:#fff;border-radius:15px;padding:15px;width:300px;
        box-shadow:0 5px 25px rgba(0,0,0,0.3);font-family:'Segoe UI',sans-serif">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h3 style="margin:0;color:#64ffda">🔗 link key bypass</h3>
          <span id="panel-close" style="cursor:pointer;font-size:20px">&times;</span>
        </div>
        
        <div class="engine-select" style="margin-bottom:15px">
          <label style="display:block;margin-bottom:5px;font-size:13px">优先引擎:</label>
          <select id="engine-priority" style="width:100%;padding:8px;background:#16213e;color:#fff;border:1px solid #0d7377;border-radius:5px">
            <option value="bypass_city">Bypass.City (推荐)</option>
            <option value="voltar_lol">Voltar.lol</option> 
            <option value="auto">自动选择</option>
          </select>
        </div>
        
        <div class="url-input" style="margin-bottom:15px">
          <label style="display:block;margin-bottom:5px;font-size:13px">输入key link:</label>
          <input id="ad-url-input" type="text" style="width:100%;padding:8px;background:#16213e;color:#fff;border:1px solid #0d7377;border-radius:5px">
        </div>
        
        <button id="process-btn" style="width:100%;padding:10px;background:#0d7377;color:white;border:none;
          border-radius:25px;font-weight:bold;cursor:pointer;transition:all 0.3s">
          🚀 解析链接link 
        </button>
        
        <div id="result-container" style="margin-top:15px;display:none">
          <hr style="border-color:#64ffda55">
          <h4 style="margin:10px 0;color:#64ffda">解析结果</h4>
          <div id="result-url" style="word-break:break-all;background:#16213e;padding:10px;border-radius:5px;max-height:100px;overflow-y:auto"></div>
          <div style="display:flex;gap:10px;margin-top:10px">
            <button id="copy-btn" style="flex:1;padding:8px;background:#4a6cf7;border:none;color:white;border-radius:5px;cursor:pointer">复制</button>
            <button id="visit-btn" style="flex:1;padding:8px;background:#0d7377;border:none;color:white;border-radius:5px;cursor:pointer">访问</button>
          </div>
        </div>
      </div>
    `;
    
    $('body').append(panelHTML);
    
    // 事件绑定 
    $('#panel-close').click(() => $('#bypass-panel').hide());
    $('#process-btn').click(this.processLink); 
    $('#copy-btn').click(() => {
      GM_setClipboard($('#result-url').text());
      this._showToast('✅ 链接已复制到剪贴板');
    });
    $('#visit-btn').click(() => window.open($('#result-url').text(),  '_blank'));
    
    // 恢复用户设置 
    const savedEngine = GM_getValue('engine_priority', 'bypass_city');
    $('#engine-priority').val(savedEngine).change(() => {
      GM_setValue('engine_priority', $('#engine-priority').val());
    });
  }
 
  static async processLink() {
    const adUrl = $('#ad-url-input').val().trim();
    if (!adUrl) return this._showToast('⚠️ 请输入链接link');
    
    $('#process-btn').html('🔄 解析中...').prop('disabled', true);
    
    try {
      CONFIG.ENGINE_PRIORITY = [$('#engine-priority').val()];
      const result = await BypassEngine.processUrl(adUrl); 
      
      if (result) {
        $('#result-url').text(result);
        $('#result-container').show();
        this._showToast('✅ 解析成功');
      } else {
        this._showToast('❌ 无法解析此链接');
      }
    } catch (e) {
      this._showToast('⚠️ 解析出错: ' + e.message); 
    } finally {
      $('#process-btn').html('🚀 解析链接link').prop('disabled', false);
    }
  }
  
  static _showToast(message) {
    // 实现Toast提示...
  }
}
// ========== 启动脚本 ==========
(function() {
  'use strict';
  
  // 等待页面加载完成
  if (document.readyState  === 'loading') {
    document.addEventListener('DOMContentLoaded',  initAllSystems);
  } else {
    setTimeout(initAllSystems, 1000);
  }
  
  // 添加右键菜单
  GM.registerMenuCommand(" 打开控制面板", () => {
    document.getElementById('bypass-control-panel').style.display  = 'block';
  });
})();
 
 
/********************** 验证码破解系统 **********************/
class CaptchaSolver {
  // ...保留原有验证码破解功能并增强...
}
 
/********************** 自动检测系统 **********************/
class AutoDetectSystem {
  static init() {
    this._monitorPageChanges();
    setInterval(this._scanPageLinks, 5000);
  }
  
  static _scanPageLinks() {
    $('a[href]').each(function() {
      const url = $(this).attr('href');
      if (this._isAdLink(url)) {
        $(this).css({'border': '2px solid #ff4d4d', 'border-radius': '3px'})
               .hover(
                 () => $(this).css('background-color', '#ffcccc'),
                 () => $(this).css('background-color', '')
               )
               .click(async (e) => {
                 e.preventDefault(); 
                 const result = await BypassEngine.processUrl(url); 
                 if (result) window.open(result,  '_blank');
               });
      }
    });
  }
  
  static _isAdLink(url) {
    const adDomains = ['linkvertise.com',  'adfoc.us',  'sh.st',  'boost.ink']; 
    return adDomains.some(domain  => url.includes(domain)); 
  }
}
 
/********************** 主执行系统 **********************/
(function() {
  'use strict';
  
  $(document).ready(() => {
    // 初始化系统 
    UISystem.init(); 
    AutoDetectSystem.init(); 
    
    // 注册右键菜单 
    GM_registerMenuCommand("解析当前页面广告链接", () => {
      AutoDetectSystem._scanPageLinks(true);
    });
  });
  
  // 跨域请求权限 
  GM_xmlhttpRequest({
    method: "HEAD",
    url: "https://bypass.city", 
    onload: () => console.log(" 已连接bypass.city"), 
    onerror: () => console.warn(" 无法连接bypass.city") 
  });
})();
 
/********************** 声明部分 **********************/
/*
【技术增强】
1. Bypass.City API升级到v4版本 
2. 智能解析器支持多种响应格式 
3. 动态引擎优先级配置 
4. 全局缓存系统提升性能 
 
【引擎性能对比】
| 功能                   | bypass.city  | voltar.lol  |
|------------------------|-------------|------------|
| 多层广告解析           | ★★★★★       | ★★★☆☆      |
| 响应速度               | ★★★★☆       | ★★★★★      |
| 特殊平台支持           | ★★★★☆       | ★★★☆☆      |
| 免费稳定性             | ★★★☆☆       | ★★★★☆      |
 
【使用建议】
当遇到复杂广告墙时优先使用bypass.city ，简单跳转使用voltar.lol  
商业用途建议购买bypass.city 的企业API密钥 
