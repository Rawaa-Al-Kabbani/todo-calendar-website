const express = require('express');
const database = require('./database.js');
const path = require('path');
const app = express();
const session = require('express-session');
const moment = require('moment');

app.use(express.json());

app.use(
  session({
    secret: 'elias',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

function makeQuery(query, args = []) {
  return new Promise((resolve, reject) => {
    database.query(query, args, function (error, result, fields) {
      if (error) {
        reject(error); 
      }
      resolve(result); 
    });
  });
}

function getUserId(request) {
  return request.session.userid;
}

function requireLoggedIn(request, response, next) {
  if (request.session.userid) {
    return next();
  }
  response.status(403).end();
}

const getCategories = async () => {
  return await makeQuery('SELECT tagid, tag_text FROM tags');
};

async function getTodosListByUser(userid) {
  return await makeQuery(
    'SELECT todoid, title, start, end, list_text, todo_item.listid AS listid, tag_text, todo_item.tagid AS tagid FROM todo_item INNER JOIN todo_list ON todo_list.listid = todo_item.listid INNER JOIN tags ON tags.tagid = todo_item.tagid WHere todo_item.userid=?',
    [userid],
  );
}

async function getListsByUser(userid) {
  return await makeQuery('SELECT list_text, listid FROM todo_list WHERE userid=?', [userid]);
}

async function getTodosByListId(userid, listid) {
  return await makeQuery(
    'SELECT todoid, title, start, end, list_text, tag_text FROM todo_item INNER JOIN todo_list ON todo_list.listid = todo_item.listid INNER JOIN tags ON tags.tagid = todo_item.tagid WHere todo_item.userid=? and todo_item.listid=?',
    [userid, listid],
  );
}

async function getTodosByTagid(userid, tagid) {
  return await makeQuery(
    'SELECT todoid, title, start, end, list_text, tag_text FROM todo_item INNER JOIN todo_list ON todo_list.listid = todo_item.listid INNER JOIN tags ON tags.tagid = todo_item.tagid WHere todo_item.userid=? and todo_item.tagid=?',
    [userid, tagid],
  );
}

async function markTodoAsDone(userid, todoid) {
  return await makeQuery('UPDATE todo_item SET done=True WHERE userid=? and todoid=?', [
    userid,
    todoid,
  ]);
}

async function deleteTodo(userid, todoid) {
  return await makeQuery('DELETE FROM todo_item WHERE userid=? AND todoid =?', [userid, todoid]);
}

async function addTodo(title,  newStart, newEnd, list, userid, tag) {
  return await makeQuery(
    'INSERT INTO todo_item (title, start, end, listid, userid, tagid)VALUES(?,?,?,?,?,?)',
    [title, newStart, newEnd, list, userid, tag],
  );
}

async function editTodo(title, newStart, newEnd, list, tag, todoid, userid) {
  return await makeQuery(
    'UPDATE todo_item SET title = ?, start = ?, end = ?, listid = ?, tagid = ? WHERE todoid = ? AND userid = ?', [title, newStart, newEnd, list, tag, todoid, userid]
  );
}

async function addNewUser(username, password, email) {
  return await makeQuery(
    'INSERT INTO user (username, auth_str, email)VALUES(?,?,?)',
    [username, password, email],
  );
}
app.get('/getCategories', async function (request, response) {
  const categories = await getCategories();
  response.send(categories);
});

app.get('/getTodos', requireLoggedIn, async function (request, response) {
  const userid = getUserId(request);
  let todosList = await getTodosListByUser(userid);
  response.send(todosList);
});

app.get('/getListsByUser', requireLoggedIn, async function (request, response) {
  const userid = getUserId(request);
  let lists = await getListsByUser(userid);
  response.send(lists);
});

app.post('/getTodosByListId', requireLoggedIn, async function (request, response) {
  const userid = getUserId(request);
  const listid = request.body.listid;
  const todos = await getTodosByListId(userid, listid);
  response.send(todos);
});

app.post('/getTodosByTagid', requireLoggedIn, async function (request, response) {
  const userid = getUserId();
  const tagid = request.body.tagid;
  const todos = await getTodosByTagid(userid, tagid);
  response.send(todos);
});

app.post('/postUser', function (request, response) {
  const email = request.body.email;
  const password = request.body.password;
  const sql = 'SELECT userid FROM todo_db.user WHERE email=? AND auth_str=?';
  database.query(sql, [email, password], (error, result) => {
    if (error) {
      return response.status(400).send(error.code);
    }
    if (result.length > 0) {
      const userid = result[0].userid;
      request.session.userid = userid;
      response.json({
        loggedIn: true,
      });
    } else {
      response.status(400).json({
        loggedIn: false,
      });
    }
  });
});

app.post('/postNewUser', async function (request, response) {
  const email = request.body.email;
  const password = request.body.password;
  const username = request.body.username;
  const name = request.body.name;
  const newUser = await addNewUser(username, password, email);
  response.end();
});

	async function getUsername (userid) {
  const userName= await makeQuery('SELECT username FROM todo_db.user where user.userid=?', [userid]);
  return userName[0].username;
}
app.get('/isLoggedIn', async function (request, response) {
  if (request.session.userid) {
    response.send({
      isLoggedIn: true,
      username: await getUsername(request.session.userid),
    });
  } else {
    response.send({
      isLoggedIn: false,
    });
  }
});

app.post('/postMarkAsDone', requireLoggedIn, async function (request, response) {
  const userid = getUserId(request);
  const todoid = request.body.todoid;
  await markTodoAsDone(userid, todoid);
  response.json({ sqlMessage: 'Item done' });
});

app.post('/postDelete', requireLoggedIn, async function (request, response) {
  const userid = getUserId(request);
  const todoid = request.body.todoid;
  await deleteTodo(userid, todoid);
  response.json({
    sqlMessage: 'Item deleted',
  });
});

function getTimestampFromDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

app.post('/postEvent', requireLoggedIn, async function (request, response) {
  const userid = getUserId(request);
  const title = request.body.title;
  const newStart = getTimestampFromDate(request.body.start);
  const newEnd = getTimestampFromDate(request.body.end);
  const tag = Number(request.body.tag);
  const list = Number(request.body.list);
  await addTodo(title, newStart, newEnd, list, userid, tag);
  response.json({
      sqlMessage: 'Item posted',
     });
});

app.post('/editEvent', requireLoggedIn, async function (request, response) {
  const userid = getUserId(request);
  const title = request.body.title;
  const newStart = getTimestampFromDate(request.body.start);
  const newEnd = getTimestampFromDate(request.body.end);
  const tag = Number(request.body.tag);
  const list = Number(request.body.list);
  const todoid = Number(request.body.todoid);
  await editTodo(title, newStart, newEnd, list, tag, todoid, userid);
  response.json({
      sqlMessage: 'Item posted',
     });
});

app.post('/signout', requireLoggedIn, (request, response) => {
  request.session.userid = null;
  response.end();
});

app.listen(5000);
