package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins="http://localhost:5173")

public class TodoController {
    @Autowired
    private TodoService todoService;

    
@GetMapping
public List<Todo> getTodos(@RequestParam(required = false) Boolean completed) {

    if (completed != null) {
        return todoService.findByCompleted(completed);
    }

    return todoService.findAll();
}

    @PostMapping
    public Todo createTodo(@Valid @RequestBody Todo todo){
        return todoService.save(todo);
    }

    @PutMapping("/{id}")
public Todo updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo){

    Todo existingTodo = todoService.findById(id);

    existingTodo.setTitle(updatedTodo.getTitle());
    existingTodo.setDescription(updatedTodo.getDescription());
    existingTodo.setCompleted(updatedTodo.isCompleted());

    return todoService.save(existingTodo);
}



    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id){
        todoService.deleteById(id);
    }
}
