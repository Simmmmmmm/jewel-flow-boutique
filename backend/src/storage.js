const { getDb } = require('./db');

const userStorage = {
  findOne: async (where) => {
    const db = getDb();
    return await db.collection('users').findOne(where);
  },
  create: async (data) => {
    const db = getDb();
    const user = {
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    };
    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  },
  save: async (user) => {
    const db = getDb();
    const { _id, ...updateData } = user;
    updateData.updated_at = new Date();
    await db.collection('users').updateOne({ _id }, { $set: updateData });
    return user;
  },
  updateOne: async (where, update) => {
    const db = getDb();
    update.updated_at = new Date();
    return await db.collection('users').updateOne(where, { $set: update });
  }
};

const profileStorage = {
  findOne: async (where) => {
    const db = getDb();
    return await db.collection('profiles').findOne(where);
  },
  create: async (data) => {
    const db = getDb();
    const profile = {
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    };
    const result = await db.collection('profiles').insertOne(profile);
    return { ...profile, _id: result.insertedId };
  },
  save: async (profile) => {
    const db = getDb();
    const { _id, ...updateData } = profile;
    updateData.updated_at = new Date();
    await db.collection('profiles').updateOne({ _id }, { $set: updateData });
    return profile;
  },
  updateOne: async (where, update) => {
    const db = getDb();
    update.updated_at = new Date();
    return await db.collection('profiles').updateOne(where, { $set: update });
  }
};

const addressStorage = {
  find: async (where) => {
    const db = getDb();
    return await db.collection('addresses').find(where).toArray();
  },
  findOne: async (where) => {
    const db = getDb();
    return await db.collection('addresses').findOne(where);
  },
  create: async (data) => {
    const db = getDb();
    const address = {
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    };
    const result = await db.collection('addresses').insertOne(address);
    return { ...address, _id: result.insertedId };
  },
  save: async (address) => {
    const db = getDb();
    const { _id, ...updateData } = address;
    updateData.updated_at = new Date();
    await db.collection('addresses').updateOne({ _id }, { $set: updateData });
    return address;
  },
  updateOne: async (where, update) => {
    const db = getDb();
    update.updated_at = new Date();
    return await db.collection('addresses').updateOne(where, { $set: update });
  },
  deleteOne: async (where) => {
    const db = getDb();
    return await db.collection('addresses').deleteOne(where);
  }
};

const orderStorage = {
  find: async (where) => {
    const db = getDb();
    return await db.collection('orders').find(where).toArray();
  },
  findOne: async (where) => {
    const db = getDb();
    return await db.collection('orders').findOne(where);
  },
  create: async (data) => {
    const db = getDb();
    const order = {
      ...data,
      order_date: new Date(),
      updated_at: new Date()
    };
    const result = await db.collection('orders').insertOne(order);
    return { ...order, _id: result.insertedId };
  },
  save: async (order) => {
    const db = getDb();
    const { _id, ...updateData } = order;
    updateData.updated_at = new Date();
    await db.collection('orders').updateOne({ _id }, { $set: updateData });
    return order;
  },
  updateOne: async (where, update) => {
    const db = getDb();
    update.updated_at = new Date();
    return await db.collection('orders').updateOne(where, { $set: update });
  },
  deleteOne: async (where) => {
    const db = getDb();
    return await db.collection('orders').deleteOne(where);
  },
  sort: async (where, sort) => {
    const db = getDb();
    return await db.collection('orders').find(where).sort(sort).toArray();
  }
};

module.exports = { userStorage, profileStorage, addressStorage, orderStorage };
