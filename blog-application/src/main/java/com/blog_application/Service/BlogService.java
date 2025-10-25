package com.blog_application.Service;

import com.blog_application.Entity.BlogEntity;
import com.blog_application.Repository.BlogRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogService {

    private final BlogRepo blogRepo;

    public BlogService(BlogRepo blogRepo) {
        this.blogRepo = blogRepo;
    }

    //Create
    public BlogEntity createPost (BlogEntity post){
        return blogRepo.save(post);
    }

    //Read all
    public List<BlogEntity> getAllPosts(){
        return blogRepo.findAll();
    }

    //Read By ID
    public Optional<BlogEntity> findById(String id){
        return blogRepo.findById(id);
    }

    //Read By Author
    public List<BlogEntity> getPostsByAuthor(String author){
        return blogRepo.findByAuthor(author);
    }

    //Update
    public BlogEntity updatePost(String id, BlogEntity updatedPost){
        return blogRepo.findById(id).map(post ->{
            post.setTitle(updatedPost.getTitle());
            post.setContent(updatedPost.getContent());
            post.setAuthor(updatedPost.getAuthor());
            return blogRepo.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found with id: "+ id));
    }

    public List<BlogEntity> searchPostsByTitle(String keyword){
        return blogRepo.findByTitleContainingIgnoreCase(keyword);
    }

    //Delete
    public void deletePOst(String id){
        blogRepo.deleteById(id);
    }
}
