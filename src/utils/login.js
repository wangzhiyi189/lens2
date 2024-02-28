import React,{useImperativeHandle} from 'react'
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  useWalletLogin,
} from "@lens-protocol/react-web";
import { InjectedConnector } from "wagmi/connectors/injected";
export default function LoginBtn(ref) {
  const { execute: login, isPending: isLoginPending } = useWalletLogin();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  // const handelLogin = async ()=>{
  //   if (isConnected) {
  //     await disconnectAsync();
  //   }
  //   const { connector } = await connectAsync();
  //   if (connector instanceof InjectedConnector) {
  //     const walletClient = await connector.getWalletClient();
  //     await login({
  //       address: walletClient.account.address,
  //     })
  //   }
  // }
  useImperativeHandle(ref,()=>({
    handelLogin : async ()=>{
      if (isConnected) {
        await disconnectAsync();
      }
      const { connector } = await connectAsync();
      if (connector instanceof InjectedConnector) {
        const walletClient = await connector.getWalletClient();
        await login({
          address: walletClient.account.address,
        })
      }
    }
  }))
  return (
    <div>login</div>
  )
}
