const apiUrl = "/api/blog";

// ====== Render Posts ======
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
            <button onclick="editPost('${post.id}')">Edit</button>
            <button onclick="deletePost('${post.id}')">Delete</button>
        `;
        container.appendChild(div);
    });
}

// ====== Fetch All Posts ======
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

// ====== Search by Title ======
async function searchPosts() {
    const keyword = document.getElementById("searchKeyword").value.trim();
    if (!keyword) return fetchPosts();

    try {
        const res = await fetch(`${apiUrl}/search?keyword=${encodeURIComponent(keyword)}`);
        if (!res.ok) throw new Error("Search failed");
        const posts = await res.json();
        renderPosts(posts);
    } catch (err) {
        console.error(err);
        alert("Failed to search posts by title");
    }
}

// ====== Search by Author ======
async function searchByAuthor() {
    const author = document.getElementById("searchAuthor").value.trim();
    if (!author) return fetchPosts();

    try {
        const res = await fetch(`${apiUrl}/author/${encodeURIComponent(author)}`);
        if (!res.ok) throw new Error("Search failed");
        const posts = await res.json();
        renderPosts(posts);
    } catch (err) {
        console.error(err);
        alert("Failed to search posts by author");
    }
}

// ====== Create or Update Post ======
async function createOrUpdatePost() {
    const id = document.getElementById("postId").value;
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !author || !content) {
        alert("Please fill all fields");
        return;
    }

    const postData = { title, author, content };

    try {
        let res;
        if (id) {
            // Update
            res = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
        } else {
            // Create
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

// ====== Edit Post ======
async function editPost(id) {
    try {
        const res = await fetch(`${apiUrl}/${id}`);
        if (!res.ok) throw new Error("Post not found");
        const post = await res.json();
        document.getElementById("postId").value = post.id;
        document.getElementById("title").value = post.title;
        document.getElementById("author").value = post.author;
        document.getElementById("content").value = post.content;
    } catch (err) {
        console.error(err);
        alert("Error fetching post");
    }
}

// ====== Delete Post ======
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

// ====== Clear Form ======
function clearForm() {
    document.getElementById("postId").value = '';
    document.getElementById("title").value = '';
    document.getElementById("author").value = '';
    document.getElementById("content").value = '';
}

// ====== Clear Search ======
function clearSearch() {
    document.getElementById("searchKeyword").value = '';
    document.getElementById("searchAuthor").value = '';
    fetchPosts();
}

// ====== Enter Key Support ======
document.getElementById("searchKeyword").addEventListener("keyup", e => {
    if (e.key === "Enter") searchPosts();
});
document.getElementById("searchAuthor").addEventListener("keyup", e => {
    if (e.key === "Enter") searchByAuthor();
});

// ====== Initial Fetch ======
fetchPosts();
