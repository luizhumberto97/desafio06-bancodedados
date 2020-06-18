import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

// AQui vamos adicionar o category_id

export default class AddCategoryIdToTransactions1590413512989
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // AQui é chave
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['category_id'], // Nome da coluna na tabela transactions
        referencedColumnNames: ['id'], // Nome da coluna referenciada na foreignKey
        referencedTableName: 'categories', // Qual tabela está estanciando
        name: 'TransactionCategory', // Para poder mexer no down
        onUpdate: 'CASCADE', // Quando atualiza em um , atualiza em todos
        onDelete: 'SET NULL', //
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Desfazer tudo que fez

    await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
    await queryRunner.dropColumn('transactions', 'category_id');
  }
}
