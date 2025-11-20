# Changelog

所有对此项目的重要更改都会记录在此文件中。

## [1.1.0] - 2025-11-20

### Added
- 完整的中文文档支持 (README.zh-CN.md)
- 所有 45 个 AI 模型的完整颜色和简化名称映射
- 改进的模型名称简化逻辑，支持更细致的分类
- 新增 Gemini 3 系列模型支持 (gemini-3-pro 及其变体)

### Changed
- 进度条渲染优化 - 使用 DrawContext 绘制路径替代 Stack 叠加
- 范围指示器布局改进 - 模型点显示更加均匀分布

### Model Support
- 新增 GPT 5.1 Codex 的所有变体 (mini, max, max-high, max-xhigh)
- 新增 Gemini 3 Pro 系列 (low, high, preview)

---

## [1.0.0] - 2025-11-19

### Added
- Initial release of Packy Usage Widget
- Support for three widget sizes: Small, Medium, Large
- Real-time API usage tracking and display
- Dark and light mode support
- Model-specific color coding
- Advanced visualizations with progress bars and charts
- Multi-model usage tracking
