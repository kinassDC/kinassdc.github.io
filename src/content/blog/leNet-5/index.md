---
title: "LeNet-5: 初识CNN"
pubDate: 2026-02-19
description: "第一款CNN模型架构"
category: "技术"
tags: ["CNN", "神经网络"]
---

## 引言

LeNet-5 是由 Yann LeCun 等人在 1998 年提出的卷积神经网络（CNN），它是现代深度学习的开山之作，主要用于识别手写数字。该网络在 MNIST 数据集上取得了巨大成功，为后续的深度学习发展奠定了基础。

## 历史背景

在 20 世纪 90 年代，传统的神经网络在处理图像识别任务时面临诸多挑战：参数量过大、计算资源有限、难以捕捉图像的空间结构信息。Yann LeCun 团队提出的 LeNet-5 通过引入**局部感受野**、**权值共享**和**下采样**等概念，有效解决了这些问题。

## 网络架构概览

LeNet-5 由 7 层组成（不包括输入层），其结构如下：

```
输入 → C1 → S2 → C3 → S4 → C5 → F6 → 输出
```

### 各层详解

#### 输入层
- **尺寸**: 32×32
- **说明**: 原始图像为 28×28，但在边缘填充像素以适应后续卷积操作

#### C1 层（卷积层）
- **输入**: 32×32
- **卷积核**: 6 个 5×5 卷积核
- **输出**: 6 个 28×28 特征图
- **参数量**: 6×(5×5+1) = 156

#### S2 层（下采样/池化层）
- **输入**: 6 个 28×28 特征图
- **采样方式**: 2×2 平均池化，步长为 2
- **输出**: 6 个 14×14 特征图
- **参数量**: 6×2 = 12（每个特征图一个权重和一个偏置）

#### C3 层（卷积层）
- **输入**: 6 个 14×14 特征图
- **卷积核**: 16 个 5×5 卷积核
- **输出**: 16 个 10×10 特征图
- **连接方式**: 并非所有特征图都与上一层连接（如表所示）

#### S4 层（下采样/池化层）
- **输入**: 16 个 10×10 特征图
- **采样方式**: 2×2 平均池化
- **输出**: 16 个 5×5 特征图

#### C5 层（卷积层）
- **输入**: 16 个 5×5 特征图
- **卷积核**: 120 个 5×5 卷积核
- **输出**: 120 个 1×1 特征图
- **说明**: 此层本质上是全连接层

#### F6 层（全连接层）
- **输入**: 120 维向量
- **输出**: 84 维向量
- **激活函数**: 双曲正切（tanh）

#### 输出层
- **输入**: 84 维向量
- **输出**: 10 维向量（对应 0-9 十个数字）
- **激活函数**: RBF（径向基函数）或 Softmax

## 核心创新点

### 1. 局部感受野

每个神经元只连接输入图像的一个局部区域，这使得网络能够捕捉局部特征（如边缘、角点）。

### 2. 权值共享

同一特征图上的神经元共享相同的卷积核参数，这大大减少了模型的参数量。

### 3. 空间下采样

通过池化层降低特征图的维度，增加模型的平移不变性，同时减少计算量。

## 激活函数

LeNet-5 使用的是 **双曲正切（tanh）** 激活函数，而不是现代常用的 ReLU。tanh 函数将输出压缩到 [-1, 1] 区间：

```python
tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))
```

## 代码实现

以下是使用 PyTorch 实现 LeNet-5 的简单示例：

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class LeNet5(nn.Module):
    def __init__(self):
        super(LeNet5, self).__init__()
        self.conv1 = nn.Conv2d(1, 6, kernel_size=5, padding=2)
        self.conv2 = nn.Conv2d(6, 16, kernel_size=5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        # C1: 卷积 + tanh
        x = F.tanh(self.conv1(x))
        # S2: 平均池化
        x = F.avg_pool2d(x, kernel_size=2, stride=2)
        # C3: 卷积 + tanh
        x = F.tanh(self.conv2(x))
        # S4: 平均池化
        x = F.avg_pool2d(x, kernel_size=2, stride=2)
        # 展平
        x = x.view(x.size(0), -1)
        # F6: 全连接 + tanh
        x = F.tanh(self.fc1(x))
        x = F.tanh(self.fc2(x))
        # 输出
        x = self.fc3(x)
        return x

# 创建模型
model = LeNet5()
print(model)
```

## 训练流程

```python
import torch.optim as optim

# 定义损失函数和优化器
criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.001, momentum=0.9)

# 训练循环
def train(model, train_loader, epochs=10):
    model.train()
    for epoch in range(epochs):
        running_loss = 0.0
        for images, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
        print(f'Epoch {epoch+1}, Loss: {running_loss/len(train_loader):.4f}')
```

## LeNet-5 的现代演变

虽然 LeNet-5 是 20 多年前的设计，但其核心思想在现代 CNN 中依然被广泛应用：

- **AlexNet (2012)**: 更深层的网络，使用 ReLU
- **VGG (2014)**: 更小的卷积核，更深的层次
- **ResNet (2015)**: 引入残差连接
- **现代架构**: MobileNet、EfficientNet 等

## 总结

LeNet-5 作为卷积神经网络的先驱，虽然结构相对简单，但它确立了 CNN 的基本设计原则：

1. 使用卷积层提取局部特征
2. 使用池化层降低维度
3. 交替堆叠卷积层和池化层
4. 末端使用全连接层进行分类

这些原则至今仍在指导着 CNN 的设计。理解 LeNet-5 对于深入学习深度学习和计算机视觉具有重要的意义。

## 参考资料

- LeCun, Y., et al. (1998). "Gradient-based learning applied to document recognition"
- [MNIST 数据集](http://yann.lecun.com/exdb/mnist/)
