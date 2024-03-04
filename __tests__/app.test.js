// api.test.js
const { searchManga, getMangaById } = require('../services/api'); 

describe('API Functions', () => {
  describe('searchManga', () => {
    it('should return an array of manga data', async () => {
      const result = await searchManga('rebuild');
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
    });

  });

  describe('getMangaById', () => {
    it('should return manga details for a given ID', async () => {
      const result = await getMangaById('576f3eec-a728-4f36-a87f-dd3fc2342812');
      expect(result).toBeDefined();
      expect(result.attributes).toBeDefined();
      expect(result.id).toEqual('576f3eec-a728-4f36-a87f-dd3fc2342812');
    });

  });
});
