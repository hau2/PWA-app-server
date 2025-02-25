// const express = require('express');
// const cors = require('cors');

// const app = express();
// const PORT = 4000;

// app.use(cors());
// app.use('/images', express.static('public'));

// const posts = [
//   { 
//     id: 1, 
//     title: "PWA with React", 
//     content: "This is an introduction to PWA with ReactJS.", 
//     image: "https://hau2.github.io/online-resources/react-pwa.jpg"
//   },
//   { 
//     id: 2, 
//     title: "Offline Mode in PWA", 
//     content: "Learn how to make your PWA work offline.", 
//     image: "https://hau2.github.io/online-resources/offline-mode.jpg"
//   },
//   { 
//     id: 3, 
//     title: "Caching with Workbox", 
//     content: "Workbox makes it easy to cache resources.", 
//     image: "https://hau2.github.io/online-resources/workbook-cache.jpg"
//   }
// ];

// // API: Lấy danh sách bài viết
// app.get('/api/posts', (req, res) => {
//   res.json(posts);
// });

// // API: Lấy chi tiết bài viết theo ID
// app.get('/api/posts/:id', (req, res) => {
//   const postId = parseInt(req.params.id, 10);
//   const post = posts.find(p => p.id === postId);

//   if (post) {
//     res.json(post);
//   } else {
//     res.status(404).json({ message: "Post not found" });
//   }
// });

// // Serve static images từ thư mục public
// app.use('/images', express.static('public'));

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// 🔹 List of random images for posts
const imageUrls = [
  "https://hau2.github.io/online-resources/react-pwa.jpg",
  "https://hau2.github.io/online-resources/offline-mode.jpg",
  "https://hau2.github.io/online-resources/workbook-cache.jpg"
];

// 🔹 Generate a list of 100 posts with random images
const posts = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  title: `Post ${index + 1}`,
  content: `This is the content of post ${index + 1}. Detailed article content can go here.`,
  image: imageUrls[Math.floor(Math.random() * imageUrls.length)] // Assign a random image
}));

// 🔹 API: Get paginated posts
app.get('/api/posts', (req, res) => {
  let { page = 1, limit = 10 } = req.query; // Default: page=1, limit=10
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  res.json({
    currentPage: page,
    totalPages: Math.ceil(posts.length / limit),
    totalPosts: posts.length,
    posts: paginatedPosts,
  });
});

// 🔹 API: Get a single post by ID
app.get('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// 🔹 Load VAPID Keys from `.env`
const vapidKeys = {
  publicKey: 'BOmI-_Eat9iH0TYjh7D3E1XOwmmlfCW6wpK8J5pV-MezE_VwSkafAcn1OhAjLqK1l1UqfaCZ7ORkYWROlWLDqEU',
  privateKey: 'ndmKxdZkvxOMJmTLyD4WMRDAy1h82DRsBqSNMr5Euo0'
};

// 🔹 Set Web Push credentials
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// 🔹 Store subscriptions in memory (Use DB in production)
let subscriptions = [];

// 🔹 API to get VAPID Public Key (Frontend needs this)
app.get('/api/notification/vapid-key', (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

// 🔹 API to subscribe a user
app.post('/api/notification/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  console.log('📩 New Subscription:', subscription);
  res.status(201).json({ message: 'Subscribed successfully' });
});

// 🔹 API to send a push notification
app.post('/api/notification/send', async (req, res) => {
  const { title, message } = req.body;
  const payload = JSON.stringify({ title, message });

  try {
    subscriptions.forEach(sub => {
      webpush.sendNotification(sub, payload).catch(err => console.error('❌ Push failed:', err));
    });
    res.status(200).json({ message: 'Notification sent' });
  } catch (error) {
    console.error('❌ Error sending push:', error);
    res.status(500).json({ error: 'Error sending notification' });
  }
});

// 🔹 API to remove a subscription (Unsubscribe)
app.post('/api/notification/remove-subscription', (req, res) => {
  const { endpoint } = req.body;
  subscriptions = subscriptions.filter(sub => sub.endpoint !== endpoint);
  console.log('🗑 Subscription removed:', endpoint);
  res.json({ message: 'Unsubscribed successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('🔑 VAPID Public Key:', vapidKeys.publicKey);
});

