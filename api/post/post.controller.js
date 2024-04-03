import { logger } from '../../services/logger.service.js'
import { postService } from './post.service.js'

export async function getPosts(req, res) {
    try {
        // const filterBy = {
        //     inStock: req.query.inStock || '',
        //     label: req.query.label || '',
        //     price: +req.query.price || 0,
        // }
        // const filterBy = {
        //     txt: req.query.txt || '',
        // }
        const filterBy = { usersToLoadPost: req.query.usersToLoadPost || '' }
        logger.debug('Getting posts with filter', filterBy)
        const posts = await postService.query(filterBy)
        res.json(posts)
    } catch (err) {
        logger.error('Failed to get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}

export async function getPostById(req, res) {
    try {
        const postId = req.params.id
        const post = await postService.getById(postId)
        res.json(post)
    } catch (err) {
        logger.error('Failed to get post', err)
        res.status(500).send({ err: 'Failed to get post' })
    }
}

export async function addPost(req, res) {
    const { loggedinUser } = req

    try {
        const post = req.body
        post.owner = loggedinUser
        const addedPost = await postService.add(post)
        res.json(addedPost)
    } catch (err) {
        logger.error('Failed to add post', err)
        res.status(500).send({ err: 'Failed to add post' })
    }
}

export async function updatePost(req, res) {
    try {
        const post = req.body
        // logger.debug(post)

        const updatedPost = await postService.update(post)
        res.json(updatedPost)
    } catch (err) {
        logger.error('Failed to update post', err)
        res.status(500).send({ err: 'Failed to update post' })
    }
}

export async function removePost(req, res) {
    try {
        const postId = req.params.id
        await postService.remove(postId)
        res.send()
    } catch (err) {
        logger.error('Failed to remove post', err)
        res.status(500).send({ err: 'Failed to remove post' })
    }
}

export async function addPostMsg(req, res) {
    const { loggedinUser } = req
    try {
        const postId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }
        const savedMsg = await postService.addPostMsg(postId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update post', err)
        res.status(500).send({ err: 'Failed to update post' })
    }
}

export async function removePostMsg(req, res) {
    // const { loggedinUser } = req
    try {
        const postId = req.params.id
        const { msgId } = req.params

        const removedId = await postService.removePostMsg(postId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove post msg', err)
        res.status(500).send({ err: 'Failed to remove post msg' })
    }
}