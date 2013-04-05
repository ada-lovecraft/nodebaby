nodebaby
========
# Backbone.js
---------------------------
## Nomenclature vs. Traditional MVC
- Views 
	In the terms of classic MVC, a backbone view should be considered a C and not a V. The nomenclature for backbone is somewhat confusing in this nature. Your view is actually your markup and templates. So, keep the following in mind: **When you see *View* in Backbone, think *Controller*.
**- Models 
	Models in Backbone refer more to a schema than a true model. Again, this is a nomenclature decision that I don't understand. Creating a model in Backbone is akin to defining a database table schema and each instantiation of a model is analogous to inserting a record. 
- Collections 
	A collection should be seen as a database table that contains your records ( a list of models ).
---------------
## Every app needs the following
- **Create a namepsace**
'' var app = {}
- **Create a model**
'' app.Todo = Backbone.Model.extend({
''     defaults: {
''         title: '',
''         completed: false
''     }
'' });
- **Create a collection**
%%This is our "table" that will hold a list of "records" (models)
'' app.TodoList = Backbone.Collection.extend({ 
''     model: app.Todo,
''     localStorage: new Store("backbone-todo")
'' });
- **Instantiate a List**
'' app.todoList = new app.TodoList();
- **Create a Model View**
%%This is the controller for each individual model instantiation. 
'' app.TodoView = Backbone.View.extend({ 
''     tagName: 'li',
''     template: _.template($('#item-template').html()),
''     render: function() {
''         this.$el.html(this.template(this.model.toJSON()));
''         this.input = this.$('.edit');
''         return this;
''     },
''     initialize: function() {
''         this.model.on('change', this.render, this);
''         this.model.on('destroy', this.remove, this);
''     },
''     events: {
''         'dblclick label' : 'edit',
''         'keypress .edit' : 'updateOnEnter',
''         'blur .edit' : 'close',
''         //'click .toggle': 'toggleCompleted',
''         'click .destroy': 'destroy'
''     },
''     edit: function() {
''         this.$el.addClass('editing');
''         this.input.focus();
''     },
''     close: function() {
''         var value = this.input.val().trim();
''         if(value) {
''             this.model.save({title: value});
''         }
''         this.$el.removeClass('editing');
''     },
''     destroy: function() {
''         this.model.destroy();
''     },
''     toggleComplete: function() {
''         this.model.toggle();
''     },
''     updateOnEnter: function(e) {
''         if (e.which == 13) {
''             this.close();
''         }
''     }
'' });
- **Create an App View**
%% This is basically the controller for the entire app. 
'' app.AppView = Backbone.View.extend({
''     el: '#todoapp',
''     initialize: function() { //constructor
''         this.input = this.$('#new-todo'),
''         app.todoList.on('add', this.addAll, this);
''         app.todoList.on('reset',this.addAll, this);
''         app.todoList.fetch(); //loads list from local storage
''     },
''     events: {
''         'keypress #new-todo': 'createTodoOnEnter'
''     },
''     createTodoOnEnter: function(e) {
''         if (e.which !== 13 || !this.input.val().trim()) {
''             return;
''         }
''         app.todoList.create(this.newAttributes());
''         this.input.val('');
''     },
''     addOne: function(todo) {
''         var view = new app.TodoView({model:todo});
''         $('#todo-list').append(view.render().el);
''     },
''     addAll: function() {
''         this.$('#todo-list').html(''); //clean the todo list
''         app.todoList.each(this.addOne,this);
''     },
''     newAttributes: function() {
''         return {
''             title: this.input.val(),
''             completed: false
''         }
''     }
'' });
- **Instantiate the app**
%%Add any other instantiations here as well
'' app.appView = new app.AppView();
- **Create View Template**
'' <script type="text/template" id="item-template">
  	'' <div class="view">
  		'' <input class="toggle" type="checkbox" <@= completed ? 'checked' : '' @>>
  		'' <label><@- title @></label>
  		'' <input class="edit" value="<@- title @>">
  		'' <button class="destroy">remove</button>
  	'' </div>
''   </script>
----------------
## Routers
- They are not required
	However, if you're using single page applications or want to save states, it's suggested that you do.
- Match parameters first, then splats
	**Parameters**: /todos/:id
	**Splats**: file/\*path
#### Example
''app.Router = Backbone.Router.extend(\{
''   routes: {
''     '*filter' : 'setFilter'
''   },
''   setFilter: function(params) {
''     console.log('app.router.params = ' + params); // just for didactical purposes.
''     window.filter = params.trim() || '';
''     app.todoList.trigger('reset');
''   }
'' });
- **Instantiate the router 
**%%Instantiate the router Backbone's history module before you instantiate the app
'' app.router = new app.Router();
'' Backbone.history.start(); //DO NOT FORGET THIS
'' app.appView = new app.AppView();
- **Modify the AppView
**''    addAll: function(){
''      this.$('#todo-list').html(''); // clean the todo list
 ''    // filter todo item list
 ''    switch(window.filter){
 ''      case 'pending':
 ''        _.each(app.todoList.remaining(), this.addOne);
 ''        break;
 ''      case 'completed':
 ''        _.each(app.todoList.completed(), this.addOne);
 ''        break;            
 ''      default:
 ''        app.todoList.each(this.addOne, this);
 ''        break;
- **Modify the Collection to implement the correct methods**
'' app.TodoList = Backbone.Collection.extend({
''    model: app.Todo,
''   localStorage: new Store("backbone-todo"),
''   completed: function() {
''     return this.filter(function( todo ) {
''       return todo.get('completed');
''     });
''   },
''   remaining: function() {
''     return this.without.apply( this, this.completed() );
''   }      
''  });


See the todos.js file in public/js/ for a full example backbone application.


