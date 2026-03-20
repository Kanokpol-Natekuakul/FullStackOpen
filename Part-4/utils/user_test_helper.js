const bcrypt = require('bcrypt')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'sekret',
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const seedUsers = async () => {
  await User.deleteMany({})

  for (const user of initialUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10)

    await new User({
      username: user.username,
      name: user.name,
      passwordHash,
    }).save()
  }
}

module.exports = {
  initialUsers,
  usersInDb,
  seedUsers,
}
