import * as Sequelize from 'sequelize'

async function up (utils: {
  transaction: Sequelize.Transaction
  queryInterface: Sequelize.QueryInterface
  sequelize: Sequelize.Sequelize
  db: any
}): Promise<void> {
  await utils.sequelize.query('ALTER TABLE "videoFile" ALTER COLUMN "storage" SET DEFAULT 0')
  await utils.sequelize.query('ALTER TABLE "videoStreamingPlaylist" ALTER COLUMN "storage" SET DEFAULT 0')
}

function down (options) {
  throw new Error('Not implemented.')
}

export {
  up,
  down
}
