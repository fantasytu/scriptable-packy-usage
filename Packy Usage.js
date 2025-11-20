// ================= PACKY USAGE WIDGET ==================
// Author: Fantasy Tu
// Date: 2025-11-19
// Description: A Scriptable widget to display API usage statistics
// ======================================================

// ================= CONFIGURATION ==================
const CONFIG = {
  API_BASE_URL: "https://www.packyapi.com",
  USER_ID: "",
  SESSION: "",
  UNIT: 500000,
  DAYS_TO_FETCH: 30,
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

// ================= COLOR MANAGER CLASS ==================
class ColorManager {
  static primary = Color.dynamic(new Color("#000000"), new Color("#FFFFFF"));
  static secondary = Color.dynamic(new Color("#8E8E93"), new Color("#636366"));
  static background = Color.dynamic(new Color("#F2F2F7"), new Color("#1C1C1E"));
  static backgroundMid = Color.dynamic(new Color("#EBEBF0"), new Color("#2C2C2E"));
  static backgroundAlt = Color.dynamic(new Color("#E5E5EA"), new Color("#3A3A3C"));
  static progressBackground = Color.dynamic(new Color("#D1D1D6"), new Color("#48484A"));
  static usageProgress = Color.dynamic(new Color("#5E5CE6"), new Color("#5E5CE6"));
  static error = Color.dynamic(new Color("#FF3B30"), new Color("#FF453A"));
  static success = Color.dynamic(new Color("#34C759"), new Color("#30D158"));

  static MODEL_COLORS = {
    'gpt-5': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-codex': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-codex-mini': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-codex-mini-high': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-codex-mini-medium': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-codex-high': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-codex-medium': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-codex-low': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-high': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-low': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-medium': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5-minimal': Color.dynamic(new Color("#007AFF"), new Color("#0A84FF")),
    'gpt-5.1': Color.dynamic(new Color("#0052CC"), new Color("#0066FF")),
    'gpt-5.1-codex': Color.dynamic(new Color("#0052CC"), new Color("#0066FF")),
    'gpt-5.1-codex-mini': Color.dynamic(new Color("#0052CC"), new Color("#0066FF")),
    'gpt-5.1-codex-max': Color.dynamic(new Color("#0052CC"), new Color("#0066FF")),
    'gpt-5.1-codex-max-high': Color.dynamic(new Color("#0052CC"), new Color("#0066FF")),
    'gpt-5.1-codex-max-xhigh': Color.dynamic(new Color("#0052CC"), new Color("#0066FF")),
    'gpt-5.1-high': Color.dynamic(new Color("#0052CC"), new Color("#0066FF")),
    'gpt-5.1-low': Color.dynamic(new Color("#0052CC"), new Color("#0066FF")),
    'gpt-5.1-medium': Color.dynamic(new Color("#0052CC"), new Color("#0066FF")),
    'gpt-5.1-minimal': Color.dynamic(new Color("#0052CC"), new Color("#0066FF")),
    'claude-3-5-haiku-20241022': Color.dynamic(new Color("#FFB800"), new Color("#FFD60A")),
    'claude-haiku-4-5-20251001': Color.dynamic(new Color("#FFB800"), new Color("#FFD60A")),
    'claude-3-5-sonnet-20240620': Color.dynamic(new Color("#FF8C00"), new Color("#FFAB00")),
    'claude-3-5-sonnet-20241022': Color.dynamic(new Color("#FF8C00"), new Color("#FFAB00")),
    'claude-3-7-sonnet-20250219': Color.dynamic(new Color("#FF8C00"), new Color("#FFAB00")),
    'claude-sonnet-4-20250514': Color.dynamic(new Color("#FF8C00"), new Color("#FFAB00")),
    'claude-sonnet-4-5-20250929': Color.dynamic(new Color("#FF8C00"), new Color("#FFAB00")),
    'claude-sonnet-4-5-20250929-thinking': Color.dynamic(new Color("#FF8C00"), new Color("#FFAB00")),
    'claude-opus-4-1-20250805': Color.dynamic(new Color("#FF3B00"), new Color("#FF5733")),
    'claude-opus-4-20250514': Color.dynamic(new Color("#FF3B00"), new Color("#FF5733")),
    'gemini-2.5-flash': Color.dynamic(new Color("#C77DFF"), new Color("#D896FF")),
    'gemini-2.5-flash-image': Color.dynamic(new Color("#C77DFF"), new Color("#D896FF")),
    'gemini-2.5-flash-nothinking': Color.dynamic(new Color("#C77DFF"), new Color("#D896FF")),
    'gemini-2.5-flash-thinking': Color.dynamic(new Color("#C77DFF"), new Color("#D896FF")),
    'gemini-2.5-pro': Color.dynamic(new Color("#9D4EDD"), new Color("#B565F2")),
    'gemini-2.5-pro-nothinking': Color.dynamic(new Color("#9D4EDD"), new Color("#B565F2")),
    'gemini-2.5-pro-thinking': Color.dynamic(new Color("#9D4EDD"), new Color("#B565F2")),
    'gemini-3-pro': Color.dynamic(new Color("#7C3AED"), new Color("#A78BFA")),
    'gemini-3-pro-low': Color.dynamic(new Color("#7C3AED"), new Color("#A78BFA")),
    'gemini-3-pro-high': Color.dynamic(new Color("#7C3AED"), new Color("#A78BFA")),
    'gemini-3-pro-preview': Color.dynamic(new Color("#7C3AED"), new Color("#A78BFA")),
    'sora_video2': Color.dynamic(new Color("#34C759"), new Color("#30D158")),
    'veo_3_1': Color.dynamic(new Color("#28A745"), new Color("#32CD32")),
    'veo_3_1-fast': Color.dynamic(new Color("#28A745"), new Color("#32CD32")),
    'veo_3_1-landscape-fast': Color.dynamic(new Color("#28A745"), new Color("#32CD32")),
    'veo_3_1-portrait-fast': Color.dynamic(new Color("#28A745"), new Color("#32CD32")),
  };

  static getModelColor(modelName) {
    return this.MODEL_COLORS[modelName] || Color.dynamic(new Color("#32D74B"), new Color("#28A745"));
  }

  static getSimplifiedModelName(modelName) {
    if (!modelName || modelName.trim() === '') return 'No Model Used';

    // GPT models
    if (modelName.includes('gpt-5.1')) {
      if (modelName.includes('codex')) {
        if (modelName.includes('max-xhigh')) return 'GPT 5.1 Max XHi';
        if (modelName.includes('max-high')) return 'GPT 5.1 Max Hi';
        if (modelName.includes('max')) return 'GPT 5.1 Max';
        if (modelName.includes('mini')) return 'GPT 5.1 Mini';
        return 'GPT 5.1 Codex';
      }
      if (modelName.includes('high')) return 'GPT 5.1 Hi';
      if (modelName.includes('low')) return 'GPT 5.1 Lo';
      if (modelName.includes('medium')) return 'GPT 5.1 Med';
      if (modelName.includes('minimal')) return 'GPT 5.1 Min';
      return 'GPT 5.1';
    }

    if (modelName.includes('gpt-5')) {
      if (modelName.includes('codex')) {
        if (modelName.includes('mini')) {
          if (modelName.includes('medium')) return 'GPT 5 Mini Med';
          if (modelName.includes('high')) return 'GPT 5 Mini Hi';
          return 'GPT 5 Mini';
        }
        if (modelName.includes('high')) return 'GPT 5 Codex Hi';
        if (modelName.includes('medium')) return 'GPT 5 Codex Med';
        if (modelName.includes('low')) return 'GPT 5 Codex Lo';
        return 'GPT 5 Codex';
      }
      if (modelName.includes('high')) return 'GPT 5 Hi';
      if (modelName.includes('low')) return 'GPT 5 Lo';
      if (modelName.includes('medium')) return 'GPT 5 Med';
      if (modelName.includes('minimal')) return 'GPT 5 Min';
      return 'GPT 5';
    }

    // Claude models
    if (modelName.includes('claude')) {
      if (modelName.includes('opus')) return 'Claude Opus';
      if (modelName.includes('sonnet')) return 'Claude Sonnet';
      if (modelName.includes('haiku')) return 'Claude Haiku';
    }

    // Gemini models
    if (modelName.includes('gemini')) {
      if (modelName.includes('gemini-3')) {
        if (modelName.includes('low')) return 'Gemini 3 Lo';
        if (modelName.includes('high')) return 'Gemini 3 Hi';
        if (modelName.includes('preview')) return 'Gemini 3 Pre';
        return 'Gemini 3';
      }
      if (modelName.includes('gemini-2.5')) {
        if (modelName.includes('pro')) return 'Gemini 2.5 Pro';
        if (modelName.includes('flash')) return 'Gemini 2.5 Flash';
      }
      return 'Gemini';
    }

    // Video/Image models
    if (modelName.includes('sora')) return 'Sora';
    if (modelName.includes('veo')) return 'VeO';

    return modelName;
  }

  static getRemainingPercentageColor(percentage) {
    if (percentage >= UI_CONSTANTS.THRESHOLDS.GOOD) return Color.green();
    if (percentage <= UI_CONSTANTS.THRESHOLDS.WARNING) return Color.red();
    return Color.yellow();
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

  static computeWidgetSize(widgetPadding) {
    const deviceScreen = Device.screenSize();
    let iconSize = 110;
    let gutterSize = (deviceScreen.width - 240) / 5;

    if (Device.isPad()) {
      const width = Math.max(deviceScreen.width, deviceScreen.height);
      iconSize = 55;
      gutterSize = (width - 360) / 7;
    }

    const extraSize = 10 - widgetPadding;
    const baseSize = gutterSize + iconSize + extraSize;

    const widgetSizing = config.widgetFamily || "small";
    const sizes = {
      small: new Size(baseSize, baseSize),
      medium: new Size(gutterSize * 3 + iconSize * 2 + extraSize, baseSize),
      large: new Size(gutterSize * 3 + iconSize * 2 + extraSize, gutterSize * 3 + iconSize * 2 + extraSize),
    };

    return sizes[widgetSizing] || sizes.small;
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
      ctxProgress.setFillColor(ColorManager.usageProgress);
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

    ctxProgress.setTextColor(ColorManager.background);
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
        modelStack.backgroundColor = ColorManager.getModelColor(modelName);
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

      ctx.setFillColor(ColorManager.getModelColor(modelName));
      ctx.fillEllipse(new Rect(xPos + 1, yPos + 1, dotSize - 2, dotSize - 2));
      ctx.setStrokeColor(ColorManager.background);
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
    colorDot.textColor = ColorManager.getModelColor(modelName);
    colorDot.font = Font.systemFont(8);

    const nameText = item.addText(ColorManager.getSimplifiedModelName(modelName));
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
        colorDot.textColor = ColorManager.getModelColor(representativeModel);
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
    this.widgetSize = Utils.computeWidgetSize(12);
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
    infoColumn.spacing = 4;

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
      ColorManager.getSimplifiedModelName(mostUsedModel),
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
          colorDot.textColor = ColorManager.getModelColor(modelName);
          colorDot.font = Font.systemFont(10);

          const nameText = modelLegend.addText(ColorManager.getSimplifiedModelName(modelName));
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
}

// ================= ENTRY POINT ==================
const app = new PackyUsageApp();
app.run();
