const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, WidthType, Table, TableRow, TableCell,
  ShadingType, LevelFormat, Header, Footer, PageNumber, ExternalHyperlink,
  Bookmark, TableOfContents
} = require('docx');
const fs = require('fs');

// ====== 颜色常量 ======
const BLUE_DARK = '1F3864';
const BLUE_MID = '2E75B6';
const BLUE_LIGHT = 'D6E4F0';
const ORANGE = 'C55A11';
const GREEN_DARK = '375623';
const GRAY_LIGHT = 'F2F2F2';
const BORDER_COLOR = 'BBBBBB';

function makeBorder(color) {
  return { style: BorderStyle.SINGLE, size: 6, color: color || BORDER_COLOR };
}

function cellBorders(color) {
  const b = makeBorder(color || BORDER_COLOR);
  return { top: b, bottom: b, left: b, right: b };
}

// ====== 标题辅助 ======
function h1(text, anchor) {
  const children = anchor
    ? [new Bookmark({ id: anchor, children: [new TextRun({ text, color: 'FFFFFF', bold: true, size: 32, font: 'Microsoft YaHei' })] })]
    : [new TextRun({ text, color: 'FFFFFF', bold: true, size: 32, font: 'Microsoft YaHei' })];
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children,
    shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
    spacing: { before: 360, after: 180 },
    border: { bottom: makeBorder(BLUE_MID) },
  });
}

function h2(text, anchor) {
  const children = anchor
    ? [new Bookmark({ id: anchor, children: [new TextRun({ text, color: BLUE_DARK, bold: true, size: 28, font: 'Microsoft YaHei' })] })]
    : [new TextRun({ text, color: BLUE_DARK, bold: true, size: 28, font: 'Microsoft YaHei' })];
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children,
    spacing: { before: 280, after: 120 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: BLUE_MID } },
    indent: { left: 200 },
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, color: ORANGE, bold: true, size: 24, font: 'Microsoft YaHei' })],
    spacing: { before: 200, after: 80 },
  });
}

function body(text, opts) {
  return new Paragraph({
    children: [new TextRun({
      text,
      size: 22,
      font: 'Microsoft YaHei',
      ...(opts || {}),
    })],
    spacing: { after: 100, line: 360 },
    indent: { left: 0 },
  });
}

function bodyMixed(runs) {
  return new Paragraph({
    children: runs.map(r => new TextRun({
      text: r.text,
      size: r.size || 22,
      font: r.font || 'Microsoft YaHei',
      bold: r.bold || false,
      color: r.color || '000000',
      italics: r.italics || false,
    })),
    spacing: { after: 100, line: 360 },
  });
}

function bullet(text, level) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: level || 0 },
    children: [new TextRun({ text, size: 22, font: 'Microsoft YaHei' })],
    spacing: { after: 80, line: 340 },
  });
}

function formulaBlock(formula, desc) {
  const rows = [
    new TableRow({
      children: [
        new TableCell({
          borders: cellBorders(BLUE_MID),
          shading: { fill: 'EBF3FB', type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 240, right: 240 },
          width: { size: 9360, type: WidthType.DXA },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: formula, font: 'Courier New', size: 22, bold: true, color: BLUE_DARK })],
              spacing: { after: desc ? 80 : 0 },
            }),
            ...(desc ? [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: desc, size: 18, color: '666666', font: 'Microsoft YaHei', italics: true })],
            })] : []),
          ],
        }),
      ],
    }),
  ];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows,
    margins: { top: 160, bottom: 160 },
  });
}

function keyBox(title, content) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders(ORANGE),
            shading: { fill: 'FFF3E0', type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 240, right: 240 },
            width: { size: 9360, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [new TextRun({ text: '  ' + title, bold: true, size: 22, color: ORANGE, font: 'Microsoft YaHei' })],
                spacing: { after: 80 },
              }),
              new Paragraph({
                children: [new TextRun({ text: content, size: 21, font: 'Microsoft YaHei', color: '333333' })],
              }),
            ],
          }),
        ],
      }),
    ],
    margins: { top: 160, bottom: 160 },
  });
}

function infoBox(title, content, color) {
  const fillColor = color || BLUE_LIGHT;
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders(BLUE_MID),
            shading: { fill: fillColor, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 240, right: 240 },
            width: { size: 9360, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [new TextRun({ text: title, bold: true, size: 22, color: BLUE_DARK, font: 'Microsoft YaHei' })],
                spacing: { after: 80 },
              }),
              ...(Array.isArray(content)
                ? content.map(c => new Paragraph({ children: [new TextRun({ text: c, size: 21, font: 'Microsoft YaHei' })], spacing: { after: 60 } }))
                : [new Paragraph({ children: [new TextRun({ text: content, size: 21, font: 'Microsoft YaHei' })] })]),
            ],
          }),
        ],
      }),
    ],
    margins: { top: 160, bottom: 160 },
  });
}

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' } },
    spacing: { after: 160 },
    children: [],
  });
}

function space(n) {
  return new Paragraph({ children: [new TextRun('')], spacing: { after: (n || 1) * 80 } });
}

function twoColTable(headers, rows) {
  const border = { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR };
  const borders = { top: border, bottom: border, left: border, right: border };
  const headerRow = new TableRow({
    children: headers.map((h, i) => new TableCell({
      borders,
      shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
      width: { size: i === 0 ? 2800 : 6560, type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20, font: 'Microsoft YaHei' })] })],
    })),
  });
  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => new TableCell({
      borders,
      shading: { fill: ri % 2 === 0 ? 'FFFFFF' : GRAY_LIGHT, type: ShadingType.CLEAR },
      width: { size: ci === 0 ? 2800 : 6560, type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, font: 'Microsoft YaHei' })] })],
    })),
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 6560],
    rows: [headerRow, ...dataRows],
    margins: { top: 160, bottom: 160 },
  });
}

// ===================================================================
// 文档主体内容
// ===================================================================
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '\u25CF', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 600, hanging: 300 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '\u25CB', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1000, hanging: 300 } } } },
        ],
      },
      {
        reference: 'numbers',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 600, hanging: 300 } } } },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: 'Microsoft YaHei', size: 22 } },
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Microsoft YaHei', color: 'FFFFFF' },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Microsoft YaHei', color: BLUE_DARK },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Microsoft YaHei', color: ORANGE },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Sutton & Barto《强化学习》精读笔记 — 第1-6章核心概念', size: 18, color: '888888', font: 'Microsoft YaHei' }),
              ],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' } },
              alignment: AlignmentType.RIGHT,
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: '第 ', size: 18, color: '888888', font: 'Microsoft YaHei' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888' }),
                new TextRun({ text: ' 页', size: 18, color: '888888', font: 'Microsoft YaHei' }),
              ],
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' } },
            }),
          ],
        }),
      },
      children: [
        // ============================================================
        // 封面/标题区
        // ============================================================
        new Paragraph({
          children: [
            new TextRun({ text: 'Sutton & Barto', size: 52, bold: true, color: BLUE_DARK, font: 'Microsoft YaHei' }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 720, after: 80 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '《强化学习》精读笔记', size: 52, bold: true, color: BLUE_DARK, font: 'Microsoft YaHei' }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Reinforcement Learning: An Introduction (2nd Edition)', size: 22, color: '888888', italics: true, font: 'Microsoft YaHei' }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
        }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders(BLUE_MID),
                  shading: { fill: BLUE_LIGHT, type: ShadingType.CLEAR },
                  margins: { top: 100, bottom: 100, left: 200, right: 200 },
                  width: { size: 4680, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: '覆盖章节', bold: true, size: 20, font: 'Microsoft YaHei', color: BLUE_DARK })] }),
                    new Paragraph({ children: [new TextRun({ text: '第1-6章（前半部分）', size: 20, font: 'Microsoft YaHei' })] }),
                  ],
                }),
                new TableCell({
                  borders: cellBorders(BLUE_MID),
                  shading: { fill: BLUE_LIGHT, type: ShadingType.CLEAR },
                  margins: { top: 100, bottom: 100, left: 200, right: 200 },
                  width: { size: 4680, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: '核心主题', bold: true, size: 20, font: 'Microsoft YaHei', color: BLUE_DARK })] }),
                    new Paragraph({ children: [new TextRun({ text: 'MDP · 贝尔曼方程 · Q-learning · 策略梯度', size: 20, font: 'Microsoft YaHei' })] }),
                  ],
                }),
              ],
            }),
          ],
          margins: { top: 0, bottom: 320 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '整理时间：2026年6月14日', size: 19, color: 'AAAAAA', font: 'Microsoft YaHei' })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 400 },
        }),
        divider(),

        // ============================================================
        // PART 1: 理解MDP
        // ============================================================
        h1('一、理解马尔可夫决策过程（MDP）', 'mdp'),
        space(1),

        h2('1.1 强化学习的核心要素', 'rl-elements'),
        body('强化学习（Reinforcement Learning, RL）是一种让智能体通过与环境交互来学习如何做出决策的框架。Sutton & Barto 将 RL 系统定义为由以下四个核心要素构成（第3章）：'),
        space(1),
        twoColTable(
          ['要素', '定义与作用'],
          [
            ['策略 (Policy) π', '定义智能体在给定状态下的行为方式。是从状态到动作（或动作概率分布）的映射：π(a|s)。策略是 RL 核心，单独决定行为。'],
            ['奖励信号 (Reward) R', '环境在每一时间步发送给智能体的单一数值信号。智能体的唯一目标是最大化长期累积奖励。是学习问题目标的直接定义。'],
            ['价值函数 (Value Function) V', '指定长期来看"什么是好的"。状态的价值 = 从该状态出发，遵循策略所能期望的累积奖励。比即时奖励更重要，是做决策的依据。'],
            ['环境模型 (Model)', '模拟环境行为的可选组件。给定状态和动作，预测下一状态和奖励，用于规划。无模型方法不需要它。'],
          ]
        ),
        space(1),

        h2('1.2 智能体-环境交互框架', 'agent-env'),
        bodyMixed([
          { text: '智能体在每个时间步 t 观察环境状态 ' },
          { text: 'S_t', bold: true, color: BLUE_DARK },
          { text: '，执行动作 ' },
          { text: 'A_t', bold: true, color: BLUE_DARK },
          { text: '，获得奖励 ' },
          { text: 'R_{t+1}', bold: true, color: BLUE_DARK },
          { text: ' 并进入新状态 ' },
          { text: 'S_{t+1}', bold: true, color: BLUE_DARK },
          { text: '，形成轨迹：' },
        ]),
        space(1),
        formulaBlock(
          'S_0, A_0, R_1, S_1, A_1, R_2, S_2, A_2, R_3, ...',
          '（智能体-环境交互序列，第3章 §3.1）'
        ),
        space(1),

        h2('1.3 马尔可夫性质与有限MDP', 'markov-property'),
        infoBox(
          '马尔可夫性质（Markov Property）',
          '状态信号必须包含过去智能体-环境交互的所有方面，这些方面与未来相关，且仅需通过当前状态就能做出最优决策。即：P(S_{t+1} | S_t, A_t) = P(S_{t+1} | S_0, A_0, S_1, A_1, ..., S_t, A_t)。满足马尔可夫性的 RL 任务称为马尔可夫决策过程（MDP）。'
        ),
        space(1),
        body('一个有限MDP由以下元素完整描述（§3.6）：'),
        bullet('状态集合 S（有限）'),
        bullet('动作集合 A（有限）'),
        bullet('奖励集合 R'),
        bullet('动态函数（转移概率）：p(s\', r | s, a) = Pr{S_{t+1}=s\', R_{t+1}=r | S_t=s, A_t=a}'),
        space(1),
        body('由动态函数 p 可推导出其他关键量（§3.6，公式3.7-3.9）：'),
        formulaBlock(
          'r(s,a) = E[R_{t+1} | S_t=s, A_t=a] = sum_r * r * sum_{s\'} p(s\',r|s,a)',
          '状态-动作对的期望奖励（公式3.7）'
        ),
        formulaBlock(
          'p(s\'|s,a) = Pr{S_{t+1}=s\' | S_t=s, A_t=a} = sum_r p(s\',r|s,a)',
          '状态转移概率（公式3.8）'
        ),
        space(1),

        h2('1.4 回报与折扣因子', 'return-discount'),
        body('智能体的目标是最大化期望累积回报（Expected Return）。对于连续任务，使用折扣回报（§3.3）：'),
        formulaBlock(
          'G_t = R_{t+1} + γR_{t+2} + γ²R_{t+3} + ... = sum_{k=0}^{∞} γ^k * R_{t+k+1}',
          '折扣回报，γ ∈ [0,1] 为折扣因子（公式3.5）'
        ),
        keyBox(
          '折扣因子 γ 的直觉理解',
          'γ=0：只关心即时奖励（极度短视）；γ=1：同等看待所有未来奖励（极度远视，需要有限步数收敛）；γ接近1：更重视长期回报，适合大多数实际任务。'
        ),
        space(2),
        divider(),

        // ============================================================
        // PART 2: 贝尔曼方程
        // ============================================================
        h1('二、贝尔曼方程（Bellman Equation）', 'bellman'),
        space(1),

        h2('2.1 状态价值函数与动作价值函数', 'value-functions'),
        body('价值函数是强化学习算法的核心工具，刻画了"状态有多好"或"在某状态执行某动作有多好"（§3.7）。'),
        space(1),
        formulaBlock(
          'v_π(s) = E_π[G_t | S_t=s] = E_π[sum_{k=0}^∞ γ^k * R_{t+k+1} | S_t=s]',
          '状态价值函数（State-Value Function）——遵循策略π，从状态s出发的期望回报（公式3.10）'
        ),
        formulaBlock(
          'q_π(s,a) = E_π[G_t | S_t=s, A_t=a] = E_π[sum_{k=0}^∞ γ^k * R_{t+k+1} | S_t=s, A_t=a]',
          '动作价值函数（Action-Value Function / Q函数）——从状态s执行动作a后遵循π的期望回报（公式3.11）'
        ),
        space(1),
        infoBox(
          '两种价值函数的关系',
          [
            '• v_π(s) = sum_a π(a|s) * q_π(s,a)  [状态价值 = 动作价值的加权平均]',
            '• q_π(s,a) = sum_{s\',r} p(s\',r|s,a) [r + γ * v_π(s\')]  [动作价值展开为即时奖励+后继状态价值]',
          ]
        ),
        space(1),

        h2('2.2 贝尔曼期望方程推导', 'bellman-derivation'),
        body('贝尔曼方程的核心思想是：当前状态的价值等于期望的即时奖励加上折扣后继状态的价值。完整推导（§3.7，公式3.12）：'),
        space(1),
        formulaBlock(
          'v_π(s) = sum_a π(a|s) * sum_{s\',r} p(s\',r|s,a) * [r + γ*v_π(s\')]',
          '贝尔曼期望方程（Bellman Expectation Equation）——核心公式3.12'
        ),
        body('这个方程的直观含义是：'),
        bullet('从状态 s 按策略 π 选择动作 a（概率 π(a|s)）'),
        bullet('环境以概率 p(s\',r|s,a) 给出奖励 r 并转到 s\''),
        bullet('当前状态的价值 = 所有可能路径下 [即时奖励 r + 折扣后继价值 γ·v_π(s\')] 的期望值'),
        space(1),
        keyBox(
          '原著关键原文（页面85）',
          '"Equation (3.12) is the Bellman equation for v_π. It expresses a relationship between the value of a state and the values of its successor states. The Bellman equation (3.12) averages over all the possibilities, weighting each by its probability of occurring."'
        ),
        space(1),

        h2('2.3 最优价值函数与贝尔曼最优方程', 'bellman-optimality'),
        body('强化学习的目标是找到最优策略 π*，使得所有状态的价值最大（§3.8）：'),
        formulaBlock(
          'v*(s) = max_π v_π(s) = max_a sum_{s\',r} p(s\',r|s,a) [r + γ*v*(s\')]',
          '贝尔曼最优方程（Bellman Optimality Equation）——状态价值（公式3.14）'
        ),
        formulaBlock(
          'q*(s,a) = sum_{s\',r} p(s\',r|s,a) [r + γ * max_{a\'} q*(s\',a\')]',
          '贝尔曼最优方程——动作价值（公式3.15）'
        ),
        space(1),
        twoColTable(
          ['方程类型', '关键特征'],
          [
            ['贝尔曼期望方程', '对应特定策略π；含 sum_a π(a|s) 求期望；用于策略评估'],
            ['贝尔曼最优方程', '对应最优策略；含 max_a 操作；非线性，一般需迭代求解'],
            ['适用范围', '有限MDP均有唯一解；最优方程的解即为最优价值函数'],
          ]
        ),
        space(1),

        h2('2.4 动态规划：求解贝尔曼方程的方法', 'dynamic-programming'),
        body('动态规划（Dynamic Programming, DP）是求解已知模型 MDP 的经典方法，利用贝尔曼方程进行迭代更新（第4章）。'),
        space(1),
        h3('策略评估（Policy Evaluation）'),
        body('给定策略 π，迭代计算 v_π 直到收敛（第4章 §4.1）：'),
        formulaBlock(
          'V_{k+1}(s) <- sum_a π(a|s) * sum_{s\',r} p(s\',r|s,a) [r + γ*V_k(s\')]',
          '迭代策略评估更新规则（公式4.5）'
        ),
        h3('策略改进（Policy Improvement）'),
        body('在贝尔曼期望方程基础上，对每个状态选择使 q_π(s,a) 最大的动作，得到改进策略 π\'（§4.2）：'),
        formulaBlock(
          'π\'(s) = argmax_a sum_{s\',r} p(s\',r|s,a) [r + γ*v_π(s\')]',
          '贪心策略改进（公式4.9）'
        ),
        h3('策略迭代与价值迭代'),
        bullet('策略迭代：交替进行策略评估（完整收敛）和策略改进，收敛到 π*'),
        bullet('价值迭代：每步评估+改进合并，直接向贝尔曼最优方程迭代，计算量小'),
        bullet('广义策略迭代（GPI）：两者结合的通用框架，贯穿全书'),
        space(2),
        divider(),

        // ============================================================
        // PART 3: Q-learning
        // ============================================================
        h1('三、Q-learning：无模型强化学习的里程碑', 'q-learning'),
        space(1),

        h2('3.1 时序差分学习（TD Learning）', 'td-learning'),
        body('在真实场景中，我们通常不知道环境的转移概率 p，因此无法直接求解贝尔曼方程。时序差分学习（Temporal Difference Learning）结合了 Monte Carlo 和动态规划的思想（第6章 §6.1）：'),
        space(1),
        twoColTable(
          ['方法', '核心特征'],
          [
            ['Monte Carlo (MC)', '需等到 episode 结束才能更新；无偏但方差大；不能 bootstrap'],
            ['动态规划 (DP)', '需要完整环境模型 p(s\',r|s,a)；用 bootstrap 逐步更新'],
            ['TD 学习', '无需环境模型；可在线、逐步更新；用 bootstrap（用估计更新估计）'],
          ]
        ),
        space(1),
        body('TD(0) 的基本更新规则（§6.1，公式6.1）：'),
        formulaBlock(
          'V(S_t) <- V(S_t) + α [R_{t+1} + γ*V(S_{t+1}) - V(S_t)]',
          'TD(0) 单步状态价值更新。方括号内的量称为"TD误差" δ_t = R_{t+1} + γV(S_{t+1}) - V(S_t)'
        ),
        keyBox(
          'TD误差的直觉',
          'TD误差 δ_t 衡量"预期收益与实际观测到的奖励+后继状态估值之间的差距"。若 δ_t>0 说明实际比预期好，应提升当前状态价值；若 δ_t<0 说明实际比预期差。这就是 TD 学习的核心驱动力。'
        ),
        space(1),

        h2('3.2 Sarsa：同策略TD控制', 'sarsa'),
        body('Sarsa 是将 TD 思想扩展到动作价值函数的同策略（on-policy）控制算法（§6.4，公式6.5）：'),
        formulaBlock(
          'Q(S_t, A_t) <- Q(S_t, A_t) + α [R_{t+1} + γ*Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)]',
          'Sarsa 更新规则（五元组 S, A, R, S\', A\' → 算法名来源）（公式6.5）'
        ),
        body('Sarsa 算法流程（原著图6.9）：'),
        bullet('初始化 Q(s,a) 任意值，终止状态 Q=0'),
        bullet('对每个 episode：初始化 S，用 ε-greedy 从 Q 导出策略选 A'),
        bullet('循环：执行 A 得到 R, S\'；从 S\' 选 A\'（ε-greedy）；按上式更新 Q；S←S\'，A←A\''),
        bullet('直到 S 为终止状态'),
        space(1),

        h2('3.3 Q-learning：离策略TD控制', 'q-learning-algo'),
        body('Q-learning 是强化学习历史上最重要的突破之一，由 Watkins（1989）提出（§6.5，公式6.6）：'),
        formulaBlock(
          'Q(S_t, A_t) <- Q(S_t, A_t) + α [R_{t+1} + γ * max_a Q(S_{t+1}, a) - Q(S_t, A_t)]',
          'Q-learning 核心更新公式（公式6.6）——与 Sarsa 的唯一区别：用 max_a 代替 A_{t+1}'
        ),
        space(1),
        infoBox(
          'Q-learning 的革命性意义（原著原文，§6.5）',
          '"the learned action-value function, Q, directly approximates q*, the optimal action-value function, independent of the policy being followed. This dramatically simplifies the analysis of the algorithm and enabled early convergence proofs."'
        ),
        space(1),
        body('Q-learning 算法完整流程（原著图6.12）：'),
        bullet('初始化 Q(s,a)：所有状态-动作对，终止状态 Q=0'),
        bullet('对每个 episode：初始化状态 S'),
        bullet('  循环执行：用 ε-greedy 从 Q 选动作 A'),
        bullet('  执行 A，观察奖励 R 和新状态 S\''),
        bullet('  更新：Q(S,A) ← Q(S,A) + α [R + γ·max_a Q(S\',a) - Q(S,A)]'),
        bullet('  S ← S\'，直到 S 为终止状态'),
        space(1),

        h2('3.4 Sarsa 与 Q-learning 的关键对比', 'sarsa-vs-q'),
        twoColTable(
          ['特性', 'Sarsa vs Q-learning'],
          [
            ['更新方式', 'Sarsa: Q(S,A)+α[R+γQ(S\',A\')-Q(S,A)]（用实际执行的A\'）\nQ-learning: Q(S,A)+α[R+γ·max_a Q(S\',a)-Q(S,A)]（用贪心最大化）'],
            ['策略类型', 'Sarsa 是同策略（on-policy）：行为策略 = 目标策略\nQ-learning 是离策略（off-policy）：行为策略可以不同于目标策略'],
            ['收敛目标', 'Sarsa 收敛到当前行为策略对应的最优\nQ-learning 直接收敛到 q*（最优Q函数）'],
            ['实际表现', 'Cliff-Walking实验（图6.13）：Q-learning学到最优路径但更危险；Sarsa学到更安全路径'],
          ]
        ),
        keyBox(
          'Cliff-Walking 典型案例（原著 §6.5）',
          'Cliff-Walking 问题（悬崖行走）展示了 on-policy vs off-policy 的本质差异：Q-learning（off-policy）学到了贴近悬崖的理论最优路径，但ε-greedy探索时常掉落（-100奖励）；Sarsa（on-policy）因为考虑了探索时可能犯的错误，学到了稍长但更安全的绕行路径。在线性能上 Sarsa 更好，但渐近最优是 Q-learning。'
        ),
        space(2),
        divider(),

        // ============================================================
        // PART 4: 策略梯度
        // ============================================================
        h1('四、策略梯度方法（Policy Gradient Methods）', 'policy-gradient'),
        space(1),

        h2('4.1 基于价值 vs 基于策略的核心区别', 'value-vs-policy'),
        body('本书第1.4节明确提出了策略梯度方法（§1.4）：'),
        infoBox(
          '原著原文（§1.4）',
          '"These methods search in spaces of policies defined by a collection of numerical parameters. They estimate the directions the parameters should be adjusted in order to most rapidly improve a policy\'s performance... Methods like this, called policy gradient methods, have proven useful in many problems."'
        ),
        space(1),
        twoColTable(
          ['方法类型', '核心思路'],
          [
            ['基于价值（Value-based）', '学习价值函数（如 Q-learning），策略由价值函数隐式推导（贪心选择）。适合离散动作空间。'],
            ['基于策略（Policy-based）', '直接用参数θ参数化策略π_θ(a|s)，通过梯度上升优化期望回报。适合连续动作空间。'],
            ['Actor-Critic', '两者结合：Actor（策略网络）执行动作，Critic（价值网络）评估动作好坏提供梯度信号。'],
          ]
        ),
        space(1),

        h2('4.2 梯度 Bandit 算法：策略梯度的原型', 'gradient-bandit'),
        body('第2章的梯度 Bandit 算法（Gradient Bandit, §2.7）是策略梯度的最简原型：通过学习每个动作的偏好（preference）H_t(a)，用 softmax 定义策略：'),
        formulaBlock(
          'π_t(a) = e^{H_t(a)} / sum_b e^{H_t(b)}',
          'Softmax 动作概率（公式2.10）'
        ),
        body('参数更新规则（§2.7，公式2.11-2.12）：'),
        formulaBlock(
          'H_{t+1}(A_t) <- H_t(A_t) + α(R_t - R̄_t)(1 - π_t(A_t))',
          '对已执行动作 A_t 的偏好更新（增加好动作的偏好）'
        ),
        formulaBlock(
          'H_{t+1}(a) <- H_t(a) - α(R_t - R̄_t)π_t(a)，对所有 a ≠ A_t',
          '对未执行动作的偏好更新（降低相对偏好）'
        ),
        keyBox(
          '基线（Baseline）的重要性',
          '更新中的 R̄_t（基线，通常为奖励平均值）对期望更新无影响，但能大幅减少方差。这是策略梯度方法中"基线减法"技术的雏形，在 Actor-Critic 等高级方法中得到广泛应用。'
        ),
        space(1),

        h2('4.3 策略梯度定理（Policy Gradient Theorem）', 'pg-theorem'),
        body('策略梯度定理是策略梯度方法的数学基础（第13章），表明参数化策略 π_θ 的性能 J(θ) 相对于θ的梯度为：'),
        formulaBlock(
          '∇J(θ) ∝ sum_s μ(s) * sum_a q_π(s,a) * ∇π(a|s,θ)',
          '策略梯度定理。μ(s) 为策略π下的稳态状态分布'
        ),
        body('实践中，REINFORCE 算法（Williams,1992）给出蒙特卡洛版本的策略梯度估计：'),
        formulaBlock(
          'θ_{t+1} <- θ_t + α * G_t * ∇ln π(A_t|S_t, θ_t)',
          'REINFORCE 更新规则，G_t 为从t开始的实际回报'
        ),
        space(1),

        h2('4.4 与本书前6章的关联', 'pg-connection'),
        body('虽然前6章主要讨论基于价值的方法，策略梯度的思想已贯穿其中：'),
        bullet('第1章（§1.4）明确将策略梯度方法列为 RL 的重要分支，并指出"some of these methods take advantage of value function estimates to improve their gradient estimates"（预示 Actor-Critic）'),
        bullet('第2章梯度 Bandit（§2.7）是在无状态环境下策略梯度的实例，奠定了从奖励信号估计梯度的思想'),
        bullet('第6章 TD 误差（δ_t = R + γV(S\') - V(S)）在 Actor-Critic 中将作为策略梯度的"优势估计"使用'),
        bullet('策略梯度方法的完整理论在后续章节（第9章函数逼近、第13章策略梯度）展开'),
        space(2),
        divider(),

        // ============================================================
        // PART 5: 知识全景图
        // ============================================================
        h1('五、核心概念全景对照', 'panorama'),
        space(1),

        h2('5.1 四大主题关系总结', 'summary-table'),
        body('本文四个主题在 Sutton & Barto 体系中的定位与关系如下：'),
        twoColTable(
          ['主题', '在RL框架中的位置与作用'],
          [
            ['MDP（马尔可夫决策过程）', '问题的数学形式化框架。定义了状态、动作、奖励、转移概率。是所有RL算法的出发点。'],
            ['贝尔曼方程', 'MDP价值函数的递归结构。揭示了"当前价值=即时奖励+折扣未来价值"的自洽关系。是动态规划与TD学习的理论基础。'],
            ['Q-learning', '在未知模型环境中求解贝尔曼最优方程的算法。通过样本数据离策略学习最优Q函数。是深度强化学习（DQN等）的基础。'],
            ['策略梯度', '直接优化参数化策略的方法。不经由价值函数，用梯度上升最大化期望回报。是PPO、A3C等现代RL算法的核心。'],
          ]
        ),
        space(1),

        h2('5.2 学习路径建议', 'learning-path'),
        body('根据 Sutton & Barto 的章节结构，推荐学习路径：'),
        bullet('第一步：理解 MDP 框架（第1章 §1.3 + 第3章 §3.1-3.6）—— 明确问题定义'),
        bullet('第二步：掌握贝尔曼方程（第3章 §3.7-3.8 + 第4章）—— 建立价值函数直觉'),
        bullet('第三步：学习TD学习与Q-learning（第6章 §6.1-6.5）—— 理解无模型学习'),
        bullet('第四步：进入函数逼近（第9章）—— 扩展到大规模/连续状态空间（DQN的基础）'),
        bullet('第五步：策略梯度完整理论（第13章）—— 掌握 Actor-Critic、REINFORCE 等'),
        space(1),
        infoBox(
          '本笔记对应原著章节索引',
          [
            '• 第1章：The Reinforcement Learning Problem（§1.3 要素，§1.4 策略梯度提及，§1.5 TD原型）',
            '• 第2章：Multi-armed Bandits（§2.7 梯度Bandit = 策略梯度原型）',
            '• 第3章：Finite Markov Decision Processes（§3.1-3.6 MDP，§3.7-3.8 贝尔曼方程）',
            '• 第4章：Dynamic Programming（§4.1 策略评估，§4.2 策略改进，§4.3-4.6 迭代方法）',
            '• 第5章：Monte Carlo Methods（§5.1-5.9 蒙特卡洛控制，提供Q-learning对比背景）',
            '• 第6章：Temporal-Difference Learning（§6.1 TD(0)，§6.4 Sarsa，§6.5 Q-learning）',
          ]
        ),
        space(2),
        divider(),

        // 结语
        new Paragraph({
          children: [new TextRun({
            text: '本笔记基于 Sutton & Barto《Reinforcement Learning: An Introduction》第2版原文整理，忠实呈现原著核心公式、直觉解释与原文表达。如需深入学习，建议结合原著对应章节阅读。',
            size: 20, color: '888888', italics: true, font: 'Microsoft YaHei',
          })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('C:/Users/liuDH/WorkBuddy/2026-06-14-task-6/RL_Study_Notes_Ch1_6.docx', buffer);
  console.log('Document generated successfully!');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
