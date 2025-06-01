import { Injectable, Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from '../../constants';
import { Repository } from 'typeorm';
import { USERS_REPOSITORY_TOKEN } from './users.repository.interface';
import { UsersTypeOrmRepository } from './implementations/users.typeorm.repository';
import { Users } from '../models/users.model';
import { HashingService } from '../../common/hashing/hashing.service';

export function provideUsersRepository(): Provider[] {
  return [
    {
      provide: USERS_REPOSITORY_TOKEN,
      useFactory: (dependenciesProvider: UsersRepoDependenciesProvider) =>
        provideUsersRepositoryFactory(dependenciesProvider),
      inject: [UsersRepoDependenciesProvider],
    },
    UsersRepoDependenciesProvider,
  ];
}

function provideUsersRepositoryFactory(
  dependenciesProvider: UsersRepoDependenciesProvider,
) {
  const dataSourceEnv = process.env.USERS_DATASOURCE;

  if (
    !dataSourceEnv ||
    !Object.values(DataSource).includes(dataSourceEnv as DataSource)
  ) {
    throw new Error(`Invalid USERS_DATASOURCE: ${dataSourceEnv}`);
  }

  const dataSource = dataSourceEnv as DataSource;

  switch (dataSource) {
    case DataSource.TYPEORM:
      return new UsersTypeOrmRepository(
        dependenciesProvider.typeOrmRepository,
        dependenciesProvider.hashingService,
      );
  }
}

@Injectable()
export class UsersRepoDependenciesProvider {
  constructor(
    @InjectRepository(Users)
    public typeOrmRepository: Repository<Users>,
    public hashingService: HashingService,
  ) {}
}
