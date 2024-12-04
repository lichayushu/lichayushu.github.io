const jwt = require('jsonwebtoken');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

hexo.extend.filter.register('server_middleware', function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  }));

  app.post('/login', function(req, res) {
    // 这里应该有检查用户名和密码的逻辑
    const username = req.body.username;
    const password = req.body.password;

    // 假设验证成功
    const user = { name: username }; // 用户信息
    const token = jwt.sign({ user }, 'your-secret-key', { expiresIn: '30d' });

    req.session.token = token;
    res.json({ message: '登录成功', token });
  });

  app.get('/protected', function(req, res) {
    if (!req.session.token) {
      return res.status(401).send('未授权：没有访问权限');
    }

    try {
      const decoded = jwt.verify(req.session.token, 'your-secret-key');
      res.send('Welcome, ' + decoded.user.name);
    } catch (err) {
      res.status(401).send('Token 已过期或无效');
    }
  });
});