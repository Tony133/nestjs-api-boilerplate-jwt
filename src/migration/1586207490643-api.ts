import {MigrationInterface, QueryRunner} from "typeorm";

export class api1586207490643 implements MigrationInterface {
    name = 'api1586207490643'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `age`", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `age` int NOT NULL", undefined);
    }

}
