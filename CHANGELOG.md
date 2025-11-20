# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-11-21

### Changed
- **ColorManager refactored to use Proxy**: Replaced class-based implementation with JavaScript Proxy for elegant dynamic property access
- **Unified ModelManager configuration**: Merged separate pattern arrays into single `MODEL_CONFIGS` array with `pattern`, `name`, and `colorKey` properties
- Improved code maintainability and reduced duplication across manager classes

### Technical Details
- ColorManager is now a Proxy object that dynamically provides color properties
- All model configurations centralized in unified structure for easier maintenance
- Added `getModelConfig()` as internal helper method for pattern-based model lookups
- Removed redundant methods and simplified color/model management logic

## [1.1.0] - 2025-11-20

### Added
- Full Chinese documentation support (README.zh-CN.md)
- Complete color and simplified name mappings for all 45 AI models
- Improved model name simplification logic with more detailed categorization
- New Gemini 3 series model support (gemini-3-pro and its variants)

### Changed
- Progress bar rendering optimization - Using DrawContext path drawing instead of Stack overlay
- Range indicator layout improvements - More evenly distributed model point display

### Model Support
- Added all GPT 5.1 Codex variants (mini, max, max-high, max-xhigh)
- Added Gemini 3 Pro series (low, high, preview)

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
