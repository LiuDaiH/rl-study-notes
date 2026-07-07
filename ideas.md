# RL 灵感记录 💡

> 精读 Sutton & Barto 教材时的发散思考与实验方向

---

## #1 λ 的自适应学习（来自 Ch7）

**触发点**：TD(λ) 中 λ 是固定超参数。能否让 agent 自学习 λ？

**思路**：Meta-gradient 方法——将 λ 作为可微参数，用验证集表现更新。

**实验方向**：在 CartPole 上实现 meta-λ Sarsa，每 episode 结束后用 counterfactual 更新 λ。

**状态**：🔵 待实现

---

## #2 Dyna + 概率模型 + 不确定性（来自 Ch8）

**触发点**：Dyna-Q 的模型是确定性的，在随机环境中不可靠。

**思路**：用 Ensemble of models 替换确定性模型，用预测方差作为规划更新权重。

**实验方向**：RL_Lab 中实现 3-5 个模型的 Ensemble Dyna。

**状态**：🔵 待实现

---

## #3 瓦片编码 → 神经网络过渡（来自 Ch9）

**触发点**：瓦片编码是"手工稀疏特征"，NN 是自动学习特征。

**思路**：理解瓦片编码的泛化行为是理解 NN+RL 泛化的最佳跳板。

**实验方向**：先用 Tile Coding + Sarsa，再逐步过渡到简单 NN + Sarsa。

**状态**：🔵 待实现

---

## #4 优先遍历 → 优先级经验回放（Ch8 → DQN）

**触发点**：优先遍历（Ch8.4）和经验回放（DQN）动机相似。

**思路**：Ch8 的优先遍历理论为 PER（Prioritized Experience Replay）提供理论基础。

**实验方向**：在 RL_Lab 中实现 DQN + PER。

**状态**：🔵 待实现

---

## #5 致命三元组的"解药"（来自 Ch9）

**触发点**：函数逼近 + bootstrap + off-policy = 可能发散。

**已知解药**：Target Network、Experience Replay、Gradient Clipping。

**思考**：这些"解药"是否只是工程 hack，还是揭示了更深的理论原理？

**状态**：🔵 阅读中

---

## #6 Sarsa(λ) 在连续控制中的加速效果（来自 Ch7）

**触发点**：Sarsa(λ) 在 CartPole 上通常比 1 步 Sarsa 快 2-5 倍。

**实验方向**：在 RL_Lab CartPole 实验中添加 Sarsa(λ) 对比实验。

**状态**：🔵 待实现

---

## #7 Dyna + MCTS 组合（来自 Ch8）

**触发点**：Dyna 提供持久全局知识，MCTS 提供临时局部精确搜索。

**思考**：AlphaGo 本质上是这个组合的成功案例。

**状态**：🟢 概念理解

---

## 图例
- 🔵 待实现
- 🟡 进行中
- 🟢 已完成

---

*最后更新：2026-07-07 · 精读 Ch7-9 期间记录*
