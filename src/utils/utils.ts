import { Amount, Asset } from '@lens-protocol/react-web';

export function never(message = 'Unexpected call to never()'): never {
  throw new Error(message);
}

export function invariant(condition: unknown, message: string): asserts condition {
  console.log(condition,message)
  try{
     if (!condition) {
      throw new Error(message);
    }
  }
  catch(err){
    console.log(err)
  }
}

export function formatAmount(amount: Amount<Asset>) {
  return `${amount.toSignificantDigits()} ${amount.asset.symbol}`;
}
