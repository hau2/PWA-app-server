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
    image: "https://onetech.vn/wp-content/uploads/2023/01/image-1.jpeg"
  },
  { 
    id: 2, 
    title: "Offline Mode in PWA", 
    content: "Learn how to make your PWA work offline.", 
    image: "https://cdn.prod.website-files.com/649300f3606e51cb999842df/65718ea3394324fa4737b672_883ca625de7c44c48148d71a891020a0.png"
  },
  { 
    id: 3, 
    title: "Caching with Workbox", 
    content: "Workbox makes it easy to cache resources.", 
    image: "https://miro.medium.com/v2/resize:fit:1000/1*Dlr1sdN1idUXk9MKImD0Mw.png"
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
