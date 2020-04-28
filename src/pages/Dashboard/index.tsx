import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface TransactionAPI {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: string;
}

interface Transaction extends TransactionAPI {
  formattedValue: string;
  formattedDate: string;
}

interface BalanceAPI {
  income: number;
  outcome: number;
  total: number;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const formatTransaction: (
  transaction: TransactionAPI,
) => Transaction = transaction => ({
  ...transaction,
  formattedValue: formatValue(transaction.value),
  formattedDate: formatDate(transaction.created_at),
});

const formatBalance: (balance: BalanceAPI) => Balance = balance => ({
  income: formatValue(balance.income),
  outcome: formatValue(balance.outcome),
  total: formatValue(balance.total),
});

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('transactions');

      setTransactions(response.data.transactions.map(formatTransaction));
      setBalance(formatBalance(response.data.balance));
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  {transaction.type === 'income' ? (
                    <td className="income">{transaction.formattedValue}</td>
                  ) : (
                    <td className="outcome">{`- ${transaction.formattedValue}`}</td>
                  )}

                  <td>{transaction.category.title}</td>
                  <td>{formatDate(transaction.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
