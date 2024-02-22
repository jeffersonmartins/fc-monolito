import { SequelizeStorage, Umzug } from "umzug"
import { join } from "path"
import { Sequelize } from "sequelize"

export const migrator = (
  sequelize: Sequelize
) => {
  console.log(join('migration.....', __dirname, "../../../"));

  return new Umzug({
    migrations: {
      glob: [
        "*/migrations/migrations/*.{js,ts}",
        {
          cwd: join(__dirname, "../../../"),
          ignore: ["**/*.d.ts", "**/index.ts", "**/index.js"],
        },
      ],
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: console
  })
}