const apiUrl = "/api/blog";

// ===== Render Posts =====
function renderPosts(posts) {
    const container = document.getElementById("postsContainer");
    container.innerHTML = '';
    if (!posts || posts.length === 0) {
        container.innerHTML = '<p>No posts found.</p>';
        return;
    }
    posts.forEach(post => {
        const div = document.createElement("div");
        div.className = "post";
        div.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Author:</strong> ${post.author}</p>
            <p>${post.content}</p>
            <div class="post-buttons">
                <button onclick="editPost('${post.id}')">Edit</button>
                <button onclick="deletePost('${post.id}')">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// ===== Fetch All Posts =====
async function fetchPosts() {
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const posts = await res.json();
        renderPosts(posts);
    } catch (err) {
        console.error(err);
        alert("Error fetching posts");
    }
}

// ===== Search by Title / Author =====
async function searchPosts() {
    const keyword = document.getElementById("searchKeyword").value.trim();
    const author = document.getElementById("searchAuthor").value.trim();

    try {
        let posts;
        if (keyword) {
            const res = await fetch(`${apiUrl}/search?keyword=${encodeURIComponent(keyword)}`);
            if (!res.ok) throw new Error("Search by title failed");
            posts = await res.json();
        } else if (author) {
            const res = await fetch(`${apiUrl}/author/${encodeURIComponent(author)}`);
            if (!res.ok) throw new Error("Search by author failed");
            posts = await res.json();
        } else {
            return fetchPosts();
        }
        renderPosts(posts);
    } catch (err) {
        console.error(err);
        alert("Failed to search posts");
    }
}

// ===== Real-Time Suggestions =====
async function showSuggestions(inputId, type) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    const suggestionsDiv = document.getElementById(type + "Suggestions");

    if (!value) {
        suggestionsDiv.style.display = "none";
        return;
    }

    try {
        let res, posts;
        if (type === "title") {
            res = await fetch(`${apiUrl}/search?keyword=${encodeURIComponent(value)}`);
        } else {
            res = await fetch(`${apiUrl}/author/${encodeURIComponent(value)}`);
        }
        if (!res.ok) throw new Error("Suggestion fetch failed");
        posts = await res.json();

        suggestionsDiv.innerHTML = '';
        posts.slice(0, 5).forEach(post => {
            const div = document.createElement("div");
            div.className = "suggestion-item";
            div.innerText = type === "title" ? post.title : post.author;
            div.onclick = () => {
                input.value = div.innerText;
                suggestionsDiv.style.display = "none";
                searchPosts();
            };
            suggestionsDiv.appendChild(div);
        });
        suggestionsDiv.style.display = posts.length ? "block" : "none";
    } catch (err) {
        console.error(err);
        suggestionsDiv.style.display = "none";
    }
}

// ===== Validate Inputs =====
function validateInputs(title, author, content) {
    let isValid = true;

    document.getElementById("titleError").innerText = '';
    document.getElementById("authorError").innerText = '';
    document.getElementById("contentError").innerText = '';

    if (!title) {
        document.getElementById("titleError").innerText = 'Title is required';
        isValid = false;
    }
    if (!author) {
        document.getElementById("authorError").innerText = 'Author is required';
        isValid = false;
    }
    if (!content) {
        document.getElementById("contentError").innerText = 'Content is required';
        isValid = false;
    }
    return isValid;
}

// ===== Create or Update Post =====
async function createOrUpdatePost() {
    const id = document.getElementById("postId").value;
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!validateInputs(title, author, content)) return;

    const postData = { title, author, content };

    try {
        let res;
        if (id) {
            res = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
        } else {
            res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
        }
        if (!res.ok) throw new Error("Failed to save post");
        clearForm();
        fetchPosts();
    } catch (err) {
        console.error(err);
        alert("Error saving post");
    }
}

// ===== Edit Post =====
async function editPost(id) {
    try {
        const res = await fetch(`${apiUrl}/${id}`);
        if (!res.ok) throw new Error("Post not found");
        const post = await res.json();
        document.getElementById("postId").value = post.id;
        document.getElementById("title").value = post.title;
        document.getElementById("author").value = post.author;
        document.getElementById("content").value = post.content;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        console.error(err);
        alert("Error fetching post");
    }
}

// ===== Delete Post =====
async function deletePost(id) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
        const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Failed to delete post");
        fetchPosts();
    } catch (err) {
        console.error(err);
        alert("Error deleting post");
    }
}

// ===== Clear Form =====
function clearForm() {
    document.getElementById("postId").value = '';
    document.getElementById("title").value = '';
    document.getElementById("author").value = '';
    document.getElementById("content").value = '';
    document.getElementById("titleError").innerText = '';
    document.getElementById("authorError").innerText = '';
    document.getElementById("contentError").innerText = '';
}

// ===== Clear Search =====
function clearSearch() {
    document.getElementById("searchKeyword").value = '';
    document.getElementById("searchAuthor").value = '';
    document.getElementById("titleSuggestions").style.display = "none";
    document.getElementById("authorSuggestions").style.display = "none";
    fetchPosts();
}

// ===== Event Listeners =====
document.getElementById("searchKeyword").addEventListener("keyup", e => {
    showSuggestions("searchKeyword", "title");
    if (e.key === "Enter") searchPosts();
});
document.getElementById("searchAuthor").addEventListener("keyup", e => {
    showSuggestions("searchAuthor", "author");
    if (e.key === "Enter") searchPosts();
});

// ===== Initial Fetch =====
fetchPosts();
