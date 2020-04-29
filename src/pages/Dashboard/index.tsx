import React, { useState, useEffect, ReactElement } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: string;
  formattedValue: string;
  formattedDate: string;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
  formattedIncome: string;
  formattedOutcome: string;
  formattedTotal: string;
}

const formatTransaction: (
  transaction: Transaction,
) => Transaction = transaction => ({
  ...transaction,
  formattedValue: formatValue(transaction.value),
  formattedDate: formatDate(transaction.created_at),
});

const formatBalance: (balance: Balance) => Balance = balance => ({
  ...balance,
  formattedIncome: formatValue(balance.income),
  formattedOutcome: formatValue(balance.outcome),
  formattedTotal: formatValue(balance.total),
});

function Dashboard(): ReactElement {
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
            <h1 data-testid="balance-income">{balance.formattedIncome}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.formattedOutcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.formattedTotal}</h1>
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
}

export default Dashboard as React.FC;
