const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {findImageElementBySource, parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders single item by id', async () => {
      const item = await seedItemToDatabase();
      const response = await request(app)
        .get(`/items/${item._id}`);

      assert.equal(parseTextFromHTML(response.text, '#item-title p'), item.title);
      assert.equal(parseTextFromHTML(response.text, '#item-description p'), item.description);

      const imageElement = findImageElementBySource(response.text, item.imageUrl);
      assert.equal(imageElement.src, item.imageUrl);

    });
  });

  describe('POST', () => {
    it('removes item when deleted', async () => {
      const item = await seedItemToDatabase();
      const response = await request(app)
        .get(`/items/${item._id}/delete`);

      assert.equal(response.status, 404);
    });
  });


});
