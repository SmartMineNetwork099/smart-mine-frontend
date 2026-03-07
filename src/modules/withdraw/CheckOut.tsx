// ✅ File 4: app/(your-path)/checkout/index.tsx  (main page/component)
"use client";
import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { useWalletAddress } from "@/hooks/useWallet";
import { getUserData } from "@/db/getData";

import MyIncomeCard, { HistoryItem } from "./MyIncomeCard";
import TeamIncomeCard from "./TeamIncomeCard";
import ShareIncomeCard from "./ShareIncomeCard";
import WithdrawHistory from "./WithdrawHistory";
import { formatAmount } from "@/utils/func";
import { shareIncomeApi, withdrawIncomeApi } from "@/apis/withdrawApis";
import { toast } from "react-toastify";
import { roundTo4 } from "@/utils/amount";
import { upsertUserData } from "@/db/saveData";

const CheckOut = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress();

  const [balance, setBalance] = useState<any>({
    myIncome: 0,
    teamIncome: 0,
    shareIncome: 0,
  });
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [source, setSource] = useState('');

  const [history, setHistory] = useState<HistoryItem[]>([
    { date: "12/12/20", amount: 100, status: "Completed", type: "myIncome" },
    { date: "12/12/20", amount: 50, status: "Completed", type: "teamIncome" },
  ]);
// withdraw income rules 
  const minimumWithdrawRequiredIncome = process.env.NEXT_PUBLIC_MINIMUM_WIDTHDRAW_INCOME;
// share income rules 
  const minimumShareRequiredIncome = process.env.NEXT_PUBLIC_MINIMUM_SHARE_INCOME;

  const handleWalletDataFetch = async () => {
    if (!walletAddress) return;

    try {
      setLoadingBalance(true);

      const localUser: any = await getUserData(walletAddress);
      const my = formatAmount(localUser?.wallet?.balance?.myIncome ?? 0);
      const team = formatAmount(localUser?.wallet?.balance?.teamIncome ?? 0);
      const share = formatAmount(localUser?.wallet?.balance?.shareIncome ?? 0);

      // setBalance({
      //   myIncome:  10,
      //   teamIncome: 10,
      //   shareIncome:10,
      // });
      setBalance({
        myIncome: my,
        teamIncome: team,
        shareIncome: share,
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setBalance({ myIncome: 0, teamIncome: 0 , shareIncome: 0 });
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;
    handleWalletDataFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const handleBack = () => router.push(ROUTES?.STACKING?.DASHBOARD);

  // ✅ callbacks for MyIncomeCard
  const onWithdrawMyIncome =async (amount: number) => {
    if(loadingBalance) return;
    if (!walletAddress) return;

    if(roundTo4(amount)>roundTo4(balance?.myIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(minimumWithdrawRequiredIncome)){
      toast.error(`minimum withdraw ${minimumWithdrawRequiredIncome}`)
      return;
    }

    const payload = {
      amount,
      source,
      // txHash
    }
    
    const {data , error} = await withdrawIncomeApi(payload);
    if(error){
      toast.error(error)
    }
    console.log(data,'datadatacheckout1111')
      const updatedFields = {
           wallet : data?.wallet,
          }
          await upsertUserData(walletAddress || '', updatedFields);
          handleWalletDataFetch()
  };

  const onSendMyIncome = async({ amount, userId }: { amount: number; userId: string }) => {
       if(loadingBalance) return
       if (!walletAddress) return;

    if(roundTo4(amount)>roundTo4(balance?.myIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(minimumShareRequiredIncome)){
      toast.error(`minimum withdraw ${minimumShareRequiredIncome}`)
      return;
    }
    const payload = {
      receiverId:userId,
      amount,
      source
    }
    const {data , error} = await shareIncomeApi(payload);
    console.log(data,'datadatacheckout1111')
      if(error){
      toast.error(error)
    }
    console.log(data,'datadatacheckout1111')
      const updatedFields = {
           wallet : data?.wallet,
          }
          await upsertUserData(walletAddress || '', updatedFields);
          handleWalletDataFetch()
  };

  // ✅ callbacks for TeamIncomeCard
  const onWithdrawTeam = async(amount: number) => {
  
  if(loadingBalance) return
  if (!walletAddress) return;

    if(roundTo4(amount)>roundTo4(balance?.teamIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(minimumWithdrawRequiredIncome)){
      toast.error(`minimum withdraw ${minimumWithdrawRequiredIncome}`)
      return;
    }

    const payload = {
      amount,
      source,
      // txHash
    }
    
    const {data , error} = await withdrawIncomeApi(payload);
    console.log(data,'datadatacheckout1111')
      if(error){
      toast.error(error)
    }
    console.log(data,'datadatacheckout1111')
      const updatedFields = {
           wallet : data?.wallet,
          }
          await upsertUserData(walletAddress || '', updatedFields);
          handleWalletDataFetch()
  };


  const onSendTeamIncome = async ({ amount, userId }: { amount: number; userId: string }) => {
       if(loadingBalance) return
       if (!walletAddress) return;

    if(roundTo4(amount)>roundTo4(balance?.teamIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(minimumShareRequiredIncome)){
      toast.error(`minimum withdraw ${minimumShareRequiredIncome}`)
      return;
    }
    const payload = {
      receiverId:userId,
      amount,
      source
    }
    const {data , error} = await shareIncomeApi(payload);
    console.log(data,'datadatacheckout1111')
      if(error){
      toast.error(error)
    }
    console.log(data,'datadatacheckout1111')
      const updatedFields = {
           wallet : data?.wallet,
          }
          await upsertUserData(walletAddress || '', updatedFields);
          handleWalletDataFetch()

  };
  const onSendShareIncome = async ({ amount, userId }: { amount: number; userId: string }) => {
     if(loadingBalance) return
     if (!walletAddress) return;

    if(roundTo4(amount)>roundTo4(balance?.shareIncome)){
      toast.error('insufficient balance')
      return;
    }
    if(roundTo4(amount)<roundTo4(minimumShareRequiredIncome)){
      toast.error(`minimum withdraw ${minimumShareRequiredIncome}`)
      return;
    }
    const payload = {
      receiverId:userId,
      amount,
      source
    }
    const {data , error} = await shareIncomeApi(payload);
    console.log(data,'datadatacheckout1111')
      if(error){
      toast.error(error)
    }
    console.log(data,'datadatacheckout1111')
      const updatedFields = {
           wallet : data?.wallet,
          }
          await upsertUserData(walletAddress || '', updatedFields);
          handleWalletDataFetch()
  };

  return (
    <>
      {/* header */}
      <div className="flex gap-2 items-center mb-4">
        <IoMdArrowRoundBack className="cursor-pointer text-4xl text-white" onClick={handleBack} />
        <p className="font-semibold sm:font-bold text-xl sm:text-3xl text-white">
          <span className="text-green-500">Withdraw</span>
        </p>
      </div>

      <div className="space-y-4">
        <MyIncomeCard
          myIncome={balance.myIncome}
          loadingBalance={loadingBalance}
          onWithdraw={onWithdrawMyIncome}
          onSend={onSendMyIncome}
          setSource={setSource}
        />

        <TeamIncomeCard
          teamIncome={balance.teamIncome}
          loadingBalance={loadingBalance}
          onWithdraw={onWithdrawTeam}
          onSend={onSendTeamIncome}
          setSource={setSource}
          />

        <ShareIncomeCard
          shareIncome={balance.shareIncome}
          loadingBalance={loadingBalance}
          onSend={onSendShareIncome}
          setSource={setSource}
        />

        {/* optional history */}
        <WithdrawHistory items={history} />
      </div>
    </>
  );
};

export default CheckOut;