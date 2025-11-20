// ================= PACKY USAGE WIDGET ==================
// Author: Fantasy Tu
// Version: 1.2.0
// Date: 2025-11-21
// Description: A Scriptable widget to display API usage statistics
// ======================================================

// ================= CONFIGURATION ==================
const CONFIG = {
  API_BASE_URL: "https://www.packyapi.com",
  USER_ID: "",
  SESSION: "",
  UNIT: 500000,
  DAYS_TO_FETCH: 30,
  DEBUG: false, // Set to false to disable debug mode
};

const UI_CONSTANTS = {
  WIDGET_CORNER_RADIUS: 12,
  GAUGE_WIDTH_RATIO: { SMALL: 1, MEDIUM: 0.45, LARGE: 1 },
  GAUGE_SPACING: 12,
  THRESHOLDS: { GOOD: 20, WARNING: 10 },
  ICON_MAP: {
    tokens: 'guidepoint.vertical.numbers',
    requests: 'bolt.horizontal.fill',
    mostUsed: 'star.fill',
    spending: 'creditcard.fill',
  },
  CAPTION_MAP: {
    tokens: 'Tokens Used',
    requests: 'Requests',
    mostUsed: 'Most Used',
    spending: 'Spending',
  },
};

// ================= COLOR MANAGER ==================
const ColorManager = new Proxy({
  // All color definitions in one place
  COLOR_DEFS: {
    // UI colors
    primary: { light: "#000000", dark: "#FFFFFF" },
    secondary: { light: "#8E8E93", dark: "#636366" },
    background: { light: "#F2F2F7", dark: "#1C1C1E" },
    backgroundMid: { light: "#EBEBF0", dark: "#2C2C2E" },
    backgroundAlt: { light: "#E5E5EA", dark: "#3A3A3C" },
    progressBackground: { light: "#D1D1D6", dark: "#48484A" },
    usageProgress: { light: "#5E5CE6", dark: "#5E5CE6" },
    error: { light: "#FF3B30", dark: "#FF453A" },
    success: { light: "#34C759", dark: "#30D158" },
    warning: { light: "#FF9500", dark: "#FF9F0A" },
    // Model colors
    'gpt-5': { light: "#007AFF", dark: "#0A84FF" },
    'gpt-5.1': { light: "#0052CC", dark: "#0066FF" },
    'claude-haiku': { light: "#FFB800", dark: "#FFD60A" },
    'claude-sonnet': { light: "#FF8C00", dark: "#FFAB00" },
    'claude-opus': { light: "#FF3B00", dark: "#FF5733" },
    'gemini-2.5-flash': { light: "#C77DFF", dark: "#D896FF" },
    'gemini-2.5-pro': { light: "#9D4EDD", dark: "#B565F2" },
    'gemini-3': { light: "#7C3AED", dark: "#A78BFA" },
    'sora': { light: "#34C759", dark: "#30D158" },
    'veo': { light: "#28A745", dark: "#32CD32" },
    'default': { light: "#32D74B", dark: "#28A745" },
  },

  getRemainingPercentageColor(percentage) {
    if (percentage >= UI_CONSTANTS.THRESHOLDS.GOOD) return this.success;
    if (percentage <= UI_CONSTANTS.THRESHOLDS.WARNING) return this.error;
    return this.warning;
  },

  getDrawColor(colorKey) {
    const colorDef = this.COLOR_DEFS[colorKey];
    return Device.isUsingDarkAppearance() ? new Color(colorDef.dark) : new Color(colorDef.light);
  }

}, {
  get(target, prop) {
    // Return existing properties (methods, COLOR_DEFS, etc.)
    if (prop in target) {
      return target[prop];
    }

    // If it's a color definition key, return the dynamic color
    if (prop in target.COLOR_DEFS) {
      const colorDef = target.COLOR_DEFS[prop];
      return Color.dynamic(new Color(colorDef.light), new Color(colorDef.dark));
    }

    return undefined;
  }
});

// ================= MODEL MANAGER CLASS ==================
class ModelManager {
  static MODEL_CONFIGS = [
    // GPT 5.1 variants (more specific patterns first)
    { pattern: ['gpt-5.1', 'codex', 'max-xhigh'], name: 'GPT 5.1 Max XHi', colorKey: 'gpt-5.1' },
    { pattern: ['gpt-5.1', 'codex', 'max-high'], name: 'GPT 5.1 Max Hi', colorKey: 'gpt-5.1' },
    { pattern: ['gpt-5.1', 'codex', 'max'], name: 'GPT 5.1 Max', colorKey: 'gpt-5.1' },
    { pattern: ['gpt-5.1', 'codex', 'mini'], name: 'GPT 5.1 Mini', colorKey: 'gpt-5.1' },
    { pattern: ['gpt-5.1', 'codex'], name: 'GPT 5.1 Codex', colorKey: 'gpt-5.1' },
    { pattern: ['gpt-5.1', 'high'], name: 'GPT 5.1 Hi', colorKey: 'gpt-5.1' },
    { pattern: ['gpt-5.1', 'low'], name: 'GPT 5.1 Lo', colorKey: 'gpt-5.1' },
    { pattern: ['gpt-5.1', 'medium'], name: 'GPT 5.1 Med', colorKey: 'gpt-5.1' },
    { pattern: ['gpt-5.1', 'minimal'], name: 'GPT 5.1 Min', colorKey: 'gpt-5.1' },
    { pattern: ['gpt-5.1'], name: 'GPT 5.1', colorKey: 'gpt-5.1' },
    // GPT 5 variants
    { pattern: ['gpt-5', 'codex', 'mini', 'medium'], name: 'GPT 5 Mini Med', colorKey: 'gpt-5' },
    { pattern: ['gpt-5', 'codex', 'mini', 'high'], name: 'GPT 5 Mini Hi', colorKey: 'gpt-5' },
    { pattern: ['gpt-5', 'codex', 'mini'], name: 'GPT 5 Mini', colorKey: 'gpt-5' },
    { pattern: ['gpt-5', 'codex', 'high'], name: 'GPT 5 Codex Hi', colorKey: 'gpt-5' },
    { pattern: ['gpt-5', 'codex', 'medium'], name: 'GPT 5 Codex Med', colorKey: 'gpt-5' },
    { pattern: ['gpt-5', 'codex', 'low'], name: 'GPT 5 Codex Lo', colorKey: 'gpt-5' },
    { pattern: ['gpt-5', 'codex'], name: 'GPT 5 Codex', colorKey: 'gpt-5' },
    { pattern: ['gpt-5', 'high'], name: 'GPT 5 Hi', colorKey: 'gpt-5' },
    { pattern: ['gpt-5', 'low'], name: 'GPT 5 Lo', colorKey: 'gpt-5' },
    { pattern: ['gpt-5', 'medium'], name: 'GPT 5 Med', colorKey: 'gpt-5' },
    { pattern: ['gpt-5', 'minimal'], name: 'GPT 5 Min', colorKey: 'gpt-5' },
    { pattern: ['gpt-5'], name: 'GPT 5', colorKey: 'gpt-5' },
    // Claude models
    { pattern: ['claude', 'opus'], name: 'Claude Opus', colorKey: 'claude-opus' },
    { pattern: ['claude', 'sonnet'], name: 'Claude Sonnet', colorKey: 'claude-sonnet' },
    { pattern: ['claude', 'haiku'], name: 'Claude Haiku', colorKey: 'claude-haiku' },
    // Gemini models
    { pattern: ['gemini-3', 'low'], name: 'Gemini 3 Lo', colorKey: 'gemini-3' },
    { pattern: ['gemini-3', 'high'], name: 'Gemini 3 Hi', colorKey: 'gemini-3' },
    { pattern: ['gemini-3', 'preview'], name: 'Gemini 3 Pre', colorKey: 'gemini-3' },
    { pattern: ['gemini-3'], name: 'Gemini 3', colorKey: 'gemini-3' },
    { pattern: ['gemini-2.5', 'pro'], name: 'Gemini 2.5 Pro', colorKey: 'gemini-2.5-pro' },
    { pattern: ['gemini-2.5', 'flash'], name: 'Gemini 2.5 Flash', colorKey: 'gemini-2.5-flash' },
    { pattern: ['gemini'], name: 'Gemini', colorKey: 'gemini-3' },
    // Video/Image models
    { pattern: ['sora'], name: 'Sora', colorKey: 'sora' },
    { pattern: ['veo'], name: 'VeO', colorKey: 'veo' },
  ];

  static getModelConfig(modelName) {
    return this.MODEL_CONFIGS.find(({ pattern }) =>
      pattern.every(p => modelName.includes(p))
    );
  }

  static getModelColorKey(modelName) {
    const config = this.getModelConfig(modelName);
    return config ? config.colorKey : 'default';
  }

  static getModelColor(modelName) {
    const key = this.getModelColorKey(modelName);
    const colorDef = ColorManager.COLOR_DEFS[key];
    return Color.dynamic(new Color(colorDef.light), new Color(colorDef.dark));
  }

  static getSimplifiedModelName(modelName) {
    if (!modelName || modelName.trim() === '') return 'No Model Used';

    const config = this.getModelConfig(modelName);
    return config ? config.name : modelName;
  }
}

// ================= SIZE MANAGER CLASS ==================
class SizeManager {
  static DEVICE_SIZES = {
    // iOS devices (screen widths: 320, 375, 390, 393, 414, 428, 430)
    320: { small: { w: 141, h: 141 }, medium: { w: 292, h: 141 }, large: { w: 292, h: 311 } },
    375: { small: { w: 155, h: 155 }, medium: { w: 329, h: 155 }, large: { w: 329, h: 345 } },
    390: { small: { w: 158, h: 158 }, medium: { w: 338, h: 158 }, large: { w: 338, h: 354 } },
    393: { small: { w: 158, h: 158 }, medium: { w: 338, h: 158 }, large: { w: 338, h: 354 } },
    414: { small: { w: 169, h: 169 }, medium: { w: 360, h: 169 }, large: { w: 360, h: 379 } },
    428: { small: { w: 170, h: 170 }, medium: { w: 364, h: 170 }, large: { w: 364, h: 382 } },
    430: { small: { w: 170, h: 170 }, medium: { w: 364, h: 170 }, large: { w: 364, h: 382 } },
    // iPadOS devices (screen widths: 744, 768, 810, 820, 834, 954, 1024, 1192)
    744: { small: { w: 141, h: 141 }, medium: { w: 305, h: 141 }, large: { w: 305, h: 305 }, extraLarge: { w: 634, h: 305 } },
    768: { small: { w: 141, h: 141 }, medium: { w: 305, h: 141 }, large: { w: 305, h: 305 }, extraLarge: { w: 634, h: 305 } },
    810: { small: { w: 146, h: 146 }, medium: { w: 320, h: 146 }, large: { w: 320, h: 320 }, extraLarge: { w: 669, h: 320 } },
    820: { small: { w: 155, h: 155 }, medium: { w: 342, h: 155 }, large: { w: 342, h: 342 }, extraLarge: { w: 715, h: 342 } },
    834: { small: { w: 155, h: 155 }, medium: { w: 342, h: 155 }, large: { w: 342, h: 342 }, extraLarge: { w: 715, h: 342 } },
    954: { small: { w: 162, h: 162 }, medium: { w: 350, h: 162 }, large: { w: 350, h: 350 }, extraLarge: { w: 726, h: 350 } },
    1024: { small: { w: 170, h: 170 }, medium: { w: 378, h: 170 }, large: { w: 378, h: 378 }, extraLarge: { w: 795, h: 378 } },
    1192: { small: { w: 188, h: 188 }, medium: { w: 412, h: 188 }, large: { w: 412, h: 412 }, extraLarge: { w: 860, h: 412 } },
  };

  static getWidgetSize(horizontalPadding = 0, verticalPadding = 0) {
    const screenSize = Device.screenSize();
    let screenWidth;

    if (Device.isPad()) {
      // iPad: use the shorter side (width) regardless of orientation
      screenWidth = Math.min(screenSize.width, screenSize.height);
    } else {
      // iPhone: use screen width directly
      screenWidth = screenSize.width;
    }

    const widgetSizing = config.widgetFamily || "small";

    // Exact match on screen width
    const sizeData = this.DEVICE_SIZES[screenWidth]?.[widgetSizing];

    if (!sizeData) return new Size(158, 158); // fallback to default

    // Apply padding adjustment separately for width and height
    const adjustedWidth = sizeData.w - horizontalPadding * 2;
    const adjustedHeight = sizeData.h - verticalPadding * 2;

    return new Size(adjustedWidth, adjustedHeight);
  }
}

// ================= UTILITY CLASS ==================
class Utils {
  static formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  }

  static formatChartValue(value) {
    const rounded = Math.round(value * 10) / 10;
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
  }

  static calculateSmartRange(minValue, maxValue) {
    const range = maxValue - minValue;
    const smartMin = Math.max(0, minValue - range * 0.1);
    const smartMax = maxValue + range * 0.1;

    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(smartMax, 0.1))));
    const step = magnitude >= 10 ? magnitude : 0.1;
    const precision = step >= 1 ? 0 : 1;

    return {
      min: parseFloat((Math.floor(smartMin / step) * step).toFixed(precision)),
      max: parseFloat((Math.ceil(smartMax / step) * step).toFixed(precision)),
    };
  }
}

// ================= DATA FETCHER CLASS ==================
class DataFetcher {
  constructor() {
    this.now = Math.floor(Date.now() / 1000);
    this.startDate = this.now - CONFIG.DAYS_TO_FETCH * 24 * 60 * 60;
    this.headers = {
      "Cookie": `session=${CONFIG.SESSION}`,
      "New-API-User": CONFIG.USER_ID,
    };
  }

  async apiGet(url) {
    const req = new Request(url);
    req.headers = this.headers;
    const res = await req.loadJSON();
    if (!res.success) throw new Error(res.message);
    return res.data;
  }

  async fetchUserData() {
    const user = await this.apiGet(`${CONFIG.API_BASE_URL}/api/user/self`);
    const dataURL = `${CONFIG.API_BASE_URL}/api/data/self?start_timestamp=${this.startDate}&end_timestamp=${this.now}&default_time=week`;
    const items = await this.apiGet(dataURL);
    return { user, items };
  }

  async fetchTimeSeriesData(count, scale = 'day', includeWeekday = false) {
    const today = new Date(this.now * 1000);
    const startDate = new Date(today.getTime() - (count - 1) * 24 * 60 * 60 * 1000);
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const dataURL = `${CONFIG.API_BASE_URL}/api/data/self?start_timestamp=${startTimestamp}&end_timestamp=${this.now}&default_time=${scale}`;
    const items = await this.apiGet(dataURL);

    const timeSeriesData = [];
    for (let i = 0; i < count; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const data = {
        date,
        timestamp: Math.floor(date.getTime() / 1000),
        models: {},
        modelCounts: {},
        totalTokens: 0,
        totalQuota: 0,
      };

      if (includeWeekday) {
        data.weekday = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
      }

      const periodItems = items.filter(item => {
        const itemDate = new Date(item.created_at * 1000);
        return itemDate.toDateString() === date.toDateString();
      });

      periodItems.forEach(item => {
        const modelName = item.model_name;
        if (!data.models[modelName]) {
          data.models[modelName] = 0;
          data.modelCounts[modelName] = 0;
        }
        data.models[modelName] += item.quota;
        data.modelCounts[modelName] += item.count;
        data.totalTokens += item.token_used;
        data.totalQuota += item.quota;
      });

      timeSeriesData.push(data);
    }

    return timeSeriesData;
  }
}

// ================= DATA PROCESSOR CLASS ==================
class DataProcessor {
  constructor(user, items) {
    this.user = user;
    this.items = items;
  }

  processData() {
    const totalQuota = this.user.quota + this.user.used_quota;
    const usagePercentage = (this.user.used_quota / totalQuota) * 100;
    const remainingPercentage = (this.user.quota / totalQuota) * 100;

    let totalTokens = 0;
    const modelUsage = {};

    this.items.forEach(item => {
      const name = item.model_name;
      if (!modelUsage[name]) modelUsage[name] = 0;
      modelUsage[name] += item.token_used;
      totalTokens += item.token_used;
    });

    return {
      balance: (this.user.quota / CONFIG.UNIT).toFixed(2),
      used: (this.user.used_quota / CONFIG.UNIT).toFixed(2),
      requestCount: this.user.request_count,
      totalTokens,
      modelUsage,
      usagePercentage,
      remainingPercentage,
      totalQuota,
    };
  }

  static getModelUsageData(timeSeriesData) {
    const modelCounts = {};
    timeSeriesData.forEach(day => {
      Object.entries(day.modelCounts).forEach(([modelName, count]) => {
        if (!modelCounts[modelName]) modelCounts[modelName] = 0;
        modelCounts[modelName] += count;
      });
    });
    return modelCounts;
  }

  static getMostUsedModel(timeSeriesData) {
    const modelUsage = this.getModelUsageData(timeSeriesData);
    let maxModel = '';
    let maxUsage = 0;

    Object.entries(modelUsage).forEach(([modelName, usage]) => {
      if (usage > maxUsage) {
        maxUsage = usage;
        maxModel = modelName;
      }
    });

    return maxModel;
  }

  static getUsedModels(timeSeriesData) {
    const modelUsage = {};

    timeSeriesData.forEach(day => {
      Object.entries(day.models).forEach(([modelName, usage]) => {
        if (!modelUsage[modelName]) {
          modelUsage[modelName] = { totalUsage: 0, dailyUsage: [] };
        }
        modelUsage[modelName].totalUsage += usage;
        modelUsage[modelName].dailyUsage.push(usage);
      });
    });

    return modelUsage;
  }

  static getModelProviders(usedModels) {
    const modelProviders = {
      'OpenAI': [],
      'Anthropic': [],
      'Google': [],
      'Other': [],
    };

    Object.keys(usedModels).forEach(modelName => {
      if (modelName.includes('gpt')) {
        modelProviders['OpenAI'].push(modelName);
      } else if (modelName.includes('claude')) {
        modelProviders['Anthropic'].push(modelName);
      } else if (modelName.includes('gemini')) {
        modelProviders['Google'].push(modelName);
      } else {
        modelProviders['Other'].push(modelName);
      }
    });

    return modelProviders;
  }
}

// ================= UI COMPONENTS CLASS ==================
class UIComponents {
  static createErrorWidget(error) {
    const widget = new ListWidget();
    widget.backgroundColor = ColorManager.background;
    widget.useDefaultPadding();

    const title = widget.addText(error.name);
    title.textColor = ColorManager.error;
    title.font = Font.boldSystemFont(14);

    widget.addSpacer(4);

    const msg = widget.addText(error.message);
    msg.textColor = ColorManager.error;
    msg.font = Font.systemFont(12);

    return widget;
  }

  static createInfoItem(parent, type, value, options = {}) {
    const { iconSize = 18, showCaption = true } = options;

    const item = parent.addStack();
    item.layoutHorizontally();
    item.centerAlignContent();
    item.spacing = 6;

    const icon = item.addImage(SFSymbol.named(UI_CONSTANTS.ICON_MAP[type]).image);
    icon.imageSize = new Size(iconSize, iconSize);
    icon.tintColor = ColorManager.primary;

    const textStack = item.addStack();
    textStack.layoutVertically();

    if (showCaption) {
      const captionText = textStack.addText(UI_CONSTANTS.CAPTION_MAP[type]);
      captionText.font = Font.caption1();
      captionText.textColor = ColorManager.secondary;
    }

    const valueText = textStack.addText(value);
    valueText.font = showCaption ? Font.body() : Font.mediumSystemFont(14);
    valueText.textColor = ColorManager.primary;

    return item;
  }

  static createProgressStack(parent, width, data, weekData) {
    const padding = 8;
    const barHeight = 8;

    const container = parent.addStack();
    container.layoutVertically();
    container.backgroundColor = ColorManager.backgroundMid;
    container.cornerRadius = UI_CONSTANTS.WIDGET_CORNER_RADIUS;
    container.setPadding(padding, padding, padding, padding);
    container.spacing = padding;

    // Remaining bar
    const remainingBar = container.addStack();
    remainingBar.layoutHorizontally();
    remainingBar.cornerRadius = barHeight / 2;
    remainingBar.backgroundColor = ColorManager.progressBackground;
    remainingBar.size = new Size(width - padding * 2, barHeight);

    const total = parseFloat(data.balance) + parseFloat(data.used);
    const remainingWidth = (width - padding * 2) * (parseFloat(data.balance) / total);
    const remainingProgress = remainingBar.addStack();
    remainingProgress.backgroundColor = ColorManager.getRemainingPercentageColor(data.remainingPercentage);
    remainingProgress.cornerRadius = barHeight / 2;
    remainingProgress.size = new Size(remainingWidth, barHeight);

    // Add spacer to keep progress left-aligned when not full
    if (parseFloat(data.used) > 0) {
      remainingBar.addSpacer();
    }

    // Usage bar with Stack background
    const amounts = weekData.map(day =>
      Object.values(day.models).reduce((sum, quota) => sum + quota / CONFIG.UNIT, 0)
    );
    const today = amounts[amounts.length - 1] || 0;
    const avg = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
    const max = Math.max(...amounts);

    // Handle max = 0 case
    const todayRatio = max === 0 ? 0 : today / max;
    const avgRatio = max === 0 ? 0 : avg / max;

    const barWidth = width - padding * 2;
    const sidePadding = 2; // Padding on both sides of the bar

    // Create bar background and progress using Stack
    const usageBarStack = container.addStack();
    usageBarStack.layoutHorizontally();
    usageBarStack.cornerRadius = barHeight / 2;
    usageBarStack.backgroundColor = ColorManager.progressBackground;
    usageBarStack.size = new Size(barWidth, barHeight);

    // Create DrawContext
    const ctxProgress = new DrawContext();
    ctxProgress.size = new Size(barWidth, barHeight);
    ctxProgress.opaque = false;
    ctxProgress.respectScreenScale = true;

    // Draw progress bar (no left padding, progress grows from left)
    const progressWidth = todayRatio * barWidth;
    if (progressWidth > 0) {
      ctxProgress.setFillColor(ColorManager.getDrawColor('usageProgress'));
      const progressPath = new Path();
      progressPath.addRoundedRect(
        new Rect(0, 0, progressWidth, barHeight),
        barHeight / 2,
        barHeight / 2
      );
      ctxProgress.addPath(progressPath);
      ctxProgress.fillPath();
    }

    // Label configuration
    const fontSize = 7;
    const avgLabelWidth = 24;
    const maxLabelWidth = 24;
    const minLabelSpacing = 4;

    // Calculate AVG position (based on avg value)
    const avgPixelPos = avgRatio * barWidth;

    // Determine AVG label format and position
    const isAvgNearStart = avgPixelPos < avgLabelWidth + sidePadding;
    const avgLabel = isAvgNearStart ? "• AVG" : "AVG •";
    const avgStartX = isAvgNearStart ? avgPixelPos : avgPixelPos - avgLabelWidth + sidePadding;
    const avgEndX = avgStartX + avgLabelWidth;

    // Calculate MAX position (always at the end with padding)
    const maxStartX = barWidth - sidePadding - maxLabelWidth;

    // Check if MAX should be shown (enough space from AVG)
    const distanceBetweenLabels = maxStartX - avgEndX;
    const showMax = distanceBetweenLabels >= minLabelSpacing && max > 0;

    ctxProgress.setTextColor(ColorManager.getDrawColor('background'));
    ctxProgress.setFont(Font.boldSystemFont(fontSize));
    ctxProgress.drawText(avgLabel, new Point(avgStartX, (barHeight - fontSize) / 2 - 1));

    if (showMax) {
      ctxProgress.drawText("MAX •", new Point(maxStartX, (barHeight - fontSize) / 2 - 1));
    }

    const usageBarImage = usageBarStack.addImage(ctxProgress.getImage());
    usageBarImage.imageSize = new Size(barWidth, barHeight);

    return container;
  }
}

// ================= CHART RENDERER CLASS ==================
class ChartRenderer {
  static createChart(data, parentStack, availableWidth, options = {}) {
    const { spacing = 2, showWeekday = false, maxBarHeight = 100 } = options;
    const dataCount = data.length;

    const amounts = data.map(day =>
      Object.values(day.models).reduce((sum, quota) => sum + quota / CONFIG.UNIT, 0)
    );
    const minAmount = Math.min(...amounts, 0);
    const maxAmount = Math.max(...amounts, 0.01);
    const { min: chartMin, max: chartMax } = Utils.calculateSmartRange(minAmount, maxAmount);

    const yAxisWidth = 32;
    const barWidth = (availableWidth - yAxisWidth - spacing * (dataCount + 1)) / dataCount;

    const chartStack = parentStack.addStack();
    chartStack.layoutVertically();
    chartStack.spacing = spacing / 2;

    const topStack = chartStack.addStack();
    topStack.layoutHorizontally();
    topStack.spacing = spacing;

    // Y-axis
    this._createYAxis(topStack, yAxisWidth, maxBarHeight, chartMin, chartMax);

    // Bars
    data.forEach(day => {
      this._createBar(topStack, day, barWidth, maxBarHeight, chartMin, chartMax);
    });

    // X-axis labels
    this._createXAxisLabels(chartStack, data, spacing, yAxisWidth, barWidth, showWeekday, dataCount);
  }

  static _createYAxis(parent, width, height, min, max) {
    const yAxisStack = parent.addStack();
    yAxisStack.layoutVertically();
    yAxisStack.size = new Size(width, height);
    yAxisStack.setPadding(0, 0, 0, 0);

    const maxTextStack = yAxisStack.addStack();
    maxTextStack.size = new Size(width, 0);
    maxTextStack.addSpacer();
    const maxText = maxTextStack.addText(`$${Utils.formatChartValue(max)}`);
    maxText.font = Font.caption2();
    maxText.textColor = ColorManager.secondary;
    maxText.lineLimit = 1;

    yAxisStack.addSpacer();

    const minTextStack = yAxisStack.addStack();
    minTextStack.size = new Size(width, 0);
    minTextStack.addSpacer();
    const minText = minTextStack.addText(`$${Utils.formatChartValue(min)}`);
    minText.font = Font.caption2();
    minText.textColor = ColorManager.secondary;
    minText.lineLimit = 1;
  }

  static _createBar(parent, dayData, barWidth, maxBarHeight, chartMin, chartMax) {
    const dayStack = parent.addStack();
    dayStack.layoutVertically();
    dayStack.cornerRadius = barWidth / 2;
    dayStack.backgroundColor = ColorManager.backgroundAlt;
    dayStack.size = new Size(barWidth, maxBarHeight);

    const totalAmount = Object.values(dayData.models).reduce((sum, quota) => sum + quota / CONFIG.UNIT, 0);
    const fillPercentage = Math.min((totalAmount - chartMin) / (chartMax - chartMin), 1);

    dayStack.addSpacer();

    if (totalAmount > 0 && fillPercentage > 0) {
      const container = dayStack.addStack();
      container.layoutVertically();
      container.cornerRadius = barWidth / 2;
      container.setPadding(0, 0, 0, 0);

      Object.entries(dayData.models).forEach(([modelName, quota]) => {
        const amount = quota / CONFIG.UNIT;
        const modelPercentage = amount / totalAmount;
        const modelStack = container.addStack();
        modelStack.backgroundColor = ModelManager.getModelColor(modelName);
        modelStack.size = new Size(barWidth, fillPercentage * maxBarHeight * modelPercentage);
      });
    }
  }

  static _createXAxisLabels(chartStack, data, spacing, yAxisWidth, barWidth, showWeekday, dataCount) {
    const bottomStack = chartStack.addStack();
    bottomStack.spacing = spacing;
    const xAxisPlaceholder = bottomStack.addStack();
    xAxisPlaceholder.size = new Size(yAxisWidth, 0);

    if (showWeekday) {
      data.forEach(day => {
        const weekdayStack = bottomStack.addStack();
        weekdayStack.size = new Size(barWidth, 0);
        const weekdayText = weekdayStack.addText(day.weekday);
        weekdayText.font = Font.caption2();
        weekdayText.textColor = ColorManager.secondary;
      });
    } else {
      const firstDay = data[0].date;
      const lastDay = data[dataCount - 1].date;
      const firstLabel = `${(firstDay.getMonth() + 1).toString().padStart(2, '0')}/${firstDay.getDate().toString().padStart(2, '0')}`;
      const lastLabel = `${(lastDay.getMonth() + 1).toString().padStart(2, '0')}/${lastDay.getDate().toString().padStart(2, '0')}`;

      const dateStack = bottomStack.addStack();
      dateStack.layoutHorizontally();
      const firstDateText = dateStack.addText(firstLabel);
      firstDateText.font = Font.caption2();
      firstDateText.textColor = ColorManager.secondary;
      dateStack.addSpacer();
      const lastDateText = dateStack.addText(lastLabel);
      lastDateText.font = Font.caption2();
      lastDateText.textColor = ColorManager.secondary;
    }
  }

  static createModelRangeIndicator(parent, width, modelUsageData) {
    const rangeContainer = parent.addStack();
    rangeContainer.layoutVertically();
    rangeContainer.spacing = 2;

    const usages = Object.values(modelUsageData);

    // Handle empty data case
    const minUsage = usages.length > 0 ? Math.min(...usages) : 0;
    const maxUsage = usages.length > 0 ? Math.max(...usages) : 0;
    const { min: rangeMin, max: rangeMax } = Utils.calculateSmartRange(minUsage, maxUsage);

    const rangeHeight = 16;
    const barHeight = 8;
    const dotSize = 10;

    const sortedModels = Object.entries(modelUsageData).sort((a, b) => a[1] - b[1]);

    // Background bar using Stack
    const barStack = rangeContainer.addStack();
    barStack.layoutHorizontally();
    barStack.cornerRadius = barHeight / 2;
    barStack.backgroundColor = ColorManager.backgroundAlt;
    barStack.size = new Size(width, barHeight);
    barStack.centerAlignContent();

    // Draw model dots using DrawContext
    const ctx = new DrawContext();
    ctx.size = new Size(width, rangeHeight);
    ctx.opaque = false;
    ctx.respectScreenScale = true;

    // Model dots
    sortedModels.forEach(([modelName, usage]) => {
      const range = rangeMax - rangeMin;
      const position = range > 0 ? (usage - rangeMin) / range : 0.5;
      const xPos = position * (width - dotSize);
      const yPos = (rangeHeight - dotSize) / 2;

      ctx.setFillColor(ColorManager.getDrawColor(ModelManager.getModelColorKey(modelName)));
      ctx.fillEllipse(new Rect(xPos + 1, yPos + 1, dotSize - 2, dotSize - 2));
      ctx.setStrokeColor(ColorManager.getDrawColor('background'));
      ctx.setLineWidth(2);
      ctx.strokeEllipse(new Rect(xPos + 1, yPos + 1, dotSize - 2, dotSize - 2));
    });

    const rangeImage = barStack.addImage(ctx.getImage());
    rangeImage.imageSize = new Size(width, rangeHeight);

    // Labels
    const labelStack = rangeContainer.addStack();
    labelStack.layoutHorizontally();
    labelStack.size = new Size(width, 0);

    const minLabel = labelStack.addText(Utils.formatNumber(rangeMin));
    minLabel.font = Font.caption2();
    minLabel.textColor = ColorManager.secondary;

    labelStack.addSpacer();

    const maxLabel = labelStack.addText(Utils.formatNumber(rangeMax));
    maxLabel.font = Font.caption2();
    maxLabel.textColor = ColorManager.secondary;
  }

  static createLegend(parent, usedModels) {
    const modelEntries = Object.entries(usedModels).filter(([_, info]) => info.totalUsage > 0);

    if (modelEntries.length === 0) return;

    const legendContainer = parent.addStack();
    legendContainer.layoutVertically();
    legendContainer.spacing = 4;

    for (let i = 0; i < modelEntries.length; i += 2) {
      const row = legendContainer.addStack();
      row.layoutHorizontally();

      this._createLegendItem(row, modelEntries[i][0]);

      if (i + 1 < modelEntries.length) {
        row.addSpacer();
        this._createLegendItem(row, modelEntries[i + 1][0]);
      }
    }

    return legendContainer;
  }

  static _createLegendItem(parent, modelName) {
    const item = parent.addStack();
    item.layoutHorizontally();
    item.centerAlignContent();
    item.spacing = 4;

    const colorDot = item.addText("●");
    colorDot.textColor = ModelManager.getModelColor(modelName);
    colorDot.font = Font.systemFont(8);

    const nameText = item.addText(ModelManager.getSimplifiedModelName(modelName));
    nameText.font = Font.systemFont(10);
    nameText.textColor = ColorManager.primary;
  }

  static createProviderLegend(parent, usedModels) {
    const modelProviders = DataProcessor.getModelProviders(usedModels);
    const legendStack = parent.addStack();
    legendStack.layoutHorizontally();
    legendStack.spacing = 8;

    Object.entries(modelProviders).forEach(([provider, modelsOfProvider]) => {
      if (modelsOfProvider.length > 0) {
        const providerLegend = legendStack.addStack();
        providerLegend.layoutHorizontally();
        providerLegend.spacing = 4;

        const representativeModel = modelsOfProvider[0];
        const colorDot = providerLegend.addText("●");
        colorDot.textColor = ModelManager.getModelColor(representativeModel);
        colorDot.font = Font.systemFont(10);

        const providerText = providerLegend.addText(provider);
        providerText.font = Font.caption2();
        providerText.textColor = ColorManager.primary;
      }
    });
  }
}

// ================= BASE WIDGET CLASS ==================
class BaseWidget {
  constructor(user, data, dataFetcher) {
    this.user = user;
    this.data = data;
    this.dataFetcher = dataFetcher;
    this.widgetSize = SizeManager.getWidgetSize(18, 12);
    this.widget = new ListWidget();
    this.widget.backgroundColor = ColorManager.background;
    this.widget.useDefaultPadding();
  }

  async create() {
    throw new Error('create() must be implemented by subclass');
  }

  getWidget() {
    return this.widget;
  }

  _addBalance(parent, fontSize = 20) {
    const balanceText = parent.addText(`$${this.data.balance}`);
    balanceText.font = Font.semiboldMonospacedSystemFont(fontSize);
    balanceText.textColor = ColorManager.primary;
    return balanceText;
  }

  _addUsername(parent) {
    const nameStack = parent.addStack();
    nameStack.addSpacer();
    const displayName = nameStack.addText(this.user.display_name);
    displayName.font = Font.thinSystemFont(14);
    displayName.textColor = ColorManager.secondary;
    return nameStack;
  }

  _createInfoRow(parent, type, todayValue, totalValue, iconSize = 16) {
    const row = parent.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();
    UIComponents.createInfoItem(row, type, todayValue, { iconSize, showCaption: false });
    row.addSpacer();
    const total = row.addText(totalValue);
    total.font = Font.caption2();
    total.textColor = ColorManager.secondary;
    return row;
  }
}

// ================= SMALL WIDGET CLASS ==================
class SmallWidget extends BaseWidget {
  async create() {
    const weekData = await this.dataFetcher.fetchTimeSeriesData(7, 'day', true);
    const todaySpending = weekData[6].totalQuota / CONFIG.UNIT;

    this._addBalance(this.widget, 20);
    this.widget.addSpacer(8);

    UIComponents.createProgressStack(
      this.widget,
      this.widgetSize.width * UI_CONSTANTS.GAUGE_WIDTH_RATIO.SMALL,
      this.data,
      weekData
    );

    this.widget.addSpacer(8);

    const bottomSection = this.widget.addStack();
    bottomSection.layoutVertically();
    bottomSection.spacing = 4;

    const totalSpending = weekData.reduce((sum, day) => sum + day.totalQuota, 0) / CONFIG.UNIT;
    const todayRequests = weekData[6].modelCounts
      ? Object.values(weekData[6].modelCounts).reduce((sum, count) => sum + count, 0)
      : 0;

    this._createInfoRow(bottomSection, 'spending', `$${todaySpending.toFixed(2)}`, `$${totalSpending.toFixed(2)}`);
    this._createInfoRow(bottomSection, 'tokens', Utils.formatNumber(weekData[6].totalTokens), Utils.formatNumber(this.data.totalTokens));
    this._createInfoRow(bottomSection, 'requests', todayRequests.toString(), this.data.requestCount.toString());

    this.widget.addSpacer();

    return this.widget;
  }
}

// ================= MEDIUM WIDGET CLASS ==================
class MediumWidget extends BaseWidget {
  async create() {
    const weekData = await this.dataFetcher.fetchTimeSeriesData(7, 'day', true);

    const mainStack = this.widget.addStack();

    // Left side
    this._createLeftSection(mainStack, weekData);
    mainStack.addSpacer();

    // Right side
    this._createRightSection(mainStack, weekData);

    return this.widget;
  }

  _createLeftSection(parent, weekData) {
    const leftStack = parent.addStack();
    leftStack.layoutVertically();
    leftStack.size = new Size(
      this.widgetSize.width * UI_CONSTANTS.GAUGE_WIDTH_RATIO.MEDIUM,
      this.widgetSize.height
    );

    const topSection = leftStack.addStack();
    topSection.layoutVertically();
    topSection.spacing = 4;

    this._addBalance(topSection, 24);

    UIComponents.createProgressStack(
      topSection,
      this.widgetSize.width * UI_CONSTANTS.GAUGE_WIDTH_RATIO.MEDIUM,
      this.data,
      weekData
    );

    this._addInfoSection(topSection, weekData);

    leftStack.addSpacer();
  }

  _addInfoSection(parent, weekData) {
    const infoColumn = parent.addStack();
    infoColumn.layoutVertically();
    infoColumn.spacing = 2;

    const weekSpending = weekData.reduce((sum, day) => sum + day.totalQuota, 0) / CONFIG.UNIT;
    const weekTokens = weekData.reduce((sum, day) => sum + day.totalTokens, 0);
    const todaySpending = weekData[6].totalQuota / CONFIG.UNIT;
    const todayTokens = weekData[6].totalTokens;
    const todayRequests = weekData[6].modelCounts
      ? Object.values(weekData[6].modelCounts).reduce((sum, count) => sum + count, 0)
      : 0;

    this._createInfoRow(infoColumn, 'spending', `$${todaySpending.toFixed(2)}`, `$${weekSpending.toFixed(2)}`);
    this._createInfoRow(infoColumn, 'tokens', Utils.formatNumber(todayTokens), Utils.formatNumber(weekTokens));
    this._createInfoRow(infoColumn, 'requests', todayRequests.toString(), this.data.requestCount.toString());
  }

  _createRightSection(parent, weekData) {
    const rightStack = parent.addStack();
    rightStack.layoutVertically();
    rightStack.centerAlignContent();
    rightStack.size = new Size(
      this.widgetSize.width * (1 - UI_CONSTANTS.GAUGE_WIDTH_RATIO.MEDIUM),
      this.widgetSize.height
    );

    this._addUsername(rightStack);
    rightStack.addSpacer();

    const usedModels = DataProcessor.getUsedModels(weekData);
    ChartRenderer.createLegend(rightStack, usedModels);
    rightStack.addSpacer(8);

    const mediumChartHeight = this.widgetSize.height * 0.5;
    ChartRenderer.createChart(
      weekData,
      rightStack,
      this.widgetSize.width * (1 - UI_CONSTANTS.GAUGE_WIDTH_RATIO.MEDIUM),
      { spacing: 4, showWeekday: true, maxBarHeight: mediumChartHeight }
    );
  }
}

// ================= LARGE WIDGET CLASS ==================
class LargeWidget extends BaseWidget {
  async create() {
    const monthData = await this.dataFetcher.fetchTimeSeriesData(30, 'day', false);

    this._createTopSection(monthData);
    this.widget.addSpacer(12);

    UIComponents.createProgressStack(
      this.widget,
      UI_CONSTANTS.GAUGE_WIDTH_RATIO.LARGE * this.widgetSize.width,
      this.data,
      monthData
    );

    this.widget.addSpacer(12);

    this._createMiddleSection(monthData);
    this.widget.addSpacer(12);

    this._createMostUsedSection(monthData);
    this.widget.addSpacer(12);

    this._createBottomSection(monthData);

    this.widget.addSpacer();

    return this.widget;
  }

  _createTopSection(monthData) {
    const topSection = this.widget.addStack();
    topSection.layoutHorizontally();

    const leftStack = topSection.addStack();
    leftStack.layoutVertically();
    leftStack.spacing = 4;

    this._addBalance(leftStack, 24);
    topSection.addSpacer();
    this._addUsername(topSection);
  }

  _createMiddleSection(monthData) {
    const middleSection = this.widget.addStack();
    middleSection.layoutHorizontally();

    const monthSpending = monthData.reduce((sum, day) => sum + day.totalQuota, 0) / CONFIG.UNIT;
    UIComponents.createInfoItem(middleSection, 'spending', `$${monthSpending.toFixed(2)}`, { iconSize: 20 });
    middleSection.addSpacer();
    UIComponents.createInfoItem(middleSection, 'tokens', Utils.formatNumber(this.data.totalTokens), { iconSize: 20 });
    middleSection.addSpacer();
    UIComponents.createInfoItem(middleSection, 'requests', this.data.requestCount.toString(), { iconSize: 20 });
  }

  _createMostUsedSection(monthData) {
    const mostUsedSection = this.widget.addStack();
    mostUsedSection.layoutHorizontally();
    mostUsedSection.bottomAlignContent();

    const mostUsedModel = DataProcessor.getMostUsedModel(monthData);
    const modelUsageData = DataProcessor.getModelUsageData(monthData);

    UIComponents.createInfoItem(
      mostUsedSection,
      'mostUsed',
      ModelManager.getSimplifiedModelName(mostUsedModel),
      { iconSize: 20 }
    );
    mostUsedSection.addSpacer();
    ChartRenderer.createModelRangeIndicator(mostUsedSection, this.widgetSize.width * 0.5, modelUsageData);
  }

  _createBottomSection(monthData) {
    const bottomSection = this.widget.addStack();
    bottomSection.layoutVertically();

    const usedModels = DataProcessor.getUsedModels(monthData);
    const modelCount = Object.keys(usedModels).length;

    if (modelCount <= 4) {
      const legendStack = bottomSection.addStack();
      legendStack.layoutHorizontally();
      legendStack.spacing = 8;

      Object.entries(usedModels).forEach(([modelName, modelInfo]) => {
        if (modelInfo.totalUsage > 0) {
          const modelLegend = legendStack.addStack();
          modelLegend.layoutHorizontally();
          modelLegend.spacing = 4;

          const colorDot = modelLegend.addText("●");
          colorDot.textColor = ModelManager.getModelColor(modelName);
          colorDot.font = Font.systemFont(10);

          const nameText = modelLegend.addText(ModelManager.getSimplifiedModelName(modelName));
          nameText.font = Font.caption2();
          nameText.textColor = ColorManager.primary;
        }
      });
    } else {
      ChartRenderer.createProviderLegend(bottomSection, usedModels);
    }

    bottomSection.addSpacer(12);

    const chartHeight = this.widgetSize.height * 0.3;
    ChartRenderer.createChart(monthData, bottomSection, this.widgetSize.width, {
      spacing: 2,
      maxBarHeight: chartHeight,
    });
  }
}

// ================= WIDGET FACTORY CLASS ==================
class WidgetFactory {
  static async createWidget(widgetFamily, user, data, dataFetcher) {
    const widgetClasses = {
      small: SmallWidget,
      medium: MediumWidget,
      large: LargeWidget,
    };

    const WidgetClass = widgetClasses[widgetFamily] || SmallWidget;
    const widgetInstance = new WidgetClass(user, data, dataFetcher);
    return await widgetInstance.create();
  }
}

// ================= MAIN APPLICATION CLASS ==================
class PackyUsageApp {
  constructor() {
    this.dataFetcher = new DataFetcher();
    this.parseWidgetParameters();
  }

  parseWidgetParameters() {
    if (config.widgetFamily) {
      const param = (args.widgetParameter || "").trim();
      if (param) {
        param.split("&").forEach(p => {
          const [key, value] = p.split("=");
          if (key === "id" && !CONFIG.USER_ID) CONFIG.USER_ID = value;
          if (key === "session" && !CONFIG.SESSION) CONFIG.SESSION = value;
        });
      }
    }
  }

  async run() {
    try {
      if (CONFIG.DEBUG) {
        return this.runDebugMode();
      }

      const { user, items } = await this.dataFetcher.fetchUserData();
      const processor = new DataProcessor(user, items);
      const data = processor.processData();

      const widgetFamily = config.widgetFamily || 'small';
      const widget = await WidgetFactory.createWidget(widgetFamily, user, data, this.dataFetcher);

      Script.setWidget(widget);
      Script.complete();
    } catch (error) {
      const errorWidget = UIComponents.createErrorWidget(error);
      Script.setWidget(errorWidget);
      Script.complete();
    }
  }

  runDebugMode() {
    const widget = new ListWidget();
    widget.backgroundColor = ColorManager.background;
    widget.useDefaultPadding();

    const screenSize = Device.screenSize();
    const isPortrait = Device.isInPortrait();
    const widgetFamily = config.widgetFamily || 'small';
    const actualSize = SizeManager.getWidgetSize(0, 0);
    const sizedWithPadding = SizeManager.getWidgetSize(18, 12);

    // Title
    const title = widget.addText('🔧 DEBUG INFO');
    title.font = Font.boldSystemFont(16);
    title.textColor = ColorManager.primary;
    widget.addSpacer(8);

    // Debug info
    const debugInfo = [
      `Device: ${Device.isPad() ? 'iPad' : 'iPhone'}`,
      `Screen: ${Math.round(screenSize.width)} × ${Math.round(screenSize.height)}`,
      `Orientation: ${isPortrait ? 'Portrait' : 'Landscape'}`,
      `Widget Family: ${widgetFamily}`,
      `Actual Size: ${Math.round(actualSize.width)} × ${Math.round(actualSize.height)}`,
      `With Padding(18,12): ${Math.round(sizedWithPadding.width)} × ${Math.round(sizedWithPadding.height)}`,
      `User ID: ${CONFIG.USER_ID || 'Not Set'}`,
      `Dark Mode: ${Device.isUsingDarkAppearance() ? 'Yes' : 'No'}`
    ];

    debugInfo.forEach(info => {
      const text = widget.addText(info);
      text.font = Font.systemFont(12);
      text.textColor = ColorManager.secondary;
    });

    Script.setWidget(widget);
    Script.complete();
  }
}

// ================= ENTRY POINT ==================
const app = new PackyUsageApp();
app.run();
