import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
// Repositorio para conectar com banco de dados

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';

import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    // TESTE : should not be able to create outcome transaction without a valid balance
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    // Existe? buscar ela no banco de dados usar o id que foi retornado
    // Verificar se a categoria ja existe
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    // Não existe? crio ela
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });
    }

    await categoryRepository.save(transactionCategory);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
