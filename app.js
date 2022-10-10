const express = require('express');
const compression = require('compression');

const app = express();

app.use(compression())

app.use(express.static('./dist'))

app.listen(8002,() => {
	console.log("电商后台管理系统在8002端口启动成功！")
})
