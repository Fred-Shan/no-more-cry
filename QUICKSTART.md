# 快速开始指南 - No More Cry

## 5分钟快速部署

### 步骤1：获取API密钥（2分钟）

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录你的Google账号
3. 点击"Create API Key"
4. 复制生成的API密钥

### 步骤2：部署到Vercel（3分钟）

1. **将代码推送到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   # 先在GitHub创建新仓库，然后：
   git remote add origin https://github.com/你的用户名/no-more-cry.git
   git push -u origin main
   ```

2. **在Vercel部署**
   - 访问 https://vercel.com/new
   - 点击"Import"导入你的GitHub仓库
   - 配置环境变量：
     ```
     NEXT_PUBLIC_GEMINI_API_KEY = 你的API密钥
     ```
   - 点击"Deploy"按钮
   - 等待2-3分钟，部署完成！

3. **开始使用**
   - 打开Vercel提供的链接
   - 点击设置图标
   - 确认API密钥已配置
   - 点击中间的麦克风按钮开始监测

---

## 本地开发

### 安装依赖
```bash
cd no-more-cry
npm install
```

### 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local，添加你的API密钥
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

---

## 主要功能

1. **点击中间的麦克风按钮** - 开始监测
2. **应用会自动检测哭声** - 无需手动操作
3. **检测到哭声时** - 自动播放安抚语音和图片
4. **点击设置图标** - 调整检测敏感度和阈值

---

## 故障排除

### 问题1：麦克风无法访问
**解决方案**：
- 确保使用HTTPS（Vercel自动提供）
- 检查浏览器权限设置
- 尝试使用Chrome或Edge浏览器

### 问题2：AI不响应
**解决方案**：
- 确认API密钥已正确设置
- 检查API密钥是否有效
- 确保有网络连接

### 问题3：检测不准确
**解决方案**：
- 在设置中调整"音量阈值"
- 调整"置信度阈值"
- 确保环境相对安静

---

## 需要帮助？

- 查看 [README.md](./README.md) - 详细说明
- 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南
- 查看 [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发指南
- 提交GitHub Issue

---

**准备好了吗？让开始部署吧！** 🚀
