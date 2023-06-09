import { Router } from 'express';
import db from '../database/connection.js';

const router = Router();

router.get('/api/forum/posts', async (req, res) => {
    let posts = await db.all('SELECT * FROM forum_posts WHERE is_published = true');
    if (posts.length === 0) {
        return res.status(404).send({
            message: 'Ingen opslag fundet',
            status: 404
        });
    }
    for (const post of posts) {
        const user = await db.get('SELECT first_name, last_name FROM users WHERE id = ?', [post.user_id]);
        const author = `${user.first_name} ${user.last_name}`;
        post.author = author;

        const post_likes = await db.get('SELECT COUNT(*) AS likes FROM posts_likes WHERE post_id = ?', [post.id]);
        post.likes = post_likes.likes;

        let comments = await db.all('SELECT * FROM forum_comments WHERE post_id = ?', [post.id]);
        if (comments.length > 0) {
            for (const comment of comments) {
                const user = await db.get('SELECT first_name, last_name FROM users WHERE id = ?', [comment.user_id]);
                const author = `${user.first_name} ${user.last_name}`;
                comment.author = author;

                const comment_likes = await db.get('SELECT COUNT(*) AS likes FROM comments_likes WHERE comment_id = ?', [comment.id]);
                comment.likes = comment_likes.likes;
            }
            post.comments = comments;
        }

    }
    return res.status(200).send(posts);
});

router.get('/api/forum/posts/:id', async (req, res) => {
    const post = await db.get('SELECT * FROM forum_posts WHERE id = ?', [Number(req.params.id)]);
    if (!post) {
        return res.status(404).send({
            message: 'Opslag ikke fundet',
            status: 404
        });
    }
    const user = await db.get('SELECT first_name, last_name FROM users WHERE id = ?', [post.user_id]);
    if (!user) {
        post.author = 'Slettet bruger';
    } else {
        const author = `${user.first_name} ${user.last_name}`;
        post.author = author;
    }

    const post_likes = await db.get('SELECT COUNT(*) AS likes FROM posts_likes WHERE post_id = ?', [post.id]);
    post.likes = post_likes.likes;

    let comments = await db.all('SELECT * FROM forum_comments WHERE post_id = ?', [post.id]);
    if (comments.length > 0) {
        for (const comment of comments) {
            const user = await db.get('SELECT first_name, last_name FROM users WHERE id = ?', [comment.user_id]);
            if (!user) {
                comment.author = 'Slettet bruger';
            } else {
                const author = `${user.first_name} ${user.last_name}`;
                comment.author = author;
            }

            const comment_likes = await db.get('SELECT COUNT(*) AS likes FROM comments_likes WHERE comment_id = ?', [comment.id]);
            comment.likes = comment_likes.likes;
        }
        post.comments = comments;
    }
    return res.status(200).send(post);
});

router.get('/api/forum/posts/subject/:subject', async (req, res) => {
    let posts = await db.all('SELECT * FROM forum_posts WHERE subject = ? AND is_published = true ORDER BY date DESC', [req.params.subject]);
    if (posts.length <= 0) {
        return res.status(404).send({
            message: 'Ingen opslag fundet',
            status: 404
        });
    } else {
        for (const post of posts) {
            const user = await db.get('SELECT first_name, last_name FROM users WHERE id = ?', [post.user_id]);
            const author = `${user.first_name} ${user.last_name}`;
            post.author = author;

            const post_likes = await db.get('SELECT COUNT(*) AS likes FROM posts_likes WHERE post_id = ?', [post.id]);
            post.likes = post_likes.likes;

            let comments = await db.all('SELECT * FROM forum_comments WHERE post_id = ?', [post.id]);
            if (comments.length > 0) {
                for (const comment of comments) {
                    const user = await db.get('SELECT first_name, last_name FROM users WHERE id = ?', [comment.user_id]);
                    const author = `${user.first_name} ${user.last_name}`;
                    comment.author = author;

                    const comment_likes = await db.get('SELECT COUNT(*) AS likes FROM comments_likes WHERE comment_id = ?', [comment.id]);
                    comment.likes = comment_likes.likes;

                }
                post.comments = comments;
            }
        }
        return res.status(200).send(posts);
    }
});

router.get('/api/private/forum/posts', async (req, res) => {

    let posts = await db.all('SELECT * FROM forum_posts WHERE user_id = ?', [req.session.user.id]);
    for (const post of posts) {
        const user = await db.get('SELECT first_name, last_name FROM users WHERE id = ?', [post.user_id]);
        const author = `${user.first_name} ${user.last_name}`;
        post.author = author;
    }
    return res.status(200).send(posts);

});

router.get('/api/private/forum/posts/likes/', async (req, res) => {

    let liked_posts = await db.all('SELECT * FROM posts_likes WHERE user_id = ?', [req.session.user.id]);
    return res.status(200).send(liked_posts);

});

router.get('/api/private/forum/posts/:id', async (req, res) => {

    const post = await db.get('SELECT * FROM forum_posts WHERE id = ? AND user_id = ?', [Number(req.params.id), req.session.user.id]);
    if (!post) {
        return res.status(404).send({
            message: 'Opslag ikke fundet',
            status: 404
        });
    }
    const user = await db.get('SELECT first_name, last_name FROM users WHERE id = ?', [req.session.user.id]);
    const author = `${user.first_name} ${user.last_name}`;
    post.author = author;
    return res.status(200).send(post);

});

router.get('/api/private/forum/comments/likes', async (req, res) => {
    let liked_comments = await db.all('SELECT * FROM comments_likes WHERE user_id = ?', [req.session.user.id]);
    return res.status(200).send(liked_comments);

});

router.post('/api/private/forum/comments/likes/:id', async (req, res) => {

    const comment = await db.get('SELECT * FROM forum_comments WHERE id = ?', [req.params.id]);
    if (!comment) {
        return res.status(404).send({
            message: 'Kommentar ikke fundet',
            status: 404
        });
    }
    const like = await db.get('SELECT * FROM comments_likes WHERE user_id = ? AND comment_id = ?', [req.session.user.id, req.params.id]);
    if (like) {
        await db.run('DELETE FROM comments_likes WHERE user_id = ? AND comment_id = ?', [req.session.user.id, req.params.id]);
        return res.status(201).send({
            message: 'Kommentar unliked',
            status: 201
        });
    } else {
        await db.run('INSERT INTO comments_likes (user_id, comment_id) VALUES (?, ?)', [req.session.user.id, req.params.id]);
        return res.status(200).send({
            message: 'Kommentar liked',
            status: 200
        });
    }

});

router.post('/api/private/forum/comments', async (req, res) => {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    if (!user) {
        return res.status(401).send({
            message: 'Kunne ikke finde din bruger',
            status: 401
        });
    }
    const { comment, post_id } = req.body;
    if (!comment || comment.length < 2) {
        return res.status(400).send({
            message: 'Kommentar skal være længere',
            status: 400
        });
    };
    const post = await db.get('SELECT * FROM forum_posts WHERE id = ?', [Number(post_id)]);
    if (!post) {
        return res.status(404).send({
            message: 'Opslag ikke fundet, kan være slettet',
            status: 404
        });
    }
    await db.run('INSERT INTO forum_comments (user_id, post_id, content, date) VALUES (?, ?, ?, ?)', [req.session.user.id, Number(post_id), comment, new Date().toLocaleString("da-DK")]);
    return res.status(200).send({
        message: 'Kommentar oprettet',
        status: 200
    });

});

router.delete('/api/private/forum/comments/:id', async (req, res) => {

    const comment = await db.get('SELECT * FROM forum_comments WHERE id = ?', [Number(req.params.id)]);
    if (!comment) {
        return res.status(404).send({
            message: 'Kommentar ikke fundet',
            status: 404
        });
    }
    if (comment.user_id !== req.session.user.id) {
        return res.status(401).send({
            message: 'Du kan kun slette dine egne kommentarer',
            status: 401
        });
    }
    await db.run('DELETE FROM forum_comments WHERE id = ?', [Number(req.params.id)]);
    return res.status(200).send({
        message: 'Kommentar slettet',
        status: 200
    });

});

router.put('/api/private/forum/comments/:id', async (req, res) => {

    const comment = await db.get('SELECT * FROM forum_comments WHERE id = ?', [Number(req.params.id)]);
    if (!comment) {
        return res.status(404).send({
            message: 'Kommentar ikke fundet',
            status: 404
        });
    }
    if (comment.user_id !== req.session.user.id) {
        return res.status(401).send({
            message: 'Du kan kun redigere dine egne kommentarer',
            status: 401
        });
    }
    const { content } = req.body;
    if (!content || content.length < 2) {
        return res.status(400).send({
            message: 'Kommentar skal være længere',
            status: 400
        });
    };
    await db.run('UPDATE forum_comments SET content = ? WHERE id = ?', [content, Number(req.params.id)]);
    return res.status(200).send({
        message: 'Kommentar redigeret',
        status: 200
    });

});

router.post('/api/private/forum/posts/likes/:id', async (req, res) => {

    const post = await db.get('SELECT * FROM forum_posts WHERE id = ?', [req.params.id]);
    if (!post) {
        return res.status(404).send({
            message: 'Opslag ikke fundet',
            status: 404
        });
    }
    const like = await db.get('SELECT * FROM posts_likes WHERE user_id = ? AND post_id = ?', [req.session.user.id, req.params.id]);
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

});

router.delete('/api/private/forum/posts/:id', async (req, res) => {

    const post = await db.get('SELECT * FROM forum_posts WHERE id = ?', [Number(req.params.id)]);
    if (!post || post.user_id !== req.session.user.id) {
        return res.status(403).send({
            message: "Ikke tilladt",
            status: 403
        });
    }

    await db.run('DELETE FROM forum_posts WHERE id = ?', [Number(req.params.id)]);
    return res.status(200).send({
        message: `Indlæg slettet <br> Titel: ${post.title}`,
        status: 200
    });
});

router.put('/api/private/forum/posts/:id', async (req, res) => {

    const post = await db.get('SELECT * FROM forum_posts WHERE id = ?', [Number(req.params.id)]);
    if (!post || post.user_id !== req.session.user.id) {
        return res.status(403).send({
            message: "Du kan kun redigere dine egne indlæg",
            status: 403
        });
    }

    const { title, content, is_published, subject } = req.body;
    if (!title || !content || is_published === undefined || !subject) {
        return res.status(400).send({
            message: "Mangler titel, indhold eller info om offentliggørelse",
            status: 400
        });
    }
    await db.run('UPDATE forum_posts SET title = ?, subject = ?, content = ?, is_published = ? WHERE id = ?', [title, subject, content, is_published, Number(req.params.id)]);
    return res.status(200).send({
        message: `Indlæg redigeret <br> Titel: ${title}`,
        status: 200
    });
});

router.post('/api/private/forum/posts', async (req, res) => {

    const { title, content, is_published, subject } = req.body;
    if (!title || !content || is_published === undefined || !subject) {
        return res.status(400).send({
            message: "Mangler titel, indhold eller info om offentliggørelse",
            status: 400
        });
    }
    await db.run('INSERT INTO forum_posts (user_id, title, subject, is_published, content, date) VALUES (?, ?, ?, ?, ?, ?)', [req.session.user.id, title, subject, is_published, content, new Date().toLocaleString("da-DK")]);
    return res.status(200).send({
        message: `Indlæg oprettet <br> Titel: ${title}`,
        status: 200
    });

});



export default router;