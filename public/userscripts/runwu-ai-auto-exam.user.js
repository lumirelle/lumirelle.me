// ==UserScript==
// @name         润悟AI创智考试自动答题助手（考试 B）
// @namespace    https://tampermonkey.net/
// @version      0.1.0
// @description  为当前考试页添加“自动答题”按钮，按预设答案自动选择选项（仅限选择题）。
// @author       Codex
// @match        *://webapp.hoperun.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  //#region Constants
  /**
   * 答案格式示例：
   *
   * 1. 单选
   * ```js
   * {
   *   byNumber: {
   *     // ...
   *     1: 'A',
   *     2: '讯飞星火',
   *   }
   * }
   * ```
   *
   * 2. 多选
   * ```js
   * {
   *   byNumber: {
   *     // ...
   *     3: ['A', 'C'],
   *   }
   * }
   * ```
   *
   * 3. 也支持按题干关键字匹配
   * ```js
   * {
   *   byKeyword: {
   *     // ...
   *     '自然语言处理': 'NLP',
   *   }
   * }
   * ```
   */
  const ANSWERS = {
    byNumber: {
      1: '需激活码',
      2: 'MCP协议',
      3: '使用NPM安装',
      4: '多端同步',
      5: '智能体（Agent）',
      6: 'NPU',
      7: '图像标注',
      8: 'Token',
      9: 'Transformer',
      10: '指令微调',
      11: '上下文学习（ICL）',
      12: '正确',
      13: '错误',
      14: '正确',
      15: '正确',
      16: '错误',
      17: ['AI浪潮与工作变革', 'LLM:你的智能助手', 'Prompt:与AI对话的艺术与科学'],
      18: ['明确目标', '使用分隔符', '提供背景信息'],
      19: ['自然语言处理', '视觉感知', '决策推理', '情感识别'],
      20: ['理解模糊需求', '多轮对话式搜索', '生成式答案', '多模态搜索'],
      21: ['自主性', '适应性', '交互能力', '目标导向'],
      22: '代码补全',
      23: 'CodeGeeX',
      24: 'LLM',
      25: 'AGI',
      26: 'NLP',
      27: 'AIGC',
      28: '角色扮演',
      29: '指令工程',
      30: '讯飞星火',
    },
    byKeyword: {
      // 例如：
      // '大型语言模型': 'LLM',
      // '自然语言处理': 'NLP',
    },
  };
  const CONFIG = {
    debug: true,
    autoSubmit: false,
    scrollIntoView: true,
    fillDelay: 120,
    targetTotalAnswerTime: 180000,
    pacingJitterRatio: 0.35,
    minPerQuestionDelay: 2500,
    maxPerQuestionDelay: 9000,
    initRetryInterval: 800,
    initRetryTimeout: 120000,
    selectors: {
      questionCard: '.ant-card.ant-card-bordered',
      questionTitle: '.ant-card-head-title',
      questionBody: '.ant-card-body',
      singleOption: 'label.ant-radio-wrapper',
      singleInput: 'input.ant-radio-input[type="radio"]',
      multiOption: 'label.ant-checkbox-wrapper',
      multiInput: 'input.ant-checkbox-input[type="checkbox"]',
      submitButton: 'button.ant-btn.ant-btn-primary.ant-btn-dangerous.ant-btn-lg.ant-btn-block',
    },
  };
  //#endregion

  //#region Helpers
  function log(...args) {
    if (CONFIG.debug) {
      console.log('[auto-exam]', ...args);
    }
  }
  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }
  //#endregion

  //#region Core Logic
  function normalizeText(text) {
    return (text || '')
      .replace(/\s+/g, ' ')
      .replace(/[：:]/g, ':')
      .trim();
  }
  function parseQuestionNumber(titleText) {
    const match = String(titleText || '').match(/Q\s*(\d+)/i);
    return match ? Number(match[1]) : null;
  }
  function getQuestionCards() {
    return Array.from(document.querySelectorAll(CONFIG.selectors.questionCard))
      .filter((card) => card.querySelector(CONFIG.selectors.questionTitle));
  }
  function getQuestionInfo(card) {
    const titleEl = card.querySelector(CONFIG.selectors.questionTitle);
    const bodyEl = card.querySelector(CONFIG.selectors.questionBody);
    const promptEl = bodyEl
      ? Array.from(bodyEl.children).find((el) => {
          const text = normalizeText(el.textContent);
          return text && !el.matches('.ant-radio-group, .ant-checkbox-group');
        })
      : null;
    const title = normalizeText(titleEl?.textContent);
    const prompt = normalizeText(promptEl?.textContent);
    const number = parseQuestionNumber(title);
    return {
      card,
      title,
      prompt,
      number,
      singleOptions: Array.from(card.querySelectorAll(CONFIG.selectors.singleOption)),
      multiOptions: Array.from(card.querySelectorAll(CONFIG.selectors.multiOption)),
    };
  }
  function getAnswer(question) {
    if (question.number != null && Object.prototype.hasOwnProperty.call(ANSWERS.byNumber, question.number)) {
      return ANSWERS.byNumber[question.number];
    }
    const prompt = question.prompt;
    for (const [keyword, answer] of Object.entries(ANSWERS.byKeyword)) {
      if (prompt.includes(keyword)) {
        return answer;
      }
    }
    return undefined;
  }
  function isChecked(optionLabel) {
    const radio = optionLabel.querySelector(CONFIG.selectors.singleInput);
    const checkbox = optionLabel.querySelector(CONFIG.selectors.multiInput);
    return Boolean(radio?.checked || checkbox?.checked);
  }
  function optionText(optionLabel) {
    const explicit = optionLabel.querySelector('.ant-radio-label, .ant-checkbox + span, .ant-checkbox-wrapper span:last-child');
    return normalizeText(explicit?.textContent || optionLabel.textContent);
  }
  function clickOption(optionLabel) {
    optionLabel.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  }
  function findMatchingOptions(options, answers) {
    const answerList = Array.isArray(answers) ? answers : [answers];
    const normalizedAnswers = answerList.map((item) => normalizeText(String(item)));
    return options.filter((option) => {
      const text = optionText(option);
      return normalizedAnswers.some((answer) => text === answer || text.includes(answer) || answer.includes(text));
    });
  }
  async function fillSingle(question, answer) {
    const matches = findMatchingOptions(question.singleOptions, answer);
    const target = matches[0];
    if (!target) {
      log(`Q${question.number ?? '?' } 未找到单选答案`, answer, question.prompt);
      return false;
    }
    if (!isChecked(target)) {
      clickOption(target);
      await sleep(CONFIG.fillDelay);
    }
    return true;
  }
  async function fillMulti(question, answer) {
    const matches = findMatchingOptions(question.multiOptions, answer);
    if (!matches.length) {
      log(`Q${question.number ?? '?' } 未找到多选答案`, answer, question.prompt);
      return false;
    }
    for (const target of matches) {
      if (!isChecked(target)) {
        clickOption(target);
        await sleep(CONFIG.fillDelay);
      }
    }
    return true;
  }
  async function fillQuestion(question) {
    const answer = getAnswer(question);
    if (answer === undefined) {
      log(`Q${question.number ?? '?' } 暂无答案`, question.prompt);
      return { filled: false, reason: 'missing-answer' };
    }
    if (CONFIG.scrollIntoView) {
      question.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(150);
    }
    if (question.singleOptions.length) {
      return { filled: await fillSingle(question, answer), reason: 'single' };
    }
    if (question.multiOptions.length) {
      return { filled: await fillMulti(question, answer), reason: 'multiple' };
    }
    log(`Q${question.number ?? '?' } 未识别题型`, question.prompt);
    return { filled: false, reason: 'unknown-type' };
  }
  function getSubmitButton() {
    const exact = document.querySelector(CONFIG.selectors.submitButton);
    if (exact) {
      return exact;
    }
    return Array.from(document.querySelectorAll('button')).find((button) => {
      return normalizeText(button.textContent).includes('提交考试');
    }) || null;
  }
  async function runAutoAnswer() {
    const cards = getQuestionCards();
    const questions = cards.map(getQuestionInfo).filter((item) => item.prompt);
    const objectiveQuestions = questions.filter((question) => question.singleOptions.length || question.multiOptions.length);
    let filledCount = 0;
    const averageDelay = objectiveQuestions.length
      ? CONFIG.targetTotalAnswerTime / objectiveQuestions.length
      : CONFIG.minPerQuestionDelay;
    log(`识别到 ${questions.length} 道题，其中 ${objectiveQuestions.length} 道客观题`);
    for (const question of questions) {
      const result = await fillQuestion(question);
      if (result.filled) {
        filledCount += 1;
        if (result.reason === 'single' || result.reason === 'multiple') {
          const jitter = averageDelay * CONFIG.pacingJitterRatio;
          const waitTime = clamp(
            Math.round(randomBetween(averageDelay - jitter, averageDelay + jitter)),
            CONFIG.minPerQuestionDelay,
            CONFIG.maxPerQuestionDelay
          );
          log(`Q${question.number ?? '?' } 已完成，随机等待 ${waitTime}ms`);
          await sleep(waitTime);
        }
      }
    }
    log(`完成 ${filledCount}/${questions.length} 道题`);
    if (CONFIG.autoSubmit) {
      const submitButton = getSubmitButton();
      if (submitButton) {
        submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await sleep(250);
        submitButton.click();
        log('已触发提交按钮');
      } else {
        log('未找到提交按钮');
      }
    }
  }
  //#endregion

  //#region UI & Initialization
  function createPanel() {
    if (document.getElementById('auto-exam-panel')) {
      return;
    }
    const panel = document.createElement('div');
    panel.id = 'auto-exam-panel';
    panel.style.cssText = [
      'position: fixed',
      'right: 24px',
      'bottom: 24px',
      'z-index: 999999',
      'display: flex',
      'flex-direction: column',
      'gap: 8px',
      'padding: 12px',
      'border-radius: 14px',
      'background: rgba(17, 24, 39, 0.92)',
      'box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28)',
      'backdrop-filter: blur(10px)',
      'font-family: system-ui, sans-serif',
    ].join(';');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '自动答题';
    button.style.cssText = [
      'border: none',
      'border-radius: 10px',
      'padding: 10px 14px',
      'background: linear-gradient(135deg, #2563eb, #1d4ed8)',
      'color: #fff',
      'font-size: 14px',
      'font-weight: 600',
      'cursor: pointer',
    ].join(';');
    const hint = document.createElement('div');
    hint.textContent = '目前题库：仅考试 B';
    hint.style.cssText = [
      'color: rgba(255, 255, 255, 0.78)',
      'font-size: 12px',
      'line-height: 1.4',
      'max-width: 220px',
    ].join(';');
    button.addEventListener('click', async () => {
      button.disabled = true;
      const rawText = button.textContent;
      button.textContent = '答题中...';
      button.style.opacity = '0.75';
      try {
        await runAutoAnswer();
        button.textContent = '已完成';
      } catch (error) {
        console.error('[auto-exam] 自动答题失败', error);
        button.textContent = '执行失败';
      } finally {
        window.setTimeout(() => {
          button.disabled = false;
          button.textContent = rawText;
          button.style.opacity = '1';
        }, 1600);
      }
    });
    panel.appendChild(button);
    panel.appendChild(hint);
    document.body.appendChild(panel);
  }
  function isTargetPageReady() {
    const hasQuestionCards = getQuestionCards().length > 0;
    const hasSubmitButton = Boolean(getSubmitButton());
    return hasQuestionCards && hasSubmitButton;
  }
  function init() {
    if (!isTargetPageReady()) {
      log('页面元素还没渲染完成，继续等待...');
      return false;
    }
    createPanel();
    log('自动答题面板已注入');
    return true;
  }
  let initTimer = null;
  let initStartedAt = Date.now();
  let observerStarted = false;
  let lastUrl = location.href;
  function stopInitWatcher() {
    if (initTimer) {
      clearInterval(initTimer);
      initTimer = null;
    }
  }
  function startInitWatcher(reason = 'unknown') {
    initStartedAt = Date.now();
    log(`开始监听页面渲染: ${reason}`);
    stopInitWatcher();
    init();
    initTimer = window.setInterval(() => {
      if (document.getElementById('auto-exam-panel')) {
        stopInitWatcher();
        return;
      }
      const elapsed = Date.now() - initStartedAt;
      if (elapsed > CONFIG.initRetryTimeout) {
        log('等待页面渲染超时，停止重试');
        stopInitWatcher();
        return;
      }
      init();
    }, CONFIG.initRetryInterval);
  }
  function observePageChanges() {
    if (observerStarted) {
      return;
    }
    observerStarted = true;
    const observer = new MutationObserver(() => {
      if (!document.getElementById('auto-exam-panel') && isTargetPageReady()) {
        log('检测到题目区域已出现，准备注入按钮');
        init();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    const wrapHistoryMethod = (type) => {
      const original = history[type];
      history[type] = function (...args) {
        const result = original.apply(this, args);
        window.dispatchEvent(new Event('auto-exam:url-change'));
        return result;
      };
    };
    wrapHistoryMethod('pushState');
    wrapHistoryMethod('replaceState');
    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('auto-exam:url-change'));
    });
    window.addEventListener('auto-exam:url-change', () => {
      if (location.href === lastUrl) {
        return;
      }
      lastUrl = location.href;
      const panel = document.getElementById('auto-exam-panel');
      if (panel) {
        panel.remove();
      }
      startInitWatcher('route-change');
    });
  }
  observePageChanges();
  startInitWatcher('initial');
  //#endregion
})();
