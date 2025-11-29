import {jest, describe, it, expect, beforeEach} from '@jest/globals';

// Mock the service used by the controller
let serviceMock;

const setupServiceMock = () => {
  serviceMock = {
    createPost: jest.fn(),
    getPostsById: jest.fn(),
    deletePost: jest.fn(),
    addLike: jest.fn(),
    getPostsByAuthor: jest.fn(),
    addComment: jest.fn(),
    getPostsByTag: jest.fn(),
    getPostsByPeriod: jest.fn(),
    updatePost: jest.fn(),
  };
  jest.unstable_mockModule('../services/post.service.js', () => ({ default: serviceMock }));
};

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe('PostController', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    setupServiceMock();
  });

  it('createPost returns 201 with created post', async () => {
    const controller = (await import('../controllers/post.controller.js')).default;
    const req = { params: { author: 'Alice' }, body: { title: 'T', content: 'C' } };
    const res = mockRes();
    const next = jest.fn();
    const created = { id: '1' };
    serviceMock.createPost.mockResolvedValue(created);

    await controller.createPost(req, res, next);
    expect(serviceMock.createPost).toHaveBeenCalledWith('Alice', { title: 'T', content: 'C' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
    expect(next).not.toHaveBeenCalled();
  });

  it('getPostById returns 200 with post', async () => {
    const controller = (await import('../controllers/post.controller.js')).default;
    const req = { params: { id: '1' } };
    const res = mockRes();
    const next = jest.fn();
    serviceMock.getPostsById.mockResolvedValue({ id: '1' });

    await controller.getPostById(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });

  it('deletePost returns deleted post json', async () => {
    const controller = (await import('../controllers/post.controller.js')).default;
    const req = { params: { id: '1' } };
    const res = mockRes();
    const next = jest.fn();
    serviceMock.deletePost.mockResolvedValue({ id: '1' });
    await controller.deletePost(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });

  it('addLike returns 204 status and result', async () => {
    const controller = (await import('../controllers/post.controller.js')).default;
    const req = { params: { id: '1' } };
    const res = mockRes();
    const next = jest.fn();
    serviceMock.addLike.mockResolvedValue(true);
    await controller.addLike(req, res, next);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith(true);
  });

  it('getPostsByAuthor returns 200 with list', async () => {
    const controller = (await import('../controllers/post.controller.js')).default;
    const req = { params: { author: 'Alice' } };
    const res = mockRes();
    const next = jest.fn();
    serviceMock.getPostsByAuthor.mockResolvedValue([{ id: '1' }]);
    await controller.getPostsByAuthor(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
  });

  it('addComment returns json of updated post', async () => {
    const controller = (await import('../controllers/post.controller.js')).default;
    const req = { params: { id: '1', user: 'Bob' }, body: { message: 'Hello' } };
    const res = mockRes();
    const next = jest.fn();
    const post = { id: '1', comments: [{ user: 'Bob', message: 'Hello' }] };
    serviceMock.addComment.mockResolvedValue(post);
    await controller.addComment(req, res, next);
    expect(serviceMock.addComment).toHaveBeenCalledWith('1', 'Bob', 'Hello');
    expect(res.json).toHaveBeenCalledWith(post);
  });

  it('getPostsByTags parses query and returns 200', async () => {
    const controller = (await import('../controllers/post.controller.js')).default;
    const req = { query: { values: 'js,node' } };
    const res = mockRes();
    const next = jest.fn();
    serviceMock.getPostsByTag.mockResolvedValue([{ id: 'a' }, { id: 'b' }]);
    await controller.getPostsByTags(req, res, next);
    expect(serviceMock.getPostsByTag).toHaveBeenCalledWith(['js', 'node']);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 'a' }, { id: 'b' }]);
  });

  it('getPostsByPeriod returns 200 with posts', async () => {
    const controller = (await import('../controllers/post.controller.js')).default;
    const req = { query: { dateFrom: '2025-01-01', dateTo: '2025-01-31' } };
    const res = mockRes();
    const next = jest.fn();
    serviceMock.getPostsByPeriod.mockResolvedValue([{ id: '1' }]);
    await controller.getPostsByPeriod(req, res, next);
    expect(serviceMock.getPostsByPeriod).toHaveBeenCalledWith('2025-01-01', '2025-01-31');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
  });

  it('updatePost returns updated post json', async () => {
    const controller = (await import('../controllers/post.controller.js')).default;
    const req = { params: { id: '1' }, body: { title: 'New' } };
    const res = mockRes();
    const next = jest.fn();
    const updated = { id: '1', title: 'New' };
    serviceMock.updatePost.mockResolvedValue(updated);
    await controller.updatePost(req, res, next);
    expect(serviceMock.updatePost).toHaveBeenCalledWith('1', { title: 'New' });
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('calls next on service error', async () => {
    const controller = (await import('../controllers/post.controller.js')).default;
    const req = { params: { id: 'missing' } };
    const res = mockRes();
    const next = jest.fn();
    serviceMock.getPostsById.mockRejectedValue(new Error('Post not found, id:missing'));
    await controller.getPostById(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
