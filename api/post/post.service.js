import { ObjectId } from 'mongodb'

import { utilService } from '../../services/util.service.js'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const postService = {
    remove,
    query,
    getById,
    add,
    update,
    addPostMsg,
    removePostMsg
}

async function query(filterBy) {
    try {
        const collection = await dbService.getCollection('post');

        logger.debug('filterBy.usersToLoadPost.length', 'X', filterBy.usersToLoadPost.length)

        if (filterBy.usersToLoadPost && filterBy.usersToLoadPost.length) {
            logger.debug(filterBy.usersToLoadPost)
            var posts = await collection.find({}).toArray();
            posts.sort((postA, postB) => new Date(postB.createdAt).getTime() - new Date(postA.createdAt).getTime());
            // const userPostToLoad = posts.map((post) => {
            //     return filterBy.usersToLoadPost.map((user) => {
            //         return user._id === post.by._id
            //     })
            // })
            // const userIdsToLoad = filterBy.usersToLoadPost.map(user => user._id);
            posts = posts.filter(post => filterBy.usersToLoadPost.includes(post.by._id));
            return posts;
        }

        logger.debug('-----------------------------------------------------------------------------------------------')
        return ''

    } catch (err) {
        logger.error('cannot find posts', err);
        throw err;
    }
}

async function getById(postId) {
    try {
        const collection = await dbService.getCollection('post')
        const post = await collection.findOne({ _id: new ObjectId(postId) })
        return post
    } catch (err) {
        logger.error(`while finding post ${postId}`, err)
        throw err
    }
}

async function remove(postId) {
    try {
        const collection = await dbService.getCollection('post')
        await collection.deleteOne({ _id: new ObjectId(postId) })
    } catch (err) {
        logger.error(`cannot remove post ${postId}`, err)
        throw err
    }
}

async function add(post) {
    try {
        const collection = await dbService.getCollection('post')
        await collection.insertOne(post)
        return post
    } catch (err) {
        logger.error('cannot insert post', err)
        throw err
    }
}

async function update(post) {
    try {
        const postToSave = {
            createdAt: post.createdAt,
            txt: post.txt,
            imgUrl: post.imgUrl,
            by: post.by,
            loc: post.loc,
            comments: post.comments,
            likedBy: post.likedBy,
            tags: post.tags,
        };
        const collection = await dbService.getCollection("post");
        await collection.updateOne(
            { _id: new ObjectId(post._id) },
            { $set: postToSave }
        );
        return post;
    } catch (err) {
        logger.error(`cannot update post ${post._id}`, err);
        throw err;
    }
}


async function addPostMsg(postId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('post')
        await collection.updateOne({ _id: new ObjectId(postId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add post msg ${postId}`, err)
        throw err
    }
}

async function removePostMsg(postId, msgId) {
    try {
        const collection = await dbService.getCollection('post')
        await collection.updateOne({ _id: new ObjectId(postId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add post msg ${postId}`, err)
        throw err
    }
}