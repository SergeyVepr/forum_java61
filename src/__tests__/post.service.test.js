import {jest, describe, it, expect, beforeEach} from '@jest/globals';

let repoMock;

const setupRepoMock = () => {
  repoMock = {
    createPost: jest.fn(),
    findPostById: jest.fn(),
    deletePost: jest.fn(),
    updateLikes: jest.fn(),
    findPostsByAuthor: jest.fn(),
    addComment: jest.fn(),
    getPostsByTags: jest.fn(),
    findPostsByPeriod: jest.fn(),
    updatePost: jest.fn(),
  };

  jest.unstable_mockModule('../repositories/post.repository.js', () => ({
    default: repoMock,
  }));
};

describe('PostService', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    setupRepoMock();
  });

  it('createPost delegates to repository with merged data', async () => {
    const postService = (await import('../services/post.service.js')).default;
    const created = { id: '1', title: 'T' };
    repoMock.createPost.mockResolvedValue(created);
    const res = await postService.createPost('Alice', { title: 'T', content: 'C' });
    expect(repoMock.createPost).toHaveBeenCalledWith({ title: 'T', content: 'C', author: 'Alice' });
    expect(res).toBe(created);
  });

  it('getPostsById returns post or throws 404-style error', async () => {
    const postService = (await import('../services/post.service.js')).default;
    repoMock.findPostById.mockResolvedValue({ id: '1' });
    await expect(postService.getPostsById('1')).resolves.toEqual({ id: '1' });

    repoMock.findPostById.mockResolvedValue(null);
    await expect(postService.getPostsById('x')).rejects.toThrow('Post not found, id:x');
  });

  it('addLike returns true or throws when post not found', async () => {
    const postService = (await import('../services/post.service.js')).default;
    repoMock.findPostById.mockResolvedValue({ id: '1' });
    repoMock.updateLikes.mockResolvedValue({ acknowledged: true });
    await expect(postService.addLike('1')).resolves.toBe(true);

    repoMock.findPostById.mockResolvedValue(null);
    await expect(postService.addLike('x')).rejects.toThrow('Post not found, id:x');
  });

  it('getPostsByAuthor returns list or throws when empty', async () => {
    const postService = (await import('../services/post.service.js')).default;
    repoMock.findPostsByAuthor.mockResolvedValue([{ id: '1' }]);
    await expect(postService.getPostsByAuthor('Alice')).resolves.toEqual([{ id: '1' }]);

    repoMock.findPostsByAuthor.mockResolvedValue([]);
    await expect(postService.getPostsByAuthor('Bob')).rejects.toThrow('Posts not found, author:Bob');
  });

  it('addComment returns post or throws on missing post', async () => {
    const postService = (await import('../services/post.service.js')).default;
    const post = { id: '1', comments: [] };
    repoMock.findPostById.mockResolvedValue(post);
    repoMock.addComment.mockResolvedValue(post);
    await expect(postService.addComment('1', 'Bob', 'Hello')).resolves.toBe(post);

    repoMock.findPostById.mockResolvedValue(null);
    await expect(postService.addComment('x', 'Bob', 'Hi')).rejects.toThrow('Post not found, id:x');
  });

  it('deletePost returns deleted post or throws', async () => {
    const postService = (await import('../services/post.service.js')).default;
    repoMock.deletePost.mockResolvedValue({ id: '1' });
    await expect(postService.deletePost('1')).resolves.toEqual({ id: '1' });

    repoMock.deletePost.mockResolvedValue(null);
    await expect(postService.deletePost('x')).rejects.toThrow('Post not found, id:x');
  });

  it('getPostsByTag flattens repository result and throws when empty', async () => {
    const postService = (await import('../services/post.service.js')).default;
    repoMock.getPostsByTags.mockResolvedValue([[{ id: 'a' }], [{ id: 'b' }]]);
    await expect(postService.getPostsByTag(['js', 'node'])).resolves.toEqual([{ id: 'a' }, { id: 'b' }]);

    repoMock.getPostsByTags.mockResolvedValue([[], []]);
    await expect(postService.getPostsByTag(['x'])).rejects.toThrow('Posts not found, tags:x');
  });

  it('getPostsByPeriod returns list or throws when not found', async () => {
    const postService = (await import('../services/post.service.js')).default;
    repoMock.findPostsByPeriod.mockResolvedValue([{ id: '1' }]);
    await expect(postService.getPostsByPeriod('2025-01-01', '2025-01-31')).resolves.toEqual([{ id: '1' }]);

    repoMock.findPostsByPeriod.mockResolvedValue([]);
    await expect(postService.getPostsByPeriod('2025-02-01', '2025-02-28')).rejects.toThrow('Posts not found, period:2025-02-01 - 2025-02-28');
  });

  it('updatePost returns updated post or throws', async () => {
    const postService = (await import('../services/post.service.js')).default;
    repoMock.updatePost.mockResolvedValue({ id: '1', title: 'New' });
    await expect(postService.updatePost('1', { title: 'New' })).resolves.toEqual({ id: '1', title: 'New' });

    repoMock.updatePost.mockResolvedValue(null);
    await expect(postService.updatePost('x', { title: 'New' })).rejects.toThrow('Post not found, id:x');
  });
});
