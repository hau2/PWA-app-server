const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use('/images', express.static('public'));

const posts = [
  { 
    id: 1, 
    title: "PWA with React", 
    content: "This is an introduction to PWA with ReactJS.", 
    image: "https://hau2.github.io/online-resources/react-pwa.jpg"
  },
  { 
    id: 2, 
    title: "Offline Mode in PWA", 
    content: "Learn how to make your PWA work offline.", 
    image: "https://hau2.github.io/online-resources/offline-mode.jpg"
  },
  { 
    id: 3, 
    title: "Caching with Workbox", 
    content: "Workbox makes it easy to cache resources.", 
    image: "https://hau2.github.io/online-resources/workbook-cache.jpg"
  }
];

// API: Lấy danh sách bài viết
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// API: Lấy chi tiết bài viết theo ID
app.get('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

// Serve static images từ thư mục public
app.use('/images', express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
