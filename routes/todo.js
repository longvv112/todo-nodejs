const router = require('express').Router();
const Todo = require('../models/todo');

router.get('/', function (req, res) {
    Todo.find({}).then(function (results) {
        let todos = results.filter(function (todo) {
            return !todo.done;
        });

        let doneTodos = results.filter(function (todo) {
            return todo.done;
        });
        res.render('index', { todos: todos, doneTodos: doneTodos });
    });
});

router.post('/todos', function (req, res) {
    let newTodo = new Todo({ description: req.body.description });

    newTodo.save().then(function (result) {
        res.redirect('/');
    }).catch(function (err) {
        res.redirect('/');
    });
});

router.post('/todos/:id/completed', function (req, res) {
    let todoId = req.params.id;

    Todo.findById(todoId).exec().then(function (result) {
        result.done = !result.done;
        return result.save();
    });

    res.redirect('/');
});

router.get('/todos/:id/deleted', function (req, res) {
    Todo.remove({_id: req.params.id}, function(err){
        if (err) {
            return res.status(500).send(err);
        }

		res.redirect('/');			
	});

});


module.exports = router;
