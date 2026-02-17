package com.example.demo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class TodoService {
    @Autowired
    private TodoRepository todoRepository;
    
    public List<Todo> findAll(){
        return todoRepository.findAll();
    }
    public Todo save(Todo todo){
        return todoRepository.save(todo);
    }
    public void deleteById(Long id){
        todoRepository.deleteById(id);
    }
    public List<Todo> findByCompleted(boolean completed){
    return todoRepository.findByCompleted(completed);
}
public Todo findById(Long id){
    Optional<Todo> todo = todoRepository.findById(id);
    return todo.orElseThrow(() -> new RuntimeException("Todo not found with id " + id));

    }

}