import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

import Transactionsrepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // Busca no banco, existe? não existe?
    const transactionsRepository = getCustomRepository(Transactionsrepository);

    // Buscar para ver se existe
    const transaction = await transactionsRepository.findOne(id);

    // Se não existir
    if (!transaction) {
      throw new AppError('TRansactionn oes not exist');
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
