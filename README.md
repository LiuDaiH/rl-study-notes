# RL Study Notes — 强化学习学习笔记

> *Systematic reading notes on Sutton & Barto's "Reinforcement Learning: An Introduction" (2nd Edition)*  
> *基于 Sutton & Barto《强化学习》第2版的系统性精读笔记*

[中文](#-中文) | [English](#-english)

---

## 🇨🇳 中文

基于 Sutton & Barto《Reinforcement Learning: An Introduction》(2nd Edition) 的系统性精读笔记，以结构化 Word 文档呈现核心概念、公式推导与直觉解释。

### 📖 当前进度

| 笔记 | 覆盖章节 | 核心主题 | 状态 |
|------|---------|---------|------|
| [Ch1-6](RL_Study_Notes_Ch1_6.docx) | 第 1-6 章 | MDP · 贝尔曼方程 · Q-learning · 策略梯度 | ✅ 完成 |
| [Ch7-9](RL_Study_Notes_Ch7_9.docx) | 第 7-9 章 | n步自举 · Dyna-Q · 优先遍历 · 函数逼近 · 致命三元组 | ✅ 完成 |

### 🎯 笔记特色

- **公式块** — 关键公式以浅蓝底色 + Courier New 字体呈现，标注原著公式编号
- **原文引用** — 橙色关键摘录框保留英文原文，忠实于原著表达
- **对比表格** — 深蓝表头 + 斑马纹的双列对照表，直观展示方法差异
- **直觉解释** — 每个技术概念配有通俗直觉解读，不只是数学定义

### 📁 仓库结构

```
rl-study-notes/
├── README.md                        # 本文件
├── RL_Study_Notes_Ch1_6.docx        # 第1-6章精读笔记
├── RL_Study_Notes_Ch7_9.docx        # 第7-9章精读笔记
├── ideas.md                         # 精读灵感与实验方向记录
├── generate_rl_doc.js              # Word 文档生成脚本 (Node.js + docx.js)
├── generate_ch7_9.js               # 第7-9章文档生成脚本
├── package.json                     # 依赖配置
└── package-lock.json
```

### 🔧 生成工具

笔记使用 Node.js `docx` 库自动生成。如需本地运行：

```bash
npm install
node generate_rl_doc.js
```

此外，该工作流已封装为 WorkBuddy 技能 `pdf-study-notes`，可用于任意 PDF 教材的结构化笔记生成。

### 📚 参考

- Sutton, R. S., & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.). MIT Press.
- 官方网站: http://incompleteideas.net/book/the-book-2nd.html

---

## 🇬🇧 English

Systematic reading notes based on Sutton & Barto's *Reinforcement Learning: An Introduction* (2nd Edition), presenting core concepts, formula derivations, and intuitive explanations in professionally formatted Word documents.

### 📖 Current Progress

| Notes | Chapters | Key Topics | Status |
|-------|----------|------------|--------|
| [Ch1-6](RL_Study_Notes_Ch1_6.docx) | Chapters 1–6 | MDP · Bellman Equations · Q-learning · Policy Gradient | ✅ Done |
| [Ch7-9](RL_Study_Notes_Ch7_9.docx) | Chapters 7–9 | n-step TD · Dyna-Q · Prioritized Sweeping · Function Approximation · Deadly Triad | ✅ Done |

> **Note**: The study notes (.docx) are currently in Chinese. An English translation is planned for future releases. However, all formulas and references to the original English textbook are preserved, making the document accessible to non-Chinese readers familiar with the source material.

### 🎯 Note Features

- **Formula Blocks** — Key equations presented in Courier New font on light blue backgrounds, with original textbook equation numbers
- **Original Quotes** — Key excerpts from the textbook preserved in English within orange-bordered callout boxes
- **Comparison Tables** — Dark blue header + zebra-striped two-column tables for method comparisons
- **Intuitive Explanations** — Every technical concept includes plain-language intuition, not just mathematical definitions

### 📁 Repository Structure

```
rl-study-notes/
├── README.md                        # This file
├── RL_Study_Notes_Ch1_6.docx        # Chapters 1-6 study notes (Word)
├── RL_Study_Notes_Ch7_9.docx        # Chapters 7-9 study notes (Word)
├── ideas.md                         # Reading inspirations & experiment ideas
├── generate_rl_doc.js              # Word document generation script (Node.js + docx.js)
├── generate_ch7_9.js               # Chapters 7-9 document generation script
├── package.json                     # Dependencies
└── package-lock.json
```

### 🔧 Generation Tool

Notes are auto-generated using the Node.js `docx` library. To run locally:

```bash
npm install
node generate_rl_doc.js
```

This workflow has also been packaged as a WorkBuddy skill called `pdf-study-notes`, enabling structured note generation from any PDF textbook.

### 📚 References

- Sutton, R. S., & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.). MIT Press.
- Official website: http://incompleteideas.net/book/the-book-2nd.html

---

**作者 / Author**: [LiuDaiH](https://github.com/LiuDaiH) | **整理日期 / Date**: 2026-07-07
