import { Address, TonClient, Transaction } from '@ton/ton';
import { retry } from '../helpers';


export class AccountSubscriptionService {
  constructor(
    readonly client: TonClient,
    readonly accountAddress: Address,
    readonly onTransactions: (txs: Transaction[]) => Promise<void> | void,
  ) {
  }

  private lastIndexedLt?: string;

  /**
   * Get transactions batch (100 transactions). If there is no transactions left returns `hasMore=false` to stop iteration.
   */
  async getTransactionsBatch(toLt?: string, lt?: string, hash?: string) {
    const transactions = await retry(() => this.client.getTransactions(this.accountAddress, {
      lt,
      limit: 100,
      hash,
      to_lt: toLt,
      inclusive: false,
      archival: true,
    }), { retries: 10, delay: 1000 });

    if (transactions.length === 0) {
      return { hasMore: false, transactions };
    }

    const lastTransaction = transactions.at(-1)!;

    return {
      hasMore: true,
      transactions,
      lt: lastTransaction.lt.toString(),
      hash: lastTransaction.hash().toString('base64'),
    };
  }

  // private isErrorState = false;
  // private errorTimeout: NodeJS.Timeout | null = null;
  
  // async getTransactionsBatch(toLt?: string, lt?: string, hash?: string) {
  //   if (this.isErrorState) {
  //     return { hasMore: false, transactions: [] };
  //   }
  
  //   try {
  //     const transactions = await retry(() => this.client.getTransactions(this.accountAddress, {
  //       lt,
  //       limit: 100,
  //       hash,
  //       to_lt: toLt,
  //       inclusive: false,
  //       archival: true,
  //     }), { retries: 3, delay: 1000 }); // Reduced retries from 10 to 3
  
  //     return {
  //       hasMore: transactions.length > 0,
  //       transactions,
  //       lt: transactions.at(-1)?.lt.toString(),
  //       hash: transactions.at(-1)?.hash().toString('base64'),
  //     };
  //   } catch (error) {
  //     // Enter error state for 1 minute to prevent constant retries
  //     this.isErrorState = true;
  //     if (this.errorTimeout) {
  //       clearTimeout(this.errorTimeout);
  //     }
  
  //     this.errorTimeout = setTimeout(() => {
  //       this.isErrorState = false;
  //     }, 60000);
  
  //     console.warn('Transaction fetch failed, will retry in 1 minute:', error);
  //     return { hasMore: false, transactions: [] };
  //   }
  // }

  async subscribeToTransactionUpdate(): Promise<void> {
    let iterationStartLt: string = '';
    let hasMore = true;
    let lt: string | undefined;
    let hash: string | undefined;

    // Fetching all the transactions from the end to `this.lastIndexedLt` (or start if undefined).
    while (hasMore) {
      const res = await this.getTransactionsBatch(this.lastIndexedLt, lt, hash);
      hasMore = res.hasMore;
      lt = res.lt;
      hash = res.hash;

      if (res.transactions.length > 0) {
        if (!iterationStartLt) {
          // Stores first fetched transaction lt. At the end of iterations stores in `this.lastIndexedLt` to prevent duplicate transaction fetches
          iterationStartLt = res.transactions[0].lt.toString();
        }

        // cals provided callback
        await this.onTransactions(res.transactions);
      }
    }

    if (iterationStartLt) {
      this.lastIndexedLt = iterationStartLt;
    }
  }

  start(): NodeJS.Timeout {
    let isProcessing = false;
    const tick = async () => {
      // prevent multiple running `subscribeToTransactionUpdate` functions
      if (isProcessing) return;
      isProcessing = true;

      await this.subscribeToTransactionUpdate();

      isProcessing = false;
    };

    // fetch updates every 10 seconds
    const intervalId = setInterval(tick, 10 * 1000);
    tick();

    return intervalId;
  }
}
