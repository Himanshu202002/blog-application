package com.blog_application.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@Document(collection = "blogs")
public class BlogEntity {
    @Id
    private String id;
    private String title;
    private String content;
    private String author;
    private LocalDateTime localDateTime= LocalDateTime.now();
}
