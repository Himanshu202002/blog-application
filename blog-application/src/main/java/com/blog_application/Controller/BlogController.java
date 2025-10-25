package com.blog_application.Controller;

import com.blog_application.Entity.BlogEntity;
import com.blog_application.Service.BlogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin(origins = "*")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    // Health Check
    @GetMapping("/abc")
    public String healthCheck(){
        return "OK";
    }

    // Create Post
    @PostMapping
    public BlogEntity createPost(@RequestBody BlogEntity post){
        return blogService.createPost(post);
    }

    // Get All Posts
    @GetMapping
    public List<BlogEntity> getAllPosts(){
        return blogService.getAllPosts();
    }

    // Get Post by ID
    @GetMapping("/{id}")
    public ResponseEntity<BlogEntity> getPostById(@PathVariable String id){
        return blogService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update Post
    @PutMapping("/{id}")
    public BlogEntity updatePost(@PathVariable String id, @RequestBody BlogEntity updatedPost){
        return blogService.updatePost(id, updatedPost);
    }

    // Delete Post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id){
        blogService.deletePOst(id);
        return ResponseEntity.noContent().build();
    }

    // Search Posts by title keyword
    @GetMapping("/search")
    public List<BlogEntity> searchPosts(@RequestParam String keyword){
        return blogService.searchPostsByTitle(keyword);
    }

    // Get Posts by author
    @GetMapping("/author/{author}")
    public List<BlogEntity> getPostsByAuthor(@PathVariable String author){
        return blogService.getPostsByAuthor(author);
    }
}
