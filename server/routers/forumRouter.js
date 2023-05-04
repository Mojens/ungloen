import { Router } from 'express';
import db from "../database/connection.js";

const router = Router();

router.get('/api/forum', async (req, res) => {
    let posts = await db.all('SELECT * FROM forum_posts WHERE is_published = true');
    if (posts.length === 0) {
        return res.status(404).send({
            message: 'Ingen opslag fundet',
            status: 404
        });
    }
    for (const post of posts) {
        const [user] = await db.all('SELECT first_name, last_name FROM users WHERE id = ?', [post.user_id]);
        const author = user.first_name + ' ' + user.last_name;
        post.author = author;
        post.user_id = undefined;

        const [post_likes] = await db.all('SELECT COUNT(*) AS likes FROM posts_likes WHERE post_id = ?', [post.id]);
        post.likes = post_likes.likes;

        let comments = await db.all('SELECT * FROM forum_comments WHERE post_id = ?', [post.id]);
        if (comments.length > 0) {
            for (const comment of comments) {
                const [user] = await db.all('SELECT first_name, last_name FROM users WHERE id = ?', [comment.user_id]);
                const author = user.first_name + ' ' + user.last_name;
                comment.author = author;

                const [comment_likes] = await db.all('SELECT COUNT(*) AS likes FROM comments_likes WHERE comment_id = ?', [comment.id]);
                comment.likes = comment_likes.likes;

                comment.user_id = undefined;
                comment.post_id = undefined;
            }
            post.comments = comments;
        }

    }
    return res.status(200).send(posts);
});

router.get('/api/forum/:id', async (req, res) => {
    const [post] = await db.all('SELECT * FROM forum_posts WHERE id = ?', [Number(req.params.id)]);
    if (!post) {
        return res.status(404).send({
            message: 'Opslag ikke fundet',
            status: 404
        });
    }
    const [user] = await db.all('SELECT first_name, last_name FROM users WHERE id = ?', [post.user_id]);
    if (!user) {
        post.author = 'Slettet bruger';
    } else {
        const author = user.first_name + ' ' + user.last_name;
        post.author = author;
    }

    const [post_likes] = await db.all('SELECT COUNT(*) AS likes FROM posts_likes WHERE post_id = ?', [post.id]);
    post.likes = post_likes.likes;

    post.user_id = undefined;
    let comments = await db.all('SELECT * FROM forum_comments WHERE post_id = ?', [post.id]);
    if (comments.length > 0) {
        for (const comment of comments) {
            const [user] = await db.all('SELECT first_name, last_name FROM users WHERE id = ?', [comment.user_id]);
            if (!user) {
                comment.author = 'Slettet bruger';
            } else {
                const author = user.first_name + ' ' + user.last_name;
                comment.author = author;
            }

            const [comment_likes] = await db.all('SELECT COUNT(*) AS likes FROM comments_likes WHERE comment_id = ?', [comment.id]);
            comment.likes = comment_likes.likes;

            comment.user_id = undefined;
            comment.post_id = undefined;
        }
        post.comments = comments;
    }
    return res.status(200).send(post);
});

router.get('/api/forum/subject/:subject', async (req, res) => {
    let posts = await db.all('SELECT * FROM forum_posts WHERE subject = ? ORDER BY date DESC', [req.params.subject]);
    if (posts.length <= 0) {
        return res.status(404).send({
            message: 'Ingen opslag fundet',
            status: 404
        });
    } else {
        for (const post of posts) {
            const [user] = await db.all('SELECT first_name, last_name FROM users WHERE id = ?', [post.user_id]);
            const author = user.first_name + ' ' + user.last_name;
            post.author = author;
            post.user_id = undefined;

            const [post_likes] = await db.all('SELECT COUNT(*) AS likes FROM posts_likes WHERE post_id = ?', [post.id]);
            post.likes = post_likes.likes;

            let comments = await db.all('SELECT * FROM forum_comments WHERE post_id = ?', [post.id]);
            if (comments.length > 0) {
                for (const comment of comments) {
                    const [user] = await db.all('SELECT first_name, last_name FROM users WHERE id = ?', [comment.user_id]);
                    const author = user.first_name + ' ' + user.last_name;
                    comment.author = author;
                    comment.user_id = undefined;
                    comment.post_id = undefined;

                    const [comment_likes] = await db.all('SELECT COUNT(*) AS likes FROM comments_likes WHERE comment_id = ?', [comment.id]);
                    comment.likes = comment_likes.likes;

                }
                post.comments = comments;
            }
        }
        return res.status(200).send(posts);
    }
});

router.get('/api/private/forum/', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: "Unauthorized",
            status: 401
        });
    } else {
        let posts = await db.all('SELECT * FROM forum_posts WHERE user_id = ?', [req.session.user.id]);
        for (const post of posts) {
            const [user] = await db.all('SELECT first_name, last_name FROM users WHERE id = ?', [post.user_id]);
            const author = user.first_name + ' ' + user.last_name;
            post.author = author;
        }
        return res.status(200).send(posts);
    }
});

router.get('/api/private/forum/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: "Ikke logget ind",
            status: 401
        });
    } else {
        const [post] = await db.all('SELECT * FROM forum_posts WHERE id = ? AND user_id = ?', [Number(req.params.id), req.session.user.id]);
        if (!post) {
            return res.status(404).send({
                message: 'Opslag ikke fundet',
                status: 404
            });
        }
        const [user] = await db.all('SELECT first_name, last_name FROM users WHERE id = ?', [req.session.user.id]);
        const author = user.first_name + ' ' + user.last_name;
        post.author = author;
        return res.status(200).send(post);
    }
});

router.get('/api/likes/posts/forum/', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: "Ikke logget ind",
            status: 401
        });
    } else {
        let liked_posts = await db.all('SELECT * FROM posts_likes WHERE user_id = ?', [req.session.user.id]);
        return res.status(200).send(liked_posts);
    }
});
router.post('/api/likes/posts/forum/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: "For at like et opslag skal du være logget ind<br>Ellers du kan oprette en bruger",
            status: 401
        });
    } else {
        const [post] = await db.all('SELECT * FROM forum_posts WHERE id = ?', [req.params.id]);
        if (!post) {
            return res.status(404).send({
                message: 'Opslag ikke fundet',
                status: 404
            });
        }
        const [like] = await db.all('SELECT * FROM posts_likes WHERE user_id = ? AND post_id = ?', [req.session.user.id, req.params.id]);
        if (like) {
            await db.run('DELETE FROM posts_likes WHERE user_id = ? AND post_id = ?', [req.session.user.id, req.params.id]);
            return res.status(201).send({
                message: 'Opslag unliket',
                status: 201
            });
        }
        await db.run('INSERT INTO posts_likes (user_id, post_id) VALUES (?, ?)', [req.session.user.id, req.params.id]);
        return res.status(200).send({
            message: 'Opslag liket',
            status: 200
        });
    }
});



export default router;