//! Layer 2 - controllers
//! main logic orchestrators
/**
 * @typedef {Object} PostService
 * @property {() => Object[]} getPostsList
 * @property {(id: number) => any} getPostById
 * @property {(metaData: Object) => any} addPost
 * @property {(id: number) => void} deletePost
 */

class PostController {
  static #successStatus = {
    GET: 200,
    POST: 201,
    DELETE: 204,
  };

  /**
   * Injects a video service of required datastorage type
   *
   * @param {PostService} videoService
   */
  constructor(videoService) {
    this.videoService = videoService;
  }

  getPostsList(req, resp, next) {
    // use videoService to get data
    this.#handle('getPostsList', req, resp, next);
  }

  getPostById(req, resp, next) {
    const { videoId } = req.params;

    // use videoService to get data
    this.#handle('getPostById', req, resp, next, videoId);
  }

  addPost(req, resp, next) {
    const { body: metaData } = req;

    // use videoService to add new data
    this.#handle('addPost', req, resp, next, metaData);
  }

  deletePostById(req, resp, next) {
    const { videoId } = req.params;

    // use videoService to delete some data
    this.#handle('deletePostById', req, resp, next, videoId);
  }

  /**
   * Central place to handle incoming requests and to link
   * them to underlying service layer
   *
   * @param {string} methodName
   * @param {import('express').Request} req
   * @param {import('express').Response} resp
   * @param  {...any} args any args meaningful for a service
   */
  async #handle(methodName, req, resp, next, ...args) {
    try {
      const result = await this.videoService[methodName](...args);
      const respStatus = result ? PostController.#successStatus[req.method] : 404;

      resp.status(respStatus).json(result);
    } catch (err) {
      // huge and unexpected errors processed out there
      if (!err.cause) return resp.status(500).json({ error: 'API is unavailable' });

      // sending bad response
      resp.status(400).json({ error: err.cause });
    }
  }
}

module.exports = PostController;
