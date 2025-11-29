import {jest, describe, it, expect, beforeEach} from '@jest/globals';

// We'll mock the Mongoose Post model used inside the repository

let saveMock;
let findByIdMock;
let findByIdAndDeleteMock;
let updateOneMock;
let findMock;
let findByIdAndUpdateMock;

const setupPostModelMock = () => {
  saveMock = jest.fn().mockResolvedValue({ id: 'generated-id' });
  findByIdMock = jest.fn();
  findByIdAndDeleteMock = jest.fn();
  updateOneMock = jest.fn();
  findMock = jest.fn();
  findByIdAndUpdateMock = jest.fn();

  jest.unstable_mockModule('../models/post.model.js', () => {
    function Post(data) {
      Object.assign(this, data);
      this.save = saveMock;
    }
    // static-like methods
    Post.findById = findByIdMock;
    Post.findByIdAndDelete = findByIdAndDeleteMock;
    Post.updateOne = updateOneMock;
    Post.find = findMock;
    Post.findByIdAndUpdate = findByIdAndUpdateMock;

    return { default: Post };
  });
};

describe('PostRepository', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    setupPostModelMock();
  });

  it('createPost should construct and save a post', async () => {
    const repo = (await import('../repositories/post.repository.js')).default;
    const data = { title: 'T', content: 'C', author: 'A' };
    await repo.createPost(data);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('findPostById should delegate to Post.findById', async () => {
    const repo = (await import('../repositories/post.repository.js')).default;
    findByIdMock.mockResolvedValue({ id: '1' });
    const res = await repo.findPostById('1');
    expect(findByIdMock).toHaveBeenCalledWith('1');
    expect(res).toEqual({ id: '1' });
  });

  it('deletePost should delegate to Post.findByIdAndDelete', async () => {
    const repo = (await import('../repositories/post.repository.js')).default;
    findByIdAndDeleteMock.mockResolvedValue({ id: '1' });
    const res = await repo.deletePost('1');
    expect(findByIdAndDeleteMock).toHaveBeenCalledWith('1');
    expect(res).toEqual({ id: '1' });
  });

  it('updateLikes should call Post.updateOne with $inc', async () => {
    const repo = (await import('../repositories/post.repository.js')).default;
    updateOneMock.mockResolvedValue({ acknowledged: true });
    await repo.updateLikes('1');
    expect(updateOneMock).toHaveBeenCalledWith({ _id: '1' }, { $inc: { likes: 1 } });
  });

  it('findPostsByAuthor should call Post.find with author filter', async () => {
    const repo = (await import('../repositories/post.repository.js')).default;
    findMock.mockResolvedValue([{ id: '1' }]);
    const res = await repo.findPostsByAuthor('Alice');
    expect(findMock).toHaveBeenCalledWith({ author: 'Alice' });
    expect(res).toEqual([{ id: '1' }]);
  });

  it('addComment should push comment and save', async () => {
    const repo = (await import('../repositories/post.repository.js')).default;
    const fakePost = { comments: [], save: jest.fn(), id: '1' };
    findByIdMock.mockResolvedValue(fakePost);
    const res = await repo.addComment('1', 'Bob', 'Hello');
    expect(fakePost.comments[0]).toEqual({ user: 'Bob', message: 'Hello' });
    expect(fakePost.save).toHaveBeenCalled();
    expect(res).toBe(fakePost);
  });

  it('getPostsByTags should query for each tag and flatten results', async () => {
    const repo = (await import('../repositories/post.repository.js')).default;
    findMock
      .mockResolvedValueOnce([{ id: 'a' }])
      .mockResolvedValueOnce([{ id: 'b' }, { id: 'c' }]);
    const res = await repo.getPostsByTags(['js', 'node']);
    // repository returns array of arrays; service flattens later
    expect(findMock).toHaveBeenNthCalledWith(1, { tags: { $regex: 'js', $options: 'i' } });
    expect(findMock).toHaveBeenNthCalledWith(2, { tags: { $regex: 'node', $options: 'i' } });
    expect(res).toEqual([[{ id: 'a' }], [{ id: 'b' }, { id: 'c' }]]);
  });

  it('findPostsByPeriod should pass correct date range', async () => {
    const repo = (await import('../repositories/post.repository.js')).default;
    const captured = [];
    findMock.mockImplementation((query) => {
      captured.push(query);
      return Promise.resolve([]);
    });
    await repo.findPostsByPeriod('2025-01-01', '2025-01-31');
    expect(captured[0]).toHaveProperty('dataCreated');
    const range = captured[0].dataCreated;
    expect(range.$gte instanceof Date).toBe(true);
    expect(range.$lte instanceof Date).toBe(true);
  });

  it('updatePost should delegate to findByIdAndUpdate with $set', async () => {
    const repo = (await import('../repositories/post.repository.js')).default;
    const updated = { id: '1', title: 'New' };
    findByIdAndUpdateMock.mockResolvedValue(updated);
    const res = await repo.updatePost('1', { title: 'New' });
    expect(findByIdAndUpdateMock).toHaveBeenCalledWith({ _id: '1' }, { $set: { title: 'New' } }, { returnDocument: 'after' });
    expect(res).toBe(updated);
  });
});
