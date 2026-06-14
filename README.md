# RL Study Notes — 强化学习学习笔记

基于 Sutton & Barto《Reinforcement Learning: An Introduction》(2nd Edition) 的系统性精读笔记，以结构化 Word 文档呈现核心概念、公式推导与直觉解释。

## 📖 当前进度

| 笔记 | 覆盖章节 | 核心主题 | 状态 |
|------|---------|---------|------|
| [Ch1-6](RL_Study_Notes_Ch1_6.docx) | 第 1-6 章 | MDP · 贝尔曼方程 · Q-learning · 策略梯度 | ✅ 完成 |

## 🎯 笔记特色

- **公式块** — 关键公式以浅蓝底色 + Courier New 字体呈现，标注原著公式编号
- **原文引用** — 橙色关键摘录框保留英文原文，忠实于原著表达
- **对比表格** — 深蓝表头 + 斑马纹的双列对照表，直观展示方法差异
- **直觉解释** — 每个技术概念配有通俗直觉解读，不只是数学定义

## 📁 仓库结构

```
rl-study-notes/
├── README.md                        # 本文件
├── RL_Study_Notes_Ch1_6.docx        # 第1-6章精读笔记
├── generate_rl_doc.js              # Word 文档生成脚本 (Node.js + docx.js)
├── package.json                     # 依赖配置
└── package-lock.json
```

## 🔧 生成工具

笔记使用 Node.js `docx` 库自动生成。如需本地运行：

```bash
npm install
node generate_rl_doc.js
```

此外，该工作流已封装为 WorkBuddy 技能 `pdf-study-notes`，可用于任意 PDF 教材的结构化笔记生成。

## 📚 参考

- Sutton, R. S., & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.). MIT Press.
- 官方网站: http://incompleteideas.net/book/the-book-2nd.html

---

**作者**: LiuDaiH | **整理日期**: 2026-06-14
