const express = require('express');
const router = express.Router();
const Todo = require('../../models/Todo');
const TodoCategory = require('../../models/TodoCategory');
const socketio = require('../../utils/socket')

const io = socketio.getIo()
let connectedClients = socketio.getConnectedClients()

io.on('connection', async (socket) => {
    const clientId = socket.id;
    connectedClients[clientId] = socket;
    function sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
      }
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete connectedClients[clientId];
    });

    socket.on('triggerEvent', async (userId) => {
        try{
            console.log('Trigger event received: ', userId);
            await sleep(3)
            for(let i = 0; i < 3; i++){
                socket.emit('taskStatus', `created: ${i}`);

                const newTodo = new Todo({
                    title: `Todo: ${userId}-${i}`,
                    description:`description: ${userId}-${i}`,
                    creator: userId,
                });
            
                await newTodo.save();
                await sleep(3)
            }
            socket.emit('finished',currentDateTime)
        }
        catch (e){
            console.error(e)
        }
    });
});
// GET /todo/create - Render create todo form
router.get('/create', async (req, res) => {
  try {
    const categories = await TodoCategory.find();
    const todoCategory = await TodoCategory.find()

    res.render('todo/create', { categories, todoCategory });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

function isObjectIdPattern(str) {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(str);
}
const createCategoryByNameOrId = async (categoryInput) => {
    if(!categoryInput) return null

    const query = isObjectIdPattern(categoryInput) ? { _id: categoryInput } : { name: categoryInput };
    const todoCategory = await TodoCategory.findOne(query);

    if (!todoCategory) {
      return await (new TodoCategory(query)).save();
    }

    return todoCategory
}

// POST /todo/create - Create a new todo
router.post('/create', async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const todoCategory = await createCategoryByNameOrId(category)

    const newTodo = new Todo({
      title,
      description,
      category: todoCategory ? todoCategory._id : null,
      creator: req.user._id,
    });

    await newTodo.save();

    res.redirect('/todo');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
// POST /todo/:id - Update a todo
router.post('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, category } = req.body;
      
      let todo = await Todo.findById(id);
  
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      const todoCategory = await createCategoryByNameOrId(category)

      todo.title = title;
      todo.description = description;
      todo.category = todoCategory ? todoCategory._id : null;

      await todo.save();
  
      res.redirect('/todo');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
// GET /todo/:id - Get todo details by ID
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
    if (!todo) {
      // Handle the case when the todo doesn't exist
      return res.status(404).send('Todo not found');
    }
    const todoCategory = await TodoCategory.find()
    res.render('todo/detail', { todo,todoCategory });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET /todo - List todos with optional filters and sorting
router.get('/', async (req, res) => {
    try {
      const { category, sortBy } = req.query;
      const userId = req.user._id
      const query = { creator: userId };
  
      if (category) {
        const todoCategory = await TodoCategory.findOne({ _id: category });
        if (todoCategory) {
          query.category = todoCategory._id;
        }
      }
  
      let sort = {};
  
      if (sortBy === 'title') {
        sort.title = 1;
      } else if (sortBy === 'date') {
        sort.createdAt = -1;
      }
  
      const todos = await Todo.find(query).sort(sort)
      const todoCategory = await TodoCategory.find()
      res.render('todo/list', { todos, todoCategory, userId });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  
module.exports = router;