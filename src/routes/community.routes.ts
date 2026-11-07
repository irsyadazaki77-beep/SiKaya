import express from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '../lib/firebase-admin.ts';
import { authenticate } from '../middleware/authenticate.ts';
import { profileMutationLimiter } from '../middleware/rateLimiter.ts';
import { CommunityPostSchema, CommunityCommentSchema } from '../lib/schemas.ts';

export const communityRouter = express.Router();

const DEFAULT_POSTS = [
  {
    id: 'default-1',
    author: 'Budi Santoso',
    avatar: '👨‍💼',
    time: '2 jam yang lalu',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    content: 'Akhirnya bisa mencapai target dana darurat 6 bulan pengeluaran! 🚀 Terima kasih SiKaya untuk fitur tracking dan edukasinya. Sekarang fokus mulai cicil reksa dana indeks.',
    likes: 124,
    tags: ['DanaDarurat', 'Milestone', 'Saham'],
    comments: [
      { id: 'c1', author: 'Siti Aminah', avatar: '🧕', content: 'Keren mas! Semoga konsisten terus ya.', time: '1 jam yang lalu' },
      { id: 'c2', author: 'Wawan Value', avatar: '🧔', content: 'Selamat mas! Langkah awal yang sangat kuat.', time: '45m lalu' }
    ]
  },
  {
    id: 'default-2',
    author: 'Siti Aminah',
    avatar: '🧕',
    time: '5 jam yang lalu',
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    content: 'Ada yang punya rekomendasi reksa dana pasar uang syariah yang return-nya stabil? Mau buat tabungan umroh nih.',
    likes: 45,
    tags: ['RDPU', 'Syariah', 'TanyaJawab'],
    comments: [
      { id: 'c3', author: 'Rudi Ardiansyah', avatar: '🦁', content: 'RDPU Syariah dari Sucor atau Bahana biasanya stabil mbak, silakan dicek prospektusnya.', time: '3 jam yang lalu' }
    ]
  },
  {
    id: 'default-3',
    author: 'Alex Chandra',
    avatar: '👨‍💻',
    time: '1 hari yang lalu',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    content: 'Market IHSG lagi koreksi dalam, waktunya serok saham blue chip! BBCA dan BBRI kelihatan menarik di harga segini. Tetap DYOR (Do Your Own Research) ya teman-teman.',
    likes: 89,
    tags: ['Saham', 'IHSG', 'Investasi'],
    comments: []
  }
];

const DEFAULT_SHOUTS = [
  { id: 's1', author: 'Rian_HODL', avatar: '🐯', text: 'Bitcoin nembus level baru guys! Tetap jaga alokasi risiko 🔥', time: '10:14' },
  { id: 's2', author: 'Dian_Puspita', avatar: '🦄', text: 'Hari ini dapet dividen pertama lumayan buat nambah unit reksadana.', time: '09:45' },
  { id: 's3', author: 'Ahmad_Bursa', avatar: '🤖', text: 'BBRI mantul di area support kuat, serok tipis-tipis.', time: '09:12' }
];

// 1. Get all community posts
communityRouter.get('/posts', async (req, res, next) => {
  try {
    const postsSnap = await adminDb
      .collection('communityPosts')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    if (postsSnap.empty) {
      return res.json({ success: true, posts: DEFAULT_POSTS });
    }

    const posts = postsSnap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        author: d.author || 'Anonim',
        avatar: d.avatar || '🦊',
        time: d.time || 'Baru saja',
        createdAt: d.createdAt,
        content: d.content || '',
        likes: d.likes || 0,
        tags: d.tags || [],
        comments: d.comments || [],
        userId: d.userId
      };
    });

    res.json({ success: true, posts });
  } catch (error) {
    next(error);
  }
});

// 2. Create new post
communityRouter.post('/posts', authenticate, profileMutationLimiter, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const validated = CommunityPostSchema.parse(req.body);

    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();

    const postRef = adminDb.collection('communityPosts').doc();
    const newPost = {
      author: userData?.fullName || req.user?.name || 'Warga SiKaya',
      avatar: userData?.avatar || '🦊',
      userId: uid,
      content: validated.content,
      tags: validated.tags,
      likes: 0,
      comments: [],
      time: 'Baru saja',
      createdAt: new Date().toISOString(),
      serverTimestamp: FieldValue.serverTimestamp()
    };

    await postRef.set(newPost);

    res.json({ success: true, id: postRef.id, post: { id: postRef.id, ...newPost } });
  } catch (error) {
    next(error);
  }
});

// 3. Add comment to post
communityRouter.post('/posts/:id/comments', authenticate, profileMutationLimiter, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const uid = req.user!.uid;
    const validated = CommunityCommentSchema.parse(req.body);

    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();

    const commentObj = {
      id: Math.random().toString(36).substring(2, 9),
      userId: uid,
      author: userData?.fullName || req.user?.name || 'Warga SiKaya',
      avatar: userData?.avatar || '🦊',
      content: validated.content,
      time: 'Baru saja',
      createdAt: new Date().toISOString()
    };

    const postRef = adminDb.collection('communityPosts').doc(postId);
    const postSnap = await postRef.get();

    if (postSnap.exists) {
      await postRef.update({
        comments: FieldValue.arrayUnion(commentObj),
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    res.json({ success: true, comment: commentObj });
  } catch (error) {
    next(error);
  }
});

// 4. Like / unlike post
communityRouter.post('/posts/:id/like', authenticate, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const postRef = adminDb.collection('communityPosts').doc(postId);
    const postSnap = await postRef.get();

    if (postSnap.exists) {
      await postRef.update({
        likes: FieldValue.increment(1)
      });
    }

    res.json({ success: true, message: 'Like tercatat' });
  } catch (error) {
    next(error);
  }
});

// 5. Get and post shoutbox
communityRouter.get('/shouts', async (req, res, next) => {
  try {
    const shoutsSnap = await adminDb
      .collection('communityShouts')
      .orderBy('createdAt', 'desc')
      .limit(30)
      .get();

    if (shoutsSnap.empty) {
      return res.json({ success: true, shouts: DEFAULT_SHOUTS });
    }

    const shouts = shoutsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, shouts });
  } catch (error) {
    next(error);
  }
});

communityRouter.post('/shouts', authenticate, profileMutationLimiter, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const text = String(req.body.text || '').trim();
    if (!text || text.length > 280) {
      return res.status(400).json({ status: 'error', message: 'Teks shoutbox maksimal 280 karakter' });
    }

    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();

    const shoutRef = adminDb.collection('communityShouts').doc();
    const newShout = {
      author: userData?.fullName || req.user?.name || 'Warga SiKaya',
      avatar: userData?.avatar || '🦊',
      userId: uid,
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      serverTimestamp: FieldValue.serverTimestamp()
    };

    await shoutRef.set(newShout);
    res.json({ success: true, shout: { id: shoutRef.id, ...newShout } });
  } catch (error) {
    next(error);
  }
});

export default communityRouter;
