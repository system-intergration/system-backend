import _toString from 'lodash/toString';
import { Request, Response } from 'express';
import { mainModel } from '../../database/be_the_heroes';
import _toNumber from 'lodash/toNumber';
import { profilesAttributes } from '../../database/be_the_heroes/models/profiles';
import { usersAttributes } from '../../database/be_the_heroes/models/users';
class PublicController {
  async getAllPost(req: Request, res: Response) {
    try {
      const { page, size } = req.query;
      let offset = (_toNumber(page) - 1) * _toNumber(size);

      const posts = await mainModel.posts.findAndCountAll({
        offset: offset,
        limit: size ? _toNumber(size) : 1,
        raw: true,
        order: [['updated_at', 'DESC']],
      });
      const postsList = posts.rows.map(async (item) => {
        const user = <usersAttributes & { profile: profilesAttributes }>(
          await mainModel.users.findOne({
            where: {
              uid: item.uid,
            },
            include: [
              {
                model: mainModel.profiles,
                as: 'profile',
                attributes: ['avatar', 'first_name', 'last_name'],
              },
            ],
          })
        );
        return {
          ...item,
          avatar: user.profile.avatar,
          first_name: user.profile.first_name,
          last_name: user.profile.last_name,
          fullname: user.profile.first_name + ' ' + user.profile.last_name,
          photos:
            item.photos && item.photos.trim() ? item.photos.split(',') : [],
        };
      });
      const postResponse = await Promise.all(postsList);
      return res.status(200).send({
        data: {
          list: postResponse,
          total: posts.count,
        },
        message: 'Get all post successfully',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
  async getAllOfUserPost(req: Request, res: Response) {
    try {
      const { page, size, uid } = req.query;
      if (!uid) {
        throw new Error('uid is required');
      }
      let offset = (_toNumber(page) - 1) * _toNumber(size);

      const posts = await mainModel.posts.findAndCountAll({
        where: {
          uid: _toString(uid),
        },
        offset: offset,
        limit: size ? _toNumber(size) : 1,
        raw: true,
        order: [['updated_at', 'DESC']],
      });

      const postsList = posts.rows.map(async (item) => {
        const user = <usersAttributes & { profile: profilesAttributes }>(
          await mainModel.users.findOne({
            where: {
              uid: item.uid,
            },
            include: [
              {
                model: mainModel.profiles,
                as: 'profile',
                attributes: ['avatar', 'first_name', 'last_name'],
              },
            ],
          })
        );
        return {
          ...item,
          avatar: user.profile.avatar,
          first_name: user.profile.first_name,
          last_name: user.profile.last_name,
          fullname: user.profile.first_name + ' ' + user.profile.last_name,
          photos:
            item.photos && item.photos.trim() ? item.photos.split(',') : [],
        };
      });
      const postResponse = await Promise.all(postsList);
      return res.status(200).send({
        data: {
          list: postResponse,
          total: posts.count,
        },
        message: 'Get all post successfully',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
  async getPostDetail(req: Request, res: Response) {
    try {
      const { post_id } = req.params;
      if (!post_id) {
        return res.status(400).json({
          message: 'Post id is required',
        });
      }
      const posts = await mainModel.posts.findOne({
        where: {
          post_id,
        },
        raw: true,
      });
      if (!posts) {
        return res.status(400).json({
          message: 'Post is not found',
        });
      }
      const users = <usersAttributes & { profile: profilesAttributes }>(
        await mainModel.users.findOne({
          where: {
            uid: posts.uid,
          },
          include: [
            {
              model: mainModel.profiles,
              as: 'profile',
              attributes: ['avatar', 'first_name', 'last_name'],
            },
          ],
        })
      );

      return res.status(200).send({
        data: {
          ...posts,
          avatar: users.profile.avatar,
          first_name: users.profile.first_name,
          last_name: users.profile.last_name,
          fullname: users.profile.first_name + ' ' + users.profile.last_name,
          photos:
            posts?.photos && posts?.photos.trim()
              ? posts?.photos.split(',')
              : [],
        },
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}

export default new PublicController();
