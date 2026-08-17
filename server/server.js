// Voice 智能医美官网 —— 预约演示数据后端
// 零依赖：Node.js 内置 http + 内置 SQLite（node:sqlite）
// 启动方式：双击 start-server.bat，或在命令行执行 node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = Number(process.env.PORT || 8787);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DB_PATH = path.join(DATA_DIR, 'voice.db');
const CONFIG_PATH = path.join(ROOT, 'config.json');

fs.mkdirSync(DATA_DIR, { recursive: true });

// ---------- 管理令牌（首次启动自动生成并保存到 config.json，不会上传到网站） ----------
let adminToken = '';
try {
  adminToken = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')).adminToken || '';
} catch { /* 首次运行 */ }
if (!adminToken) {
  adminToken = 'voice-' + crypto.randomBytes(12).toString('hex');
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ adminToken }, null, 2));
}

// ---------- SQLite 数据库 ----------
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS demo_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT 'web',
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
`);

// ---------- 基础工具 ----------
function sendJSON(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 1e6) { req.destroy(); resolve(null); }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { resolve({}); }
    });
    req.on('error', () => resolve(null));
  });
}

function checkToken(req) {
  const auth = req.headers.authorization || '';
  return auth === 'Bearer ' + adminToken;
}

// ---------- 管理页面 ----------
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Voice 预约演示数据管理</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:"Microsoft YaHei",system-ui,sans-serif;background:#f3f1fb;color:#1e1b2e;padding:32px 20px}
  .wrap{max-width:960px;margin:0 auto}
  h1{font-size:22px;color:#4c1d95}
  .card{background:#fff;border-radius:14px;box-shadow:0 6px 24px rgba(76,29,149,.08);padding:24px;margin-top:20px}
  input[type=password]{width:280px;padding:11px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px}
  button{padding:10px 20px;border:0;border-radius:8px;background:#7c3aed;color:#fff;font-size:14px;cursor:pointer}
  button.ghost{background:#eee;color:#555;margin-left:8px}
  .bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
  table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px}
  th,td{text-align:left;padding:10px 8px;border-bottom:1px solid #f0eef7;vertical-align:top;word-break:break-all}
  th{color:#7a6f94;font-weight:600}
  .msg{font-size:13px;color:#7a6f94;margin-top:12px}
  .empty{text-align:center;color:#aaa;padding:34px 0}
  .del{color:#e11d48;cursor:pointer;background:none;border:0;padding:0}
  @media(max-width:640px){input[type=password]{width:100%;margin-bottom:10px}}
</style>
</head>
<body>
<div class="wrap">
  <h1>Voice 智能医美 · 预约演示数据管理</h1>
  <div class="card">
    <div class="bar">
      <div>
        <input type="password" id="token" placeholder="输入管理令牌">
        <button onclick="login()">登录查看</button>
      </div>
      <div id="ops" style="display:none">
        <button onclick="exportCsv()">导出 CSV</button>
        <button class="ghost" onclick="logout()">退出</button>
      </div>
    </div>
    <div class="msg" id="status">数据库文件：server/data/voice.db（本机 SQLite）</div>
    <table id="table" style="display:none">
      <thead><tr><th>ID</th><th>姓名</th><th>电话</th><th>机构</th><th>需求描述</th><th>提交时间</th><th>操作</th></tr></thead>
      <tbody id="tbody"></tbody>
    </table>
    <div class="empty" id="empty" style="display:none">暂无预约记录</div>
  </div>
</div>
<script>
var rows = [];
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function login(){
  var t = document.getElementById('token').value.trim();
  if(!t){return;}
  fetch('/api/requests', {headers:{'Authorization':'Bearer '+t}}).then(function(r){
    if(r.status===401){document.getElementById('status').textContent='令牌错误，请重试';return;}
    return r.json();
  }).then(function(d){
    if(!d || !d.ok){return;}
    rows = d.rows;
    document.getElementById('ops').style.display='flex';
    document.getElementById('status').textContent='共 '+d.total+' 条记录（当前显示最近 '+rows.length+' 条）';
    render();
  });
}
function render(){
  var tb = document.getElementById('tbody');
  tb.innerHTML = '';
  var table = document.getElementById('table');
  var empty = document.getElementById('empty');
  if(!rows.length){table.style.display='none';empty.style.display='block';return;}
  table.style.display='table';empty.style.display='none';
  rows.forEach(function(r){
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>'+r.id+'</td><td>'+esc(r.name)+'</td><td>'+esc(r.phone)+'</td><td>'+esc(r.company)+'</td><td>'+esc(r.message)+'</td><td>'+esc(r.created_at)+'</td><td><button class="del" onclick="del('+r.id+')">删除</button></td>';
    tb.appendChild(tr);
  });
}
function del(id){
  if(!confirm('确认删除第 '+id+' 条记录？')){return;}
  var t = document.getElementById('token').value.trim();
  fetch('/api/requests/'+id, {method:'DELETE', headers:{'Authorization':'Bearer '+t}}).then(function(r){return r.json();}).then(function(d){
    if(d.ok){rows = rows.filter(function(x){return x.id!==id;});render();document.getElementById('status').textContent='已删除第 '+id+' 条记录';}
  });
}
function exportCsv(){
  var head=['ID','姓名','电话','机构','需求描述','提交时间'];
  var lines=[head.join(',')];
  rows.forEach(function(r){
    lines.push([r.id,r.name,r.phone,r.company,r.message,r.created_at].map(function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"';}).join(','));
  });
  var blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='voice-demo-requests.csv';
  a.click();
}
function logout(){document.getElementById('ops').style.display='none';rows=[];document.getElementById('table').style.display='none';document.getElementById('empty').style.display='none';document.getElementById('status').textContent='已退出';}
</script>
</body>
</html>`;

// ---------- 路由 ----------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const p = url.pathname;

  // 跨域预检
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // 健康检查
  if (req.method === 'GET' && p === '/api/health') {
    return sendJSON(res, 200, { ok: true, time: new Date().toLocaleString('zh-CN') });
  }

  // 提交预约（公开）
  if (req.method === 'POST' && p === '/api/demo') {
    const body = await readBody(req);
    if (!body) return sendJSON(res, 400, { ok: false, error: '请求体过大或格式错误' });
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    if (!name || !phone) return sendJSON(res, 400, { ok: false, error: '姓名和联系电话为必填项' });
    const company = String(body.company || '').trim();
    const message = String(body.message || '').trim();
    const source = String(body.source || 'web').slice(0, 40);
    const info = db.prepare(
      'INSERT INTO demo_requests (name, phone, company, message, source) VALUES (?, ?, ?, ?, ?)'
    ).run(name, phone, company, message, source);
    return sendJSON(res, 200, { ok: true, id: Number(info.lastInsertRowid) });
  }

  // 查看预约列表（需管理令牌）
  if (req.method === 'GET' && p === '/api/requests') {
    if (!checkToken(req)) return sendJSON(res, 401, { ok: false, error: '未授权' });
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 200), 1), 500);
    const rows = db.prepare(
      'SELECT id, name, phone, company, message, source, created_at FROM demo_requests ORDER BY id DESC LIMIT ?'
    ).all(limit);
    const total = db.prepare('SELECT COUNT(*) AS n FROM demo_requests').get().n;
    return sendJSON(res, 200, { ok: true, total, rows });
  }

  // 删除单条（需管理令牌）
  if (req.method === 'DELETE' && /^\/api\/requests\/\d+$/.test(p)) {
    if (!checkToken(req)) return sendJSON(res, 401, { ok: false, error: '未授权' });
    const id = Number(p.split('/').pop());
    const info = db.prepare('DELETE FROM demo_requests WHERE id = ?').run(id);
    return sendJSON(res, 200, { ok: true, deleted: Number(info.changes) > 0 });
  }

  // 数据管理页面
  if (req.method === 'GET' && p === '/admin') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(ADMIN_HTML);
  }

  sendJSON(res, 404, { ok: false, error: 'Not Found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Voice 预约演示后端已启动');
  console.log('本地地址:    http://127.0.0.1:' + PORT);
  console.log('健康检查:    http://127.0.0.1:' + PORT + '/api/health');
  console.log('数据管理页:  http://127.0.0.1:' + PORT + '/admin');
  console.log('数据库文件:  ' + DB_PATH);
  console.log('');
  console.log('管理令牌（查看/删除数据时需要，请妥善保管）:');
  console.log(adminToken);
  console.log('');
  console.log('如需公网访问，请另开窗口运行 start-tunnel.bat');
});
