package com.blog_application.Repository;

import com.blog_application.Entity.BlogEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BlogRepo extends MongoRepository<BlogEntity, String > {
    List<BlogEntity> findByAuthor (String author);
    List<BlogEntity> findByTitleContainingIgnoreCase(String keyword);
}
