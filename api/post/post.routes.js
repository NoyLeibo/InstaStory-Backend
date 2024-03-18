import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getPosts, getPostById, addPost, updatePost, removePost, addPostMsg, removePostMsg } from './post.controller.js'

export const postRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

postRoutes.get('/', log, getPosts)
postRoutes.get('/:id', getPostById)
postRoutes.post('/', requireAuth, addPost)
postRoutes.put('/:id', requireAuth, updatePost)
postRoutes.delete('/:id', requireAuth, removePost)

postRoutes.post('/:id/msg', requireAuth, addPostMsg)
postRoutes.delete('/:id/msg/:msgId', requireAuth, removePostMsg)