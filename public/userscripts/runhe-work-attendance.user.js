// ==UserScript==
// @name         润和-补录考勤任务面板
// @namespace    https://tampermonkey.net/
// @version      0.1.0
// @description  在补录考勤页提供任务导入与自动录入面板（Excel + 队列执行）。
// @author       lumirelle
// @match        http://pom.hoperun.com:8187/attp/www/index.html*
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const HASH_PREFIX = '#/manager/makeup';
  const STORAGE_KEY_TASKS = 'runhe_makeup_attendance_tasks_v1';

  const SEL = {
    jobQueryInput:
      'body > div.ng-scope > div > div.row.manager-body > div.col-sm-9.col-md-10.manager-right > div > div > section > div > div > div.tab-pane.ng-scope.active > div:nth-child(1) > div > div:nth-child(2) > div.col-md-3.col-md-offset-8 > input',
    queryButton:
      'body > div.ng-scope > div > div.row.manager-body > div.col-sm-9.col-md-10.manager-right > div > div > section > div > div > div.tab-pane.ng-scope.active > div:nth-child(1) > div > div:nth-child(2) > div.col-md-1.pull-all > button',
    modalConfirm:
      'body > div.modal.fade.ng-isolate-scope.in > div > div > div.modal-footer.ng-scope > button.btn.btn-primary',
    locationInput:
      'body > div.ng-scope > div > div.row.manager-body > div.col-sm-9.col-md-10.manager-right > div > div > section > div > div > div.tab-pane.ng-scope.active > div:nth-child(1) > div > div:nth-child(4) > div:nth-child(1) > div > input',
    startDateInput:
      'body > div.ng-scope > div > div.row.manager-body > div.col-sm-9.col-md-10.manager-right > div > div > section > div > div > div.tab-pane.ng-scope.active > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > div > div > input',
    endDateInput:
      'body > div.ng-scope > div > div.row.manager-body > div.col-sm-9.col-md-10.manager-right > div > div > section > div > div > div.tab-pane.ng-scope.active > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div > div > input',
    endHourInput:
      'body > div.ng-scope > div > div.row.manager-body > div.col-sm-9.col-md-10.manager-right > div > div > section > div > div > div.tab-pane.ng-scope.active > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > table > tbody > tr:nth-child(2) > td.form-group.uib-time.hours > input',
    submitMakeupButton:
      'body > div.ng-scope > div > div.row.manager-body > div.col-sm-9.col-md-10.manager-right > div > div > section > div > div > div.tab-pane.ng-scope.active > div:nth-child(2) > div > div.row.makeup-row.makeup-button-row > div > div:nth-child(1) > button',
  };

  const STATUS = {
    PENDING: 0,
    DONE: 1,
  };

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }
  function randomDelay(minMs, maxMs) {
    return sleep(Math.round(randomBetween(minMs, maxMs)));
  }

  function toast(msg, type = 'info') {
    const root = getToastRoot();
    const el = document.createElement('div');
    el.className = `rwm-toast rwm-toast--${type}`;
    el.textContent = String(msg);
    root.appendChild(el);
    window.setTimeout(() => {
      el.classList.add('rwm-toast--out');
      window.setTimeout(() => el.remove(), 300);
    }, 4200);
  }

  let toastRootEl = null;
  function getToastRoot() {
    if (toastRootEl && document.body.contains(toastRootEl)) return toastRootEl;
    toastRootEl = document.createElement('div');
    toastRootEl.className = 'rwm-toast-root';
    document.body.appendChild(toastRootEl);
    return toastRootEl;
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TASKS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((t) => t && typeof t.jobNo === 'string')
        .map((t) => ({
          jobNo: String(t.jobNo).trim(),
          attendanceDate: String(t.attendanceDate || '').trim(),
          status: Number(t.status) === STATUS.DONE ? STATUS.DONE : STATUS.PENDING,
        }));
    } catch {
      return [];
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }

  function setNativeInputValue(el, value) {
    if (!el) return;
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && desc.set) desc.set.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function controlValueMatches(el, target) {
    if (!el) return false;
    const cur = String(el.value ?? '').trim();
    const want = String(target ?? '').trim();
    return cur === want;
  }

  /** @returns {boolean} 是否已写入（false 表示与目标值相同已跳过） */
  function setNativeInputValueIfChanged(el, value) {
    if (!el) return false;
    if (controlValueMatches(el, value)) return false;
    setNativeInputValue(el, value);
    return true;
  }

  function clickEl(el) {
    if (!el) throw new Error('无法点击：元素不存在');
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
    el.click();
  }

  async function waitForSelector(selector, options = {}) {
    const timeoutMs = options.timeoutMs ?? 30000;
    const intervalMs = options.intervalMs ?? 250;
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (typeof options.onTick === 'function') {
        await options.onTick();
      }
      const el = document.querySelector(selector);
      if (el) return el;
      await sleep(intervalMs);
    }
    throw new Error(`等待元素超时：${selector}`);
  }

  function colLetterToIndex0(letters) {
    const s = String(letters || '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z]/g, '');
    if (!s) return null;
    let n = 0;
    for (let i = 0; i < s.length; i++) {
      n = n * 26 + (s.charCodeAt(i) - 64);
    }
    return n - 1;
  }

  function parseColumnSpecifier(text) {
    const s = String(text ?? '').trim();
    if (!s) return null;
    if (/^\d+$/.test(s)) return Number(s) - 1;
    const idx = colLetterToIndex0(s);
    if (idx !== null && idx >= 0) return idx;
    return null;
  }

  function normalizeHeaderCell(v) {
    return String(v ?? '')
      .replace(/\s+/g, '')
      .trim();
  }

  function findHeaderIndex(headers, wantedName) {
    const wanted = normalizeHeaderCell(wantedName);
    if (!wanted) return -1;
    for (let i = 0; i < headers.length; i++) {
      if (normalizeHeaderCell(headers[i]) === wanted) return i;
    }
    return -1;
  }

  function formatDateForForm(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function parseAttendanceDate(cell) {
    if (cell == null) return null;
    if (cell instanceof Date && !Number.isNaN(cell.getTime())) return formatDateForForm(cell);
    const s = String(cell).trim();
    if (!s) return null;
    const num = Number(s);
    if (Number.isFinite(num) && num > 20000 && num < 80000) {
      const epoch = new Date(Date.UTC(1899, 11, 30));
      const d = new Date(epoch.getTime() + num * 86400000);
      if (!Number.isNaN(d.getTime())) return formatDateForForm(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    }
    const m = s.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]);
      const da = Number(m[3]);
      const d = new Date(y, mo - 1, da);
      if (!Number.isNaN(d.getTime())) return formatDateForForm(d);
    }
    return s;
  }

  function readWorkbookToTasks(file, cfg) {
    const XLSX = globalThis.XLSX;
    if (!XLSX || typeof XLSX.read !== 'function') {
      throw new Error('Excel 解析库未加载，请检查网络或脚本 @require');
    }
    if (typeof file.arrayBuffer !== 'function') {
      return Promise.reject(new Error('文件对象不支持 arrayBuffer'));
    }

    return file.arrayBuffer().then((ab) => {
      const wb = XLSX.read(ab, { type: 'array' });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) throw new Error('Excel 中没有工作表');
      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: '' });
      if (!rows.length) throw new Error('Excel 表为空');

      const headerRow = rows[0].map((c) => String(c ?? '').trim());
      const jobName = String(cfg.jobColName || '').trim();
      const attName = String(cfg.attColName || '').trim();
      const jobColSpec = String(cfg.jobColSpec || '').trim();
      const attColSpec = String(cfg.attColSpec || '').trim();
      const attemptedHeader = Boolean(jobName) || Boolean(attName);

      let jobIdx = jobName ? findHeaderIndex(headerRow, jobName) : -1;
      if (jobIdx < 0 && jobColSpec) {
        const p = parseColumnSpecifier(jobColSpec);
        if (p === null) throw new Error(`工号列号“${jobColSpec}”无效（请填数字列号或列字母，如 1 或 A）`);
        jobIdx = p;
      }
      if (jobIdx < 0) {
        if (jobName) {
          if (!jobColSpec) {
            throw new Error(`工号列名“${jobName}”不存在且未配置列号`);
          }
          throw new Error(`工号列名“${jobName}”不存在，且列号“${jobColSpec}”未解析到有效列`);
        }
        if (!jobColSpec) {
          throw new Error('未配置工号列名且未配置列号');
        }
        throw new Error('工号列未能确定（请检查列名或列号）');
      }

      let attIdx = attName ? findHeaderIndex(headerRow, attName) : -1;
      if (attIdx < 0 && attColSpec) {
        const p = parseColumnSpecifier(attColSpec);
        if (p === null) throw new Error(`考勤列号“${attColSpec}”无效（请填数字列号或列字母，如 2 或 B）`);
        attIdx = p;
      }
      if (attIdx < 0) {
        if (attName) {
          if (!attColSpec) {
            throw new Error(`考勤列名“${attName}”不存在且未配置列号`);
          }
          throw new Error(`考勤列名“${attName}”不存在，且列号“${attColSpec}”未解析到有效列`);
        }
        if (!attColSpec) {
          throw new Error('未配置考勤列名且未配置列号');
        }
        throw new Error('考勤列未能确定（请检查列名或列号）');
      }

      const dataStart = attemptedHeader ? 1 : 0;
      const tasks = [];
      for (let r = dataStart; r < rows.length; r++) {
        const row = rows[r] || [];
        const jobNo = String(row[jobIdx] ?? '').trim();
        const rawAtt = row[attIdx];
        const attendanceDate = parseAttendanceDate(rawAtt);
        if (!jobNo && !attendanceDate) continue;
        if (!jobNo) {
          throw new Error(`第 ${r + 1} 行：工号为空`);
        }
        if (!attendanceDate) {
          throw new Error(`第 ${r + 1} 行：考勤日期无法解析`);
        }
        tasks.push({
          jobNo,
          attendanceDate,
          status: STATUS.PENDING,
        });
      }
      if (!tasks.length) throw new Error('未从 Excel 中解析到任何有效任务行');
      return tasks;
    });
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .rwm-root{position:fixed;right:16px;bottom:16px;z-index:2147483000;width:360px;max-width:calc(100vw - 32px);
        font:13px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;
        color:#111;background:#fff;border:1px solid #d0d7de;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.18);
        display:flex;flex-direction:column;overflow:hidden}
      .rwm-header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #eee;background:#f6f8fa}
      .rwm-title{font-weight:700}
      .rwm-body{padding:10px 12px;gap:10px;display:flex;flex-direction:column;max-height:70vh;overflow:auto}
      .rwm-drop{border:1px dashed #94a3b8;border-radius:8px;padding:10px;background:#f8fafc;color:#334155}
      .rwm-drop--active{border-color:#2563eb;background:#eff6ff}
      .rwm-row{display:flex;flex-direction:column;gap:4px}
      .rwm-label{font-size:12px;color:#475569}
      .rwm-input,.rwm-file{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:8px;padding:7px 8px;background:#fff}
      .rwm-grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .rwm-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .rwm-btn{border:0;border-radius:8px;padding:8px 10px;font-weight:700;cursor:pointer;color:#fff}
      .rwm-btn:disabled{opacity:.45;cursor:not-allowed}
      .rwm-btn--blue{background:#2563eb}
      .rwm-btn--green{background:#16a34a}
      .rwm-btn--red{background:#dc2626}
      .rwm-btn--yellow{background:#ca8a04;color:#111}
      .rwm-switch{display:flex;align-items:center;gap:8px;justify-content:space-between;padding:8px;border:1px solid #e2e8f0;border-radius:8px;background:#fff}
      .rwm-list{border:1px solid #e2e8f0;border-radius:8px;overflow:hidden}
      .rwm-list-h{padding:8px 10px;background:#f1f5f9;font-weight:700;border-bottom:1px solid #e2e8f0}
      .rwm-list-b{max-height:180px;overflow:auto}
      .rwm-task{display:flex;gap:8px;align-items:flex-start;padding:8px 10px;border-bottom:1px solid #f1f5f9}
      .rwm-task:last-child{border-bottom:0}
      .rwm-badge{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:2px 8px;font-size:12px;font-weight:700;border:1px solid transparent;white-space:nowrap}
      .rwm-badge--0{background:#f1f5f9;color:#334155;border-color:#cbd5e1}
      .rwm-badge--1{background:#dcfce7;color:#14532d;border-color:#86efac}
      .rwm-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:12px;word-break:break-all}
      .rwm-toast-root{position:fixed;left:16px;bottom:16px;z-index:2147483646;display:flex;flex-direction:column;gap:8px;max-width:min(520px,calc(100vw - 32px))}
      .rwm-toast{padding:10px 12px;border-radius:10px;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.18);transform:translateY(0);opacity:1;transition:opacity .25s ease,transform .25s ease}
      .rwm-toast--out{opacity:0;transform:translateY(6px)}
      .rwm-toast--info{background:#0f172a}
      .rwm-toast--ok{background:#15803d}
      .rwm-toast--err{background:#b91c1c}
      .rwm-hint{font-size:12px;color:#64748b}
    `;
    document.head.appendChild(style);
  }

  function mount() {
    injectStyles();

    const root = document.createElement('div');
    root.className = 'rwm-root';
    root.innerHTML = `
      <div class="rwm-header">
        <div class="rwm-title">补录考勤任务</div>
      </div>
      <div class="rwm-body">
        <div class="rwm-list">
          <div class="rwm-list-h">当前任务列表</div>
          <div class="rwm-list-b" id="rwmTaskList"></div>
        </div>

        <div class="rwm-drop" id="rwmDrop" tabindex="0">
          <div><b>原始数据（Excel）</b> <span class="rwm-hint">（必填，支持拖入）</span></div>
          <div class="rwm-hint" id="rwmFileName">未选择文件</div>
          <input class="rwm-file" id="rwmFile" type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" />
        </div>

        <div class="rwm-grid2">
          <div class="rwm-row">
            <div class="rwm-label">工号列名（可选）</div>
            <input class="rwm-input" id="rwmJobName" type="text" value="工号" placeholder="默认：工号" />
          </div>
          <div class="rwm-row">
            <div class="rwm-label">工号列号（可选）</div>
            <input class="rwm-input" id="rwmJobCol" type="text" placeholder="如 1 或 A" />
          </div>
          <div class="rwm-row">
            <div class="rwm-label">考勤列名（可选）</div>
            <input class="rwm-input" id="rwmAttName" type="text" value="考勤日期" placeholder="默认：考勤日期" />
          </div>
          <div class="rwm-row">
            <div class="rwm-label">考勤列号（可选）</div>
            <input class="rwm-input" id="rwmAttCol" type="text" placeholder="如 2 或 B" />
          </div>
        </div>

        <div class="rwm-switch">
          <div>
            <div style="font-weight:700">调试模式</div>
            <div class="rwm-hint">开启后每次运行只处理 1 个任务</div>
          </div>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none">
            <input id="rwmDebug" type="checkbox" />
            <span>开启</span>
          </label>
        </div>

        <div class="rwm-actions">
          <button class="rwm-btn rwm-btn--blue" id="rwmCreate" type="button">创建任务</button>
          <button class="rwm-btn rwm-btn--green" id="rwmStart" type="button">开始操作</button>
          <button class="rwm-btn rwm-btn--red" id="rwmStop" type="button" disabled>停止操作</button>
          <button class="rwm-btn rwm-btn--yellow" id="rwmPause" type="button" disabled>暂停操作</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    const elFile = root.querySelector('#rwmFile');
    const elFileName = root.querySelector('#rwmFileName');
    const elDrop = root.querySelector('#rwmDrop');
    const elJobName = root.querySelector('#rwmJobName');
    const elJobCol = root.querySelector('#rwmJobCol');
    const elAttName = root.querySelector('#rwmAttName');
    const elAttCol = root.querySelector('#rwmAttCol');
    const elDebug = root.querySelector('#rwmDebug');
    const elCreate = root.querySelector('#rwmCreate');
    const elStart = root.querySelector('#rwmStart');
    const elStop = root.querySelector('#rwmStop');
    const elPause = root.querySelector('#rwmPause');
    const elTaskList = root.querySelector('#rwmTaskList');

    let tasks = loadTasks();
    let selectedFile = null;

    let operating = false;
    let paused = false;
    let stopRequested = false;
    let creating = false;

    const RWM_STOP = Object.assign(new Error('已停止'), { code: 'RWM_STOP' });
    async function yieldIfPausedOrStopped() {
      while (paused && !stopRequested) {
        saveTasks(tasks);
        await sleep(200);
      }
      if (stopRequested) throw RWM_STOP;
    }

    async function opDelay() {
      await randomDelay(1000, 2000);
      await yieldIfPausedOrStopped();
    }

    function valuesMatchForSet(mode, current, target) {
      const a = String(current ?? '').trim();
      const b = String(target ?? '').trim();
      if (mode === 'strict') return a === b;
      if (mode === 'date') return a.replace(/\//g, '-') === b.replace(/\//g, '-');
      if (mode === 'numeric') {
        const na = Number.parseInt(a, 10);
        const nb = Number.parseInt(b, 10);
        return !Number.isNaN(na) && !Number.isNaN(nb) && na === nb;
      }
      return a === b;
    }

    async function setNativeIfNeeded(el, value, mode = 'strict') {
      if (!el) return;
      if (valuesMatchForSet(mode, el.value, value)) return;
      setNativeInputValue(el, value);
      await opDelay();
    }

    function setAllButtonsDisabled(disabled) {
      elCreate.disabled = disabled;
      elStart.disabled = disabled;
      elStop.disabled = disabled;
      elPause.disabled = disabled;
    }

    function refreshButtons() {
      if (creating) {
        setAllButtonsDisabled(true);
        return;
      }
      const hasTasks = tasks.length > 0;
      const idle = !operating;
      elCreate.disabled = operating;
      elStart.disabled = idle ? !hasTasks : true;
      elStop.disabled = idle;
      elPause.disabled = idle;
      if (!idle) {
        elPause.textContent = paused ? '恢复操作' : '暂停操作';
      } else {
        elPause.textContent = '暂停操作';
      }
      elDebug.disabled = !idle;
    }

    function statusUi(task) {
      if (task.status === STATUS.DONE) {
        return { cls: 'rwm-badge--1', icon: '✓', text: '已处理' };
      }
      return { cls: 'rwm-badge--0', icon: '○', text: '未处理' };
    }

    function renderTasks() {
      if (!tasks.length) {
        elTaskList.innerHTML = `<div class="rwm-task"><div class="rwm-hint">暂无任务。请上传 Excel 并点击「创建任务」。</div></div>`;
        refreshButtons();
        return;
      }
      elTaskList.innerHTML = tasks
        .map((t, idx) => {
          const u = statusUi(t);
          return `
            <div class="rwm-task">
              <div style="min-width:34px;color:#64748b;font-weight:700">${idx + 1}</div>
              <div style="flex:1;display:flex;flex-direction:column;gap:4px">
                <div><span class="rwm-mono">${escapeHtml(t.jobNo)}</span> <span class="rwm-hint">｜</span> <span class="rwm-mono">${escapeHtml(
            t.attendanceDate,
          )}</span></div>
                <div><span class="rwm-badge ${u.cls}"><span aria-hidden="true">${u.icon}</span>${escapeHtml(u.text)}</span></div>
              </div>
            </div>`;
        })
        .join('');
      refreshButtons();
    }

    function escapeHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function bindFile(file) {
      if (!file) return;
      const name = String(file.name || '');
      const lower = name.toLowerCase();
      if (!lower.endsWith('.xlsx') && !lower.endsWith('.xls')) {
        toast('仅支持 .xlsx / .xls 文件', 'err');
        return;
      }
      selectedFile = file;
      elFileName.textContent = name || '已选择文件';
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        elFile.files = dt.files;
      } catch {
        // ignore if browser blocks assigning files
      }
      refreshButtons();
    }

    elFile.addEventListener('change', () => {
      const f = elFile.files && elFile.files[0];
      bindFile(f);
    });

    ;['dragenter', 'dragover'].forEach((evt) => {
      elDrop.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        elDrop.classList.add('rwm-drop--active');
      });
    });
    ;['dragleave', 'drop'].forEach((evt) => {
      elDrop.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (evt !== 'drop') elDrop.classList.remove('rwm-drop--active');
      });
    });
    elDrop.addEventListener('drop', (e) => {
      elDrop.classList.remove('rwm-drop--active');
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      bindFile(f);
    });

    elCreate.addEventListener('click', async () => {
      if (creating || operating) return;
      if (!selectedFile) {
        toast('请先上传原始数据 Excel（必填）', 'err');
        return;
      }
      creating = true;
      setAllButtonsDisabled(true);
      try {
        const cfg = {
          jobColName: elJobName.value,
          jobColSpec: elJobCol.value,
          attColName: elAttName.value,
          attColSpec: elAttCol.value,
        };
        const next = await readWorkbookToTasks(selectedFile, cfg);
        tasks = next;
        saveTasks(tasks);
        toast(`已创建 ${tasks.length} 条任务`, 'ok');
        renderTasks();
      } catch (e) {
        toast(e && e.message ? e.message : String(e), 'err');
        renderTasks();
      } finally {
        creating = false;
        refreshButtons();
      }
    });

    async function runOneTask(task) {
      await yieldIfPausedOrStopped();
      await opDelay();
      const jobInput = document.querySelector(SEL.jobQueryInput);
      if (!jobInput) throw new Error('未找到工号查询输入框');
      await setNativeIfNeeded(jobInput, task.jobNo, 'strict');

      const qBtn = document.querySelector(SEL.queryButton);
      if (!qBtn) throw new Error('未找到查询按钮');
      clickEl(qBtn);
      await opDelay();

      const okBtn = await waitForSelector(SEL.modalConfirm, { timeoutMs: 30000, onTick: yieldIfPausedOrStopped });
      clickEl(okBtn);
      await opDelay();

      const loc = document.querySelector(SEL.locationInput);
      if (!loc) throw new Error('未找到出勤地点输入框');
      await setNativeIfNeeded(loc, '北京市', 'strict');

      const startEl = document.querySelector(SEL.startDateInput);
      const endEl = document.querySelector(SEL.endDateInput);
      if (!startEl || !endEl) throw new Error('未找到开始/结束日期输入框（页面结构可能已变化）');
      await setNativeIfNeeded(startEl, task.attendanceDate, 'date');
      await setNativeIfNeeded(endEl, task.attendanceDate, 'date');

      const hourEl = document.querySelector(SEL.endHourInput);
      if (!hourEl) throw new Error('未找到结束时间小时输入框');
      await setNativeIfNeeded(hourEl, '18', 'numeric');

      const submitBtn = document.querySelector(SEL.submitMakeupButton);
      if (!submitBtn) throw new Error('未找到录入考勤按钮');
      clickEl(submitBtn);
      await opDelay();
    }

    async function processLoop() {
      operating = true;
      paused = false;
      stopRequested = false;
      refreshButtons();

      try {
        for (let i = 0; i < tasks.length; i++) {
          await yieldIfPausedOrStopped();

          const t = tasks[i];
          if (t.status === STATUS.DONE) continue;

          try {
            await runOneTask(t);
            t.status = STATUS.DONE;
            saveTasks(tasks);
            renderTasks();
          } catch (e) {
            if (e && e.code === 'RWM_STOP') {
              break;
            }
            toast(`任务 ${i + 1}（工号 ${t.jobNo}）失败：${e && e.message ? e.message : e}`, 'err');
            saveTasks(tasks);
            renderTasks();
            break;
          }

          if (elDebug.checked) {
            toast('调试模式：已完成 1 个任务，已停止', 'info');
            break;
          }

          const hasMorePending = tasks.some((x, j) => j > i && x.status === STATUS.PENDING);
          if (!stopRequested && hasMorePending) {
            await randomDelay(1000, 2000);
            await yieldIfPausedOrStopped();
          }
        }

        if (stopRequested) {
          toast('已停止操作', 'info');
        } else if (!tasks.some((x) => x.status === STATUS.PENDING)) {
          toast('全部任务已处理完成', 'ok');
        }
      } finally {
        operating = false;
        paused = false;
        stopRequested = false;
        saveTasks(tasks);
        renderTasks();
      }
    }

    elStart.addEventListener('click', () => {
      if (operating || creating) return;
      if (!tasks.length) {
        toast('没有可处理的任务', 'err');
        return;
      }
      void processLoop();
    });

    elStop.addEventListener('click', () => {
      if (!operating) return;
      stopRequested = true;
      paused = false;
    });

    elPause.addEventListener('click', () => {
      if (!operating) return;
      paused = !paused;
      saveTasks(tasks);
      refreshButtons();
      toast(paused ? '已暂停（进度已保存）' : '已恢复执行', 'info');
    });

    renderTasks();
  }

  function main() {
    if (location.hostname !== 'pom.hoperun.com' && !location.href.includes('pom.hoperun.com')) {
      return;
    }
    if (!String(location.hash || '').startsWith(HASH_PREFIX)) {
      return;
    }
    mount();
  }

  main();
})();
