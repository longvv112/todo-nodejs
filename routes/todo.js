const router = require('express').Router();
const Todo = require('../models/todo');
const User = require('../models/user');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

router.get('/', isAuthenticated, function (req, res) {
    let currentUser;
    User.find({_id: req.session.passport.user}, function(err, user){
        currentUser = user;
        return true;
    });
    Todo.find({user: req.session.passport.user}).then(function (results) {
        let todos = results.filter(function (todo) {
            return !todo.done;
        });

        let doneTodos = results.filter(function (todo) {
            return todo.done;
        });
        res.render('index', { todos: todos, doneTodos: doneTodos, currentUser: currentUser });
    });
});

router.post('/', function (req, res) {
    let newTodo = new Todo({ description: req.body.description, user: req.session.passport.user });

    newTodo.save().then(function (result) {
        res.redirect('/todos');
    }).catch(function (err) {
        res.redirect('/todos');
    });
});

router.post('/:id/completed', function (req, res) {
    let todoId = req.params.id;

    Todo.findById(todoId).exec().then(function (result) {
        result.done = !result.done;
        return result.save();
    });

    res.redirect('/todos');
});

router.get('/:id/deleted', function (req, res) {
    Todo.remove({_id: req.params.id}, function(err){
        if (err) {
            return res.status(500).send(err);
        }

		res.redirect('/todos');			
	});

});


module.exports = router;
